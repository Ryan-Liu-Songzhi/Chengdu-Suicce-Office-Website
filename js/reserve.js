/* ============================================================
   Restaurant Chengdu — 预约订位逻辑（首页）
   （员工无需修改此文件；文案/价格请改 config.js 的 reservation 和 fondue）
   ============================================================ */

(function () {
  const C = SITE_CONFIG;
  const R = C.reservation;
  if (!R || !R.enabled) return;

  const $ = (id) => document.getElementById(id);
  const overlay = $("reserveOverlay");
  if (!overlay) return;

  const DAY_KEYS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  const DAY_FR = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  const MONTH_FR = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

  let mode = "table"; // "table" | "fondue"

  /* ---------- 人数下拉 ---------- */
  function buildPeopleOptions() {
    const sel = $("rPeople");
    const max = R.maxPeople || 12;
    let html = "";
    for (let i = 1; i <= max; i++) html += `<option value="${i}">${i} personne${i > 1 ? "s" : ""}</option>`;
    html += `<option value="${max}+">Plus de ${max} personnes</option>`;
    sel.innerHTML = html;
  }

  /* ---------- 日期 / 时段：跟点餐页同一套算法，但用预约自己的时间设置 ---------- */
  function toMin(hm) { const [h, m] = hm.split(":").map(Number); return h * 60 + m; }
  function toHM(min) {
    return String(Math.floor(min / 60)).padStart(2, "0") + ":" + String(min % 60).padStart(2, "0");
  }
  function localISO(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function dayLabel(date, i) {
    const base = DAY_FR[date.getDay()] + " " + date.getDate() + " " + MONTH_FR[date.getMonth()];
    if (i === 0) return "Aujourd'hui — " + base;
    if (i === 1) return "Demain — " + base;
    return base;
  }
  function slotsForDate(date) {
    const iso = localISO(date);
    if (C.specialClosures.includes(iso)) return [];
    const ranges = C.hours[DAY_KEYS[date.getDay()]] || [];
    const now = new Date();
    const isToday = localISO(now) === iso;
    const earliest = isToday ? now.getHours() * 60 + now.getMinutes() + R.leadTimeMinutes : 0;
    const slots = [];
    ranges.forEach(([open, close]) => {
      const lastSlot = toMin(close) - R.lastSeatingBeforeClose;
      let t = Math.ceil(Math.max(toMin(open), earliest) / 30) * 30;
      for (; t <= lastSlot; t += 30) slots.push(toHM(t));
    });
    return slots;
  }

  let reserveDays = [];
  function buildDayOptions() {
    reserveDays = [];
    const sel = $("rDay");
    sel.innerHTML = "";
    for (let i = 0; i <= R.maxDaysAhead; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const slots = slotsForDate(d);
      if (slots.length === 0) continue;
      reserveDays.push({ date: d, slots });
      const opt = document.createElement("option");
      opt.value = reserveDays.length - 1;
      opt.textContent = dayLabel(d, i);
      sel.appendChild(opt);
    }
    if (reserveDays.length === 0) {
      sel.innerHTML = "<option value=''>Aucun créneau disponible</option>";
      $("rTime").innerHTML = "<option value=''>—</option>";
      return;
    }
    buildTimeOptions();
  }
  function buildTimeOptions() {
    const day = reserveDays[Number($("rDay").value) || 0];
    $("rTime").innerHTML = "<option value=''>Choisir une heure…</option>" +
      day.slots.map((s) => `<option value="${s}">${s}</option>`).join("");
  }

  /* ---------- 模式切换（普通订位 / 火锅） ---------- */
  const tabTable = $("tabTable");
  const tabFondue = $("tabFondue");
  const fondueNote = $("fondueNote");
  const F = C.fondue;

  if (!F || !F.enabled) {
    if (tabFondue) tabFondue.style.display = "none";
  }

  function setMode(m) {
    mode = m;
    if (tabTable) tabTable.classList.toggle("active", m === "table");
    if (tabFondue) tabFondue.classList.toggle("active", m === "fondue");
    if (fondueNote) fondueNote.style.display = m === "fondue" ? "" : "none";
  }
  if (tabTable) tabTable.addEventListener("click", () => setMode("table"));
  if (tabFondue) tabFondue.addEventListener("click", () => setMode("fondue"));

  if (fondueNote && F) {
    fondueNote.innerHTML = `🍲 <strong>${F.pricePerPerson}.- CHF / personne</strong> — ${F.note || ""}`;
  }

  /* ---------- 打开 / 关闭弹层 ---------- */
  function openReserve(initialMode) {
    $("reserveForm").style.display = "";
    $("reserveConfirm").style.display = "none";
    setMode(initialMode === "fondue" && F && F.enabled ? "fondue" : "table");
    buildPeopleOptions();
    buildDayOptions();
    overlay.classList.add("visible");
    document.body.style.overflow = "hidden";
  }
  function closeReserve() {
    overlay.classList.remove("visible");
    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-reserve-open]").forEach((btn) => {
    btn.addEventListener("click", () => openReserve(btn.dataset.reserveOpen));
  });
  $("reserveClose").addEventListener("click", closeReserve);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeReserve(); });
  $("rDay").addEventListener("change", buildTimeOptions);

  /* ---------- 校验 ---------- */
  function markInvalid(input, errId, bad) {
    input.classList.toggle("invalid", bad);
    $(errId).classList.toggle("visible", bad);
    return !bad;
  }
  function validate() {
    let ok = true;
    ok = markInvalid($("rName"), "rErrName", $("rName").value.trim().length < 2) && ok;
    const phone = $("rPhone").value.replace(/[\s.\-()/]/g, "");
    ok = markInvalid($("rPhone"), "rErrPhone", !/^\+?\d{9,13}$/.test(phone)) && ok;
    const email = $("rEmail").value.trim();
    ok = markInvalid($("rEmail"), "rErrEmail", email !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) && ok;
    ok = markInvalid($("rTime"), "rErrTime", !$("rTime").value) && ok;
    return ok;
  }

  function reservationNumber() {
    const d = new Date();
    const rand = Math.floor(100 + Math.random() * 900);
    return "RES-" + String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, "0") + String(d.getDate()).padStart(2, "0") + "-" + rand;
  }

  function reservationText(r) {
    return [
      `NOUVELLE DEMANDE DE RÉSERVATION ${r.number}`,
      `Type : ${r.mode === "fondue" ? "Fondue chinoise (self-service, " + (F ? F.pricePerPerson : "") + ".-/pers.)" : "Table classique"}`,
      `------------------------------------`,
      `Personnes : ${r.people}`,
      `Date : ${r.dayLabel} à ${r.time}`,
      `------------------------------------`,
      `Nom : ${r.name}`,
      `Téléphone : ${r.phone}`,
      r.email ? `E-mail : ${r.email}` : null,
      r.notes ? `Remarques : ${r.notes}` : null
    ].filter(Boolean).join("\n");
  }

  async function submitReservation(r) {
    const endpoint = R.endpoint;
    if (endpoint) {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `Réservation ${r.number} — ${r.mode === "fondue" ? "Fondue" : "Table"} — ${r.people} pers. — ${r.dayLabel} ${r.time}`,
          reservation: reservationText(r)
        })
      });
      if (!res.ok) throw new Error("endpoint");
      return "sent";
    }
    const mail = "mailto:" + C.restaurant.email +
      "?subject=" + encodeURIComponent(`Réservation ${r.number} — ${r.dayLabel} ${r.time}`) +
      "&body=" + encodeURIComponent(reservationText(r));
    window.location.href = mail;
    return "mailto";
  }

  $("reserveFormEl").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const day = reserveDays[Number($("rDay").value) || 0];
    const r = {
      number: reservationNumber(),
      mode,
      people: $("rPeople").value,
      dayLabel: $("rDay").selectedOptions[0].textContent,
      time: $("rTime").value,
      name: $("rName").value.trim(),
      phone: $("rPhone").value.trim(),
      email: $("rEmail").value.trim(),
      notes: $("rNotes").value.trim()
    };

    const btn = $("rSubmit");
    btn.disabled = true;
    btn.textContent = "Envoi en cours…";
    try {
      await submitReservation(r);
    } catch (err) {
      btn.disabled = false;
      btn.textContent = "Envoyer ma demande de réservation";
      const toastEl = $("toast");
      if (toastEl) {
        toastEl.textContent = "Erreur d'envoi — merci de nous appeler au " + C.restaurant.phone;
        toastEl.classList.add("visible");
        setTimeout(() => toastEl.classList.remove("visible"), 2600);
      }
      return;
    }
    btn.disabled = false;
    btn.textContent = "Envoyer ma demande de réservation";

    $("reserveForm").style.display = "none";
    $("reserveConfirm").style.display = "";
    $("reserveConfirmDetail").textContent = `${r.people} pers. · ${r.dayLabel} à ${r.time}`;
    $("reserveFormEl").reset();
  });

  $("rNewReservation").addEventListener("click", closeReserve);
})();
