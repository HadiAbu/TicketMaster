import { PrismaClient, TicketStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Create a Test User
  const user = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      name: "Test User",
      password: "password123", // Required field
    },
  });

  // 2. Create a Test Event
  const event = await prisma.event.create({
    data: {
      title: "Grand Opening Concert",
      description: "A massive musical event to test our new booking system!",
      date: new Date("2025-12-31T20:00:00Z"),
    },
  });

  // 3. Create 50 Available Tickets for this event
  const ticketsData = Array.from({ length: 50 }).map((_, i) => ({
    seat: `Row A - Seat ${i + 1}`,
    price: 99.99,
    status: TicketStatus.AVAILABLE,
    reservedAt: null,
    eventId: event.id,
  }));

  await prisma.ticket.createMany({
    data: ticketsData,
  });

  console.log(`✅ Seeded: 1 User, 1 Event, and ${ticketsData.length} Tickets.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
