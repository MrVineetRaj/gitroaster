/*
  Warnings:

  - A unique constraint covering the columns `[orgname]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Subscription_orgname_key" ON "public"."Subscription"("orgname");
