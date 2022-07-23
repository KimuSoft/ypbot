/*
  Warnings:

  - You are about to drop the column `isSeparation` on the `RuleElement` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RuleElement" DROP COLUMN "isSeparation",
ADD COLUMN     "separate" BOOLEAN NOT NULL DEFAULT false;
