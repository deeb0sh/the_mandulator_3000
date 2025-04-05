/*
  Warnings:

  - You are about to drop the column `name` on the `limits` table. All the data in the column will be lost.
  - You are about to drop the column `network` on the `limits` table. All the data in the column will be lost.
  - You are about to drop the column `speed` on the `limits` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "limits" DROP COLUMN "name",
DROP COLUMN "network",
DROP COLUMN "speed",
ADD COLUMN     "login" TEXT,
ADD COLUMN     "networkDe" TEXT,
ADD COLUMN     "networkFi" TEXT,
ADD COLUMN     "networkRu" TEXT,
ADD COLUMN     "speedDe" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "speedFi" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "speedRu" INTEGER NOT NULL DEFAULT 10;
