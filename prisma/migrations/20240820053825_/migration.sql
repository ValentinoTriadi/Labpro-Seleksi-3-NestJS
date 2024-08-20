/*
  Warnings:

  - A unique constraint covering the columns `[filmId,userId]` on the table `BoughtFilm` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "balance" SET DEFAULT 500;

-- CreateIndex
CREATE UNIQUE INDEX "BoughtFilm_filmId_userId_key" ON "BoughtFilm"("filmId", "userId");
