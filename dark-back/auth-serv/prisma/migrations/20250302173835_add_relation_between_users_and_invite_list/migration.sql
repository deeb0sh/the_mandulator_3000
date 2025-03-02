-- DropIndex
DROP INDEX "inviteList_code_key";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "inCode" TEXT;
