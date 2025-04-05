/*
  Warnings:

  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Users";

-- CreateTable
CREATE TABLE "limits" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "network" TEXT,
    "speed" INTEGER NOT NULL DEFAULT 10,

    CONSTRAINT "limits_pkey" PRIMARY KEY ("id")
);
