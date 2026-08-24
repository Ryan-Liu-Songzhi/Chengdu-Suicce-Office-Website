/* ============================================================
   Restaurant Chengdu — Menu Midi (lundi-vendredi)
   ★ 员工可改：每天的入门菜和主菜内容/价格
   数据来自纸质"Midi menu"海报，固定每周循环，
   网页会根据"今天星期几"自动显示对应的一天，无需手动更换。
   ============================================================ */

const MIDI_MENU = {
  enabled: true,
  title: "Menu Midi",
  subtitle: "3 plats du jour différents chaque jour — Entrée + Plat",
  priceRange: "17.50 CHF – 18.50 CHF",
  hours: "Lundi – Vendredi · 10h30 – 14h00",
  note: "Vous pouvez combiner librement les entrées et les plats principaux comme vous le souhaitez.",

  // 1 = lundi ... 5 = vendredi（JS 里 Date.getDay() 的编号）
  days: {
    1: {
      label: "Lundi",
      starters: ["Rouleaux de printemps aux légumes", "Samousa", "Raviolis à la vapeur"],
      mains: [
        { name: "Poulet sauté à la façon Sichuan", price: 17.5 },
        { name: "Bœuf sauté au satay", price: 18.5 },
        { name: "Riz sauté aux légumes", price: 17.0 }
      ]
    },
    2: {
      label: "Mardi",
      starters: ["Potage aigre piquant", "Raviolis frits (Won-Ton)", "Raviolis grillés"],
      mains: [
        { name: "Poulet au basilic", price: 17.5 },
        { name: "Bœuf croustillant", price: 18.5 },
        { name: "Légumes sautés avec tofu", price: 17.0 }
      ]
    },
    3: {
      label: "Mercredi",
      starters: ["Salade chinoise mêlée", "Nems", "Raviolis grillés"],
      mains: [
        { name: "Poulet croustillant", price: 17.5 },
        { name: "Bœuf au curry rouge", price: 18.5 },
        { name: "Nouilles sautées aux légumes", price: 17.0 }
      ]
    },
    4: {
      label: "Jeudi",
      starters: ["Salade chinoise mêlée", "Rouleaux de printemps aux légumes", "Raviolis aux légumes"],
      mains: [
        { name: "Poulet à la sauce aigre-doux", price: 17.5 },
        { name: "Bœuf sauté à la façon Sichuan", price: 18.5 },
        { name: "Crevettes sautées aux légumes", price: 18.5 }
      ]
    },
    5: {
      label: "Vendredi",
      starters: ["Potage aigre piquant", "Raviolis aux légumes", "Salade chinoise mêlée"],
      mains: [
        { name: "Poulet sauté aux noix de cajou", price: 17.5 },
        { name: "Bœuf poivre noir", price: 18.5 },
        { name: "Canard laqué parfumé à l'orange", price: 18.5 }
      ]
    }
  }
};
