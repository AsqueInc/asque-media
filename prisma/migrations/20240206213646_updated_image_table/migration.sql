/*
  Warnings:

  - You are about to drop the column `imageUris` on the `Story` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Story" DROP COLUMN "imageUris",
ADD COLUMN     "firstImage" TEXT,
ADD COLUMN     "secondImage" TEXT,
ADD COLUMN     "thirdImage" TEXT;
