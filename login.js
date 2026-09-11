document.getElementById("logo-icon").innerHTML = ICON_LOGO;

const AVATAR_CHOICES = ["🌽", "🌶️", "🍿", "🧑‍🌾", "🎬", "🎮", "🎧", "⚽", "👻", "🎨", "🍦", "🐔"];

const picker = document.getElementById("avatar-picker");
let selectedAvatar = AVATAR_CHOICES[0];

AVATAR_CHOICES.forEach((emoji, i) => {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "avatar-choice" + (i === 0 ? " selected" : "");
  btn.textContent = emoji;
  btn.addEventListener("click", () => {
    selectedAvatar = emoji;
    document.querySelectorAll(".avatar-choice").forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");
  });
  picker.appendChild(btn);
});

// Si ya había una cuenta, precarga sus datos.
const existing = loadAccount();
if (existing) {
  document.getElementById("name-input").value = existing.name;
  selectedAvatar = existing.emoji;
}

document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name-input").value.trim();
  if (!name) return;

  const account = existing && existing.name === name
    ? { ...existing, emoji: selectedAvatar }
    : { name, emoji: selectedAvatar, subs: String(Math.floor(Math.random() * 40)) };

  saveAccount(account);
  window.location.href = `channel.html?name=${encodeURIComponent(name)}`;
});
