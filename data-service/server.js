// imports
const amqp = require("amqplib");

// init express app
let channel;

async function connect() {
  const amqpServer = process.env.RABBITMQ_URL;
  const connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue("DATA");

  channel.consume("DATA", processData, { noAck: true });
}

connect();

function processData(data) {
  const jsonData = JSON.parse(data.content.toString());
  console.log("DATA consumer:", jsonData);
  channel.sendToQueue("WEBHOOK", Buffer.from(data.content.toString()));
}
