/*
  Warnings:

  - You are about to drop the column `serverDeId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `serverFiId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `serverRuId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `ClientDe` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ClientFi` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ClientRU` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ServerDe` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ServerFi` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ServerRu` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserAccess` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ClientDe" DROP CONSTRAINT "ClientDe_serverId_fkey";

-- DropForeignKey
ALTER TABLE "ClientFi" DROP CONSTRAINT "ClientFi_serverId_fkey";

-- DropForeignKey
ALTER TABLE "ClientRU" DROP CONSTRAINT "ClientRU_serverId_fkey";

-- DropForeignKey
ALTER TABLE "UserAccess" DROP CONSTRAINT "UserAccess_userId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_serverDeId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_serverFiId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_serverRuId_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "serverDeId",
DROP COLUMN "serverFiId",
DROP COLUMN "serverRuId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "ClientDe";

-- DropTable
DROP TABLE "ClientFi";

-- DropTable
DROP TABLE "ClientRU";

-- DropTable
DROP TABLE "ServerDe";

-- DropTable
DROP TABLE "ServerFi";

-- DropTable
DROP TABLE "ServerRu";

-- DropTable
DROP TABLE "UserAccess";

-- CreateTable
CREATE TABLE "Server" (
    "id" TEXT NOT NULL,
    "serverName" "ServerName" NOT NULL,
    "lan" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "privatKey" TEXT NOT NULL,
    "port" INTEGER NOT NULL DEFAULT 51820,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Server_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,
    "endPoint" TEXT NOT NULL,
    "allowIps" TEXT NOT NULL DEFAULT '0.0.0.0/0',
    "dns" TEXT NOT NULL DEFAULT '45.142.122.244, 77.221.159.104',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "serverId" TEXT NOT NULL,
    "serverName" "ServerName" NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
