import { test, expect } from "@jest/globals";
import { BookingService } from "../services/booking.service";

test("booking test", async () => {
  const TEST_USER_ID = 1; // Created by seed
  const TEST_EVENT_ID = 1; // Created by seed

  // Expect the reservation to fail since tickets are sold out
  await expect(
    BookingService.reserveTicket(TEST_USER_ID, TEST_EVENT_ID)
  ).rejects.toThrow();
  console.log("✅ Test passed: correctly rejected booking when sold out");
});
