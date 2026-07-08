/*
  Warnings:

  - A unique constraint covering the columns `[rentalRequestId]` on the table `reviews` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `provider` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rentalRequestId` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('STRIPE', 'SSLCOMMERZ');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CARD', 'BKASH', 'NAGAD', 'ROCKET', 'BANK');

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "method" "PaymentMethod" NOT NULL DEFAULT 'CARD',
ADD COLUMN     "provider" "PaymentProvider" NOT NULL,
ADD COLUMN     "sessionId" TEXT;

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "rentalRequestId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "reviews_rentalRequestId_key" ON "reviews"("rentalRequestId");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_rentalRequestId_fkey" FOREIGN KEY ("rentalRequestId") REFERENCES "rental_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
