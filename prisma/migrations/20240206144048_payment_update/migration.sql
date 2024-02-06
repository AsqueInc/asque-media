/*
  Warnings:

  - You are about to drop the column `transactionId` on the `Payment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[transactionReference]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `transactionReference` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "transactionId",
ADD COLUMN     "transactionReference" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Payment_transactionReference_key" ON "Payment"("transactionReference");
