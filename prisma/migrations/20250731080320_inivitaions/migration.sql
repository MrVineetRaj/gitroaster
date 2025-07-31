-- CreateEnum
CREATE TYPE "public"."InvitationStatus" AS ENUM ('pending', 'accepted', 'rejected');

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
    "isResponded" TEXT NOT NULL,

    CONSTRAINT "Invitations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."AiTone" ADD CONSTRAINT "AiTone_username_fkey" FOREIGN KEY ("username") REFERENCES "public"."User"("username") ON DELETE CASCADE ON UPDATE CASCADE;
