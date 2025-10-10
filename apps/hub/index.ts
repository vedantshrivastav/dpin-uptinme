import { v7 as uuidv7 } from "uuid";
import WebSocket from 'ws';
import { WebSocketServer } from 'ws'
import http from 'http'
import type { IncomingMessage, SignupIncomingMessage } from "common";
import { Prismaclient } from "db/client";
import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";
import nacl_util from "tweetnacl-util";

const availableValidators: { validatorId: string, socket: WebSocket, publicKey: string }[] = [];

const CALLBACKS : { [callbackId: string]: (data: IncomingMessage) => void } = {}
const COST_PER_VALIDATION = 100; // in lamports

const wss = new WebSocketServer({ port: 8081 });

wss.on("connection", (ws: WebSocket) => {
  console.log("Client connected");

  ws.on("message", async (message: string) => {
    try {
      const data: IncomingMessage = JSON.parse(message.toString());

      if (data.type === "signup") {
        const verified = await verifyMessage(
          `Signed message for ${data.data.callbackId}, ${data.data.publicKey}`,
          data.data.publicKey,
          data.data.signedMessage
        );

        if (verified) {
          await signupHandler(ws, data.data);
        }
      } else if (data.type === "validate") {
        if (CALLBACKS[data.data.callbackId]) {
          CALLBACKS[data.data.callbackId]!(data);
          delete CALLBACKS[data.data.callbackId];
        }
      }
    } catch (err) {
      console.error("Failed to process message:", err);
    }
  });

  ws.on("close", () => {
    const idx = availableValidators.findIndex(v => v.socket === ws);
    if (idx !== -1) {
      availableValidators.splice(idx, 1);
    }
    console.log("Client disconnected");
  });
});

async function signupHandler(ws: WebSocket, { ip, publicKey, signedMessage, callbackId }: SignupIncomingMessage) {
    const validatorDb = await Prismaclient.validator.findFirst({
        where: {
            publicKey,
        },
    });

    if (validatorDb) {
        ws.send(JSON.stringify({
            type: 'signup',
            data: {
                validatorId: validatorDb.id,
                callbackId,
            },
        }));

        availableValidators.push({
            validatorId: validatorDb.id,
            socket: ws,
            publicKey: validatorDb.publicKey,
        });
        return;
    }
    
    //TODO: Given the ip, return the location
    const validator = await Prismaclient.validator.create({
        data: {
            ip,
            publicKey,
            location: 'unknown',
        },
    });

    ws.send(JSON.stringify({
        type: 'signup',
        data: {
            validatorId: validator.id,
            callbackId,
        },
    }));

    availableValidators.push({
        validatorId: validator.id,
        socket: ws,
        publicKey: validator.publicKey,
    });
}

async function verifyMessage(message: string, publicKey: string, signature: string) {
    const messageBytes = nacl_util.decodeUTF8(message);
    const result = nacl.sign.detached.verify(
        messageBytes,
        new Uint8Array(JSON.parse(signature)),
        new PublicKey(publicKey).toBytes(),
    );

    return result;
}

setInterval(async () => {
    const websitesToMonitor = await Prismaclient.website.findMany({
        where: {
            disabled: false,
        },
    });

    for (const website of websitesToMonitor) {
        availableValidators.forEach(validator => {
            const callbackId = uuidv7();
            console.log(`Sending validate to ${validator.validatorId} ${website.url}`);
            validator.socket.send(JSON.stringify({
                type: 'validate',
                data: {
                    url: website.url,
                    callbackId
                },
            }));

            CALLBACKS[callbackId] = async (data: IncomingMessage) => {
                if (data.type === 'validate') {
                    const { validatorId, status, latency, signedMessage } = data.data;
                    const verified = await verifyMessage(
                        `Replying to ${callbackId}`,
                        validator.publicKey,
                        signedMessage
                    );
                    if (!verified) {
                        return;
                    }
// here for websiteTick and validator update we can use $transaction but we are not because of parallel
// request the db is giving timeout error
// Also the reason for using transaction is that both the below operations should happen 
// we dont want only one operation to happen either both happens or none
                        await Prismaclient.websiteTick.create({
                            data: {
                                websiteId: website.id,
                                validatorId,
                                status,
                                latency,
                                createdAt: new Date(),
                            },
                        });

                        await Prismaclient.validator.update({
                            where: { id: validatorId },
                            data: {
                                pendingPayouts: { increment: COST_PER_VALIDATION },
                            },
                        });
                    ;
                }
            };
        });
    }
}, 60 * 1000);