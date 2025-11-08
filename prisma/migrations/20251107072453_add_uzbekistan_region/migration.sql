/*
  Warnings:

  - You are about to drop the column `city` on the `houses` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UzbekistanRegion" AS ENUM ('Tashkent', 'Samarkand', 'Bukhara', 'Khorezm', 'Fergana', 'Andijan', 'Namangan', 'Surkhandarya', 'Kashkadarya', 'Jizzakh', 'Navoi', 'Sirdarya');

-- AlterTable
ALTER TABLE "houses" DROP COLUMN "city",
ADD COLUMN     "province" "UzbekistanRegion" NOT NULL DEFAULT 'Tashkent';
