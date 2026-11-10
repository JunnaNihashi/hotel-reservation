
// モバイル用ナビゲーションの開閉
const menuToggle = document.querySelector(".menu-toggle");
const globalNav = document.querySelector(".global-nav");

if (menuToggle && globalNav) {
  menuToggle.addEventListener("click", () => {
    const isExpanded =
      menuToggle.getAttribute("aria-expanded") === "true";

    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute(
      "aria-label",
      isExpanded ? "メニューを開く" : "メニューを閉じる"
    );
    globalNav.classList.toggle("is-open", !isExpanded);
  });

  globalNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "メニューを開く");
      globalNav.classList.remove("is-open");
    });
  });
}

// 予約フォームの入力チェック
const reservationForm = document.querySelector("#reservation-form");

if (reservationForm) {
  const fieldIds = [
    "guest-name",
    "guest-email",
    "guest-phone",
    "checkin",
    "checkout",
    "room-choice"
  ];

  const requests = document.querySelector("#requests");
  const count = document.querySelector("#requests-count");
  const feedback = document.querySelector("#form-feedback");

  requests.addEventListener("input", () => {
    count.textContent = requests.value.length;
  });

  function setError(id, message) {
    const input = document.getElementById(id);
    document.getElementById(id + "-error").textContent = message;

    if (message) {
      input.setAttribute("aria-invalid", "true");
    } else {
      input.removeAttribute("aria-invalid");
    }
  }

  fieldIds.forEach((id) => {
    const input = document.getElementById(id);

    input.addEventListener("input", () => setError(id, ""));
    input.addEventListener("change", () => setError(id, ""));
  });

  reservationForm.addEventListener("submit", (event) => {
    event.preventDefault();

    feedback.textContent = "";
    fieldIds.forEach((id) => setError(id, ""));

    // 入力値の取得
    const name = document.getElementById("guest-name").value.trim();
    const email = document.getElementById("guest-email").value.trim();
    const phone = document.getElementById("guest-phone").value.trim();
    const checkin = document.getElementById("checkin").value;
    const checkout = document.getElementById("checkout").value;
    const room = document.getElementById("room-choice").value;
    const requestText = requests.value;

    // コンソールに入力内容を表示
    console.log("===== 予約フォームの入力内容 =====");
    console.log("お名前：", name);
    console.log("メールアドレス：", email);
    console.log("電話番号：", phone);
    console.log("チェックイン日：", checkin);
    console.log("チェックアウト日：", checkout);
    console.log("お部屋：", room);
    console.log("ご要望など：", requestText);

    // 入力チェック
    if (!name) {
      setError("guest-name", "お名前を入力してください。");
    }

    if (!email) {
      setError("guest-email", "メールアドレスを入力してください。");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("guest-email", "正しいメールアドレスを入力してください。");
    }

    if (!phone) {
      setError("guest-phone", "電話番号を入力してください。");
    } else if (
      !/^[0-9-]+$/.test(phone) ||
      !/^(?:0\d{9,10}|0\d{1,4}-\d{1,4}-\d{3,4})$/.test(phone) ||
      ![10, 11].includes(phone.replace(/-/g, "").length)
    ) {
      setError(
        "guest-phone",
        "電話番号は数字とハイフンで10〜11桁の形式で入力してください。"
      );
    }

    if (!checkin) {
      setError("checkin", "チェックイン日を選択してください。");
    }

    if (!checkout) {
      setError("checkout", "チェックアウト日を選択してください。");
    } else if (checkin && checkout <= checkin) {
      setError(
        "checkout",
        "チェックアウト日はチェックイン日より後の日付にしてください。"
      );
    }

    if (!room) {
      setError("room-choice", "お部屋を選択してください。");
    }

    if (requestText.length > 500) {
      setError(
        "requests",
        "ご要望は500文字以内で入力してください。"
      );
    }

    // コンソールにチェック結果を表示
    console.log("===== 入力チェック結果 =====");

    let hasError = false;

    const checkIds = [...fieldIds, "requests"];

    checkIds.forEach((id) => {
      const input = document.getElementById(id);
      const errorElement = document.getElementById(id + "-error");
      const errorMessage = errorElement ? errorElement.textContent : "";

      if (errorMessage) {
        console.log(`${id}：NG（${errorMessage}）`);
        hasError = true;
      } else {
        console.log(`${id}：OK`);
      }
    });

    console.log("フォーム全体：", hasError ? "NG" : "OK");
    console.log("===== チェック終了 =====");

    if (hasError) {
      const firstInvalid = checkIds
        .map((id) => document.getElementById(id))
        .find((el) => el.getAttribute("aria-invalid") === "true");

      if (firstInvalid) firstInvalid.focus();
      return;
    }

    feedback.textContent =
      "入力内容のチェックが完了しました。※これはデモフォームです。予約情報は送信・保存されません。";
  });
}
