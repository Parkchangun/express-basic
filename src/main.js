// @ts-check

const express = require("express");
const userRouter = express.Router();

const USERS = {
  15: {
    nickname: "foo",
  },
};
const PORT = 3000;
const app = express();
app.use(express.json());
app.set("views", "src/views");
app.set("view engine", "pug");

userRouter.param("id", (req, res, next, value) => {
  console.log("🚀 ~ file: main.js:14 ~ userRouter.param ~ value", value);
  //@ts-ignore
  req.user = USERS[value];
  next();
});

userRouter.get("/", (req, res) => {
  res.type("application/json");
  res.send("User List");
});

userRouter.get("/:id", (req, res) => {
  //@ts-ignore
  if (!req.user) {
    res.status(404);
  }

  const resMimeType = req.accepts(["json", "html"]);

  if (resMimeType === "json") {
    //@ts-ignore
    res.send(req.user);
  }
  if (resMimeType === "html") {
    //@ts-ignore
    res.render("user-profile", { nickname: req.user.nickname });
  }
});

userRouter.post("/", (req, res) => {
  res.send("User Registered");
});

userRouter.post("/:id/nickname", (req, res) => {
  //req.body: {"nickname": "bar"}
  console.log(req.body);
  //@ts-ignore
  const { user } = req;
  const { nickname } = req.body;
  console.log("🚀 ~ file: main.js:47 ~ userRouter.post ~ nickname", nickname);

  user.nickname = nickname;

  res.send(`User nickname updated: ${nickname}`);
});

app.use("/users", userRouter);
app.use("/", (req, res) => {
  
});

app.listen(PORT, () => {
  console.log(`The Express server is listening at prot: ${PORT}`);
});
