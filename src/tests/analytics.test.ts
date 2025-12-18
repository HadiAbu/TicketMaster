import { BookingService } from "../services/booking.service";
import { AnalyticsService } from "../services/analytics.service";
import redisClient, { connectRedis } from "../config/redis";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Analytics Integration Test", () => {
  let testEventId: number;
  let TEST_USER_ID: number;

  beforeAll(async () => {
    await connectRedis();

    // 1. Create a real user first
    const user = await prisma.user.upsert({
      where: { email: "tester@example.com" },
      update: {},
      create: {
        email: "tester@example.com",
        name: "Integration Tester",
      },
    });
    TEST_USER_ID = user.id;

    // Create a clean event and 10 tickets for this test
    const event = await prisma.event.create({
      data: {
        title: "Analytics Test Concert",
        date: new Date(),
        tickets: {
          createMany: {
            data: [
              { seat: "A1", price: 100 },
              { seat: "A2", price: 100 },
              { seat: "A3", price: 150 },
            ],
          },
        },
      },
    });
    testEventId = event.id;
  });

  afterAll(async () => {
    await redisClient.quit();
    await prisma.$disconnect();
  });

  test("should reflect real-time changes in ticket statuses", async () => {
    // 1. Initial State: Should be 3 available
    let stats = await AnalyticsService.getEventSummary(testEventId);
    expect(stats.available).toBe(3);
    expect(stats.reserved).toBe(0);

    console.log("📊 Initial State: 3 Available, 0 Reserved");

    // 2. Reserve 2 tickets
    await BookingService.reserveTicket(TEST_USER_ID, testEventId);
    await BookingService.reserveTicket(TEST_USER_ID, testEventId);

    // 3. Check Stats again
    stats = await AnalyticsService.getEventSummary(testEventId);

    console.log(
      `📊 Updated State: ${stats.available} Available, ${stats.reserved} Reserved`
    );

    expect(stats.available).toBe(1);
    expect(stats.reserved).toBe(2);
  });
});
