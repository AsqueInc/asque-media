/*
  Warnings:

  - The `category` column on the `Album` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `categoryId` on the `ArtWork` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ArtWork" DROP CONSTRAINT "ArtWork_categoryId_fkey";

-- AlterTable
ALTER TABLE "Album" DROP COLUMN "category",
ADD COLUMN     "category" TEXT[];

-- AlterTable
ALTER TABLE "ArtWork" DROP COLUMN "categoryId",
ADD COLUMN     "category" TEXT[];
