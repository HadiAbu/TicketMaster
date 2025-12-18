import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = [
    { email: "alice@example.com", name: "Alice" },
    { email: "bob@example.com", name: "Bob" },
  ];

  const events = [
    {
      title: "PrismaConf 2026",
      description: "Prisma conference",
      date: new Date("2026-06-01"),
    },
    {
      title: "Concert X",
      description: "Live concert",
      date: new Date("2026-09-12"),
    },
  ];

  // insert users/events (skip duplicates)
  await prisma.user.createMany({ data: users, skipDuplicates: true });
  await prisma.event.createMany({ data: events, skipDuplicates: true });

  const createdUsers = await prisma.user.findMany({
    where: { email: { in: users.map((u) => u.email) } },
  });

  const createdEvents = await prisma.event.findMany({
    where: { title: { in: events.map((e) => e.title) } },
  });

  // map for easy lookup
  const userByEmail = Object.fromEntries(createdUsers.map((u) => [u.email, u]));
  const eventByTitle = Object.fromEntries(
    createdEvents.map((e) => [e.title, e])
  );

  const tickets = [
    {
      seat: "A1",
      price: 49.99,
      userId: userByEmail["alice@example.com"].id,
      eventId: eventByTitle["PrismaConf 2026"].id,
    },
    {
      seat: "B2",
      price: 79.99,
      userId: userByEmail["bob@example.com"].id,
      eventId: eventByTitle["Concert X"].id,
    },
  ];

  await prisma.ticket.createMany({ data: tickets, skipDuplicates: true });

  console.log("Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
