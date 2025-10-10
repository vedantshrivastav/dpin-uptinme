import { Prismaclient } from "../src/index.js";

async function seed2(){
 await Prismaclient.validator.create({
        data: {
            publicKey: "2gd3FxqDUrTs38DJ3xvkNqBmCpieXS4Bqtj1UgB32vW6",
            location: "Delhi",
            ip: "127.0.0.1",
        }
    })
}

seed2()