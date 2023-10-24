/*
  Warnings:

  - Added the required column `orderId` to the `Order_Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Order_Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Order_Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order_Item" ADD COLUMN     "orderId" TEXT NOT NULL,
ADD COLUMN     "price" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "profileId" TEXT NOT NULL,
ALTER COLUMN "rating" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Order_Item" ADD CONSTRAINT "Order_Item_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
