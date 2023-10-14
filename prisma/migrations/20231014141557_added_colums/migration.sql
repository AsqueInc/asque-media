/*
  Warnings:

  - Added the required column `artwork_id` to the `ArtWork_Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category_id` to the `ArtWork_Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ArtWork_Category" ADD COLUMN     "artwork_id" TEXT NOT NULL,
ADD COLUMN     "category_id" TEXT NOT NULL;
