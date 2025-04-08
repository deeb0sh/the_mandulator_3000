-- CreateEnum
CREATE TYPE "ServerType" AS ENUM ('RU', 'DE', 'FI');

-- CreateTable
CREATE TABLE "UserAccess" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "serverType" "ServerType" NOT NULL,
    "allowed" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "UserAccess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserAccess_userId_serverType_key" ON "UserAccess"("userId", "serverType");

-- AddForeignKey
ALTER TABLE "UserAccess" ADD CONSTRAINT "UserAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
