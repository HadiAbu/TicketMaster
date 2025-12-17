import { PrismaClient } from "@prisma/client";

// Prisma 7 automatically picks up the config
const prisma = new PrismaClient();

export default prisma;
