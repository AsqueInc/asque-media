/*
  Warnings:

  - You are about to drop the `ArtWork_Repository` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Repository` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "ArtWork" ADD COLUMN     "category" TEXT[];

-- DropTable
DROP TABLE "ArtWork_Repository";

-- DropTable
DROP TABLE "Repository";

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);
