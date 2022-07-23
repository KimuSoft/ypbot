-- AlterTable
ALTER TABLE "Rule" ADD COLUMN     "shareCode" TEXT,
ADD COLUMN     "sharingEnabled" BOOLEAN NOT NULL DEFAULT false;
