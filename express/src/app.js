// @ts-check

const express = require("express");
const userRouter = require("./router/user");

const app = express();
app.use(express.json());
app.set("views", "src/views");
app.set("view engine", "pug");

app.use("/users", userRouter);
app.use("/uploads", express.static("uploads"));

app.use((err, req, res, next) => {
  res.statusCode = err.statusCode || 500;
  res.send(err.message);
});

module.exports = app;
