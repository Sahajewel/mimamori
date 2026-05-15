/*
  Warnings:

  - You are about to drop the column `userId` on the `Senior` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SeniorMemberRole" AS ENUM ('OWNER', 'EDITOR', 'VIEWER');

-- DropForeignKey
ALTER TABLE "Senior" DROP CONSTRAINT "Senior_userId_fkey";

-- DropIndex
DROP INDEX "Senior_userId_idx";

-- AlterTable
ALTER TABLE "Medicine" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Senior" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "Invitation" (
    "id" TEXT NOT NULL,
    "seniorId" TEXT NOT NULL,
    "invitedBy" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "role" "SeniorMemberRole" NOT NULL DEFAULT 'VIEWER',
    "accepted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeniorMember" (
    "id" TEXT NOT NULL,
    "seniorId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "SeniorMemberRole" NOT NULL DEFAULT 'VIEWER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SeniorMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_token_key" ON "Invitation"("token");

-- CreateIndex
CREATE INDEX "Invitation_token_idx" ON "Invitation"("token");

-- CreateIndex
CREATE INDEX "Invitation_email_idx" ON "Invitation"("email");

-- CreateIndex
CREATE INDEX "Invitation_seniorId_idx" ON "Invitation"("seniorId");

-- CreateIndex
CREATE INDEX "SeniorMember_seniorId_idx" ON "SeniorMember"("seniorId");

-- CreateIndex
CREATE INDEX "SeniorMember_userId_idx" ON "SeniorMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SeniorMember_seniorId_userId_key" ON "SeniorMember"("seniorId", "userId");

-- CreateIndex
CREATE INDEX "Senior_id_idx" ON "Senior"("id");

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_seniorId_fkey" FOREIGN KEY ("seniorId") REFERENCES "Senior"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_invitedBy_fkey" FOREIGN KEY ("invitedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeniorMember" ADD CONSTRAINT "SeniorMember_seniorId_fkey" FOREIGN KEY ("seniorId") REFERENCES "Senior"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeniorMember" ADD CONSTRAINT "SeniorMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
