/* ============================================================
   Restaurant Chengdu — 在线点餐逻辑
   （员工无需修改此文件；菜单请改 menu-data.js，设置请改 config.js）
   ============================================================ */

(function () {
  const C = SITE_CONFIG;
  const CART_KEY = "chengdu-cart-v1";

  /* ---------- 工具 ---------- */
  const $ = (id) => document.getElementById(id);
  const fmt = (n) => "CHF " + n.toFixed(2);
  const DAY_KEYS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  const DAY_FR = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  const MONTH_FR = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

  // 按编号快速查找菜品；空分类（items 为空）自动隐藏
  const ITEM_BY_NO = {};
  MENU_DATA.forEach((cat) => cat.items.forEach((it) => (ITEM_BY_NO[it.no] = it)));
  const CATS = MENU_DATA.filter((cat) => cat.items.length > 0);
  const SIG = C.signatureDish && C.signatureDish.enabled ? C.signatureDish : null;

  /* ---------- 购物车状态 ---------- */
  let cart = {};
  try { cart = JSON.parse(localStorage.getItem(CART_KEY) || "{}"); } catch (e) { cart = {}; }
  // 清除已下架/不存在的菜品
  Object.keys(cart).forEach((no) => {
    if (!ITEM_BY_NO[no] || ITEM_BY_NO[no].soldOut) delete cart[no];
  });

  function saveCart() { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
  function cartCount() { return Object.values(cart).reduce((a, b) => a + b, 0); }
  function cartTotal() {
    return Object.entries(cart).reduce((sum, [no, qty]) => sum + ITEM_BY_NO[no].price * qty, 0);
  }

  function setQty(no, qty) {
    if (qty <= 0) delete cart[no];
    else cart[no] = Math.min(qty, 30);
    saveCart();
    renderCart();
    renderDishControls(no);
  }

  /* ---------- 点餐页顶部常驻提示条 ---------- */
  function renderPerkBanner() {
    const el = $("perkBanner");
    const p = C.mainDishRiceOffer;
    if (!el || !p || !p.enabled) return;
    el.textContent = p.text;
    el.classList.add("visible");
  }
  renderPerkBanner();

  /* ---------- 主推菜（在菜单里以特别栏目呈现，紧挨在"每周特价"之前） ---------- */
  function getSignatureDish() {
    if (!SIG) return null;
    const dish = ITEM_BY_NO[SIG.dishNo];
    return dish && !dish.soldOut ? dish : null;
  }

  /* ---------- 渲染分类导航 ---------- */
  function slug(s) { return s.toLowerCase().normalize("NFD").replace(/[^a-z0-9]+/g, "-"); }

  function catChipDefs() {
    const defs = [];
    if (getSignatureDish()) defs.push({ icon: "⭐", label: "Le plat signature", target: "sec-le-plat-signature" });
    CATS.forEach((cat) => defs.push({ icon: cat.icon, label: cat.category, target: "sec-" + slug(cat.category) }));
    return defs;
  }

  function renderCatNav() {
    $("catNav").innerHTML = catChipDefs().map(
      (c, i) => `<button class="cat-chip${i === 0 ? " active" : ""}" data-target="${c.target}">${c.icon} ${c.label}</button>`
    ).join("");
    $("catNav").querySelectorAll(".cat-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        const el = $(chip.dataset.target);
        const y = el.getBoundingClientRect().top + window.scrollY - 150;
        window.scrollTo({ top: y, behavior: "smooth" });
      });
    });
  }

  /* ---------- 渲染菜单 ---------- */
  function dishControlsHTML(item) {
    if (item.soldOut) return '<button class="add-btn" disabled>+</button>';
    const qty = cart[item.no] || 0;
    if (qty === 0) {
      return `<button class="add-btn" data-add="${item.no}" aria-label="Ajouter">+</button>`;
    }
    return `<span class="qty-stepper">
      <button data-minus="${item.no}" aria-label="Retirer">−</button>
      <span class="qty">${qty}</span>
      <button data-plus="${item.no}" aria-label="Ajouter">+</button>
    </span>`;
  }

  function signatureSectionHTML() {
    const dish = getSignatureDish();
    if (!dish) return "";
    const cat = CATS.find((c) => c.items.includes(dish));
    return `
      <section class="menu-section signature-menu-section" id="sec-le-plat-signature">
        <div class="menu-section-head">
          <span class="icon">⭐</span>
          <h2>Le plat signature</h2>
          <span class="cn">招牌菜</span>
        </div>
        <div class="sig-card">
          <div class="sig-photo">${dish.photo ? `<img src="images/plats/${dish.photo}" alt="${dish.name}">` : (cat ? cat.icon : "⭐")}</div>
          <div class="sig-info">
            <span class="sig-tag">⭐ Le plat signature · 招牌菜</span>
            <div class="sig-name">${dish.name}<span class="cn">${dish.nameCn}</span></div>
            <p class="sig-desc">${SIG.tagline || dish.desc}</p>
          </div>
          <div class="sig-action">
            <div class="sig-price">${dish.price.toFixed(2)} <span class="cur">CHF</span></div>
            <span class="dish-controls" data-controls="${dish.no}">${dishControlsHTML(dish)}</span>
          </div>
        </div>
      </section>`;
  }

  function renderMenu() {
    $("menuSections").innerHTML = signatureSectionHTML() + CATS.map((cat) => `
      <section class="menu-section" id="sec-${slug(cat.category)}">
        <div class="menu-section-head">
          <span class="icon">${cat.icon}</span>
          <h2>${cat.category}</h2>
          <span class="cn">${cat.categoryCn}</span>
        </div>
        <div class="dish-grid">
          ${cat.items.map((item) => `
            <article class="dish-card${item.soldOut ? " sold-out" : ""}" id="dish-${item.no}">
              ${item.soldOut ? '<span class="soldout-tag">Épuisé</span>' : ""}
              ${SIG && SIG.dishNo === item.no ? '<span class="sig-badge">⭐ Signature</span>' : ""}
              <div class="dish-photo">${item.photo ? `<img src="images/plats/${item.photo}" alt="${item.name}">` : cat.icon}</div>
              <div class="dish-body">
                <div class="dish-name"><span class="no">N°${item.no}</span>${item.name}${item.spicy ? '<span class="spicy-tag" title="Épicé">🌶</span>' : ""}</div>
                <div class="dish-cn">${item.nameCn}</div>
                <div class="dish-desc">${item.desc}</div>
                <div class="dish-foot">
                  <span class="dish-price">${item.oldPrice ? `<span class="old-price">${item.oldPrice.toFixed(2)}</span>` : ""}<span class="${item.oldPrice ? "promo-now" : ""}">${item.price.toFixed(2)}</span> <span class="cur">CHF</span></span>
                  <span class="dish-controls" data-controls="${item.no}">${dishControlsHTML(item)}</span>
                </div>
              </div>
            </article>`).join("")}
        </div>
      </section>`).join("");
  }

  // 同一道菜可能同时出现在"主推菜"栏目和它原本的分类里，两处都要同步刷新
  function renderDishControls(no) {
    document.querySelectorAll(`[data-controls="${no}"]`).forEach((holder) => {
      holder.innerHTML = dishControlsHTML(ITEM_BY_NO[no]);
    });
  }

  /* ---------- 渲染购物车 ---------- */
  function renderCart() {
    const count = cartCount();
    const total = cartTotal();
    $("cartCountBadge").textContent = count;
    $("fabCount").textContent = count;
    $("cartTotal").textContent = fmt(total);
    $("btnCheckout").disabled = count === 0;
    $("cartFab").style.display = count > 0 && window.innerWidth <= 1020 ? "inline-flex" : "";
    const clearBtn = $("btnClearCart");
    if (clearBtn) clearBtn.style.display = count > 0 ? "block" : "none";

    if (count === 0) {
      $("cartItems").innerHTML = `<div class="cart-empty"><span class="icon">🥢</span>Votre panier est vide.<br>Ajoutez des plats pour commencer !</div>`;
      return;
    }
    $("cartItems").innerHTML = Object.entries(cart).map(([no, qty]) => {
      const it = ITEM_BY_NO[no];
      return `<div class="cart-item">
        <div class="cart-item-info">
          <div class="cart-item-name">${it.name}</div>
          <div class="cart-item-price">${fmt(it.price)} × ${qty}</div>
        </div>
        <span class="qty-stepper">
          <button data-minus="${no}" aria-label="Retirer">−</button>
          <span class="qty">${qty}</span>
          <button data-plus="${no}" aria-label="Ajouter">+</button>
        </span>
      </div>`;
    }).join("");
  }

  /* ---------- 点击事件（加减菜品） ---------- */
  document.addEventListener("click", (e) => {
    const add = e.target.closest("[data-add]");
    const plus = e.target.closest("[data-plus]");
    const minus = e.target.closest("[data-minus]");
    if (add) {
      setQty(add.dataset.add, 1);
      toast("Ajouté à votre commande ✓");
    } else if (plus) {
      setQty(plus.dataset.plus, (cart[plus.dataset.plus] || 0) + 1);
    } else if (minus) {
      setQty(minus.dataset.minus, (cart[minus.dataset.minus] || 0) - 1);
    }
  });

  /* ---------- 滚动高亮当前分类 ---------- */
  function spyCategories() {
    const sections = catChipDefs().map((c) => $(c.target));
    const chips = Array.from(document.querySelectorAll(".cat-chip"));
    window.addEventListener("scroll", () => {
      let active = 0;
      sections.forEach((sec, i) => {
        if (sec.getBoundingClientRect().top - 170 <= 0) active = i;
      });
      chips.forEach((c, i) => c.classList.toggle("active", i === active));
      const chip = chips[active];
      if (chip) chip.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    }, { passive: true });
  }

  /* ---------- 自取时间：生成可选日期与时段 ---------- */
  function toMin(hm) { const [h, m] = hm.split(":").map(Number); return h * 60 + m; }
  function toHM(min) {
    return String(Math.floor(min / 60)).padStart(2, "0") + ":" + String(min % 60).padStart(2, "0");
  }
  function localISO(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  // 返回某一天可选的取餐时段（15 分钟一档）
  function slotsForDate(date) {
    const iso = localISO(date);
    if (C.specialClosures.includes(iso)) return [];
    const ranges = C.hours[DAY_KEYS[date.getDay()]] || [];
    const now = new Date();
    const isToday = localISO(now) === iso;
    const earliest = isToday ? now.getHours() * 60 + now.getMinutes() + C.ordering.leadTimeMinutes : 0;
    const slots = [];
    ranges.forEach(([open, close]) => {
      const lastSlot = toMin(close) - C.ordering.lastOrderBeforeClose;
      // 从整刻开始（15 分钟对齐）
      let t = Math.ceil(Math.max(toMin(open), earliest) / 15) * 15;
      for (; t <= lastSlot; t += 15) slots.push(toHM(t));
    });
    return slots;
  }

  function dayLabel(date, i) {
    const base = DAY_FR[date.getDay()] + " " + date.getDate() + " " + MONTH_FR[date.getMonth()];
    if (i === 0) return "Aujourd'hui — " + base;
    if (i === 1) return "Demain — " + base;
    return base;
  }

  let pickupDays = [];
  function buildDayOptions() {
    pickupDays = [];
    const sel = $("fDay");
    sel.innerHTML = "";
    for (let i = 0; i <= C.ordering.maxDaysAhead; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const slots = slotsForDate(d);
      if (slots.length === 0) continue;
      pickupDays.push({ date: d, slots });
      const opt = document.createElement("option");
      opt.value = pickupDays.length - 1;
      opt.textContent = dayLabel(d, i);
      sel.appendChild(opt);
    }
    if (pickupDays.length === 0) {
      sel.innerHTML = "<option value=''>Aucun créneau disponible</option>";
      $("fTime").innerHTML = "<option value=''>—</option>";
      return;
    }
    buildTimeOptions();
  }

  function buildTimeOptions() {
    const day = pickupDays[Number($("fDay").value) || 0];
    $("fTime").innerHTML = "<option value=''>Choisir une heure…</option>" +
      day.slots.map((s) => `<option value="${s}">${s}</option>`).join("");
    updatePickupPreview();
  }

  // 实时提示客人已选的取餐日期+时间，让选择结果更醒目
  function updatePickupPreview() {
    const preview = $("pickupPreview");
    const daySel = $("fDay");
    const time = $("fTime").value;
    if (!time || !daySel.selectedOptions[0]) {
      preview.textContent = "";
      preview.classList.remove("visible");
      return;
    }
    preview.textContent = `✓ Retrait prévu : ${daySel.selectedOptions[0].textContent} à ${time}`;
    preview.classList.add("visible");
  }

  /* ---------- 结账弹层 ---------- */
  const overlay = $("checkoutOverlay");

  function openCheckout() {
    if (cartCount() === 0) return;
    $("checkoutForm").style.display = "";
    $("checkoutConfirm").style.display = "none";
    renderSummary();
    buildDayOptions();
    overlay.classList.add("visible");
    document.body.style.overflow = "hidden";
  }
  function closeCheckout() {
    overlay.classList.remove("visible");
    document.body.style.overflow = "";
  }

  function renderSummary() {
    const total = cartTotal();
    const rows = Object.entries(cart).map(([no, qty]) => {
      const it = ITEM_BY_NO[no];
      return `<div class="row"><span>${qty} × ${it.name}</span><span>${fmt(it.price * qty)}</span></div>`;
    }).join("");
    const foot = `<div class="row total"><span>Total (TVA incl.)</span><span>${fmt(total)}</span></div>`;
    $("checkoutSummary").innerHTML = rows + foot;
  }

  $("btnCheckout").addEventListener("click", openCheckout);
  $("cartFab").addEventListener("click", openCheckout);
  $("sheetClose").addEventListener("click", closeCheckout);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeCheckout(); });
  $("fDay").addEventListener("change", buildTimeOptions);
  $("fTime").addEventListener("change", updatePickupPreview);

  /* ---------- 清空购物车 ---------- */
  function clearCart() {
    if (!window.confirm("Voulez-vous vraiment vider votre panier ?")) return;
    cart = {};
    saveCart();
    renderCart();
    renderMenu();
    closeCheckout();
    toast("Panier vidé");
  }
  $("btnClearCart").addEventListener("click", clearCart);
  $("btnClearCart2").addEventListener("click", clearCart);

  /* ---------- 表单验证与提交 ---------- */
  function markInvalid(input, errId, bad) {
    input.classList.toggle("invalid", bad);
    $(errId).classList.toggle("visible", bad);
    return !bad;
  }

  function validate() {
    let ok = true;
    ok = markInvalid($("fName"), "errName", $("fName").value.trim().length < 2) && ok;
    const phone = $("fPhone").value.replace(/[\s.\-()/]/g, "");
    ok = markInvalid($("fPhone"), "errPhone", !/^\+?\d{9,13}$/.test(phone)) && ok;
    const email = $("fEmail").value.trim();
    ok = markInvalid($("fEmail"), "errEmail", email !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) && ok;
    ok = markInvalid($("fTime"), "errTime", !$("fTime").value) && ok;
    return ok;
  }

  function orderNumber() {
    const d = new Date();
    const rand = Math.floor(100 + Math.random() * 900);
    return "CD-" + String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, "0") + String(d.getDate()).padStart(2, "0") + "-" + rand;
  }

  function orderText(order) {
    const lines = order.items.map((i) => `${i.qty} x N°${i.no} ${i.name} — CHF ${(i.price * i.qty).toFixed(2)}`);
    return [
      `NOUVELLE COMMANDE ${order.number}`,
      `------------------------------------`,
      ...lines,
      `------------------------------------`,
      `TOTAL : ${fmt(order.totalDue)} (paiement sur place)`,
      ``,
      `Retrait : ${order.pickupDay} à ${order.pickupTime}`,
      `Nom : ${order.name}`,
      `Téléphone : ${order.phone}`,
      order.email ? `E-mail : ${order.email}` : null,
      order.notes ? `Remarques : ${order.notes}` : null
    ].filter(Boolean).join("\n");
  }

  // 厨房小票打印：尽力而为，失败也不影响正常下单流程（邮件通知才是主渠道）
  function printToKitchen(order) {
    const endpoint = C.ordering.printEndpoint;
    if (!C.ordering.printEnabled || !endpoint) return;
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order)
    }).catch((err) => console.warn("Impression cuisine indisponible :", err));
  }

  async function submitOrder(order) {
    const endpoint = C.ordering.orderEndpoint;
    if (endpoint) {
      // 通过 Formspree 等服务自动发送到餐厅邮箱
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `Commande ${order.number} — retrait ${order.pickupTime}`,
          commande: orderText(order)
        })
      });
      if (!res.ok) throw new Error("endpoint");
      return "sent";
    }
    // 未配置接收服务：打开客人的邮件软件，预填订单内容
    const mail = "mailto:" + C.restaurant.email +
      "?subject=" + encodeURIComponent(`Commande ${order.number} — retrait ${order.pickupTime}`) +
      "&body=" + encodeURIComponent(orderText(order));
    window.location.href = mail;
    return "mailto";
  }

  $("orderForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const day = pickupDays[Number($("fDay").value) || 0];
    const total = cartTotal();
    const order = {
      number: orderNumber(),
      items: Object.entries(cart).map(([no, qty]) => ({ no, qty, name: ITEM_BY_NO[no].name, price: ITEM_BY_NO[no].price })),
      total: total,
      totalDue: total,
      name: $("fName").value.trim(),
      phone: $("fPhone").value.trim(),
      email: $("fEmail").value.trim(),
      notes: $("fNotes").value.trim(),
      pickupDay: $("fDay").selectedOptions[0].textContent,
      pickupTime: $("fTime").value
    };

    const btn = $("btnSubmit");
    btn.disabled = true;
    btn.textContent = "Envoi en cours…";
    let mode;
    try {
      mode = await submitOrder(order);
      printToKitchen(order);
    } catch (err) {
      btn.disabled = false;
      btn.textContent = "Confirmer la commande";
      toast("Erreur d'envoi — merci de nous appeler au " + C.restaurant.phone);
      return;
    }
    btn.disabled = false;
    btn.textContent = "Confirmer la commande";

    // 显示确认页
    $("checkoutForm").style.display = "none";
    $("checkoutConfirm").style.display = "";
    $("confirmOrderNo").textContent = "Commande " + order.number;
    $("confirmPickup").innerHTML = `Retrait : <strong>${order.pickupDay}</strong> à <strong>${order.pickupTime}</strong><br>${C.restaurant.address}`;
    $("confirmMailNote").innerHTML = mode === "mailto"
      ? "📧 Votre messagerie s'est ouverte avec la commande pré-remplie — <strong>merci de l'envoyer</strong> pour nous la transmettre. Sinon, appelez-nous au " + C.restaurant.phone + "."
      : "Votre commande a bien été transmise au restaurant.";

    // 清空购物车
    cart = {};
    saveCart();
    renderCart();
    renderMenu();
  });

  $("btnNewOrder").addEventListener("click", () => { closeCheckout(); });

  /* ---------- Toast 通知 ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $("toast");
    t.textContent = msg;
    t.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("visible"), 2200);
  }

  window.addEventListener("resize", renderCart);

  /* ---------- 初始化 ---------- */
  renderCatNav();
  renderMenu();
  renderCart();
  spyCategories();
})();
