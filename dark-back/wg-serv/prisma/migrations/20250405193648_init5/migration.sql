/*
  Warnings:

  - You are about to drop the `Limits` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Role` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Limits" DROP CONSTRAINT "Limits_roleId_fkey";

-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "name" TEXT;

-- DropTable
DROP TABLE "Limits";

-- CreateTable
CREATE TABLE "limits" (
    "id" SERIAL NOT NULL,
    "login" TEXT,
    "roleId" INTEGER,
    "userNetwork" TEXT NOT NULL DEFAULT '10.0.0.0/29',

    CONSTRAINT "limits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "limits_login_key" ON "limits"("login");

-- CreateIndex
CREATE INDEX "limits_roleId_idx" ON "limits"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- AddForeignKey
ALTER TABLE "limits" ADD CONSTRAINT "limits_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;
