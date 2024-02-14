-- CreateEnum
CREATE TYPE "PurchaseStatus" AS ENUM ('SoldOut', 'InStock');

-- AlterTable
ALTER TABLE "ArtWork" ADD COLUMN     "purchaseStatus" "PurchaseStatus" NOT NULL DEFAULT 'InStock';
