import { PrismaClient, TicketStatus } from "@prisma/client";

const prisma = new PrismaClient();

export const BookingService = {
  /**
   * 1. RESERVE: Holds a ticket for 10 minutes
   */
  async reserveTicket(userId: number, eventId: number) {
    return await prisma.$transaction(async (tx) => {
      // Find one available ticket using raw SQL to ensure "Row Locking" (FOR UPDATE)
      // This prevents race conditions at the database level.
      const tickets = await tx.$queryRaw<any[]>`
        SELECT id FROM "Ticket"
        WHERE "eventId" = ${eventId} AND "status" = 'AVAILABLE'
        LIMIT 1
        FOR UPDATE SKIP LOCKED
      `;

      if (tickets.length === 0) {
        throw new Error("Sold out!");
      }

      const ticketId = tickets[0].id;

      return await tx.ticket.update({
        where: { id: ticketId },
        data: {
          status: TicketStatus.RESERVED,
          userId: userId,
          reservedAt: new Date(),
        },
      });
    });
  },

  /**
   * 2. CONFIRM: Finalizes the purchase after payment
   */
  async confirmPurchase(ticketId: number, userId: number) {
    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });

    if (
      !ticket ||
      ticket.status !== TicketStatus.RESERVED ||
      ticket.userId !== userId
    ) {
      throw new Error("Invalid reservation or session expired.");
    }

    return await prisma.ticket.update({
      where: { id: ticketId },
      data: { status: TicketStatus.SOLD },
    });
  },

  /**
   * 3. CLEANUP: Releases tickets that were reserved but never paid for
   */
  async releaseExpiredTickets() {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    return await prisma.ticket.updateMany({
      where: {
        status: TicketStatus.RESERVED,
        reservedAt: { lt: tenMinutesAgo },
      },
      data: {
        status: TicketStatus.AVAILABLE,
        userId: null,
        reservedAt: null,
      },
    });
  },
};
