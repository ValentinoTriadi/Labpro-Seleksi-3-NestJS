/*
  Warnings:

  - A unique constraint covering the columns `[title,director,release_year]` on the table `Film` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Film_title_key";

-- CreateIndex
CREATE UNIQUE INDEX "Film_title_director_release_year_key" ON "Film"("title", "director", "release_year");
