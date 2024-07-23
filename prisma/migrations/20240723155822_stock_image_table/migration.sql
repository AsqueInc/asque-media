-- AlterTable
ALTER TABLE "Album" ADD COLUMN     "subTitle" TEXT;

-- CreateTable
CREATE TABLE "StockImage" (
    "id" TEXT NOT NULL,
    "stockImageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StockImage_pkey" PRIMARY KEY ("id")
);
