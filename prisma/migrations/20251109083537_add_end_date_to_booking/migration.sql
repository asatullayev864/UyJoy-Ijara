/*
  Warnings:

  - Added the required column `end_date` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "end_date" TIMESTAMP(3) NOT NULL;
