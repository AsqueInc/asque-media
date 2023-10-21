/*
  Warnings:

  - You are about to drop the column `detail` on the `ArtWork` table. All the data in the column will be lost.
  - You are about to drop the column `imageUri` on the `ArtWork` table. All the data in the column will be lost.
  - You are about to drop the column `ownerProfileId` on the `ArtWork` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `artistName` to the `ArtWork` table without a default value. This is not possible if the table is not empty.
  - Added the required column `artistProfileId` to the `ArtWork` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `ArtWork` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstImageUri` to the `ArtWork` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `ArtWork` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `ArtWork` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secondImageUri` to the `ArtWork` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thirdImageUri` to the `ArtWork` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ArtWork" DROP CONSTRAINT "ArtWork_ownerProfileId_fkey";

-- AlterTable
ALTER TABLE "ArtWork" DROP COLUMN "detail",
DROP COLUMN "imageUri",
DROP COLUMN "ownerProfileId",
ADD COLUMN     "artistName" TEXT NOT NULL,
ADD COLUMN     "artistProfileId" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "firstImageUri" TEXT NOT NULL,
ADD COLUMN     "price" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "secondImageUri" TEXT NOT NULL,
ADD COLUMN     "thirdImageUri" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role";

-- DropTable
DROP TABLE "Category";

-- DropEnum
DROP TYPE "UserRoleEnum";

-- CreateTable
CREATE TABLE "Repository" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Repository_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ArtWork" ADD CONSTRAINT "ArtWork_artistProfileId_fkey" FOREIGN KEY ("artistProfileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
