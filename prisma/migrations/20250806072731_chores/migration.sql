/*
  Warnings:

  - The `status` column on the `Payments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Subscription` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterEnum
ALTER TYPE "public"."SubscriptionStatus" ADD VALUE 'completed';

-- AlterTable
ALTER TABLE "public"."Payments" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending',
ALTER COLUMN "invoiceId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Subscription" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending',
ALTER COLUMN "cycleStart" DROP NOT NULL,
ALTER COLUMN "cycleEnd" DROP NOT NULL;
