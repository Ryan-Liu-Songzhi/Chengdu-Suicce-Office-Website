/* ============================================================
   Restaurant Chengdu — 预约订位小票打印（芯烨云 XPYun）
   收到新的订位申请后，推给厨房/前台打印机（会响铃提醒）。
   跟 print-order.js 是同一套芯烨云账号，只是小票内容不同。

   需要的环境变量（跟 print-order.js 共用同一组）：
     XPYUN_USER / XPYUN_USER_KEY / XPYUN_PRINTER_SN
   ============================================================ */

const crypto = require("crypto");

const XPYUN_USER = process.env.XPYUN_USER;
const XPYUN_USER_KEY = process.env.XPYUN_USER_KEY;
const XPYUN_PRINTER_SN = process.env.XPYUN_PRINTER_SN;
const PRINT_URL = "https://open.xpyun.net/api/openapi/xprinter/print";

function sign(user, key, timestamp) {
  return crypto.createHash("sha1").update(user + key + timestamp).digest("hex");
}

const DIACRITICS_RE = new RegExp("[̀-ͯ]", "g");

// 法语重音字符在部分票据打印机的编码下可能打印错误，小票内容做安全转写
function safeText(str) {
  return String(str)
    .normalize("NFD")
    .replace(DIACRITICS_RE, "")
    .replace(/œ/gi, "oe")
    .replace(/æ/gi, "ae")
    .replace(/[<>]/g, "")
    .slice(0, 300);
}

function buildTicket(r) {
  const typeLabel = r.mode === "fondue" ? "FONDUE CHINOISE (self-service)" : "TABLE CLASSIQUE";
  const notesLine = r.notes ? `Remarques: ${safeText(r.notes)}<BR>` : "";
  const emailLine = r.email ? `E-mail: ${safeText(r.email)}<BR>` : "";

  return [
    `<C><BOLD><HB>Restaurant Chengdu</HB></BOLD></C><BR>`,
    `<C>DEMANDE DE RESERVATION</C><BR>`,
    `<C><BOLD>${safeText(r.number)}</BOLD></C><BR>`,
    `--------------------------------<BR>`,
    `<C><BOLD>${safeText(typeLabel)}</BOLD></C><BR>`,
    `--------------------------------<BR>`,
    `<L>`,
    `Personnes: ${safeText(r.people)}<BR>`,
    `Date: ${safeText(r.dayLabel)} a ${safeText(r.time)}<BR>`,
    `Nom: ${safeText(r.name)}<BR>`,
    `Tel: ${safeText(r.phone)}<BR>`,
    emailLine,
    notesLine,
    `</L>`,
    `--------------------------------<BR>`,
    `<C>A confirmer par telephone</C><BR>`,
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

  let r;
  try {
    r = JSON.parse(event.body || "{}");
    if (!r.number || !r.dayLabel || !r.time) {
      throw new Error("invalid reservation payload");
    }
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ error: "invalid reservation payload" }) };
  }

  const timestamp = String(Math.floor(Date.now() / 1000));

  const payload = {
    user: XPYUN_USER,
    timestamp,
    sign: sign(XPYUN_USER, XPYUN_USER_KEY, timestamp),
    sn: XPYUN_PRINTER_SN,
    content: buildTicket(r),
    copies: 1,
    voice: 2, // 来单播放模式：打印机自动大声响铃提醒
    mode: 1, // 打印机离线时先排队，恢复联网后自动补打
    idempotent: r.number // 同一预约号 5 分钟内只打一次，防止重复出票
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
