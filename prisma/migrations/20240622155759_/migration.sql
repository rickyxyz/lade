-- AlterTable
ALTER TABLE "Contest" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deletedAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN     "updatedAt" TIMESTAMP(3);
