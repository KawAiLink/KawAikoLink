/*
  Warnings:

  - You are about to drop the column `mode` on the `Preferences` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Preferences" DROP COLUMN "mode";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dateEnabled" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "Mode";
