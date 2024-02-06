/*
  Warnings:

  - You are about to drop the column `payeeId` on the `Payment` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "trackingId" TEXT;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "payeeId",
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING';
