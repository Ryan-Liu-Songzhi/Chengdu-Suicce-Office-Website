/* ============================================================
   Restaurant Chengdu — 扫码菜单专用数据
   （季节限定 / 套餐 / 酒水单）
   ★ 员工可改：价格、菜名、上下架（enabled）
   ============================================================ */

/* ------------------------------------------------------------
   季节限定 — Les Nouveaux de Saison
   ------------------------------------------------------------ */
const SEASONAL_SPECIALS = {
  enabled: true,
  title: "Les nouveaux de saison",
  subtitle: "Collection d'Été",
  items: [
    { nameCn: "拍黄瓜", name: "Concombres frappés", price: 6, photo: "saison-concombres.jpg" },
    { nameCn: "酱牛肉", name: "Bœuf aux cinq épices", price: 12, photo: "saison-boeuf-epices.jpg" },
    { nameCn: "毛豆", name: "Edamame", price: 6, photo: "saison-edamame.jpg" },
    { nameCn: "花毛一体", name: "Cacahuètes et edamame", price: 12.5, photo: "saison-cacahuetes-edamame.jpg" },
    { nameCn: "凉面 (小份)", name: "Nouilles froides", price: 12.5, photo: "saison-nouilles-froides.jpg" },
    { nameCn: "包子 (2只)", name: "Baozi", price: 10, photo: "saison-baozi.jpg" },
    { nameCn: "菜饼", name: "Crêpe chinoise (Caibing)", price: 9, photo: "saison-crepe.jpg" },
    { nameCn: "海藻沙拉", name: "Salade d'algues", price: 6, photo: "saison-algues.jpg" }
  ]
};

/* ------------------------------------------------------------
   套餐 — Menus spéciaux (Émeraude / Topaze / Rubis)
   适合聚会/宴请，需要提前跟服务员确认人数
   ------------------------------------------------------------ */
const SET_MENUS = {
  enabled: true,
  title: "Menus spéciaux",
  subtitle: "Sur commande pour toute la table",
  menus: [
    {
      name: "Émeraude du Chengdu",
      color: "#1E6E4F",
      price: 33,
      minPeople: 2,
      starter: { name: "Rouleaux de printemps", photo: "set-emeraude-entree.jpg" },
      plat: { names: ["Poulet aigre-doux", "Bœuf curry rouge", "Riz cantonais"], photo: "set-emeraude-plat.jpg" },
      dessert: "Coconut Mochi",
      pdf: "menus/menu-emeraude.pdf"
    },
    {
      name: "Topaze du Chengdu",
      color: "#1F4E9C",
      price: 36,
      minPeople: 3,
      starter: { name: "Friture mélangée", photo: "set-topaze-entree.jpg" },
      plat: { names: ["Poulet curry rouge", "Canard rôti", "Mélange de légumes", "Riz cantonais"], photo: "set-topaze-plat.jpg" },
      dessert: "Beignet de banane",
      pdf: "menus/menu-topaze.pdf"
    },
    {
      name: "Rubis du Chengdu",
      color: "#A3242B",
      price: 38,
      minPeople: 4,
      starter: { name: "Vapeur mélange de raviolis", photo: "set-rubis-entree.jpg" },
      plat: { names: ["Canard laqué", "Poulet légumes", "Crevettes « Si-chuan »", "Bœuf en casserole", "Riz cantonais"], photo: "set-rubis-plat.jpg" },
      dessert: "Au choix",
      pdf: "menus/menu-rubis.pdf"
    }
  ]
};

/* ------------------------------------------------------------
   酒水单 — Carte des boissons（纯文字，无图片）
   ------------------------------------------------------------ */
const DRINKS_MENU = {
  enabled: true,
  title: "Carte des boissons",
  groups: [
    {
      category: "Les cafés",
      items: [
        { name: "Café", price: 3.8 },
        { name: "Espresso", price: 3.8 },
        { name: "Double espresso", price: 4.9 },
        { name: "Renversé", price: 4.9 }
      ]
    },
    {
      category: "Les thés",
      items: [
        { name: "Thé (noir / menthe / verveine…)", price: 3.6 },
        { name: "Thé vert", price: 3.8 },
        { name: "Thé jasmin", price: 3.8 }
      ]
    },
    {
      category: "Les minérales (bouteille)",
      items: [
        { name: "Coca 3.3 dl", price: 4.6 },
        { name: "Rivella 3.3 dl", price: 4.6 },
        { name: "Minérale avec ou sans 5.0 dl", price: 4.8 },
        { name: "Thé froid 5.0 dl", price: 4.8 },
        { name: "Thé froid japonais 5.0 dl", price: 4.8 }
      ]
    },
    {
      category: "Les minérales (verre)",
      items: [
        { name: "Coca 3.0 dl", price: 3.6 },
        { name: "Schorle 3.0 dl", price: 3.6 },
        { name: "Rivella 3.0 dl", price: 3.6 },
        { name: "Minérale avec ou sans 3.0 dl", price: 3.6 },
        { name: "Thé froid 3.0 dl", price: 3.6 }
      ]
    },
    {
      category: "Les bières (bouteille)",
      items: [
        { name: "Chine 3.3 dl", price: 5.0 },
        { name: "Thaï 3.3 dl", price: 5.0 },
        { name: "Erdinger 5.0 dl", price: 6.5 }
      ]
    },
    {
      category: "Vin blanc",
      items: [
        { name: "Cheval en tête blanc (Fr) — bouteille 7.5 dl", price: 38 },
        { name: "Chasselas — verre 1.0 dl", price: 4.6 },
        { name: "Chasselas — 5.0 dl", price: 20 }
      ]
    },
    {
      category: "Vin rosé",
      items: [
        { name: "Antica Enotria (It) — bouteille 7.5 dl", price: 38 },
        { name: "Oeil de perdrix — verre 1.0 dl", price: 4.6 },
        { name: "Oeil de perdrix — 5.0 dl", price: 20 }
      ]
    },
    {
      category: "Vin rouge",
      items: [
        { name: "Antica Enotria (It) — bouteille 7.5 dl", price: 40 },
        { name: "Settemaffio Merlot (Ch) — bouteille 7.5 dl", price: 48 },
        { name: "Scilio Etna Rosso (It) — bouteille 7.5 dl", price: 42 },
        { name: "Cedro - Chianti Rufina (It) — bouteille 7.5 dl", price: 42 },
        { name: "Cheval en tête rouge (Fr) — bouteille 7.5 dl", price: 42 },
        { name: "Antica Enotria (It) — verre 1.0 dl", price: 5.8 },
        { name: "Cedro - Chianti Rufina (It) — verre 1.0 dl", price: 6.0 }
      ]
    }
  ]
};
