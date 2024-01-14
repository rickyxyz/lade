/*
  Warnings:

  - Added the required column `answer` to the `Solved` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Solved" ADD COLUMN     "answer" STRING NOT NULL;
