// Easter eggs sueltos, sin relación con ninguna persona real. Solo diversión.

// ---------- Mensaje en la consola ----------
console.log(
  "%c   _\n" +
  "  //\\\n" +
  " ||  ||   CornHub\n" +
  " ||()||   Puro maiz, cero drama.\n" +
  " ||  ||   Si estas leyendo esto... bienvenido al codigo fuente. 🌽\n" +
  "  \\\\//    Prueba el codigo Konami en cualquier pagina.\n" +
  "   \"\"",
  "color:#ffcf3f;font-family:monospace;font-size:12px;"
);

// ---------- Lluvia de elotes (código Konami) ----------
const KONAMI_SEQUENCE = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];
let konamiProgress = 0;

document.addEventListener("keydown", (e) => {
  const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  if (key === KONAMI_SEQUENCE[konamiProgress]) {
    konamiProgress++;
    if (konamiProgress === KONAMI_SEQUENCE.length) {
      konamiProgress = 0;
      startCornRain();
    }
  } else {
    konamiProgress = key === KONAMI_SEQUENCE[0] ? 1 : 0;
  }
});

function startCornRain() {
  const layer = document.createElement("div");
  layer.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden;";
  document.body.appendChild(layer);

  showToast("🌽 ¡Código secreto activado! Lluvia de elotes 🌽");

  for (let i = 0; i < 45; i++) {
    const kernel = document.createElement("div");
    kernel.textContent = "🌽";
    const left = Math.random() * 100;
    const duration = 1.8 + Math.random() * 1.6;
    const delay = Math.random() * 0.8;
    const size = 18 + Math.random() * 22;
    kernel.style.cssText = `
      position:absolute; top:-40px; left:${left}vw; font-size:${size}px;
      animation: cornhub-fall ${duration}s linear ${delay}s forwards;
    `;
    layer.appendChild(kernel);
  }

  setTimeout(() => layer.remove(), 4000);
}

const fallStyle = document.createElement("style");
fallStyle.textContent = `
@keyframes cornhub-fall {
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(110vh) rotate(360deg); opacity: .9; }
}
.cornhub-toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  background: #1e1e1e;
  border: 1px solid #ff9900;
  color: #fff;
  padding: 10px 18px;
  border-radius: 20px;
  font-size: 13px;
  z-index: 10000;
  opacity: 0;
  transition: opacity .25s ease, transform .25s ease;
  white-space: nowrap;
}
.cornhub-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
`;
document.head.appendChild(fallStyle);

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "cornhub-toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2600);
}

// ---------- Truco del logo: 5 clics rápidos ----------
document.addEventListener("DOMContentLoaded", () => {
  const logo = document.querySelector("a.logo");
  if (!logo) return;

  let clickCount = 0;
  let clickTimer = null;

  logo.addEventListener("click", (e) => {
    e.preventDefault();
    clickCount++;
    clearTimeout(clickTimer);

    clickTimer = setTimeout(() => {
      if (clickCount >= 5) {
        logo.classList.add("logo-spin");
        triggerLogoVideo();
        setTimeout(() => logo.classList.remove("logo-spin"), 1200);
      } else {
        window.location.href = logo.getAttribute("href");
      }
      clickCount = 0;
    }, 350);
  });
});

// ---------- Easter egg: 5 clics en el logo -> video sorpresa ----------
const videoEggStyle = document.createElement("style");
videoEggStyle.textContent = `
.cornhub-video-overlay {
  position: fixed;
  inset: 0;
  z-index: 10002;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,.85);
  opacity: 0;
  transition: opacity .25s ease;
}
.cornhub-video-overlay.show { opacity: 1; }
.cornhub-video-box {
  position: relative;
  max-width: 90vw;
  max-height: 85vh;
}
.cornhub-video-box video {
  display: block;
  max-width: 90vw;
  max-height: 85vh;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0,0,0,.6);
  background: #000;
}
.cornhub-video-close {
  position: absolute;
  top: -14px;
  right: -14px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #ff9900;
  color: #1e1e1e;
  border: none;
  font-size: 18px;
  font-weight: 900;
  cursor: pointer;
  line-height: 1;
}
`;
document.head.appendChild(videoEggStyle);

