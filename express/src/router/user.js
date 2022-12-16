const express = require("express");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });
const router = express.Router();

const USERS = {
  15: {
    nickname: "foo",
    ImageUrl: undefined,
  },
  16: {
    nickname: "bar",
    ImageUrl: undefined,
  },
};

router.param("id", async (req, res, next, value) => {
  try {
    const user = USERS[value];

    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }

    //@ts-ignore
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
});

router.get("/", (req, res) => {
  res.type("application/json");
  res.send("User List");
});

router.get("/:id", (req, res) => {
  //@ts-ignore
  if (!req.user) {
    console.log("this");
    res.status(404);
    res.send("Cannot Find user");
    return;
  }

  const resMimeType = req.accepts(["json", "html"]);

  if (resMimeType === "json") {
    //@ts-ignore
    res.send(req.user);
  }
  if (resMimeType === "html") {
    //@ts-ignore
    res.render("user-profile", {
      nickname: req.user.nickname,
      userId: req.params.id,
      profileImgUrl: `/uploads/${req.user.ImageUrl}`,
    });
  }
});

router.post("/", (req, res) => {
  res.send("User Registered");
});

router.post("/:id/nickname", (req, res) => {
  //req.body: {"nickname": "bar"}
  console.log(req.body);
  //@ts-ignore
  const { user } = req;
  const { nickname } = req.body;
  console.log("🚀 ~ file: main.js:47 ~ router.post ~ nickname", nickname);

  user.nickname = nickname;

  res.send(`User nickname updated: ${nickname}`);
});

router.post("/:id/profile", upload.single("profile"), (req, res, next) => {
  const { user } = req;
  const { filename } = req.file;
  user.ImageUrl = filename;

  // res.send("user profile img uploaded  " + filename);
  res.redirect("back")
});

module.exports = router;
