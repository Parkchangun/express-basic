// @ts-check

const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use("/", async (req, res, next) => {
  const fileContent = await fs.promises.readFile(".gitignore");

  const requestedAt = new Date();
  //@ts-ignore
  req.requestedAt = requestedAt;
  //@ts-ignore
  req.fileContent = fileContent

  console.log("middleware 1");
  next();
});

app.use((req, res) => {
  //@ts-ignore
  console.log(req.requestedAt);
  console.log("middleware 2");
  //@ts-ignore
  res.send(`Hello, Express at ${req.requestedAt}\n ${req.fileContent}`);
});

app.listen(PORT, () => {
  console.log(`The Express server is listening at prot: ${PORT}`);
});
