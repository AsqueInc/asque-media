/*
  Warnings:

  - You are about to drop the column `firstImageUri` on the `ArtWork` table. All the data in the column will be lost.
  - You are about to drop the column `secondImageUri` on the `ArtWork` table. All the data in the column will be lost.
  - You are about to drop the column `thirdImageUri` on the `ArtWork` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ArtWork" DROP COLUMN "firstImageUri",
DROP COLUMN "secondImageUri",
DROP COLUMN "thirdImageUri",
ADD COLUMN     "imageUris" TEXT[];
