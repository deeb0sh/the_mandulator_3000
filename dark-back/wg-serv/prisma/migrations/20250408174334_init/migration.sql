-- AlterTable
ALTER TABLE "ServerDe" ALTER COLUMN "lan" SET DEFAULT '10.12.0.0/16';

-- AlterTable
ALTER TABLE "ServerFi" ALTER COLUMN "lan" SET DEFAULT '10.13.0.0/16';

-- AlterTable
ALTER TABLE "ServerRu" ALTER COLUMN "lan" SET DEFAULT '10.11.0.0/16';

-- CreateTable
CREATE TABLE "UserSubnet" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "cidr" TEXT NOT NULL,
    "serverType" "ServerType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSubnet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSubnet_userId_serverType_key" ON "UserSubnet"("userId", "serverType");

-- AddForeignKey
ALTER TABLE "UserSubnet" ADD CONSTRAINT "UserSubnet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
