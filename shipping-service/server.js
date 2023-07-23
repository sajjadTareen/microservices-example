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
  await channel.assertQueue("SHIPPING");
}

connect();

const app = express();
// use morgan middleware
app.use(morgan("combined"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

// ! SHIPPING OPERATIONS
app.get("/shipping", (req, res) => {
  res.send("GET SHIPPING");
});

app.post("/shipping", async (req, res) => {
  const response = await fetch("http://billing:5009/billing", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req.body),
  });

  const resJson = await response.json();

  channel.sendToQueue("DATA", Buffer.from(JSON.stringify(req.body)));

  res.json(resJson);
});

app.put("/shipping", (req, res) => {
  res.send("PUT SHIPPING");
});

app.delete("/shipping", (req, res) => {
  res.send("DELETE SHIPPING");
});

app.listen(5001);
