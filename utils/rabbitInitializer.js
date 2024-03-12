import amqp from "amqplib";

const url = "localhost";
const queueName = "RCS";
const username = "user";
const password = "password";

const initializeRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(
      `amqp://${username}:${password}@${url}`
    );
    const channel = await connection.createChannel();

    await channel.assertQueue(queueName, { durable: false });

    console.log("initialized RabbitMQ!");
    return channel;
  } catch (error) {
    console.error("Error initializing RabbitMQ:", error);
    throw error;
  }
};

export default initializeRabbitMQ;
