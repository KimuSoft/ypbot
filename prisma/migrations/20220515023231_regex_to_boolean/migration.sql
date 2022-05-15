/*
  Warnings:

  - Changed the type of `regex` on the `RuleElement` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "RuleElement" DROP COLUMN "regex",
ADD COLUMN     "regex" BOOLEAN NOT NULL;
