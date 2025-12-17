import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL);

redis.on("connect", () => {
  // eslint-disable-next-line no-console
  console.log("Redis client connected");
});

redis.on("error", (err) => {
  // eslint-disable-next-line no-console
  console.error("Redis error", err);
});

export default redis;
