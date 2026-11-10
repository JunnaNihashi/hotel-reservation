const raw = sessionStorage.getItem("nagiReservation");
let data = null;
try { data = raw ? JSON.parse(raw) : null; } catch { data = null; }
const rooms = ["THE HORIZON", "THE TERRACE", "THE RESIDENCE"];
const valid = data && data.guestName && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || "") &&
  /^(?:0\d{9,10}|0\d{1,4}-\d{1,4}-\d{3,4})$/.test(data.phone || "") &&
  [10, 11].includes((data.phone || "").replace(/-/g, "").length) &&
  /^\d{4}-\d{2}-\d{2}$/.test(data.checkin || "") &&
  /^\d{4}-\d{2}-\d{2}$/.test(data.checkout || "") && data.checkout > data.checkin &&
  rooms.includes(data.room) && (data.requests || "").length <= 500;
if (valid) {
  document.getElementById("thanks-success").hidden = false;
  const details = document.getElementById("reservation-details");
  const dateLabel = (value) => value.replace(/-/g, "/");
  const entries = [
    ["お名前", data.guestName], ["メールアドレス", data.email],
    ["電話番号", data.phone], ["チェックイン日", dateLabel(data.checkin)],
    ["チェックアウト日", dateLabel(data.checkout)], ["お部屋", data.room],
    ["ご要望など", data.requests || "なし"]
  ];
  entries.forEach(([label, value]) => {
    const row = document.createElement("div"); row.className = "thanks-detail-row";
    const dt = document.createElement("dt"); dt.textContent = label;
    const dd = document.createElement("dd"); dd.textContent = value;
    row.append(dt, dd); details.append(row);
  });
  sessionStorage.removeItem("nagiReservation");
} else {
  document.getElementById("thanks-empty").hidden = false;
}
