/*
  Warnings:

  - You are about to drop the column `contestId` on the `Problem` table. All the data in the column will be lost.
  - Added the required column `endDate` to the `Contest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Contest` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Problem" DROP CONSTRAINT "Problem_contestId_fkey";

-- AlterTable
ALTER TABLE "Contest" ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL;
ALTER TABLE "Contest" ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "contestId";

-- CreateTable
CREATE TABLE "ContestToProblem" (
    "contestId" INT8 NOT NULL,
    "problemId" INT8 NOT NULL,
    "score" INT4 NOT NULL,

    CONSTRAINT "ContestToProblem_pkey" PRIMARY KEY ("contestId","problemId")
);

-- AddForeignKey
ALTER TABLE "ContestToProblem" ADD CONSTRAINT "ContestToProblem_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestToProblem" ADD CONSTRAINT "ContestToProblem_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
