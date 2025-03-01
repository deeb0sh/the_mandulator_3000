/*
  Warnings:

  - The `UserID` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "lastLogin" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "rangID" SET DEFAULT 0,
DROP COLUMN "UserID",
ADD COLUMN     "UserID" INTEGER NOT NULL DEFAULT 0;
