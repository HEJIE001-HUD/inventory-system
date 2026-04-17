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

// ===== 自动获取token =====
async function getToken(){
  if(Date.now() < expire) return token;

  let res = await axios.post(
    "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal/",
    {
      app_id: APP_ID,
      app_secret: APP_SECRET
    }
  );

  token = res.data.tenant_access_token;
  expire = Date.now() + 7000 * 1000;
  return token;
}

// ===== 查询 =====
app.get("/api/list", async (req,res)=>{
  let t = await getToken();

  let r = await axios.get(
    `https://open.feishu.cn/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${TABLE_ID}/records`,
    { headers:{ Authorization:`Bearer ${t}` } }
  );

  res.json(r.data.data.items);
});

// ===== 更新 =====
app.post("/api/update", async (req,res)=>{
  let t = await getToken();

  await axios.put(
    `https://open.feishu.cn/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${TABLE_ID}/records/${req.body.id}`,
    { fields:req.body.fields },
    { headers:{ Authorization:`Bearer ${t}` } }
  );

  res.send("ok");
});

// ===== 删除 =====
app.post("/api/delete", async (req,res)=>{
  let t = await getToken();

  await axios.delete(
    `https://open.feishu.cn/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${TABLE_ID}/records/${req.body.id}`,
    { headers:{ Authorization:`Bearer ${t}` } }
  );

  res.send("ok");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("运行成功"));