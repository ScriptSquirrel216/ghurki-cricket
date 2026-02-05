/*
  Warnings:

  - You are about to drop the column `dots` on the `batting` table. All the data in the column will be lost.
  - You are about to drop the column `fours` on the `bowling` table. All the data in the column will be lost.
  - You are about to drop the column `sixes` on the `bowling` table. All the data in the column will be lost.
  - You are about to drop the column `playerOfMatchId` on the `matches` table. All the data in the column will be lost.
  - Added the required column `dateId` to the `innings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `potmId` to the `matches` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "matches" DROP CONSTRAINT "matches_playerOfMatchId_fkey";

-- AlterTable
ALTER TABLE "batting" DROP COLUMN "dots",
ADD COLUMN     "fifties" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "hundreds" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "bowling" DROP COLUMN "fours",
DROP COLUMN "sixes",
ADD COLUMN     "2fr" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "3fr" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "innings" ADD COLUMN     "dateId" DATE NOT NULL;

-- AlterTable
ALTER TABLE "matches" DROP COLUMN "playerOfMatchId",
ADD COLUMN     "potmId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_potmId_fkey" FOREIGN KEY ("potmId") REFERENCES "players"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "innings" ADD CONSTRAINT "innings_dateId_fkey" FOREIGN KEY ("dateId") REFERENCES "dates"("date") ON DELETE RESTRICT ON UPDATE CASCADE;
