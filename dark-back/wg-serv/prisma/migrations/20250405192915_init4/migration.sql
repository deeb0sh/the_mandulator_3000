/*
  Warnings:

  - You are about to drop the `limits` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "limits";

-- CreateTable
CREATE TABLE "Role" (
    "id" INTEGER NOT NULL,
    "speed" INTEGER NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Limits" (
    "id" SERIAL NOT NULL,
    "login" TEXT,
    "roleId" INTEGER,
    "serverNetwork" TEXT,
    "userNetwork" TEXT NOT NULL,
    "speed" INTEGER NOT NULL DEFAULT 5,

    CONSTRAINT "Limits_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Limits" ADD CONSTRAINT "Limits_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;
