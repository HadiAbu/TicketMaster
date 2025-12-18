-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'SOLD');

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "reservedAt" TIMESTAMP(3),
ADD COLUMN     "status" "TicketStatus" NOT NULL DEFAULT 'AVAILABLE';
