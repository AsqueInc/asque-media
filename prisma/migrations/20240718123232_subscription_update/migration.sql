/*
  Warnings:

  - You are about to drop the column `invoiceCode` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `periodEnd` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `periodStart` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionId` on the `Subscription` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "SubscriptionStatus" ADD VALUE 'CANCELED';

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "invoiceCode",
DROP COLUMN "periodEnd",
DROP COLUMN "periodStart",
DROP COLUMN "subscriptionId",
ADD COLUMN     "cancelledAt" TEXT,
ALTER COLUMN "status" SET DEFAULT 'PENDING';
