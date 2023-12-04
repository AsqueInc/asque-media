/*
  Warnings:

  - You are about to drop the column `userId` on the `Blog` table. All the data in the column will be lost.
  - Added the required column `profileId` to the `Blog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Blog" DROP CONSTRAINT "Blog_userId_fkey";

-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "userId",
ADD COLUMN     "imageUris" TEXT[],
ADD COLUMN     "profileId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
