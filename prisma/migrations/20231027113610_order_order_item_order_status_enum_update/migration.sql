/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `Order` table. All the data in the column will be lost.
  - Added the required column `artworkId` to the `Order_Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'SHIPPED';

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "createdAt",
DROP COLUMN "totalAmount",
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "dateOrdered" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "firstShippingAddress" TEXT,
ADD COLUMN     "secondShippingAddress" TEXT,
ADD COLUMN     "totalPrice" DECIMAL(65,30) DEFAULT 0,
ADD COLUMN     "zip" TEXT;

-- AlterTable
ALTER TABLE "Order_Item" ADD COLUMN     "artworkId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Order_Item" ADD CONSTRAINT "Order_Item_artworkId_fkey" FOREIGN KEY ("artworkId") REFERENCES "ArtWork"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
