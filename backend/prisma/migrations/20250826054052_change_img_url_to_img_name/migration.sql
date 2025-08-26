/*
  Warnings:

  - You are about to drop the column `imgURL` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Post" DROP COLUMN "imgURL",
ADD COLUMN     "imgName" TEXT;
