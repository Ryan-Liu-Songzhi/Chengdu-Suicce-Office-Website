/* ============================================================
   ★★★ 餐厅员工专用配置文件 ★★★
   Restaurant Chengdu — 网站配置（公告、营业时间、订单设置）

   如何修改：
   1. 用「文本编辑」(TextEdit) 或记事本打开本文件
   2. 只修改 冒号(:) 后面、引号 "..." 里面的文字
   3. 保存文件，刷新网页即可看到效果
   4. 注意：不要删除逗号、引号、大括号！改坏了就把备份复制回来

   建议：修改前先复制一份本文件作为备份（例如 config-备份.js）
   ============================================================ */

const SITE_CONFIG = {

  /* ------------------------------------------------------------
     ① 首页公告横幅 / 弹窗（临时闭店、营业时间调整、促销活动等）
     ------------------------------------------------------------
     enabled : true = 显示公告    false = 不显示公告
     style   : "banner" = 页面顶部横幅    "popup" = 打开网站时弹出窗口
     type    : "info" = 蓝色(一般通知)  "warning" = 红色(闭店/重要)  "promo" = 金色(促销)
     title   : 公告标题（法语，给客人看）
     message : 公告内容（法语，给客人看）
     startDate / endDate : 公告显示的起止日期，格式 "年-月-日"
                           留空 "" 表示不限制（一直显示）
     ------------------------------------------------------------ */
  announcement: {
    enabled: false,
    style: "banner",
    type: "warning",
    title: "Fermeture annuelle",
    message: "Toute l'équipe est en vacances du 2 au 6 août — restaurant fermé. Réouverture le 7 août !",
    startDate: "",
    endDate: "2026-08-06"
  },

  /* 【公告写法示例 — 需要时把上面整段换成下面的内容】
  

     临时闭店：
       enabled: true,
       style: "popup",
       type: "warning",
       title: "Fermeture exceptionnelle",
       message: "Le restaurant sera fermé du 13 au 14 avril. Merci de votre compréhension !",
       startDate: "2026-04-01",
       endDate: "2026-04-14"

     促销活动：
       enabled: true,
       style: "banner",
       type: "promo",
       title: "Offre spéciale Nouvel An chinois",
       message: "10% de réduction sur les commandes à l'emporter du 17 au 23 février !",
       startDate: "2026-02-10",
       endDate: "2026-02-23"
  */

  /* ------------------------------------------------------------
     ①-B 首页大公告板（打开首页时自动弹出的大窗口，客人可关闭）
     ------------------------------------------------------------
     enabled : true = 弹出    false = 不弹出
     type    : "promo" = 红金喜庆(促销/庆典)  "warning" = 红色(闭店/重要)  "info" = 蓝色(一般通知)
     icon    : 弹窗顶部的大图标（可换成 🎉 🏮 ⚠️ 📢 等）
     title   : 大标题
     lines   : 正文，每行一段，想加粗的文字用 **文字** 包起来
     buttonText / buttonLink : 底部按钮文字和点击后跳转的页面
                               （闭店通知可改成 "J'ai compris" 和 ""）
     startDate / endDate : 显示起止日期，留空 "" = 不限制
     ------------------------------------------------------------ */
  popup: {
    enabled: false,
    type: "warning",
    icon: "🏖️",
    title: "Fermeture annuelle — vacances d'été",
    lines: [
      "Toute notre équipe prend des vacances bien méritées !",
      "Le restaurant sera **fermé du 2 au 6 août**.",
      "Nous vous attendons de nouveau dès le **7 août** avec plaisir. Bel été à toutes et tous ! ☀️"
    ],
    buttonText: "J'ai compris",
    buttonLink: "",
    startDate: "",
    endDate: "2026-08-06"
  },

  /* 【大公告板示例 — 特殊闭店通知，需要时替换上面整段】
       enabled: true,
       type: "warning",
       icon: "🗓️",
       title: "Fermeture exceptionnelle",
       lines: [
         "Le restaurant sera **fermé du 13 au 14 avril**.",
         "Merci de votre compréhension et à très bientôt !"
       ],
       buttonText: "J'ai compris",
       buttonLink: "",
       startDate: "2026-04-01",
       endDate: "2026-04-14"
  */

  /* ------------------------------------------------------------
     ② 餐厅基本信息
     ------------------------------------------------------------ */
  restaurant: {
    name: "Restaurant Chengdu",
    nameCn: "成都",
    address: "Boulevard de Pérolles 30, 1700 Fribourg",
    phone: "026 321 16 23",
    phone2: "078 835 32 78",
    email: "info@chengdu-suisse.ch"
  },

  /* ------------------------------------------------------------
     ③ 营业时间（用于首页显示 + 自动计算可选的自取时间）
     每天可以有多个时间段 ["开门", "关门"]；全天关门写 []
     ------------------------------------------------------------ */
  hours: {
    lundi:    [["10:30", "14:30"], ["17:15", "22:00"]],
    mardi:    [["10:30", "14:30"], ["17:15", "22:00"]],
    mercredi: [["10:30", "14:30"], ["17:15", "22:00"]],
    jeudi:    [["10:30", "14:30"], ["17:15", "22:00"]],
    vendredi: [["10:30", "14:30"], ["17:15", "22:00"]],
    samedi:   [["11:00", "14:30"], ["17:15", "22:00"]],
    dimanche: [["11:00", "14:30"]]
  },

  /* ------------------------------------------------------------
     ④ 特殊闭店日期（这些日子客人无法选择自取时间）
     格式 "年-月-日"，用逗号隔开，例如：["2026-04-13", "2026-04-14"]
     ------------------------------------------------------------ */
  specialClosures: ["2026-08-02", "2026-08-03", "2026-08-04", "2026-08-05", "2026-08-06"],

  /* ------------------------------------------------------------
     ⑤ 在线订单设置
     ------------------------------------------------------------
     leadTimeMinutes : 最快取餐时间 = 下单后多少分钟（备餐时间）
     lastOrderBeforeClose : 打烊前多少分钟停止接单
     maxDaysAhead    : 客人最多可以提前几天预订
     orderEndpoint   : 订单接收地址。
        - 留空 "" ：客人提交后会自动打开邮件，把订单发送到上面的餐厅邮箱
        - 推荐：到 https://formspree.io 免费注册后填入你的地址，
          例如 "https://formspree.io/f/xxxxxxxx"，订单会自动发到餐厅邮箱，
          客人无需打开自己的邮件软件（详见《网站使用指南》）
     ------------------------------------------------------------ */
  ordering: {
    leadTimeMinutes: 30,
    lastOrderBeforeClose: 30,
    maxDaysAhead: 3,
    orderEndpoint: "https://formspree.io/f/mkodvvab",
    /* 厨房小票打印（芯烨云）：新订单会额外推一份到厨房打印机，自动出票+响铃提醒。
       不影响上面的邮件通知，两个同时生效。想暂停厨房打印，把下面改成 false 即可。 */
    printEnabled: true,
    printEndpoint: "/.netlify/functions/print-order"
  },

  /* ------------------------------------------------------------
     ⑥ 主推菜（招牌菜聚光灯：首页和点餐页最显眼处展示）
     ------------------------------------------------------------
     enabled : true = 显示    false = 隐藏
     dishNo  : 菜品编号，必须是 menu-data.js 里存在的编号
               （例如 "S1"、"34"、"P1"）
     tagline : 一句推荐语（法语，给客人看）
     ------------------------------------------------------------ */
  signatureDish: {
    enabled: true,
    dishNo: "S1",
    tagline: "La grande spécialité du Sichuan : Porc fondant dans un bouillon d'huile pimentée, intense et parfumé."
  }
};
