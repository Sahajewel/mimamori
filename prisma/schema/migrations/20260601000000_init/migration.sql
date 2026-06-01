-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'FAMILY', 'CAREGIVER');

-- CreateEnum
CREATE TYPE "SeniorMemberRole" AS ENUM ('OWNER', 'EDITOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "CheckInStatus" AS ENUM ('OK', 'CONCERN', 'EMERGENCY');

-- CreateEnum
CREATE TYPE "MedicineStatus" AS ENUM ('PENDING', 'TAKEN', 'MISSED', 'SKIPPED');

-- CreateTable
CREATE TABLE "CareNote" (
    "id" TEXT NOT NULL,
    "seniorId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CareNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckIn" (
    "id" TEXT NOT NULL,
    "seniorId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "CheckInStatus" NOT NULL DEFAULT 'OK',
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CheckIn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "featureRequest" TEXT,
    "name" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "showOnLanding" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "playing_with_neon" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" REAL,

    CONSTRAINT "playing_with_neon_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "Medicine" (
    "id" TEXT NOT NULL,
    "seniorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dosage" TEXT,
    "frequency" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" INTEGER,
    "endDate" TIMESTAMP(3),
    "notes" TEXT,
    "ongoing" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Medicine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicineLog" (
    "id" TEXT NOT NULL,
    "medicineId" TEXT NOT NULL,
    "reminderId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "MedicineStatus" NOT NULL DEFAULT 'PENDING',
    "takenAt" TIMESTAMP(3),
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MedicineLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicineReminder" (
    "id" TEXT NOT NULL,
    "medicineId" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MedicineReminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "seniorId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "imageUrl" TEXT,
    "deletedAt" TIMESTAMP(3),
    "editedAt" TIMESTAMP(3),

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Senior" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "quickToken" TEXT,
    "photoUrl" TEXT,

    CONSTRAINT "Senior_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeniorMember" (
    "id" TEXT NOT NULL,
    "seniorId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "SeniorMemberRole" NOT NULL DEFAULT 'VIEWER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastReadAt" TIMESTAMP(3),

    CONSTRAINT "SeniorMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'FAMILY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "image" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifyToken" TEXT,
    "verifyExpires" TIMESTAMP(6),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PushSubscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PushSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CareNote_createdAt_idx" ON "CareNote"("createdAt");

-- CreateIndex
CREATE INDEX "CareNote_seniorId_idx" ON "CareNote"("seniorId");

-- CreateIndex
CREATE INDEX "CheckIn_createdAt_idx" ON "CheckIn"("createdAt");

-- CreateIndex
CREATE INDEX "CheckIn_seniorId_idx" ON "CheckIn"("seniorId");

-- CreateIndex
CREATE INDEX "CheckIn_status_idx" ON "CheckIn"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_token_key" ON "Invitation"("token");

-- CreateIndex
CREATE INDEX "Invitation_email_idx" ON "Invitation"("email");

-- CreateIndex
CREATE INDEX "Invitation_seniorId_idx" ON "Invitation"("seniorId");

-- CreateIndex
CREATE INDEX "Invitation_token_idx" ON "Invitation"("token");

-- CreateIndex
CREATE INDEX "Medicine_seniorId_idx" ON "Medicine"("seniorId");

-- CreateIndex
CREATE INDEX "Medicine_endDate_idx" ON "Medicine"("endDate");

-- CreateIndex
CREATE INDEX "Medicine_active_idx" ON "Medicine"("active");

-- CreateIndex
CREATE INDEX "MedicineLog_medicineId_idx" ON "MedicineLog"("medicineId");

-- CreateIndex
CREATE INDEX "MedicineLog_reminderId_idx" ON "MedicineLog"("reminderId");

-- CreateIndex
CREATE INDEX "MedicineLog_createdAt_idx" ON "MedicineLog"("createdAt");

-- CreateIndex
CREATE INDEX "MedicineLog_status_idx" ON "MedicineLog"("status");

-- CreateIndex
CREATE INDEX "MedicineReminder_medicineId_idx" ON "MedicineReminder"("medicineId");

-- CreateIndex
CREATE INDEX "Message_seniorId_idx" ON "Message"("seniorId");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE INDEX "PasswordResetToken_email_idx" ON "PasswordResetToken"("email");

-- CreateIndex
CREATE INDEX "PasswordResetToken_token_idx" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Senior_quickToken_key" ON "Senior"("quickToken");

-- CreateIndex
CREATE INDEX "Senior_id_idx" ON "Senior"("id");

-- CreateIndex
CREATE INDEX "Senior_quickToken_idx" ON "Senior"("quickToken");

-- CreateIndex
CREATE INDEX "SeniorMember_seniorId_idx" ON "SeniorMember"("seniorId");

-- CreateIndex
CREATE INDEX "SeniorMember_userId_idx" ON "SeniorMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SeniorMember_seniorId_userId_key" ON "SeniorMember"("seniorId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PushSubscription_endpoint_key" ON "PushSubscription"("endpoint");

-- CreateIndex
CREATE INDEX "PushSubscription_userId_idx" ON "PushSubscription"("userId");

-- AddForeignKey
ALTER TABLE "CareNote" ADD CONSTRAINT "CareNote_seniorId_fkey" FOREIGN KEY ("seniorId") REFERENCES "Senior"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareNote" ADD CONSTRAINT "CareNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckIn" ADD CONSTRAINT "CheckIn_seniorId_fkey" FOREIGN KEY ("seniorId") REFERENCES "Senior"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckIn" ADD CONSTRAINT "CheckIn_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_invitedBy_fkey" FOREIGN KEY ("invitedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_seniorId_fkey" FOREIGN KEY ("seniorId") REFERENCES "Senior"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medicine" ADD CONSTRAINT "Medicine_seniorId_fkey" FOREIGN KEY ("seniorId") REFERENCES "Senior"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicineLog" ADD CONSTRAINT "MedicineLog_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "Medicine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicineLog" ADD CONSTRAINT "MedicineLog_reminderId_fkey" FOREIGN KEY ("reminderId") REFERENCES "MedicineReminder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicineLog" ADD CONSTRAINT "MedicineLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicineReminder" ADD CONSTRAINT "MedicineReminder_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "Medicine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_seniorId_fkey" FOREIGN KEY ("seniorId") REFERENCES "Senior"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeniorMember" ADD CONSTRAINT "SeniorMember_seniorId_fkey" FOREIGN KEY ("seniorId") REFERENCES "Senior"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeniorMember" ADD CONSTRAINT "SeniorMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PushSubscription" ADD CONSTRAINT "PushSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

