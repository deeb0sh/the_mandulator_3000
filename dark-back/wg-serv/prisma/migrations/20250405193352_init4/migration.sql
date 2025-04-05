/*
  Warnings:

  - You are about to drop the column `serverNetwork` on the `Limits` table. All the data in the column will be lost.
  - You are about to drop the column `speed` on the `Limits` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Limits" DROP COLUMN "serverNetwork",
DROP COLUMN "speed";
