import { AuthService } from "../services/auth.service";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Authentication Service", () => {
  const testUser = {
    email: "auth-test@example.com",
    password: "securePassword123",
    name: "Auth Tester",
  };

  // Clean up the test user before and after
  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { email: testUser.email } });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: testUser.email } });
    await prisma.$disconnect();
  });

  test("should register a new user and hash the password", async () => {
    const user = await AuthService.register(
      testUser.email,
      testUser.password,
      testUser.name
    );

    expect(user.email).toBe(testUser.email);
    // Ensure the password is NOT stored as plain text
    expect(user.password).not.toBe(testUser.password);
    expect(user.password.length).toBeGreaterThan(20); // Typical bcrypt hash length
  });

  test("should login and return a valid JWT", async () => {
    const { token, user } = await AuthService.login(
      testUser.email,
      testUser.password
    );

    expect(token).toBeDefined();
    expect(user.email).toBe(testUser.email);

    // Verify the token content
    const decoded = AuthService.verifyToken(token);
    expect(decoded.userId).toBe(user.id);
  });

  test("should reject login with incorrect password", async () => {
    await expect(
      AuthService.login(testUser.email, "wrong-password")
    ).rejects.toThrow("Invalid credentials");
  });
});
