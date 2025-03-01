/*
  Warnings:

  - You are about to drop the column `lastAt` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "lastAt",
ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3);
