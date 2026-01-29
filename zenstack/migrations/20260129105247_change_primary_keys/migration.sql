/*
  Warnings:

  - The primary key for the `batting` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `batting` table. All the data in the column will be lost.
  - The primary key for the `bowling` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `bowling` table. All the data in the column will be lost.
  - The primary key for the `fielding` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `fielding` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "batting" DROP CONSTRAINT "batting_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "batting_pkey" PRIMARY KEY ("playerId", "dateId");

-- AlterTable
ALTER TABLE "bowling" DROP CONSTRAINT "bowling_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "bowling_pkey" PRIMARY KEY ("playerId", "dateId");

-- AlterTable
ALTER TABLE "fielding" DROP CONSTRAINT "fielding_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "fielding_pkey" PRIMARY KEY ("playerId", "dateId");
