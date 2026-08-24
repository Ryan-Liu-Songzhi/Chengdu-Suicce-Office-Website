/* ============================================================
   Restaurant Chengdu — 厨房小票打印（芯烨云 XPYun）
   收到新订单后，自动把小票推给厨房打印机（会响铃提醒）。
   这个文件只在 Netlify 服务器端运行，不会被浏览器看到，
   所以密钥可以安全地写在 Netlify 后台的环境变量里。

   需要在 Netlify 网站后台 → Site settings → Environment variables 配置：
     XPYUN_USER       芯烨云开发者账号（登录邮箱）
     XPYUN_USER_KEY   芯烨云开发者密钥
     XPYUN_PRINTER_SN 打印机编号（机身背面贴纸）
   ============================================================ */

const crypto = require("crypto");

const XPYUN_USER = process.env.XPYUN_USER;
const XPYUN_USER_KEY = process.env.XPYUN_USER_KEY;
const XPYUN_PRINTER_SN = process.env.XPYUN_PRINTER_SN;
const PRINT_URL = "https://open.xpyun.net/api/openapi/xprinter/print";

function sign(user, key, timestamp) {
  return crypto.createHash("sha1").update(user + key + timestamp).digest("hex");
}

// 法语重音字符在部分票据打印机的编码下可能打印错误，小票内容做安全转写
// （通知邮件/Telegram 里仍然是带重音符号的正常法语，只有厨房小票这里做转写）
const DIACRITICS_RE = new RegExp("[̀-ͯ]", "g");

function safeText(str) {
  return String(str)
    .normalize("NFD")
    .replace(DIACRITICS_RE, "")
    .replace(/œ/gi, "oe")
    .replace(/æ/gi, "ae")
    .replace(/[<>]/g, "");
}

function buildTicket(order) {
  const itemRows = order.items
    .map((i) => {
      const name = safeText(`${i.qty} x N${i.no} ${i.name}`);
      const price = `${(i.price * i.qty).toFixed(2)}`;
      return `<tr>${name}<td>${price}</tr>`;
    })
    .join("\n");

  const notesLine = order.notes ? `Remarques: ${safeText(order.notes)}<BR>` : "";
  const emailLine = order.email ? `E-mail: ${safeText(order.email)}<BR>` : "";

  return [
    `<C><BOLD><HB>Restaurant Chengdu</HB></BOLD></C><BR>`,
    `<C>NOUVELLE COMMANDE</C><BR>`,
    `<C><BOLD>${safeText(order.number)}</BOLD></C><BR>`,
    `--------------------------------<BR>`,
    `<L>`,
    `<TABLE col="22,10" w=1 h=1 b=0 lh=42>`,
    itemRows,
    `</TABLE>`,
    `</L>`,
    `--------------------------------<BR>`,
    `<R><BOLD><HB>TOTAL: CHF ${safeText(order.totalDue.toFixed(2))}</HB></BOLD><BR></R>`,
    `<BR>`,
    `<L>`,
    `Retrait: ${safeText(order.pickupDay)} a ${safeText(order.pickupTime)}<BR>`,
    `Nom: ${safeText(order.name)}<BR>`,
    `Tel: ${safeText(order.phone)}<BR>`,
    emailLine,
    notesLine,
    `</L>`,
    `<C>-- Paiement sur place --</C><BR>`,
    `<BR>`
  ].join("\n");
}

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  if (!XPYUN_USER || !XPYUN_USER_KEY || !XPYUN_PRINTER_SN) {
    console.error("XPYun env vars missing");
    return { statusCode: 500, body: JSON.stringify({ error: "printer not configured" }) };
  }

  let order;
  try {
    order = JSON.parse(event.body || "{}");
    if (!order.number || !Array.isArray(order.items) || !order.items.length) {
      throw new Error("invalid order payload");
    }
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ error: "invalid order payload" }) };
  }

  const timestamp = String(Math.floor(Date.now() / 1000));

  const payload = {
    user: XPYUN_USER,
    timestamp,
    sign: sign(XPYUN_USER, XPYUN_USER_KEY, timestamp),
    sn: XPYUN_PRINTER_SN,
    content: buildTicket(order),
    copies: 1,
    voice: 2, // 来单播放模式：打印机自动大声响铃提醒
    mode: 1, // 打印机离线时先排队，恢复联网后自动补打
    idempotent: order.number // 同一订单号 5 分钟内只打一次，防止重复出票
  };

  try {
    const res = await fetch(PRINT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (data.code !== 0) {
      console.error("XPYun print failed", data);
      return { statusCode: 502, body: JSON.stringify({ error: data.msg || "print failed", raw: data }) };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true, data: data.data }) };
  } catch (err) {
    console.error("XPYun request error", err);
    return { statusCode: 502, body: JSON.stringify({ error: "request to printer service failed" }) };
  }
};
