/*
  Warnings:

  - You are about to drop the column `inCode` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "inCode",
ADD COLUMN     "inCodeUsed" TEXT;
