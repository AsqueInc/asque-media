/*
  Warnings:

  - You are about to drop the column `subscriptionExpirtDate` on the `Subscription` table. All the data in the column will be lost.
  - Added the required column `subscriptionPlan` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('FREEMIUM', 'PREMIUM');

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "subscriptionExpirtDate",
ADD COLUMN     "subscriptionPlan" "SubscriptionPlan" NOT NULL;
