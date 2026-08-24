/* ============================================================
   ★★★ 菜单数据文件（员工可编辑）★★★
   Restaurant Chengdu — 在线点餐菜单

   如何修改一道菜：
   - name   : 法语菜名（客人看到的）
   - nameCn : 中文菜名
   - desc   : 简短描述（法语）
   - price  : 价格（瑞郎，只写数字，例如 22 或 9.5）
   - spicy  : true = 显示辣椒图标 🌶   false = 不显示
   - photo  : 菜品照片文件名。把照片放进 images/plats/ 文件夹，
              然后写文件名，例如 "poulet-sichuan.jpg"。
              留空 "" 会显示漂亮的图案占位。
   - soldOut: true = 显示"售完"、无法下单   false = 正常出售

   如何下架一道菜：整行菜（从 { 到 },）删除，或把 soldOut 改成 true
   如何加一道菜：复制一行 { ... }, 粘贴后修改文字
   注意不要删掉行末的逗号！
   ============================================================ */

const MENU_DATA = [
  /* ------------------------------------------------------------
     ★ 每周特价栏（显示在菜单最前面）
     - price    : 特价（客人实际支付的价格）
     - oldPrice : 原价（页面上显示删除线），不想显示原价就删掉这一项
     - 每周更换：改下面几行即可；想暂停特价栏就删光 items 里的内容
       （保留 items: [] 空括号，特价栏会自动隐藏）
     ------------------------------------------------------------ */
  {
    category: "Promo de la semaine",
    categoryCn: "每周特价",
    icon: "🏷️",
    items: []
  },
  {
    category: "Entrées",
    categoryCn: "前菜",
    icon: "🥟",
    items: [
      { no: "1",  name: "Assortiment Chengdu", nameCn: "成都拼盘", desc: "Sélection de nos meilleures entrées", price: 14, spicy: false, photo: "", soldOut: false },
      { no: "2",  name: "Rouleaux de printemps aux légumes", nameCn: "炸春卷", desc: "Croustillants, aux légumes frais", price: 8, spicy: false, photo: "", soldOut: false },
      { no: "3",  name: "Nems", nameCn: "越南卷", desc: "Rouleaux vietnamiens au porc et légumes", price: 9, spicy: false, photo: "", soldOut: false },
      { no: "4",  name: "Raviolis frits (Won-Ton)", nameCn: "炸云吞", desc: "Won-ton dorés et croustillants", price: 8, spicy: false, photo: "", soldOut: false },
      { no: "5",  name: "Samousa", nameCn: "咖喱饺", desc: "Chaussons croustillants au curry", price: 9, spicy: false, photo: "", soldOut: false },
      { no: "6",  name: "Raviolis aux légumes", nameCn: "煎素饺", desc: "Raviolis végétariens poêlés", price: 10, spicy: false, photo: "", soldOut: false },
      { no: "7",  name: "Raviolis grillés", nameCn: "煎肉饺", desc: "Raviolis à la viande, grillés", price: 10, spicy: false, photo: "", soldOut: false },
      { no: "8",  name: "Raviolis aux crevettes à la vapeur", nameCn: "蒸虾饺", desc: "Ha-kao vapeur aux crevettes", price: 9, spicy: false, photo: "", soldOut: false },
      { no: "9",  name: "Beignets de crevettes", nameCn: "炸虾", desc: "Crevettes en beignet doré", price: 9, spicy: false, photo: "", soldOut: false },
      { no: "10", name: "Edamame", nameCn: "水煮毛豆", desc: "Fèves de soja vapeur, fleur de sel", price: 6, spicy: false, photo: "", soldOut: false }
    ]
  },
  {
    category: "Potages",
    categoryCn: "汤类",
    icon: "🍲",
    items: [
      { no: "11", name: "Potage aigre piquant", nameCn: "酸辣汤", desc: "Le classique pékinois, aigre et relevé", price: 8, spicy: true, photo: "n11.jpg", soldOut: false },
      { no: "12", name: "Potage aux raviolis (Won-Ton)", nameCn: "云吞汤", desc: "Bouillon clair et raviolis maison", price: 8, spicy: false, photo: "", soldOut: false },
      { no: "13", name: "Soupe de tofu aux légumes", nameCn: "什锦菜豆腐汤", desc: "Tofu soyeux et légumes croquants", price: 8, spicy: false, photo: "", soldOut: false },
      { no: "14", name: "Soupe au lait de coco avec du tofu", nameCn: "冬阴素豆腐汤", desc: "Tom yam végétarien au lait de coco", price: 9, spicy: true, photo: "", soldOut: false },
      { no: "15", name: "Soupe au lait de coco avec crevettes", nameCn: "冬阴虾汤", desc: "Tom yam aux crevettes", price: 9, spicy: true, photo: "", soldOut: false },
      { no: "16", name: "Soupe au lait de coco avec du poulet", nameCn: "冬阴鸡汤", desc: "Tom yam au poulet", price: 9, spicy: true, photo: "", soldOut: false }
    ]
  },
  {
    category: "Salades",
    categoryCn: "沙拉",
    icon: "🥗",
    items: [
      { no: "21", name: "Salade chinoise mêlée", nameCn: "中国沙拉", desc: "Salade fraîche à la chinoise", price: 9, spicy: false, photo: "", soldOut: false },
      { no: "22", name: "Salade de poulet", nameCn: "鸡肉沙拉", desc: "Émincé de poulet sur salade croquante", price: 9, spicy: false, photo: "", soldOut: false },
      { no: "23", name: "Salade de crevettes", nameCn: "虾沙拉", desc: "Crevettes et légumes croquants", price: 12, spicy: false, photo: "n23.jpeg", soldOut: false },
      { no: "24", name: "Salade d'avocat", nameCn: "牛油果沙拉", desc: "Avocat frais, sauce maison", price: 12, spicy: false, photo: "", soldOut: false }
    ]
  },
  {
    category: "Poulet",
    categoryCn: "鸡肉",
    icon: "🍗",
    items: [
      { no: "31",  name: "Poulet à la sauce aigre-douce", nameCn: "糖醋鸡", desc: "Croustillant, sauce aigre-douce maison", price: 20, spicy: false, photo: "n31.jpg", soldOut: false },
      { no: "32",  name: "Poulet au basilic", nameCn: "九层塔鸡", desc: "Sauté au basilic thaï parfumé", price: 20, spicy: true, photo: "", soldOut: false },
      { no: "33A", name: "Poulet au curry rouge", nameCn: "红咖喱鸡", desc: "Curry rouge au lait de coco", price: 20, spicy: true, photo: "", soldOut: false },
      { no: "33B", name: "Poulet sauté au curry", nameCn: "咖喱鸡", desc: "Curry doux aux légumes", price: 20, spicy: false, photo: "", soldOut: false },
      { no: "34",  name: "Poulet sauté à la façon Sichuan", nameCn: "四川鸡", desc: "Wok épicé, la spécialité de la maison", price: 20, spicy: true, photo: "n34.jpg", soldOut: false },
      { no: "35",  name: "Poulet croustillant", nameCn: "干煸鸡丝", desc: "Émincé de poulet croustillant sauté à sec", price: 22, spicy: true, photo: "", soldOut: false }
    ]
  },
  {
    category: "Bœuf",
    categoryCn: "牛肉",
    icon: "🥩",
    items: [
      { no: "41",  name: "Bœuf au poivre noir", nameCn: "黑椒牛", desc: "Bœuf suisse sauté au poivre noir", price: 22, spicy: false, photo: "n41.jpeg", soldOut: false },
      { no: "42",  name: "Bœuf sauté aux légumes", nameCn: "什锦菜牛", desc: "Bœuf tendre et légumes croquants", price: 22, spicy: false, photo: "", soldOut: false },
      { no: "43A", name: "Bœuf au curry rouge", nameCn: "红咖喱牛", desc: "Curry rouge au lait de coco", price: 22, spicy: true, photo: "", soldOut: false },
      { no: "43B", name: "Bœuf sauté au curry", nameCn: "咖喱牛", desc: "Curry doux aux légumes", price: 22, spicy: false, photo: "", soldOut: false },
      { no: "44",  name: "Bœuf sauté à la façon Sichuan", nameCn: "四川牛", desc: "Wok épicé à la sichuanaise", price: 22, spicy: true, photo: "", soldOut: false },
      { no: "45",  name: "Bœuf croustillant", nameCn: "干煸牛肉丝", desc: "Émincé de bœuf croustillant sauté à sec", price: 23, spicy: true, photo: "", soldOut: false }
    ]
  },
  {
    category: "Canard",
    categoryCn: "鸭肉",
    icon: "🦆",
    items: [
      { no: "51", name: "Canard rôti désossé", nameCn: "烧鸭", desc: "Canard laqué, désossé", price: 24, spicy: false, photo: "plat2.jpg", soldOut: false },
      { no: "52", name: "Canard laqué parfumé à l'orange", nameCn: "香橙鸭", desc: "Sauce à l'orange parfumée", price: 24, spicy: false, photo: "", soldOut: false },
      { no: "53", name: "Canard au curry rouge", nameCn: "红咖喱鸭", desc: "Curry rouge au lait de coco", price: 24, spicy: true, photo: "n53.png", soldOut: false },
      { no: "54", name: "Canard sauté à la façon Sichuan", nameCn: "四川鸭", desc: "Wok épicé à la sichuanaise", price: 24, spicy: true, photo: "", soldOut: false },
    ]
  },
  {
    category: "Fruits de mer",
    categoryCn: "海鲜",
    icon: "🦐",
    items: [
      { no: "61", name: "Crevettes à la sauce aigre-douce", nameCn: "糖醋虾", desc: "Crevettes croustillantes aigre-douces", price: 25, spicy: false, photo: "plat4.jpeg", soldOut: false },
      { no: "62", name: "Crevettes aux cinq épices", nameCn: "椒盐虾", desc: "Sel et poivre, cinq épices", price: 26, spicy: true, photo: "n62.jpeg", soldOut: false },
      { no: "63", name: "Crevettes au curry rouge", nameCn: "红咖喱虾", desc: "Curry rouge au lait de coco", price: 25, spicy: true, photo: "n63.jpg", soldOut: false },
      { no: "64", name: "Crevettes sautées à la façon Sichuan", nameCn: "四川虾", desc: "Wok épicé à la sichuanaise", price: 25, spicy: true, photo: "n64.jpg", soldOut: false },
      { no: "65", name: "Crevettes sur ardoise", nameCn: "铁板虾", desc: "Servies grésillantes sur plaque chaude", price: 26, spicy: false, photo: "", soldOut: false }
    ]
  },
  {
    category: "Nouilles",
    categoryCn: "炒面",
    icon: "🍜",
    items: [
      { no: "71", name: "Nouilles sautées aux légumes", nameCn: "什锦菜炒面", desc: "Nouilles au wok, légumes croquants", price: 16, spicy: false, photo: "n71.jpg", soldOut: false },
      { no: "72", name: "Nouilles sautées au poulet", nameCn: "鸡肉炒面", desc: "Nouilles au wok et poulet", price: 18, spicy: false, photo: "", soldOut: false },
      { no: "73", name: "Nouilles sautées au bœuf", nameCn: "牛肉炒面", desc: "Nouilles au wok et bœuf tendre", price: 19, spicy: false, photo: "", soldOut: false },
      { no: "74", name: "Nouilles sautées aux crevettes", nameCn: "虾肉炒面", desc: "Nouilles au wok et crevettes", price: 20, spicy: false, photo: "", soldOut: false }
    ]
  },
  {
    category: "Riz",
    categoryCn: "炒饭",
    icon: "🍚",
    items: [
      { no: "75",  name: "Riz sauté aux légumes", nameCn: "什锦炒饭", desc: "Riz sauté au wok, légumes frais", price: 15, spicy: false, photo: "", soldOut: false },
      { no: "76",  name: "Riz sauté au poulet", nameCn: "鸡肉炒饭", desc: "Riz sauté au wok et poulet", price: 17, spicy: false, photo: "n76.jpg", soldOut: false },
      { no: "77",  name: "Riz sauté au bœuf", nameCn: "牛肉炒饭", desc: "Riz sauté au wok et bœuf", price: 18, spicy: false, photo: "", soldOut: false },
      { no: "78",  name: "Riz sauté aux crevettes", nameCn: "虾肉炒饭", desc: "Riz sauté au wok et crevettes", price: 19, spicy: false, photo: "", soldOut: false },
      { no: "79A", name: "Riz cantonais", nameCn: "广东炒饭", desc: "Le grand classique cantonais", price: 7, spicy: false, photo: "n79a.jpg", soldOut: false },
      { no: "79B", name: "Riz nature", nameCn: "天然大米", desc: "Riz blanc vapeur", price: 2, spicy: false, photo: "n79b.webp", soldOut: false }
    ]
  },
  {
    category: "Soupes de nouilles",
    categoryCn: "汤面",
    icon: "🥣",
    items: [
      { no: "81", name: "Soupe de nouilles au tofu et légumes", nameCn: "素咖喱汤面", desc: "Bouillon curry-coco végétarien", price: 22, spicy: true, photo: "", soldOut: false },
      { no: "82", name: "Soupe de nouilles au poulet", nameCn: "鸡咖喱汤面", desc: "Bouillon curry-coco au poulet", price: 22, spicy: true, photo: "", soldOut: false },
      { no: "83", name: "Soupe de nouilles aux crevettes", nameCn: "虾咖喱汤面", desc: "Bouillon curry-coco aux crevettes", price: 24, spicy: true, photo: "plat1.jpg", soldOut: false },
      { no: "84", name: "Nouilles de bœuf épicées", nameCn: "香辣牛肉面", desc: "Bouillon riche et épicé au bœuf", price: 23, spicy: true, photo: "n84.jpeg", soldOut: false }
    ]
  },
  {
    category: "Plats spéciaux",
    categoryCn: "特色菜",
    icon: "🌶️",
    items: [
      { no: "87", name: "Porc cinq épices", nameCn: "椒盐排骨", desc: "Travers de porc sel et poivre", price: 25, spicy: true, photo: "", soldOut: false },
      { no: "91", name: "Ma Po Tofu", nameCn: "香辣豆腐", desc: "Tofu épicé du Sichuan", price: 23, spicy: true, photo: "plat3.jpg", soldOut: false },
      { no: "92", name: "Tofu maison", nameCn: "特色豆腐", desc: "Tofu spécial du chef", price: 23, spicy: false, photo: "n92.jpg", soldOut: false },
      { no: "93", name: "Cuisses de grenouilles cinq épices", nameCn: "椒盐田鸡", desc: "Sel et poivre, cinq épices", price: 26, spicy: true, photo: "", soldOut: false },
      { no: "94", name: "Pot d'aubergines aux vermicelles", nameCn: "粉丝茄子煲", desc: "Mijoté en casserole traditionnelle", price: 25, spicy: false, photo: "n94.jpeg", soldOut: false },
      { no: "95", name: "Bœuf en casserole", nameCn: "牛腩煲", desc: "Poitrine de bœuf mijotée en pot", price: 26, spicy: false, photo: "n95.jpg", soldOut: false },
      { no: "96", name: "Légumes verts sautés à l'ail", nameCn: "蒜蓉青菜", desc: "Légumes de saison, ail frais", price: 22, spicy: false, photo: "", soldOut: false }
    ]
  },
  {
    category: "Suggestions du chef",
    categoryCn: "主厨推荐",
    icon: "👨‍🍳",
    items: [
      { no: "S1", name: "Porc cuit en deux temps", nameCn: "回锅肉", desc: "Hui Guo Rou, poivrons et poireau", price: 25, spicy: true, photo: "s1.webp", soldOut: false },
      { no: "S2", name: "Aubergine « au goût de poisson »", nameCn: "鱼香茄子", desc: "Sauce Yu Xiang à l'ail", price: 25, spicy: true, photo: "", soldOut: false },
      { no: "S3", name: "Poulet citronnelle", nameCn: "香茅鸡", desc: "Sauté à la citronnelle, parfum délicat", price: 23, spicy: false, photo: "", soldOut: false },
      { no: "S4", name: "Bœuf froid effiloché au concombre", nameCn: "凉拌黄瓜牛肉丝", desc: "Entrée froide rafraîchissante", price: 27, spicy: true, photo: "s4.jpg", soldOut: false },
      { no: "S5", name: "Poulet à la sauce épicée", nameCn: "麻辣鸡", desc: "Tranches de poulet Ma La", price: 25, spicy: true, photo: "s5.jpeg", soldOut: false },
    ]
  },
  {
    category: "Desserts",
    categoryCn: "甜点",
    icon: "🍨",
    items: [
      { no: "D1", name: "Banane flambée au rhum", nameCn: "火焰香蕉", desc: "Flambée minute", price: 9.5, spicy: false, photo: "", soldOut: false },
      { no: "D2", name: "Beignets de fruits", nameCn: "炸水果", desc: "Ananas, pommes ou litchis", price: 7.5, spicy: false, photo: "", soldOut: false },
      { no: "D3", name: "Salade de fruits de saison", nameCn: "时令水果沙拉", desc: "Fruits frais du moment", price: 7.5, spicy: false, photo: "", soldOut: false },
      { no: "D4", name: "Mochi (1 pièce)", nameCn: "麻糬", desc: "Sésame, thé vert et autres parfums", price: 3.8, spicy: false, photo: "", soldOut: false },
      { no: "D5", name: "Meringue et crème de Gruyère (2 pcs)", nameCn: "瑞士蛋白饼", desc: "La touche fribourgeoise", price: 8.5, spicy: false, photo: "", soldOut: false },
      { no: "D6", name: "Flan au chocolat", nameCn: "巧克力布丁", desc: "Fondant au chocolat", price: 5.5, spicy: false, photo: "", soldOut: false }
    ]
  }
];
