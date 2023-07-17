// imports
const express = require("express");
const morgan = require("morgan");

// init express app
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
  res.json(req.body);
});

app.listen(5009);
