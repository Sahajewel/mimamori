/*
  Warnings:

  - A unique constraint covering the columns `[quickToken]` on the table `Senior` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Senior" ADD COLUMN     "quickToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Senior_quickToken_key" ON "Senior"("quickToken");

-- CreateIndex
CREATE INDEX "Senior_quickToken_idx" ON "Senior"("quickToken");
