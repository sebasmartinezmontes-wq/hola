const account = loadAccount();
if (!account) {
  window.location.href = "login.html";
}

document.getElementById("logo-icon").innerHTML = ICON_LOGO;

const select = document.getElementById("cat-select");
CATEGORIES.filter((c) => c !== "Todos").forEach((cat) => {
  const opt = document.createElement("option");
  opt.value = cat;
  opt.textContent = cat;
  select.appendChild(opt);
});

document.getElementById("upload-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("title-input").value.trim();
  if (!title) return;
  const category = select.value;

  const progressWrap = document.getElementById("upload-progress-wrap");
  const progressFill = document.getElementById("upload-progress-fill");
  const submitBtn = document.getElementById("upload-submit-btn");
  progressWrap.style.display = "block";
  submitBtn.disabled = true;
  submitBtn.textContent = "Subiendo...";

  let pct = 0;
  const timer = setInterval(() => {
    pct += randInt(8, 20);
    progressFill.style.width = Math.min(pct, 100) + "%";
    if (pct >= 100) {
      clearInterval(timer);
      setTimeout(publishVideo, 400);
    }
  }, 220);

  async function publishVideo() {
    const style = CATEGORY_STYLE[category] || CATEGORY_STYLE["Documental"];
    const id = "u" + Date.now();
    const video = {
      id,
      title,
      category,
      channel: { name: account.name, emoji: account.emoji, subs: account.subs },
      gradient: style.gradient,
      paletteIndex: style.palette,
      icon: style.icon,
      views: 0,
      likes: 0,
      duration: randInt(20, 300),
      daysAgo: 0,
      isLive: false,
      description: `Video subido por ${account.name} 🌽\n\nRecuerda: esta subida es 100% simulada, no hay archivo real ni servidor detrás.`,
      comments: [],
    };
    await publishUpload(video);
    window.location.href = `watch.html?v=${id}`;
  }
});
