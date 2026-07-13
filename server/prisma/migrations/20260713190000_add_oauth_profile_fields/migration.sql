-- AlterTable
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "avatarUrl" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "authProvider" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "providerAccountId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "User_providerAccountId_key" ON "User"("providerAccountId");
