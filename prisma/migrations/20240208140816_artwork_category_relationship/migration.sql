/*
  Warnings:

  - You are about to drop the column `category` on the `ArtWork` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ArtWork" DROP COLUMN "category";

-- CreateTable
CREATE TABLE "_ArtWorkToCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ArtWorkToCategory_AB_unique" ON "_ArtWorkToCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_ArtWorkToCategory_B_index" ON "_ArtWorkToCategory"("B");

-- AddForeignKey
ALTER TABLE "_ArtWorkToCategory" ADD CONSTRAINT "_ArtWorkToCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "ArtWork"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArtWorkToCategory" ADD CONSTRAINT "_ArtWorkToCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
