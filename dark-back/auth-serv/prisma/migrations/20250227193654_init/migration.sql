/*
  Warnings:

  - Changed the type of `salt` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "salt",
ADD COLUMN     "salt" INTEGER NOT NULL;
