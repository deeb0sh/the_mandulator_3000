/*
  Warnings:

  - The primary key for the `Server` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Server` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `serverId` on the `Client` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_serverId_fkey";

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "userId" INTEGER NOT NULL,
DROP COLUMN "serverId",
ADD COLUMN     "serverId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Server" DROP CONSTRAINT "Server_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Server_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP COLUMN "createdAt";

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
