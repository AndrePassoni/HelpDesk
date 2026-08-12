/*
  Warnings:

  - Added the required column `baseServiceId` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "baseServiceId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_baseServiceId_fkey" FOREIGN KEY ("baseServiceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
