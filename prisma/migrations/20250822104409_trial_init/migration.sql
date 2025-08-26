/*
  Warnings:

  - Added the required column `updatedAt` to the `Invitations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trialEndAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Invitations" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "trialEndAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "trialStartAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
