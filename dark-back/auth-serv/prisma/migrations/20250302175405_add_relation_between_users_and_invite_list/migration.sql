/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `inviteList` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "session_token_key";

-- AlterTable
ALTER TABLE "session" ALTER COLUMN "token" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "inviteList_code_key" ON "inviteList"("code");
