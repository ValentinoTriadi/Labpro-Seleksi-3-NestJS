/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Film` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Film_title_key" ON "Film"("title");
