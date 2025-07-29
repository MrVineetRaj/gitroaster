-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "PullRequestStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('pending', 'authenticated', 'active', 'paused', 'cancelled', 'halted');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'captured', 'failed');

-- CreateTable
CREATE TABLE "User" (
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "defaultOrg" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "InstallationId" (
    "id" TEXT NOT NULL,
    "installationId" TEXT NOT NULL,
    "ownerUsername" TEXT NOT NULL,
    "orgname" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InstallationId_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAsMemberAndOrg" (
    "id" TEXT NOT NULL,
    "orgname" TEXT NOT NULL,
    "teamMemberUsername" TEXT NOT NULL,
    "isAllowed" BOOLEAN NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAsMemberAndOrg_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrgRepo" (
    "repoFullName" TEXT NOT NULL,
    "ownerUsername" TEXT NOT NULL,
    "orgname" TEXT NOT NULL,
    "isConnected" BOOLEAN NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrgRepo_pkey" PRIMARY KEY ("repoFullName")
);

-- CreateTable
CREATE TABLE "PullRequest" (
    "id" TEXT NOT NULL,
    "ownerUsername" TEXT NOT NULL,
    "repoFullName" TEXT NOT NULL,
    "orgname" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "pullNumber" INTEGER NOT NULL,
    "status" "PullRequestStatus" NOT NULL DEFAULT 'PENDING',
    "timeTakenToReview" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PullRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
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
CREATE TABLE "Subscription" (
    "subscriptionId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "orgname" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'pending',
    "cycleStart" TIMESTAMP(3) NOT NULL,
    "cycleEnd" TIMESTAMP(3) NOT NULL,
    "upcomingPayment" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("subscriptionId")
);

-- CreateTable
CREATE TABLE "Payments" (
    "paymentId" TEXT NOT NULL,
    "orgname" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "invoiceId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "paymentDetails" JSONB NOT NULL,
    "email" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("paymentId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "InstallationId_orgname_ownerUsername_key" ON "InstallationId"("orgname", "ownerUsername");

-- CreateIndex
CREATE UNIQUE INDEX "UserAsMemberAndOrg_orgname_teamMemberUsername_key" ON "UserAsMemberAndOrg"("orgname", "teamMemberUsername");

-- CreateIndex
CREATE UNIQUE INDEX "PullRequest_repoFullName_pullNumber_key" ON "PullRequest"("repoFullName", "pullNumber");

-- AddForeignKey
ALTER TABLE "InstallationId" ADD CONSTRAINT "InstallationId_ownerUsername_fkey" FOREIGN KEY ("ownerUsername") REFERENCES "User"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAsMemberAndOrg" ADD CONSTRAINT "UserAsMemberAndOrg_teamMemberUsername_fkey" FOREIGN KEY ("teamMemberUsername") REFERENCES "User"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgRepo" ADD CONSTRAINT "OrgRepo_ownerUsername_fkey" FOREIGN KEY ("ownerUsername") REFERENCES "User"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PullRequest" ADD CONSTRAINT "PullRequest_repoFullName_fkey" FOREIGN KEY ("repoFullName") REFERENCES "OrgRepo"("repoFullName") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PullRequest" ADD CONSTRAINT "PullRequest_ownerUsername_fkey" FOREIGN KEY ("ownerUsername") REFERENCES "User"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("planId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_username_fkey" FOREIGN KEY ("username") REFERENCES "User"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_username_fkey" FOREIGN KEY ("username") REFERENCES "User"("username") ON DELETE CASCADE ON UPDATE CASCADE;
