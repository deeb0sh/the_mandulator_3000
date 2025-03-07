/*
  Warnings:

  - You are about to drop the column `inCodeUsed` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "session" ADD COLUMN     "userAgent" TEXT,
ADD COLUMN     "userIp" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "inCodeUsed";
