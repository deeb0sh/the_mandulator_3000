-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "lastname" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_lastname_key" ON "Users"("lastname");
