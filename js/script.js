// モバイル用ナビゲーションの開閉
const menuToggle = document.querySelector(".menu-toggle");
const globalNav = document.querySelector(".global-nav");

if (menuToggle && globalNav) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";

    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute(
      "aria-label",
      isExpanded ? "メニューを開く" : "メニューを閉じる"
    );
    globalNav.classList.toggle("is-open", !isExpanded);
  });

  // メニュー内のリンクを押したらナビゲーションを閉じる
  globalNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "メニューを開く");
      globalNav.classList.remove("is-open");
    });
  });
}


// 予約フォームの入力チェック（デモ用：サーバー送信は行いません）
const reservationForm = document.querySelector("#reservation-form");
if (reservationForm) {
  const fieldIds = ["guest-name", "guest-email", "guest-phone", "checkin", "checkout", "room-choice"];
  const requests = document.querySelector("#requests");
  const count = document.querySelector("#requests-count");
  const feedback = document.querySelector("#form-feedback");
  requests.addEventListener("input", () => { count.textContent = requests.value.length; });

  function setError(id, message) {
    const input = document.getElementById(id);
    document.getElementById(id + "-error").textContent = message;
    if (message) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
  }
  fieldIds.forEach(id => {
    document.getElementById(id).addEventListener("input", () => setError(id, ""));
    document.getElementById(id).addEventListener("change", () => setError(id, ""));
  });

  reservationForm.addEventListener("submit", (event) => {
    event.preventDefault();
    feedback.textContent = "";
    fieldIds.forEach(id => setError(id, ""));
    const name = document.getElementById("guest-name").value.trim();
    const email = document.getElementById("guest-email").value.trim();
    const phone = document.getElementById("guest-phone").value.trim();
    const checkin = document.getElementById("checkin").value;
    const checkout = document.getElementById("checkout").value;
    const room = document.getElementById("room-choice").value;
    if (!name) setError("guest-name", "お名前を入力してください。");
    if (!email) setError("guest-email", "メールアドレスを入力してください。");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) setError("guest-email", "正しいメールアドレスを入力してください。");
    if (!phone) setError("guest-phone", "電話番号を入力してください。");
    else if (!/^[0-9-]+$/.test(phone) || !/^(?:0\d{9,10}|0\d{1,4}-\d{1,4}-\d{3,4})$/.test(phone) || ![10,11].includes(phone.replace(/-/g, "").length)) setError("guest-phone", "電話番号は数字とハイフンで10〜11桁の形式で入力してください。");
    if (!checkin) setError("checkin", "チェックイン日を選択してください。");
    if (!checkout) setError("checkout", "チェックアウト日を選択してください。");
    else if (checkin && checkout <= checkin) setError("checkout", "チェックアウト日はチェックイン日より後の日付にしてください。");
    if (!room) setError("room-choice", "お部屋を選択してください。");
    if (requests.value.length > 500) {
      feedback.textContent = "ご要望は500文字以内で入力してください。";
    }
    // 開発者ツールのConsoleに入力値と判定結果を順番に表示
    console.group("予約フォームの入力チェック");
    const fields = [
      ["お名前", "guest-name", name],
      ["メールアドレス", "guest-email", email],
      ["電話番号", "guest-phone", phone],
      ["チェックイン日", "checkin", checkin],
      ["チェックアウト日", "checkout", checkout],
      ["お部屋", "room-choice", room],
    ];
    fields.forEach(([label, id, value]) => {
      const error = document.getElementById(id + "-error").textContent;
      console.log(`${label}：${value || "（未入力）"} → ${error || "OK"}`);
    });
    console.log(`ご要望など：${requests.value || "（未入力・任意）"}`);
    console.log(`ご要望の文字数：${requests.value.length}/500 → ${requests.value.length <= 500 ? "OK" : "エラー"}`);
    const hasError = fieldIds.some(id => document.getElementById(id).getAttribute("aria-invalid") === "true") || requests.value.length > 500;
    console.log(`最終判定：${hasError ? "入力エラーあり" : "入力OK"}`);
    console.groupEnd();
    const firstInvalid = fieldIds.map(id => document.getElementById(id)).find(el => el.getAttribute("aria-invalid") === "true");
    if (hasError) { if (firstInvalid) firstInvalid.focus(); return; }
    // 入力チェックがすべてOKの場合のみサンクスページへ移動
    const reservationData = {
      guestName: name,
      email,
      phone,
      checkin,
      checkout,
      room,
      requests: requests.value.trim()
    };
    sessionStorage.setItem("nagiReservation", JSON.stringify(reservationData));
    window.location.href = "thanks.html";
  });
}
