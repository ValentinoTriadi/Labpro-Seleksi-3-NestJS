-- DropForeignKey
ALTER TABLE "BoughtFilm" DROP CONSTRAINT "BoughtFilm_filmId_fkey";

-- DropForeignKey
ALTER TABLE "BoughtFilm" DROP CONSTRAINT "BoughtFilm_userId_fkey";

-- AddForeignKey
ALTER TABLE "BoughtFilm" ADD CONSTRAINT "BoughtFilm_filmId_fkey" FOREIGN KEY ("filmId") REFERENCES "Film"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoughtFilm" ADD CONSTRAINT "BoughtFilm_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
