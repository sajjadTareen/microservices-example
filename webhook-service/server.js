// imports
const amqp = require("amqplib");

// init express app
let channel;

async function connect() {
  const amqpServer = process.env.RABBITMQ_URL;
  const connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue("WEBHOOK");

  channel.consume("WEBHOOK", processData, { noAck: true });
}

connect();

function processData(data) {
  const jsonData = JSON.parse(data.content.toString());
  console.log("WEBHOOK consumer:", jsonData);
}
