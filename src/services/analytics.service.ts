import { PrismaClient, TicketStatus } from "@prisma/client";

const prisma = new PrismaClient();

export const AnalyticsService = {
  async getEventSummary(eventId: number) {
    const stats = await prisma.ticket.groupBy({
      by: ["status"],
      where: { eventId },
      _count: { _all: true },
      _sum: { price: true },
    });

    // Transform the array into a clean object
    const summary = {
      available: 0,
      reserved: 0,
      sold: 0,
      totalRevenue: 0,
    };

    stats.forEach((stat) => {
      if (stat.status === TicketStatus.AVAILABLE)
        summary.available = stat._count._all;
      if (stat.status === TicketStatus.RESERVED)
        summary.reserved = stat._count._all;
      if (stat.status === TicketStatus.SOLD) {
        summary.sold = stat._count._all;
        summary.totalRevenue = stat._sum.price || 0;
      }
    });

    return summary;
  },
};
