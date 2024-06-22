-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "updatedAt" DROP NOT NULL;
ALTER TABLE "Comment" ALTER COLUMN "deletedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Solved" ALTER COLUMN "updatedAt" DROP NOT NULL;
