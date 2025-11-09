/*
  Warnings:

  - Added the required column `client_id` to the `rental_times` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "rental_times" ADD COLUMN     "client_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "rental_times" ADD CONSTRAINT "rental_times_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
