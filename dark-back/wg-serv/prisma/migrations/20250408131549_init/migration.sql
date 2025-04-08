-- CreateTable
CREATE TABLE "Role" (
    "id" INTEGER NOT NULL,
    "name" TEXT,
    "speed" INTEGER,
    "network" INTEGER,
    "networkReserv" INTEGER NOT NULL DEFAULT 28,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "login" TEXT,
    "roleId" INTEGER,
    "serverRuId" INTEGER,
    "serverDeId" INTEGER,
    "serverFiId" INTEGER,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServerRu" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'wg-ru',
    "lan" TEXT NOT NULL DEFAULT '10.1.0.0/16',
    "publicKey" TEXT NOT NULL,
    "privatKey" TEXT NOT NULL,
    "port" INTEGER NOT NULL DEFAULT 51820,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServerRu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServerDe" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'wg-de',
    "lan" TEXT NOT NULL DEFAULT '10.2.0.0/16',
    "publicKey" TEXT NOT NULL,
    "privatKey" TEXT NOT NULL,
    "port" INTEGER NOT NULL DEFAULT 51820,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServerDe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServerFi" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'wg-fi',
    "lan" TEXT NOT NULL DEFAULT '10.3.0.0/16',
    "publicKey" TEXT NOT NULL,
    "privatKey" TEXT NOT NULL,
    "port" INTEGER NOT NULL DEFAULT 51820,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServerFi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientRU" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,
    "endPoint" TEXT NOT NULL,
    "allowIps" TEXT NOT NULL DEFAULT '0.0.0.0/0',
    "dns" TEXT NOT NULL DEFAULT '45.142.122.244, 77.221.159.104',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "serverId" INTEGER NOT NULL,

    CONSTRAINT "ClientRU_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientDe" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,
    "endPoint" TEXT NOT NULL,
    "allowIps" TEXT NOT NULL DEFAULT '0.0.0.0/0',
    "dns" TEXT NOT NULL DEFAULT '45.142.122.244, 77.221.159.104',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "serverId" INTEGER NOT NULL,

    CONSTRAINT "ClientDe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientFi" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,
    "endPoint" TEXT NOT NULL,
    "allowIps" TEXT NOT NULL DEFAULT '0.0.0.0/0',
    "dns" TEXT NOT NULL DEFAULT '45.142.122.244, 77.221.159.104',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "serverId" INTEGER NOT NULL,

    CONSTRAINT "ClientFi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_login_key" ON "users"("login");

-- CreateIndex
CREATE INDEX "users_roleId_idx" ON "users"("roleId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_serverRuId_fkey" FOREIGN KEY ("serverRuId") REFERENCES "ServerRu"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_serverDeId_fkey" FOREIGN KEY ("serverDeId") REFERENCES "ServerDe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_serverFiId_fkey" FOREIGN KEY ("serverFiId") REFERENCES "ServerFi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientRU" ADD CONSTRAINT "ClientRU_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "ServerRu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientDe" ADD CONSTRAINT "ClientDe_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "ServerDe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientFi" ADD CONSTRAINT "ClientFi_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "ServerFi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
