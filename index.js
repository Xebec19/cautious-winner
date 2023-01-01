const express = require("express");
const rateLimiter = require("./slidingWindowCounter");
const app = express();

app.use(rateLimiter);

app.get("/", (req, res) => {
  res.send("<h1>API response</h1>");
});

app.use((err, req, res, next) => {
  console.error("--error caught : ", err.stack);
  res.status(500).send("Something broke!").end();
  return;
});

app.listen(5000, () => {
  console.log("server is running on port 5000");
});
