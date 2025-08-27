-- CreateTable
CREATE TABLE "public"."BillingInterest" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BillingInterest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ReportedBug" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT,
    "steps" TEXT NOT NULL,
    "screenshots" TEXT[],
    "screenshotsPublicId" TEXT[],

    CONSTRAINT "ReportedBug_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BillingInterest_username_key" ON "public"."BillingInterest"("username");

-- CreateIndex
CREATE UNIQUE INDEX "BillingInterest_email_key" ON "public"."BillingInterest"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ReportedBug_username_key" ON "public"."ReportedBug"("username");

-- CreateIndex
CREATE UNIQUE INDEX "ReportedBug_email_key" ON "public"."ReportedBug"("email");

-- AddForeignKey
ALTER TABLE "public"."BillingInterest" ADD CONSTRAINT "BillingInterest_username_fkey" FOREIGN KEY ("username") REFERENCES "public"."User"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReportedBug" ADD CONSTRAINT "ReportedBug_username_fkey" FOREIGN KEY ("username") REFERENCES "public"."User"("username") ON DELETE CASCADE ON UPDATE CASCADE;
