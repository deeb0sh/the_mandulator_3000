/*
  Warnings:

  - Changed the type of `exp` on the `session` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "session" DROP COLUMN "exp",
ADD COLUMN     "exp" TIMESTAMP(3) NOT NULL;
