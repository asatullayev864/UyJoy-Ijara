-- AlterTable
ALTER TABLE "users" ADD COLUMN     "otp" TEXT,
ADD COLUMN     "otp_expire" TIMESTAMP(3),
ALTER COLUMN "is_active" SET DEFAULT false;
