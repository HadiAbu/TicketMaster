import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

export const AuthService = {
  // 1. Create a new user with a hashed password
  async register(email: string, pass: string, name?: string) {
    const hashedPassword = await bcrypt.hash(pass, 10);
    const id = Math.floor(Math.random() * 2147483647);
    const userId = await prisma.user.findUnique({ where: { id: id } });
    try {
      if (userId) {
        throw new Error("User ID collision, try again");
      } else {
        return prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            name,
            id: id,
          },
        });
      }
    } catch (err: any) {
      throw new Error(err.message);
    }
  },

  // 2. Validate credentials and return a Token
  async login(email: string, pass: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");

    const isValid = await bcrypt.compare(pass, user.password);
    if (!isValid) throw new Error("Invalid credentials");

    // Generate JWT (Payload contains userId)
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    return { token, user: { id: user.id, email: user.email } };
  },

  // 3. Verify a token (used by middleware)
  verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET) as { userId: number };
  },
};
