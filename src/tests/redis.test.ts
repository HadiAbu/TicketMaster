import { test, expect } from "@jest/globals";
import { BookingService } from "../services/booking.service";
import { PrismaClient } from "@prisma/client";
import redisClient, { connectRedis } from "../config/redis";

const prisma = new PrismaClient();

jest.setTimeout(3000);

describe("Duplicate Booking Test", () => {
  const TEST_USER_ID = 99; // Unique ID for this test
  const TEST_EVENT_ID = 1;

  beforeAll(async () => {
    await connectRedis();
  });
  afterAll(async () => {
    // Cleanup Redis and DB connections
    await redisClient.del(`waiting_room:user:${TEST_USER_ID}`);
    await redisClient.quit();
    await prisma.$disconnect();
  });

  test("should allow 3 attempts and block the 4th request via Redis", async () => {
    console.log("🚀 Testing Redis Rate Limiter...");

    // 1. First 3 attempts should either succeed or fail at the DB level (not Redis)
    for (let i = 1; i <= 3; i++) {
      const promise = BookingService.reserveTicket(TEST_USER_ID, TEST_EVENT_ID);
      await expect(promise)
        .resolves.toBeDefined()
        .catch((err) => {
          // If the DB is sold out, that's fine, as long as the error isn't 'WAITING_ROOM_FULL'
          expect(err.message).not.toBe(
            "WAITING_ROOM_FULL: Too many requests. Try again in 30s."
          );
        });
      console.log(`Attempt ${i}: Passed through Gatekeeper`);
    }

    // 2. The 4th attempt should be blocked INSTANTLY by Redis
    try {
      await BookingService.reserveTicket(TEST_USER_ID, TEST_EVENT_ID);
      fail("The 4th attempt should have been blocked by Redis");
    } catch (error: any) {
      console.log(`Attempt 4: Blocked! Error: ${error.message}`);
      expect(error.message).toBe(
        "WAITING_ROOM_FULL: Too many requests. Try again in 30s."
      );
    }
  });
});
