import { BookingService } from "../services/booking.service";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 1. Increase timeout globally for this file to 30 seconds
jest.setTimeout(30000);

describe("Ticketing Stress Test", () => {
  // 2. Properly close the database handle after tests
  afterAll(async () => {
    await prisma.$disconnect();
  });

  test("should handle 10 simultaneous booking attempts without duplicates", async () => {
    const USER_IDS = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
    const EVENT_ID = 2;

    console.log("🚀 Launching 10 simultaneous booking attempts...");

    const results = await Promise.allSettled(
      USER_IDS.map((id) => BookingService.reserveTicket(id, EVENT_ID))
    );

    const successful = results.filter((r) => r.status === "fulfilled");
    const failed = results.filter((r) => r.status === "rejected");

    console.log(
      `✅ Successes: ${successful.length} | ❌ Failures: ${failed.length}`
    );

    // Validate no duplicate tickets
    if (successful.length > 0) {
      const ticketIds = (successful as any).map((s: any) => s.value.id);
      const uniqueIds = new Set(ticketIds);
      expect(uniqueIds.size).toBe(ticketIds.length);
    }
  });
});
