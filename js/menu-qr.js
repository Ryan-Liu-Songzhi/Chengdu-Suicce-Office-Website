/* ============================================================
   Restaurant Chengdu — 扫码菜单页面渲染逻辑
   （员工无需修改此文件；内容请改 midi-menu.js / menu-qr-data.js / menu-data.js）
   ============================================================ */

(function () {
  const $ = (id) => document.getElementById(id);
  const fmt = (n) => "CHF " + n.toFixed(2);
  const DAY_FR = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

  // 分类下架时，顶部快捷跳转栏对应的按钮也一起隐藏，避免点了没反应
  function setChip(target, visible) {
    const chip = document.querySelector(`.cat-chip[data-target="${target}"]`);
    if (chip) chip.style.display = visible ? "" : "none";
  }

  /* ---------- Menu Midi（自动按今天星期几显示） ---------- */
  function renderMidi() {
    const holder = $("secMidi");
    if (!holder || !MIDI_MENU || !MIDI_MENU.enabled) { if (holder) holder.style.display = "none"; setChip("secMidi", false); return; }
    setChip("secMidi", true);

    const todayIdx = new Date().getDay();
    const today = MIDI_MENU.days[todayIdx];

    const head = `
      <div class="menu-section-head">
        <span class="icon">🕐</span>
        <h2>${MIDI_MENU.title}</h2>
        <span class="cn">午餐套餐</span>
      </div>`;

    if (!today) {
      holder.innerHTML = head + `
        <div class="midi-closed">
          <span class="icon">🌙</span>
          <p><strong>Le menu Midi n'est pas servi aujourd'hui (${DAY_FR[todayIdx]}).</strong></p>
          <p>Il est proposé du lundi au vendredi, ${MIDI_MENU.hours.split("·")[1] || "10h30 – 14h00"}.</p>
        </div>`;
      return;
    }

    holder.innerHTML = head + `
      <div class="midi-card">
        <div class="midi-photo"><img src="images/menu-qr/midi-header.jpg" alt="Menu Midi Restaurant Chengdu"></div>
        <div class="midi-body">
          <span class="midi-day">${today.label}</span>
          <p class="midi-sub">${MIDI_MENU.subtitle}</p>
          <div class="midi-cols">
            <div>
              <h4>Entrée au choix</h4>
              <ul class="midi-list">${today.starters.map((s) => `<li>${s}</li>`).join("")}</ul>
            </div>
            <div>
              <h4>Plat au choix</h4>
              <ul class="midi-list midi-list-price">
                ${today.mains.map((m) => `<li><span>${m.name}</span><span>${fmt(m.price)}</span></li>`).join("")}
              </ul>
            </div>
          </div>
          <div class="midi-foot">
            <span>${MIDI_MENU.priceRange} <em>· entrée + plat</em></span>
            <span>${MIDI_MENU.hours}</span>
          </div>
          <p class="midi-note">${MIDI_MENU.note}</p>
        </div>
      </div>`;
  }

  /* ---------- 季节限定 ---------- */
  function renderSeasonal() {
    const holder = $("secSaison");
    if (!holder || !SEASONAL_SPECIALS || !SEASONAL_SPECIALS.enabled || !SEASONAL_SPECIALS.items.length) {
      if (holder) holder.style.display = "none";
      setChip("secSaison", false);
      return;
    }
    setChip("secSaison", true);
    holder.innerHTML = `
      <div class="menu-section-head">
        <span class="icon">🌱</span>
        <h2>${SEASONAL_SPECIALS.title}</h2>
        <span class="cn">${SEASONAL_SPECIALS.subtitle}</span>
      </div>
      <div class="seasonal-grid">
        ${SEASONAL_SPECIALS.items.map((it) => `
          <div class="seasonal-card">
            <div class="seasonal-photo"><img src="images/menu-qr/${it.photo}" alt="${it.name}" loading="lazy"></div>
            <div class="seasonal-body">
              <div class="seasonal-name">${it.nameCn}</div>
              <div class="seasonal-fr">${it.name}</div>
              <div class="seasonal-price">${fmt(it.price)}</div>
            </div>
          </div>`).join("")}
      </div>`;
  }

  /* ---------- 日常菜单（à la carte，复用 menu-data.js） ---------- */
  function catSlug(cat) { return "qsec-" + cat.category.toLowerCase().replace(/[^a-z0-9]+/g, "-"); }

  function renderCarte() {
    const holder = $("menuSections");
    if (!holder) return;
    const cats = (typeof MENU_DATA !== "undefined" ? MENU_DATA : []).filter((c) => c.items.length > 0);

    // 二级快捷栏：La carte 里每个分类一个按钮（Entrées / Potages / Poulet…）
    const subNav = $("subCatNavInner");
    if (subNav) {
      subNav.innerHTML = cats.map((cat) => `<button class="sub-cat-chip" data-target="${catSlug(cat)}">${cat.icon} ${cat.category}</button>`).join("");
    }

    holder.innerHTML = cats.map((cat) => `
      <section class="menu-section" id="${catSlug(cat)}">
        <div class="menu-section-head sub-head">
          <span class="icon">${cat.icon}</span>
          <h2>${cat.category}</h2>
          <span class="cn">${cat.categoryCn}</span>
        </div>
        <div class="dish-grid">
          ${cat.items.map((item) => `
            <article class="dish-card${item.soldOut ? " sold-out" : ""}">
              ${item.soldOut ? '<span class="soldout-tag">Épuisé</span>' : ""}
              <div class="dish-photo">${item.photo ? `<img src="images/plats/${item.photo}" alt="${item.name}" loading="lazy">` : cat.icon}</div>
              <div class="dish-body">
                <div class="dish-name"><span class="no">N°${item.no}</span>${item.name}${item.spicy ? '<span class="spicy-tag" title="Épicé">🌶</span>' : ""}</div>
                <div class="dish-cn">${item.nameCn}</div>
                <div class="dish-desc">${item.desc}</div>
                <div class="dish-foot">
                  <span class="dish-price">${item.oldPrice ? `<span class="old-price">${item.oldPrice.toFixed(2)}</span>` : ""}<span class="${item.oldPrice ? "promo-now" : ""}">${item.price.toFixed(2)}</span> <span class="cur">CHF</span></span>
                  ${item.soldOut ? "" : `<a class="link-order" href="commander.html#dish-${item.no}">Commander →</a>`}
                </div>
              </div>
            </article>`).join("")}
        </div>
      </section>`).join("");
  }

  /* ---------- 套餐 Menus spéciaux ---------- */
  function renderSetMenus() {
    const holder = $("secMenus");
    if (!holder || !SET_MENUS || !SET_MENUS.enabled || !SET_MENUS.menus.length) {
      if (holder) holder.style.display = "none";
      setChip("secMenus", false);
      return;
    }
    setChip("secMenus", true);
    holder.innerHTML = `
      <div class="menu-section-head">
        <span class="icon">🥂</span>
        <h2>${SET_MENUS.title}</h2>
        <span class="cn">${SET_MENUS.subtitle}</span>
      </div>
      <div class="setmenu-grid">
        ${SET_MENUS.menus.map((m) => `
          <div class="setmenu-card" style="--accent:${m.color}">
            <div class="setmenu-photos">
              <img src="images/menu-qr/${m.starter.photo}" alt="${m.starter.name}" loading="lazy">
              <img src="images/menu-qr/${m.plat.photo}" alt="Plat ${m.name}" loading="lazy">
            </div>
            <div class="setmenu-body">
              <h3>${m.name}</h3>
              <div class="setmenu-row"><span class="setmenu-tag">Entrée</span>${m.starter.name}</div>
              <div class="setmenu-row"><span class="setmenu-tag">Plat</span>${m.plat.names.join(" · ")}</div>
              <div class="setmenu-row"><span class="setmenu-tag">Dessert</span>${m.dessert}</div>
              <div class="setmenu-foot">
                <span class="setmenu-price">${m.price} <span class="cur">CHF</span> / pers.</span>
                <span class="setmenu-min">dès ${m.minPeople} personnes</span>
              </div>
              ${m.pdf ? `<a class="setmenu-pdf" href="${m.pdf}" target="_blank">📄 Voir la carte PDF</a>` : ""}
            </div>
          </div>`).join("")}
      </div>`;
  }

  /* ---------- 酒水单 ---------- */
  function renderDrinks() {
    const holder = $("secBoissons");
    if (!holder || !DRINKS_MENU || !DRINKS_MENU.enabled) { if (holder) holder.style.display = "none"; setChip("secBoissons", false); return; }
    setChip("secBoissons", true);
    holder.innerHTML = `
      <div class="menu-section-head">
        <span class="icon">🍵</span>
        <h2>${DRINKS_MENU.title}</h2>
        <span class="cn">酒水单</span>
      </div>
      <div class="drinks-grid">
        ${DRINKS_MENU.groups.map((g) => `
          <div class="drinks-group">
            <h4>${g.category}</h4>
            <table class="hours-table">
              ${g.items.map((it) => `<tr><td>${it.name}</td><td>${fmt(it.price)}</td></tr>`).join("")}
            </table>
          </div>`).join("")}
      </div>`;
  }

  /* ---------- 提示 toast ---------- */
  let toastTimer;
  function toast(msg) {
    const el = $("toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("visible"), 3200);
  }

  /* ---------- 堂食 / 外带模式（防止堂食客人误在此页下单） ---------- */
  function initDineMode() {
    const KEY = "chengdu-dine-mode";
    const text = $("dineModeText");
    const toggle = $("dineModeToggle");
    if (!text || !toggle) return;

    function apply(mode) {
      document.body.classList.toggle("takeaway-mode", mode === "takeaway");
      if (mode === "takeaway") {
        text.innerHTML = "🥡 <strong>Mode à l'emporter activé</strong> — vous pouvez commander en ligne ci-dessous.";
        toggle.textContent = "🍽️ Je suis à table";
      } else {
        text.innerHTML = "🍽️ <strong>Vous êtes à table ?</strong> Ce menu sert à consulter — commandez auprès de notre personnel, sans payer en ligne.";
        toggle.textContent = "🥡 Je commande à l'emporter";
      }
    }

    let mode = sessionStorage.getItem(KEY) || "dinein";
    apply(mode);

    toggle.addEventListener("click", () => {
      mode = mode === "dinein" ? "takeaway" : "dinein";
      sessionStorage.setItem(KEY, mode);
      apply(mode);
      if (mode === "takeaway") toast("Commande à l'emporter activée ✓");
    });

    document.addEventListener("click", (e) => {
      const link = e.target.closest(".link-order");
      if (!link) return;
      if (document.body.classList.contains("takeaway-mode")) return;
      e.preventDefault();
      toast("Vous êtes à table ? Commandez auprès de notre personnel 😊 — ou activez « à l'emporter » en haut de page.");
    });
  }

  /* ---------- 分区导航跳转 ---------- */
  function initNav() {
    document.querySelectorAll(".cat-chip[data-target]").forEach((chip) => {
      chip.addEventListener("click", () => {
        const el = $(chip.dataset.target);
        if (!el) return;
        const bar = $("subCatNav");
        const extra = bar && bar.classList.contains("visible") ? bar.offsetHeight : 0;
        const y = el.getBoundingClientRect().top + window.scrollY - (150 + extra);
        window.scrollTo({ top: y, behavior: "smooth" });
      });
    });
  }

  /* ---------- La carte 二级快捷栏：浏览到 La carte 范围内才出现 ---------- */
  function initSubCatNav() {
    const bar = $("subCatNav");
    const carte = $("secCarte");
    if (!bar || !carte || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => bar.classList.toggle("visible", entry.isIntersecting));
    }, { rootMargin: "-140px 0px -55% 0px", threshold: 0 });
    observer.observe(carte);

    document.querySelectorAll(".sub-cat-chip[data-target]").forEach((chip) => {
      chip.addEventListener("click", () => {
        const el = $(chip.dataset.target);
        if (!el) return;
        const y = el.getBoundingClientRect().top + window.scrollY - (150 + bar.offsetHeight);
        window.scrollTo({ top: y, behavior: "smooth" });
      });
    });
  }

  renderMidi();
  renderSeasonal();
  renderCarte();
  renderSetMenus();
  renderDrinks();
  initNav();
  initSubCatNav();
  initDineMode();
})();
