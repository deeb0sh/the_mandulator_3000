/*
  Warnings:

  - The primary key for the `ServerDe` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ServerFi` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ServerRu` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "ClientDe" DROP CONSTRAINT "ClientDe_serverId_fkey";

-- DropForeignKey
ALTER TABLE "ClientFi" DROP CONSTRAINT "ClientFi_serverId_fkey";

-- DropForeignKey
ALTER TABLE "ClientRU" DROP CONSTRAINT "ClientRU_serverId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_serverDeId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_serverFiId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_serverRuId_fkey";

-- AlterTable
ALTER TABLE "ClientDe" ALTER COLUMN "serverId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "ClientFi" ALTER COLUMN "serverId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "ClientRU" ALTER COLUMN "serverId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "ServerDe" DROP CONSTRAINT "ServerDe_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "ServerDe_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ServerDe_id_seq";

-- AlterTable
ALTER TABLE "ServerFi" DROP CONSTRAINT "ServerFi_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "ServerFi_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ServerFi_id_seq";

-- AlterTable
ALTER TABLE "ServerRu" DROP CONSTRAINT "ServerRu_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "ServerRu_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ServerRu_id_seq";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "networkIpLan" INTEGER,
ALTER COLUMN "serverRuId" SET DATA TYPE TEXT,
ALTER COLUMN "serverDeId" SET DATA TYPE TEXT,
ALTER COLUMN "serverFiId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_serverRuId_fkey" FOREIGN KEY ("serverRuId") REFERENCES "ServerRu"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_serverDeId_fkey" FOREIGN KEY ("serverDeId") REFERENCES "ServerDe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_serverFiId_fkey" FOREIGN KEY ("serverFiId") REFERENCES "ServerFi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientRU" ADD CONSTRAINT "ClientRU_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "ServerRu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientDe" ADD CONSTRAINT "ClientDe_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "ServerDe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientFi" ADD CONSTRAINT "ClientFi_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "ServerFi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
