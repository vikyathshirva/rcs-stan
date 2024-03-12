import { createClient } from "redis";

const host = "127.0.0.1";
const port = 6379;

const redisClient = createClient({
  host,
  port,
});

const initializeRedis = async () => {
  await redisClient.connect();
  return redisClient;
};

export default initializeRedis;
