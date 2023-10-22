-- AlterTable
ALTER TABLE "ArtWork" ALTER COLUMN "firstImageUri" DROP NOT NULL,
ALTER COLUMN "secondImageUri" DROP NOT NULL,
ALTER COLUMN "thirdImageUri" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "bankAccountNumber" TEXT,
ADD COLUMN     "bankName" TEXT;
