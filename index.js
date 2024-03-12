import { spawn } from "child_process";
import { Buffer } from "buffer";
import initializeRedis from "./utils/redisInitializer.js";
import * as path from "path";
import Redis from "ioredis";
const redis = new Redis();
import initializeRabbitMQ from "./utils/rabbitInitializer.js";
const __dirname = path.resolve();
const queueName = "RCS";
const redisClient = await initializeRedis();
const channel = await initializeRabbitMQ();
const FF = process.argv[2];

redisClient.on("ready", () => {
  console.log("connected to redis!");
  redis.set("turnLock", "p1");
});

const sendMessage = async (channel, message) => {
  try {
    channel.sendToQueue(queueName, Buffer.from(message));
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

const init = async () => {
  await redis.set("turnLock", "p1");
};

if (FF === "coordinate") {
  init();
}

const consumeMessages = (channel) => {
  channel.consume(
    queueName,
    async (msg) => {
      if (msg !== null) {
        const message = msg.content.toString();
        if (message === "p1-lock") {
          console.log(`Locked: p1`);
          await redis.set("turnLock", "p1");
        } else {
          console.log(`Locked: p2`);
          await redis.set("turnLock", "p2");
        }
        await channel.ack(msg);
      }
    },
    { noAck: false }
  );
};

if (FF === "coordinate") {
  await consumeMessages(channel);
}

const accuireLock = async (value) => {
  await sendMessage(channel, `${value}-lock`);
};

const releaseLock = async (value) => {
  await sendMessage(channel, `${value}-release`);
};

const waitTurn = async (oldTurn) => {
  let turn = await redis.get("turnLock");
  if (turn !== oldTurn) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
};

const processP2 = () => {
  if (FF === "coordinate") {
    spawn("node", [path.join(__dirname, "process2.js"), FF]);
  } else {
    spawn("node", [path.join(__dirname, "process2.js")]);
  }
};

const incrementCounter = async (val) => {
  await redis.lpush("counterQueue", `p1-${val}`);
};

const processQueue = async () => {
  while (true) {
    if (FF === "coordinate") {
      const queueValues = await redis.lrange("counterQueue", 0, -1);
      console.log(`Current queue: ${JSON.stringify(queueValues)}`);
      const [key, value] = await redis.brpop("counterQueue", 0);
      console.log(`Processing update: ${value}`);
      await accuireLock(value.split("-")[0]);
      const counter = await redis.get("counter");
      console.log("Updated Counter Value : ", counter);
      await redis.set("counter", value.split("-")[1]);
      await releaseLock(value.split("-")[0]);
    } else {
      const queueValues = await redis.lrange("counterQueue", 0, -1);
      console.log(`Current queue: ${JSON.stringify(queueValues)}`);
      const [key, value] = await redis.brpop("counterQueue", 0);
      console.log(`Processing update: ${value}`);
      const counter = await redis.get("counter");
      console.log("Updated Counter Value : ", counter);
      await redis.set("counter", value.split("-")[1]);
    }
  }
};
processQueue();

async function processP1() {
  for (let i = 2; i <= 100; i += 2) {
    if (FF === "coordinate") {
      await waitTurn("p1");
      await incrementCounter(i);
    } else {
      await incrementCounter(i);
    }
  }
}

processP1();
processP2();
