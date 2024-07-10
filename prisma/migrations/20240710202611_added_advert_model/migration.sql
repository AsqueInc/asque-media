-- CreateTable
CREATE TABLE "Advert" (
    "id" TEXT NOT NULL,
    "adminProfileId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "imageUris" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Advert_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Advert_adminProfileId_key" ON "Advert"("adminProfileId");

-- AddForeignKey
ALTER TABLE "Advert" ADD CONSTRAINT "Advert_adminProfileId_fkey" FOREIGN KEY ("adminProfileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
