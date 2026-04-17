const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ===== 环境变量 =====
const APP_ID = process.env.APP_ID;
const APP_SECRET = process.env.APP_SECRET;
const APP_TOKEN = process.env.APP_TOKEN;
const TABLE_ID = process.env.TABLE_ID;

let token = "";
let expire = 0;

// ===== 首页（解决 Railway 未响应问题）=====
app.get("/", (req, res) => {
  res.send("服务正常运行");
});

// ===== 获取 token =====
async function getToken() {
  if (Date.now() < expire) return token;

  const res = await axios.post(
    "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal/",
    {
      app_id: APP_ID,
      app_secret: APP_SECRET,
    }
  );

  token = res.data.tenant_access_token;
  expire = Date.now() + 7000 * 1000;
  return token;
}

// ===== 查询库存 =====
app.get("/api/list", async (req, res) => {
  try {
    const t = await getToken();

    const r = await axios.get(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${TABLE_ID}/records`,
      {
        headers: { Authorization: `Bearer ${t}` },
      }
    );

    res.json(r.data.data.items);
  } catch (e) {
    console.error(e.message);
    res.status(500).send("查询失败");
  }
});

// ===== 更新库存 =====
app.post("/api/update", async (req, res) => {
  try {
    const t = await getToken();

    await axios.put(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${TABLE_ID}/records/${req.body.id}`,
      { fields: req.body.fields },
      {
        headers: { Authorization: `Bearer ${t}` },
      }
    );

    res.send("ok");
  } catch (e) {
    console.error(e.message);
    res.status(500).send("更新失败");
  }
});

// ===== 删除 =====
app.post("/api/delete", async (req, res) => {
  try {
    const t = await getToken();

    await axios.delete(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${TABLE_ID}/records/${req.body.id}`,
      {
        headers: { Authorization: `Bearer ${t}` },
      }
    );

    res.send("ok");
  } catch (e) {
    console.error(e.message);
    res.status(500).send("删除失败");
  }
});

// ===== 关键端口（必须这样写）=====
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("服务器已启动，端口：" + PORT);
});