/*
  Warnings:

  - You are about to drop the column `UserID` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `createDate` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastLogin` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `rangID` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `salt` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "UserID",
DROP COLUMN "createDate",
DROP COLUMN "lastLogin",
DROP COLUMN "rangID",
DROP COLUMN "salt";
