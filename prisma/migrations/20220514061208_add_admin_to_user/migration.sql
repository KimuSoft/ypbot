-- DropForeignKey
ALTER TABLE "Rule" DROP CONSTRAINT "Rule_authorId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "admin" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Rule" ADD CONSTRAINT "Rule_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
