import initializeRedis from "./utils/redisInitializer.js";
import Redis from "ioredis";
const redis = new Redis();
const redisClient = await initializeRedis();
const FF = process.argv[2];

redisClient.on("ready", () => {
  console.log("connected to redis!");
});

const waitTurn = async (oldTurn) => {
  let turn = await redis.get("turnLock");
  if (turn !== oldTurn) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
};
const incrementCounter = async (val) => {
  await redis.lpush("counterQueue", `p2-${val}`);
};

async function processP2() {
  for (let i = 1; i <= 100; i += 2) {
    if (FF === "coordinate") {
      await waitTurn("p1");
      await incrementCounter(i);
    } else {
      await incrementCounter(i);
    }
  }
}

processP2();
