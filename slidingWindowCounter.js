const { createClient } = require("redis");
const moment = require("moment");

module.exports = async (req, res, next) => {
  try {
    const client = createClient();
    client.on("error", (err) => console.error("Redis client error", err));
    const ip =
      (req.headers["x-forwarded-for"] || "").split(",").pop().trim() ||
      req.socket.remoteAddress;
    await client.connect();
    const value = await client.get(ip);
    if (value && value > 100) {
      console.log(value);
      return res.json({ error: 1, message: "Too many requests!" });
    }
    if (!value || isNaN(value)) {
      await client.set(ip, 1, { EX: 60 });
    } else {
      await client.set(ip, value + 1);
    }

    console.log(value);
    await client.disconnect();
    next();
  } catch (error) {
    console.error(error);
    return res.json({ error: 1, message: "Internal Error!" });
  }
};
