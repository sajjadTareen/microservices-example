// imports
const express = require("express");
const morgan = require("morgan");
const amqp = require("amqplib");

// init express app
let channel;

async function connect() {
  const amqpServer = process.env.RABBITMQ_URL;
  const connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue("BILLING");
}

connect();

const app = express();

// use morgan middleware
app.use(morgan("combined"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from Billing Services");
});

// ! BILLING CRUD OPERATIONS

app.post("/billing", (req, res) => {
  console.log("Billing req.body:", req.body);

  channel.sendToQueue("DATA", Buffer.from(JSON.stringify(req.body)));

  res.json(req.body);
});

app.listen(5009);
