-- CreateTable
CREATE TABLE "Guild" (
    "id" TEXT NOT NULL,
    "timeout" INTEGER NOT NULL DEFAULT 0,
    "alertChannelId" TEXT,

    CONSTRAINT "Guild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "__ruleOnGuild" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "__ruleOnGuild_AB_unique" ON "__ruleOnGuild"("A", "B");

-- CreateIndex
CREATE INDEX "__ruleOnGuild_B_index" ON "__ruleOnGuild"("B");

-- AddForeignKey
ALTER TABLE "__ruleOnGuild" ADD CONSTRAINT "__ruleOnGuild_A_fkey" FOREIGN KEY ("A") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "__ruleOnGuild" ADD CONSTRAINT "__ruleOnGuild_B_fkey" FOREIGN KEY ("B") REFERENCES "Rule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
