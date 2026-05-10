-- AlterEnum
ALTER TYPE "RoleEnum" ADD VALUE 'OPERATOR_POSYANDU';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "posyanduId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_posyanduId_fkey" FOREIGN KEY ("posyanduId") REFERENCES "Posyandu"("id") ON DELETE SET NULL ON UPDATE CASCADE;