function triggerLogoVideo() {
  const overlay = document.createElement("div");
  overlay.className = "cornhub-video-overlay";
  overlay.innerHTML = `
    <div class="cornhub-video-box">
      <button class="cornhub-video-close" title="Cerrar">×</button>
      <video src="https://dvfubytpxgarjfethedj.supabase.co/storage/v1/object/public/videos/eastereggs/logo-secret.mp4" autoplay controls></video>
    </div>
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add("show"));

  function closeOverlay() {
    overlay.classList.remove("show");
    document.removeEventListener("keydown", onKeydown);
    setTimeout(() => overlay.remove(), 250);
  }
  function onKeydown(e) {
    if (e.key === "Escape") closeOverlay();
  }
  document.addEventListener("keydown", onKeydown);

  overlay.querySelector(".cornhub-video-close").addEventListener("click", closeOverlay);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeOverlay();
  });
  overlay.querySelector("video").addEventListener("ended", closeOverlay);
  overlay.querySelector("video").addEventListener("error", () => {
    showToast("🌽 No se pudo cargar el video sorpresa");
  });
}

const spinStyle = document.createElement("style");
spinStyle.textContent = `
.logo-spin .kernel { display: inline-flex; animation: cornhub-spin .6s linear; }
@keyframes cornhub-spin { to { transform: rotate(360deg); } }
`;
document.head.appendChild(spinStyle);

// ---------- Easter egg: buscar "carniceria chapala" -> cerdito diciendo YUPI ----------
function normalizeText(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

const pigStyle = document.createElement("style");
pigStyle.textContent = `
.cornhub-pig-overlay {
  position: fixed;
  inset: 0;
  z-index: 10001;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  pointer-events: none;
  background: rgba(0,0,0,.35);
  opacity: 0;
  animation: cornhub-pig-bg .2s ease forwards, cornhub-pig-bg-out .3s ease forwards 2s;
}
.cornhub-pig-emoji {
  font-size: 120px;
  animation: cornhub-pig-bounce .6s ease infinite;
  filter: drop-shadow(0 10px 12px rgba(0,0,0,.4));
}
.cornhub-pig-text {
  font-size: 42px;
  font-weight: 900;
  color: #ffcf3f;
  text-shadow: 0 3px 0 #7a1f0e, 0 0 18px rgba(255,153,0,.7);
  letter-spacing: 2px;
}
@keyframes cornhub-pig-bg { to { opacity: 1; } }
@keyframes cornhub-pig-bg-out { to { opacity: 0; } }
@keyframes cornhub-pig-bounce {
  0%, 100% { transform: translateY(0) rotate(-4deg); }
  50% { transform: translateY(-30px) rotate(4deg); }
}
`;
document.head.appendChild(pigStyle);

function triggerPigYupi() {
  const overlay = document.createElement("div");
  overlay.className = "cornhub-pig-overlay";
  overlay.innerHTML = `
    <div class="cornhub-pig-emoji">🐷</div>
    <div class="cornhub-pig-text">¡YUPI!</div>
  `;
  document.body.appendChild(overlay);
  setTimeout(() => overlay.remove(), 2400);
}

// ---------- Easter egg: buscar "gala" -> corazón roto ----------
const heartStyle = document.createElement("style");
heartStyle.textContent = `
.cornhub-heart-emoji {
  font-size: 110px;
  animation: cornhub-heart-shake .5s ease;
  filter: drop-shadow(0 10px 12px rgba(0,0,0,.4));
}
.cornhub-heart-text {
  font-size: 30px;
  font-weight: 800;
  color: #ddd;
  letter-spacing: 3px;
  text-transform: lowercase;
  opacity: .85;
}
@keyframes cornhub-heart-shake {
  0% { transform: scale(.5); opacity: 0; }
  40% { transform: scale(1.15); opacity: 1; }
  60% { transform: translateX(-6px) rotate(-3deg); }
  80% { transform: translateX(6px) rotate(3deg); }
  100% { transform: translateX(0) rotate(0deg); }
}
`;
document.head.appendChild(heartStyle);

function triggerBrokenHeart() {
  const overlay = document.createElement("div");
  overlay.className = "cornhub-pig-overlay";
  overlay.innerHTML = `
    <div class="cornhub-heart-emoji">💔</div>
    <div class="cornhub-heart-text">gala</div>
  `;
  document.body.appendChild(overlay);
  setTimeout(() => overlay.remove(), 2400);
}

let pigTriggered = false;
let heartTriggered = false;
document.addEventListener("input", (e) => {
  if (e.target && e.target.id === "search-input") {
    const normalized = normalizeText(e.target.value);

    if (normalized === "carniceria chapala") {
      if (!pigTriggered) {
        pigTriggered = true;
        triggerPigYupi();
      }
    } else {
      pigTriggered = false;
    }

    if (normalized === "gala") {
      if (!heartTriggered) {
        heartTriggered = true;
        triggerBrokenHeart();
      }
    } else {
      heartTriggered = false;
    }
  }
});
