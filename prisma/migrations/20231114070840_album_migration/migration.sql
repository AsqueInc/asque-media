-- CreateTable
CREATE TABLE "Album" (
    "id" TEXT NOT NULL,
    "artworkId" TEXT NOT NULL,
    "albumImageUris" TEXT[],

    CONSTRAINT "Album_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Album_artworkId_key" ON "Album"("artworkId");

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_artworkId_fkey" FOREIGN KEY ("artworkId") REFERENCES "ArtWork"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
