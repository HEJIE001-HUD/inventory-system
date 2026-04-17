const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("OK-首页正常");
});

app.get("/api/test", (req, res) => {
  res.send("OK-test正常");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("服务器已启动：" + PORT);
});
