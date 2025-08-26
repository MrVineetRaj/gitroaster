-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "public"."PullRequestStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."SubscriptionStatus" AS ENUM ('pending', 'authenticated', 'active', 'completed', 'paused', 'cancelled', 'halted');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('pending', 'captured', 'failed');

-- CreateEnum
CREATE TYPE "public"."InvitationStatus" AS ENUM ('pending', 'accepted', 'rejected');

-- CreateTable
CREATE TABLE "public"."User" (
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "defaultOrg" TEXT NOT NULL,
    "role" "public"."UserRole" NOT NULL DEFAULT 'USER',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "public"."InstallationId" (
    "id" TEXT NOT NULL,
    "installationId" TEXT NOT NULL,
    "ownerUsername" TEXT NOT NULL,
    "orgname" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InstallationId_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserAsMemberAndOrg" (
    "id" TEXT NOT NULL,
    "orgname" TEXT NOT NULL,
    "teamMemberUsername" TEXT NOT NULL,
    "isAllowed" BOOLEAN NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAsMemberAndOrg_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OrgRepo" (
    "repoFullName" TEXT NOT NULL,
    "ownerUsername" TEXT NOT NULL,
    "orgname" TEXT NOT NULL,
    "isConnected" BOOLEAN NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrgRepo_pkey" PRIMARY KEY ("repoFullName")
);

-- CreateTable
CREATE TABLE "public"."PullRequest" (
    "id" TEXT NOT NULL,
    "ownerUsername" TEXT NOT NULL,
    "repoFullName" TEXT NOT NULL,
    "orgname" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "pullNumber" INTEGER NOT NULL,
    "status" "public"."PullRequestStatus" NOT NULL DEFAULT 'PENDING',
    "timeTakenToReview" INTEGER NOT NULL,
    "charCount" INTEGER NOT NULL DEFAULT 0,
    "tokenCount" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PullRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Plan" (
    "planId" TEXT NOT NULL,
    "interval" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "unitAmount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "features" TEXT[],
    "isActive" BOOLEAN NOT NULL,
    "isPopular" BOOLEAN NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("planId")
);

-- CreateTable
CREATE TABLE "public"."Subscription" (
    "subscriptionId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "orgname" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "cycleStart" TIMESTAMP(3),
    "cycleEnd" TIMESTAMP(3),
    "upcomingPayment" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("subscriptionId")
);

-- CreateTable
CREATE TABLE "public"."Payments" (
    "paymentId" TEXT NOT NULL,
    "orgname" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "invoiceId" TEXT,
    "orderId" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "paymentDetails" JSONB NOT NULL,
    "email" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("paymentId")
);

-- CreateTable
CREATE TABLE "public"."AiTone" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "orgname" TEXT NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "usedForRepoFullName" TEXT,
    "title" TEXT NOT NULL,
    "userDescription" TEXT NOT NULL,
    "extractedTone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiTone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Invitations" (
    "id" TEXT NOT NULL,
    "senderUserName" TEXT NOT NULL,
    "orgname" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" "public"."InvitationStatus" NOT NULL DEFAULT 'pending',
    "isResponded" BOOLEAN NOT NULL,

    CONSTRAINT "Invitations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "InstallationId_orgname_ownerUsername_key" ON "public"."InstallationId"("orgname", "ownerUsername");

-- CreateIndex
CREATE UNIQUE INDEX "UserAsMemberAndOrg_orgname_teamMemberUsername_key" ON "public"."UserAsMemberAndOrg"("orgname", "teamMemberUsername");

-- CreateIndex
CREATE UNIQUE INDEX "PullRequest_repoFullName_pullNumber_key" ON "public"."PullRequest"("repoFullName", "pullNumber");

-- AddForeignKey
ALTER TABLE "public"."InstallationId" ADD CONSTRAINT "InstallationId_ownerUsername_fkey" FOREIGN KEY ("ownerUsername") REFERENCES "public"."User"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserAsMemberAndOrg" ADD CONSTRAINT "UserAsMemberAndOrg_teamMemberUsername_fkey" FOREIGN KEY ("teamMemberUsername") REFERENCES "public"."User"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrgRepo" ADD CONSTRAINT "OrgRepo_ownerUsername_fkey" FOREIGN KEY ("ownerUsername") REFERENCES "public"."User"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PullRequest" ADD CONSTRAINT "PullRequest_repoFullName_fkey" FOREIGN KEY ("repoFullName") REFERENCES "public"."OrgRepo"("repoFullName") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PullRequest" ADD CONSTRAINT "PullRequest_ownerUsername_fkey" FOREIGN KEY ("ownerUsername") REFERENCES "public"."User"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Subscription" ADD CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "public"."Plan"("planId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Subscription" ADD CONSTRAINT "Subscription_username_fkey" FOREIGN KEY ("username") REFERENCES "public"."User"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payments" ADD CONSTRAINT "Payments_username_fkey" FOREIGN KEY ("username") REFERENCES "public"."User"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AiTone" ADD CONSTRAINT "AiTone_username_fkey" FOREIGN KEY ("username") REFERENCES "public"."User"("username") ON DELETE CASCADE ON UPDATE CASCADE;
