import redisClient from "../config/redis";

export const QueueService = {
  /**
   * Rate Limiter: Allows 3 attempts per 30 seconds
   */
  async isAllowedInWaitingRoom(userId: number): Promise<boolean> {
    const key = `waiting_room:user:${userId}`;

    // Increment the count for this user
    const count = await redisClient.incr(key);

    if (count === 1) {
      // First hit: set expiration for 30 seconds
      await redisClient.expire(key, 30);
    }

    // If more than 3 attempts, kick them out
    return count <= 3;
  },
};
