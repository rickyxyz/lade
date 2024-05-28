/*
  Warnings:

  - You are about to drop the column `endDate` on the `Contest` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Contest` table. All the data in the column will be lost.
  - You are about to drop the column `statement` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the `Sheet` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `endAt` to the `Contest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startAt` to the `Contest` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Sheet" DROP CONSTRAINT "Sheet_contestId_fkey";

-- DropForeignKey
ALTER TABLE "Sheet" DROP CONSTRAINT "Sheet_userId_fkey";

-- AlterTable
ALTER TABLE "Contest" RENAME COLUMN "endDate" TO "endAt";
ALTER TABLE "Contest" RENAME COLUMN "startDate" TO "startAt";

-- AlterTable
ALTER TABLE "Problem" RENAME COLUMN "statement" TO "description";

-- DropTable
DROP TABLE "Sheet";

-- CreateTable
CREATE TABLE "Comment" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" STRING NOT NULL,
    "problemId" INT8,
    "contestId" INT8,
    "description" STRING NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
