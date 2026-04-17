const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("服务正常运行");
});

// ===== 测试接口 =====
app.get("/api/test", (req, res) => {
  res.json({ msg: "接口正常" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("服务器已启动，端口：" + PORT);
});