/*
  Warnings:

  - Added the required column `discordTokenExpiresAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "discordTokenExpiresAt" INTEGER NOT NULL;
