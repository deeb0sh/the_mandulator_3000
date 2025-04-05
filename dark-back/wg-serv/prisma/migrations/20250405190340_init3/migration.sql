/*
  Warnings:

  - You are about to drop the column `networkDe` on the `limits` table. All the data in the column will be lost.
  - You are about to drop the column `networkFi` on the `limits` table. All the data in the column will be lost.
  - You are about to drop the column `networkRu` on the `limits` table. All the data in the column will be lost.
  - You are about to drop the column `speedDe` on the `limits` table. All the data in the column will be lost.
  - You are about to drop the column `speedFi` on the `limits` table. All the data in the column will be lost.
  - You are about to drop the column `speedRu` on the `limits` table. All the data in the column will be lost.
  - Added the required column `network` to the `limits` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "limits" DROP COLUMN "networkDe",
DROP COLUMN "networkFi",
DROP COLUMN "networkRu",
DROP COLUMN "speedDe",
DROP COLUMN "speedFi",
DROP COLUMN "speedRu",
ADD COLUMN     "network" TEXT NOT NULL,
ADD COLUMN     "role" INTEGER,
ADD COLUMN     "serverNework" TEXT,
ADD COLUMN     "speed" INTEGER NOT NULL DEFAULT 5;
