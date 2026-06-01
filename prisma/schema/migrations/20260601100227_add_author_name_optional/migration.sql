-- DropForeignKey
ALTER TABLE "CareNote" DROP CONSTRAINT "CareNote_userId_fkey";

-- DropForeignKey
ALTER TABLE "CheckIn" DROP CONSTRAINT "CheckIn_userId_fkey";

-- DropForeignKey
ALTER TABLE "MedicineLog" DROP CONSTRAINT "MedicineLog_userId_fkey";

-- DropIndex
DROP INDEX "CareNote_createdAt_idx";

-- DropIndex
DROP INDEX "CareNote_seniorId_idx";

-- DropIndex
DROP INDEX "CheckIn_createdAt_idx";

-- DropIndex
DROP INDEX "CheckIn_seniorId_idx";

-- DropIndex
DROP INDEX "CheckIn_status_idx";

-- DropIndex
DROP INDEX "MedicineLog_status_idx";

-- AlterTable
ALTER TABLE "CareNote" ADD COLUMN     "authorName" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "CheckIn" ADD COLUMN     "authorName" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "MedicineLog" ADD COLUMN     "authorName" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "CareNote_seniorId_createdAt_idx" ON "CareNote"("seniorId", "createdAt");

-- CreateIndex
CREATE INDEX "CheckIn_seniorId_status_createdAt_idx" ON "CheckIn"("seniorId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "MedicineLog_userId_status_idx" ON "MedicineLog"("userId", "status");

-- AddForeignKey
ALTER TABLE "CareNote" ADD CONSTRAINT "CareNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckIn" ADD CONSTRAINT "CheckIn_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicineLog" ADD CONSTRAINT "MedicineLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
