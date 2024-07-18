/*
  Warnings:

  - You are about to drop the column `amount` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `interval` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `plan_token` on the `Subscription` table. All the data in the column will be lost.
  - Added the required column `subscriptionId` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "amount",
DROP COLUMN "duration",
DROP COLUMN "interval",
DROP COLUMN "plan_token",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "emailToken" TEXT,
ADD COLUMN     "invoiceCode" TEXT,
ADD COLUMN     "nextPaymentDate" TEXT,
ADD COLUMN     "periodEnd" TEXT,
ADD COLUMN     "periodStart" TEXT,
ADD COLUMN     "subscriptionCode" TEXT,
ADD COLUMN     "subscriptionId" TEXT NOT NULL,
ADD COLUMN     "transactionReference" TEXT,
ALTER COLUMN "currency" DROP NOT NULL;
