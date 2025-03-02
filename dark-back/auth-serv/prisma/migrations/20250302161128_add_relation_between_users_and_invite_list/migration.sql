/*
  Warnings:

  - You are about to drop the column `createDate` on the `inviteList` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "inviteList" DROP COLUMN "createDate",
ADD COLUMN     "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "limit" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "updateAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "session" (
    "id" SERIAL NOT NULL,
    "ownerID" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3),

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_ownerID_fkey" FOREIGN KEY ("ownerID") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
