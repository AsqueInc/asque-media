/*
  Warnings:

  - You are about to drop the `Podcast` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "LikeType" AS ENUM ('ARTWORK', 'BLOG', 'ALBUM');

-- DropForeignKey
ALTER TABLE "Podcast" DROP CONSTRAINT "Podcast_profileId_fkey";

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Referral" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Transfer" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "Podcast";

-- DropEnum
DROP TYPE "PodcastType";

-- CreateTable
CREATE TABLE "Like" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "itemType" "LikeType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
