/*
  Warnings:

  - Added the required column `userId` to the `Website` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."User_email_key";

-- AlterTable
ALTER TABLE "public"."Validator" ADD COLUMN     "pendingPayouts" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."Website" ADD COLUMN     "disabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."WebsiteTick" ALTER COLUMN "createdAt" DROP DEFAULT;
