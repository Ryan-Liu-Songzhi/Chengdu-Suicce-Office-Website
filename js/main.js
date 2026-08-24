/* ============================================================
   Restaurant Chengdu — 公共逻辑（公告、导航、营业时间）
   （员工无需修改此文件，公告内容请改 config.js）
   ============================================================ */

(function () {
  const C = SITE_CONFIG;

  /* ---------- 公告显示（横幅 / 弹窗） ---------- */
  function inDateRange(a) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (a.startDate) {
      const s = new Date(a.startDate + "T00:00:00");
      if (today < s) return false;
    }
    if (a.endDate) {
      const e = new Date(a.endDate + "T23:59:59");
      if (today > e) return false;
    }
    return true;
  }

  function showAnnouncement() {
    const a = C.announcement;
    if (!a || !a.enabled || !inDateRange(a)) return;
    // 关闭按钮只隐藏当前这次浏览；重新打开或刷新网页，公告会再次出现
    // （只要还在 enabled/startDate/endDate 有效期内）

    if (a.style === "popup") {
      const ov = document.getElementById("announceOverlay");
      if (!ov) return;
      const popup = document.getElementById("announcePopup");
      popup.classList.add("type-" + a.type);
      document.getElementById("announcePopupIcon").textContent =
        a.type === "warning" ? "⚠️" : a.type === "promo" ? "🎉" : "📢";
      document.getElementById("announcePopupTitle").textContent = a.title;
      document.getElementById("announcePopupMsg").textContent = a.message;
      ov.classList.add("visible");
      document.getElementById("announcePopupClose").onclick = () => {
        ov.classList.remove("visible");
      };
    } else {
      const banner = document.getElementById("announceBanner");
      if (!banner) return;
      banner.classList.add("visible", "type-" + a.type);
      document.getElementById("announceBannerTitle").textContent = a.title;
      document.getElementById("announceBannerMsg").textContent = " " + a.message;
      document.getElementById("announceBannerClose").onclick = () => {
        banner.classList.remove("visible");
      };
    }
  }

  /* ---------- 大公告板弹窗（内容在 config.js 的 popup 里） ---------- */
  function escapeHTML(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  // 支持 **加粗** 写法
  function richText(s) {
    return escapeHTML(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  }

  function showGrandPopup() {
    const p = C.popup;
    const ov = document.getElementById("grandOverlay");
    if (!p || !p.enabled || !ov || !inDateRange(p)) return;
    // 关闭按钮只隐藏当前这次浏览；重新打开或刷新网页，弹窗会再次出现
    // （只要还在 enabled/startDate/endDate 有效期内）

    document.getElementById("grandPopup").classList.add("type-" + (p.type || "promo"));
    document.getElementById("grandIcon").textContent = p.icon || "📢";
    document.getElementById("grandTitle").innerHTML = richText(p.title);
    document.getElementById("grandBody").innerHTML = p.lines.map((l) => "<p>" + richText(l) + "</p>").join("");

    const btn = document.getElementById("grandBtn");
    btn.textContent = p.buttonText || "J'ai compris";
    const close = () => { ov.classList.remove("visible"); };
    if (p.buttonLink) {
      btn.href = p.buttonLink;
    } else {
      btn.href = "#";
      btn.addEventListener("click", (e) => { e.preventDefault(); close(); });
    }
    document.getElementById("grandClose").onclick = close;
    ov.addEventListener("click", (e) => { if (e.target === ov) close(); });
    ov.classList.add("visible");
  }

  /* ---------- 首页主推菜聚光灯 ---------- */
  function findDish(no) {
    if (typeof MENU_DATA === "undefined") return null;
    for (const cat of MENU_DATA) {
      const hit = cat.items.find((it) => it.no === no);
      if (hit) return { ...hit, icon: cat.icon };
    }
    return null;
  }

  function renderSignatureHome() {
    const holder = document.getElementById("signatureSpotHome");
    const cfg = C.signatureDish;
    if (!holder) return;
    if (!cfg || !cfg.enabled) { holder.parentElement.style.display = "none"; return; }
    const dish = findDish(cfg.dishNo);
    if (!dish) { holder.parentElement.style.display = "none"; return; }
    holder.innerHTML = `
      <div class="sig-card">
        <div class="sig-photo">${dish.photo ? `<img src="images/plats/${dish.photo}" alt="${dish.name}">` : dish.icon}</div>
        <div class="sig-info">
          <span class="sig-tag">⭐ Le plat signature · 招牌菜</span>
          <div class="sig-name">${dish.name}<span class="cn">${dish.nameCn}</span></div>
          <p class="sig-desc">${cfg.tagline || dish.desc}</p>
        </div>
        <div class="sig-action">
          <div class="sig-price">${dish.price.toFixed(2)} <span class="cur">CHF</span></div>
          <a class="sig-btn" href="commander.html#dish-${dish.no}">Commander ce plat</a>
        </div>
      </div>`;
  }

  /* ---------- 手机端导航菜单 ---------- */
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => nav.classList.toggle("open"));
    nav.querySelectorAll("a").forEach((l) => l.addEventListener("click", () => nav.classList.remove("open")));
  }

  /* ---------- 营业时间表格 + 今日是否营业 ---------- */
  const DAY_KEYS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  const DAY_LABELS = {
    lundi: "Lundi", mardi: "Mardi", mercredi: "Mercredi", jeudi: "Jeudi",
    vendredi: "Vendredi", samedi: "Samedi", dimanche: "Dimanche"
  };

  function fmtRanges(ranges) {
    if (!ranges || ranges.length === 0) return "Fermé";
    return ranges.map((r) => r[0] + " – " + r[1]).join(" / ");
  }

  function renderHours() {
    const table = document.getElementById("hoursTable");
    if (!table) return;
    const todayKey = DAY_KEYS[new Date().getDay()];
    const order = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
    table.innerHTML = order
      .map((k) => {
        const cls = k === todayKey ? ' class="today"' : "";
        return "<tr" + cls + "><td>" + DAY_LABELS[k] + "</td><td>" + fmtRanges(C.hours[k]) + "</td></tr>";
      })
      .join("");
  }

  function isOpenNow() {
    const now = new Date();
    const iso = now.toISOString().slice(0, 10);
    if (C.specialClosures.includes(iso)) return false;
    const ranges = C.hours[DAY_KEYS[now.getDay()]] || [];
    const cur = now.getHours() * 60 + now.getMinutes();
    return ranges.some((r) => {
      const [h1, m1] = r[0].split(":").map(Number);
      const [h2, m2] = r[1].split(":").map(Number);
      return cur >= h1 * 60 + m1 && cur < h2 * 60 + m2;
    });
  }

  function renderOpenBadge() {
    const el = document.getElementById("openBadge");
    if (!el) return;
    el.innerHTML = isOpenNow()
      ? '<span class="badge-open">Ouvert actuellement</span>'
      : '<span class="badge-closed">Fermé actuellement</span>';
  }

  /* ---------- 页脚年份 ---------- */
  const yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- 首页图片画廊左右箭头（桌面端鼠标用户用） ---------- */
  const gallery = document.getElementById("foodGallery");
  const galleryPrev = document.getElementById("galleryPrev");
  const galleryNext = document.getElementById("galleryNext");
  if (gallery && galleryPrev && galleryNext) {
    const scrollByOne = (dir) => {
      const item = gallery.querySelector(".gallery-item");
      const step = item ? item.offsetWidth + 16 : 240;
      gallery.scrollBy({ left: dir * step, behavior: "smooth" });
    };
    galleryPrev.addEventListener("click", () => scrollByOne(-1));
    galleryNext.addEventListener("click", () => scrollByOne(1));
  }

  showAnnouncement();
  showGrandPopup();
  renderSignatureHome();
  renderHours();
  renderOpenBadge();
})();
