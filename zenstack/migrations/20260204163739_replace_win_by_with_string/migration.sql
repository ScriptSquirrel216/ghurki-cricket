/*
  Warnings:

  - You are about to drop the column `winByRuns` on the `matches` table. All the data in the column will be lost.
  - You are about to drop the column `winByWickets` on the `matches` table. All the data in the column will be lost.
  - Added the required column `winBy` to the `matches` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "matches" DROP COLUMN "winByRuns",
DROP COLUMN "winByWickets",
ADD COLUMN     "winBy" TEXT NOT NULL;
