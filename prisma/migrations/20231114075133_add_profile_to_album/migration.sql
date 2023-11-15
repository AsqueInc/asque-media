/*
  Warnings:

  - A unique constraint covering the columns `[profileId]` on the table `Album` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `profileId` to the `Album` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Album` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Album" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "profileId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Album_profileId_key" ON "Album"("profileId");

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
