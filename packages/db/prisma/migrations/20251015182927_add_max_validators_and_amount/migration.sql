-- AlterTable
ALTER TABLE "public"."Website" ADD COLUMN     "amount" TEXT NOT NULL DEFAULT '0',
ADD COLUMN     "max_no_of_validators" TEXT NOT NULL DEFAULT '0';
