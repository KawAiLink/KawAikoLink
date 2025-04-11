/*
  Warnings:

  - Made the column `mode` on table `Preferences` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Preferences" ALTER COLUMN "mode" SET NOT NULL,
ALTER COLUMN "mode" SET DEFAULT 'FRIEND_MODE';
