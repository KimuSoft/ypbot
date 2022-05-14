-- CreateTable
CREATE TABLE "ShareCode" (
    "id" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "maxCounts" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "ShareCode_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ShareCode" ADD CONSTRAINT "ShareCode_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "Rule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
