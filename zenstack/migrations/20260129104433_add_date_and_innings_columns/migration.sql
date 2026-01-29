/*
  Warnings:

  - You are about to drop the column `outs` on the `batting` table. All the data in the column will be lost.
  - You are about to drop the column `dateId` on the `innings` table. All the data in the column will be lost.
  - Added the required column `dateId` to the `batting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateId` to the `bowling` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateId` to the `fielding` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "innings" DROP CONSTRAINT "innings_dateId_fkey";

-- AlterTable
ALTER TABLE "batting" DROP COLUMN "outs",
ADD COLUMN     "dateId" DATE NOT NULL,
ADD COLUMN     "highestScore" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "notOuts" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "bowling" ADD COLUMN     "dateId" DATE NOT NULL;

-- AlterTable
ALTER TABLE "fielding" ADD COLUMN     "dateId" DATE NOT NULL;

-- AlterTable
ALTER TABLE "innings" DROP COLUMN "dateId";

-- AddForeignKey
ALTER TABLE "batting" ADD CONSTRAINT "batting_dateId_fkey" FOREIGN KEY ("dateId") REFERENCES "dates"("date") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bowling" ADD CONSTRAINT "bowling_dateId_fkey" FOREIGN KEY ("dateId") REFERENCES "dates"("date") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fielding" ADD CONSTRAINT "fielding_dateId_fkey" FOREIGN KEY ("dateId") REFERENCES "dates"("date") ON DELETE RESTRICT ON UPDATE CASCADE;
