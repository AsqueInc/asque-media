-- CreateTable
CREATE TABLE "AlbumChildren" (
    "id" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,
    "subTitle" TEXT,
    "albumImageUris" TEXT[],
    "description" TEXT,
    "category" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "audioUrl" TEXT,

    CONSTRAINT "AlbumChildren_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AlbumChildren" ADD CONSTRAINT "AlbumChildren_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
