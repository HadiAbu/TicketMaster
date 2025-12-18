import { test } from '@jest/globals';
import { BookingService } from "../services/booking.service";

test('stress test', async () => {
  const USER_IDS = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; // Simulating 10 requests
  const EVENT_ID = 1;

  console.log("🚀 Launching 10 simultaneous booking attempts...");

  // Fire all 10 requests at the exact same time
  const results = await Promise.allSettled(
    USER_IDS.map((id) => BookingService.reserveTicket(id, EVENT_ID))
  );

  const successful = results.filter((r) => r.status === "fulfilled");
  const failed = results.filter((r) => r.status === "rejected");

  console.log("--- RESULTS ---");
  console.log(`✅ Successes: ${successful.length}`);
  console.log(`❌ Failures: ${failed.length}`);

  if (successful.length > 0) {
    // Check if any IDs are duplicated
    const ticketIds = (successful as any).map((s: any) => s.value.id);
    const uniqueIds = new Set(ticketIds);

    console.log(
      `🎫 Unique Ticket IDs assigned: ${Array.from(uniqueIds).join(", ")}`
    );

    if (uniqueIds.size === ticketIds.length) {
      console.log("🏆 TEST PASSED: No duplicate bookings detected!");
    } else {
      console.log("🚨 TEST FAILED: Duplicate tickets were issued!");
      throw new Error("Duplicate tickets detected");
    }
  }
});
