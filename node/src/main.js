// @ts-check

const http = require("http");
const { routes } = require("./api");

const server = http.createServer((req, res) => {
  const init = async () => {
    const route = routes.find(route => req.url && req.method && route.url.test(req.url) && route.method === req.method);

    if (!req.url || !route) {
      res.statusCode = 404;
      res.end("Not Found");
      return;
    }

    const regesResult = route.url.exec(req.url);

    if (!regesResult) {
      res.statusCode = 404;
      res.end("Not Found");
      return;
    }

    /** @type {Object.<string, *> | undefined} */
    const reqBody =
      req.headers["content-type"] === "application/json"
        ? await new Promise((resolve, reject) => {
            req.setEncoding("utf-8");
            req.on("data", data => {
              try {
                resolve(JSON.parse(data));
              } catch {
                reject(new Error("JSON Form Error"));
              }
            });
          })
        : undefined;

    const result = await route.callback(regesResult, reqBody);
    res.statusCode = result.statusCode;

    if (typeof result.body === "object") {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify(result.body));
    } else {
      res.end(result.body);
    }
  };

  init();
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`The Server is listening at port: ${PORT}`);
});
