/*
  Warnings:

  - The values [Include] on the enum `RuleType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RuleType_new" AS ENUM ('Black', 'White');
ALTER TABLE "RuleElement" ALTER COLUMN "ruleType" TYPE "RuleType_new" USING ("ruleType"::text::"RuleType_new");
ALTER TYPE "RuleType" RENAME TO "RuleType_old";
ALTER TYPE "RuleType_new" RENAME TO "RuleType";
DROP TYPE "RuleType_old";
COMMIT;

-- CreateTable
CREATE TABLE "__ruleReferences" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "__ruleReferences_AB_unique" ON "__ruleReferences"("A", "B");

-- CreateIndex
CREATE INDEX "__ruleReferences_B_index" ON "__ruleReferences"("B");

-- AddForeignKey
ALTER TABLE "__ruleReferences" ADD CONSTRAINT "__ruleReferences_A_fkey" FOREIGN KEY ("A") REFERENCES "Rule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "__ruleReferences" ADD CONSTRAINT "__ruleReferences_B_fkey" FOREIGN KEY ("B") REFERENCES "Rule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
