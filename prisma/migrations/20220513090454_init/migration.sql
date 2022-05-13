-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "discordAccessToken" TEXT NOT NULL,
    "discordRefreshToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
