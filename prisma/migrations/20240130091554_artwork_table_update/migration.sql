/*
  Warnings:

  - You are about to drop the column `artistName` on the `ArtWork` table. All the data in the column will be lost.
  - Added the required column `saleType` to the `ArtWork` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SaleType" AS ENUM ('ORIGINAL', 'PRINT');

-- AlterTable
ALTER TABLE "ArtWork" DROP COLUMN "artistName",
ADD COLUMN     "saleType" "SaleType" NOT NULL,
ALTER COLUMN "quantity" DROP NOT NULL;
