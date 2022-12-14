const supertest = require("supertest");
const app = require("./app");

const request = supertest(app);

test("retrieve user json", async () => {
  const { body } = await request.get("/users/15").accept("application/json");

  expect(body).toMatchObject({
    nickname: expect.any(String),
  });
});

test("retrieve user page", async () => {
  const { text } = await request.get("/users/15").accept("text/html");
  expect(text).toMatch(/^<html>.*<\/html>$/);
});

test("update nickname", async () => {
  const nickname = "newNickname";

  const res = await request.post("/users/15/nickname").send({ nickname });
  expect(res.status).toBe(200);

  const user = await request.get("/users/15").accept("application/json");
  expect(user.status).toBe(200);
  expect(user.body).toMatchObject({
    nickname,
  });
});
