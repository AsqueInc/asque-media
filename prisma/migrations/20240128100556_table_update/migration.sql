-- DropIndex
DROP INDEX "User_name_key";

-- AlterTable
ALTER TABLE "Referral" ADD COLUMN     "balance" DECIMAL(65,30) NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'ARTIST';
