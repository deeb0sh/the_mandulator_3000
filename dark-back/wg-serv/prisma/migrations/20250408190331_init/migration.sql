/*
  Warnings:

  - You are about to drop the column `name` on the `ServerDe` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `ServerFi` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `ServerRu` table. All the data in the column will be lost.
  - You are about to drop the column `serverType` on the `UserAccess` table. All the data in the column will be lost.
  - You are about to drop the column `serverType` on the `UserSubnet` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,serverName]` on the table `UserAccess` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,serverName]` on the table `UserSubnet` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `serverName` to the `UserAccess` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serverName` to the `UserSubnet` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ServerName" AS ENUM ('RU', 'DE', 'FI');

-- DropIndex
DROP INDEX "UserAccess_userId_serverType_key";

-- DropIndex
DROP INDEX "UserSubnet_userId_serverType_key";

-- AlterTable
ALTER TABLE "ServerDe" DROP COLUMN "name",
ADD COLUMN     "serverName" "ServerName" NOT NULL DEFAULT 'DE';

-- AlterTable
ALTER TABLE "ServerFi" DROP COLUMN "name",
ADD COLUMN     "serverName" "ServerName" NOT NULL DEFAULT 'FI';

-- AlterTable
ALTER TABLE "ServerRu" DROP COLUMN "name",
ADD COLUMN     "serverName" "ServerName" NOT NULL DEFAULT 'RU';

-- AlterTable
ALTER TABLE "UserAccess" DROP COLUMN "serverType",
ADD COLUMN     "serverName" "ServerName" NOT NULL;

-- AlterTable
ALTER TABLE "UserSubnet" DROP COLUMN "serverType",
ADD COLUMN     "serverName" "ServerName" NOT NULL;

-- DropEnum
DROP TYPE "ServerType";

-- CreateIndex
CREATE UNIQUE INDEX "UserAccess_userId_serverName_key" ON "UserAccess"("userId", "serverName");

-- CreateIndex
CREATE UNIQUE INDEX "UserSubnet_userId_serverName_key" ON "UserSubnet"("userId", "serverName");
