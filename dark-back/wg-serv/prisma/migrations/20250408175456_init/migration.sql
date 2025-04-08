/*
  Warnings:

  - You are about to drop the column `network` on the `UserSubnet` table. All the data in the column will be lost.
  - Added the required column `cidr` to the `UserSubnet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserSubnet" DROP COLUMN "network",
ADD COLUMN     "cidr" TEXT NOT NULL;
