const express = require("express");
const app = express();

// ===== 最基础测试 =====
app.get("/", (req, res) => {
  res.send("服务正常运行");
});

app.get("/test", (req, res) => {
  res.send("test ok");
});

// ===== 启动 =====
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("服务器已启动，端口：" + PORT);
});
