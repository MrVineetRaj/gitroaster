/*
  Warnings:

  - Changed the type of `isResponded` on the `Invitations` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."Invitations" DROP COLUMN "isResponded",
ADD COLUMN     "isResponded" BOOLEAN NOT NULL;
