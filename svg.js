// Iconos e ilustraciones en SVG puro (sin archivos externos), usados como
// miniaturas y controles para que el sitio se vea bien en cualquier pantalla.

const CORN_PALETTES = [
  { kernel: "#ffd94a", kernelDark: "#e0a80f", husk: "#4a7a2a", huskDark: "#2f5a18" },
  { kernel: "#fff0a8", kernelDark: "#f0c23a", husk: "#3f6b52", huskDark: "#274a37" },
  { kernel: "#ffcf3f", kernelDark: "#c98f10", husk: "#5b8f3a", huskDark: "#3a6023" },
  { kernel: "#ffe08a", kernelDark: "#d9a520", husk: "#356b5a", huskDark: "#1f4a3d" },
  { kernel: "#ffdd6b", kernelDark: "#d4a010", husk: "#6b7a2f", huskDark: "#48551d" },
  { kernel: "#fff3c2", kernelDark: "#e6b830", husk: "#4f6b2a", huskDark: "#334a19" },
  { kernel: "#ffb347", kernelDark: "#e8471c", husk: "#7a1f0e", huskDark: "#5a1508" },
  { kernel: "#5bcefa", kernelDark: "#f5a9b8", husk: "#f5a9b8", huskDark: "#5bcefa" },
];

function cornSVG(paletteIndex, opts = {}) {
  const p = CORN_PALETTES[paletteIndex % CORN_PALETTES.length];
  const kernels = [];
  const rows = 7;
  const cols = 2;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = 42 + c * 16 + (r % 2 === 0 ? 0 : 8);
      const y = 18 + r * 12;
      kernels.push(
        `<ellipse cx="${x}" cy="${y}" rx="7.5" ry="6" fill="${(r + c) % 3 === 0 ? p.kernelDark : p.kernel}" />`
      );
    }
  }

  return `
  <svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Elote ilustrado">
    <ellipse cx="55" cy="70" rx="26" ry="58" fill="${p.kernel}" />
    ${kernels.join("\n")}
    <path d="M32 30 C 8 45, 4 90, 26 118 C 18 90, 20 55, 32 30 Z" fill="${p.husk}" />
    <path d="M40 20 C 14 32, 10 78, 34 112 C 24 82, 26 46, 40 20 Z" fill="${p.huskDark}" opacity="0.85" />
    <path d="M78 34 C 100 48, 102 92, 82 116 C 92 88, 90 56, 78 34 Z" fill="${p.husk}" />
  </svg>`;
}

const ICON_PLAY_CIRCLE = `
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <circle cx="32" cy="32" r="30" fill="rgba(0,0,0,.55)" stroke="#ffcf3f" stroke-width="2"/>
  <path d="M26 20 L46 32 L26 44 Z" fill="#ffcf3f"/>
</svg>`;

const ICON_LOGO = `
<svg viewBox="0 0 100 100" width="26" height="26" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="52" cy="52" rx="22" ry="40" fill="#ffcf3f"/>
  <ellipse cx="42" cy="26" rx="6" ry="5" fill="#c98f10"/>
  <ellipse cx="58" cy="26" rx="6" ry="5" fill="#ffe08a"/>
  <ellipse cx="42" cy="40" rx="6" ry="5" fill="#ffe08a"/>
  <ellipse cx="58" cy="40" rx="6" ry="5" fill="#c98f10"/>
  <ellipse cx="42" cy="54" rx="6" ry="5" fill="#c98f10"/>
  <ellipse cx="58" cy="54" rx="6" ry="5" fill="#ffe08a"/>
  <ellipse cx="42" cy="68" rx="6" ry="5" fill="#ffe08a"/>
  <ellipse cx="58" cy="68" rx="6" ry="5" fill="#c98f10"/>
  <path d="M34 30 C 16 40, 14 74, 30 92 C 22 70, 24 48, 34 30 Z" fill="#4a7a2a"/>
  <path d="M70 30 C 88 40, 90 74, 74 92 C 82 70, 80 48, 70 30 Z" fill="#3a6023"/>
</svg>`;

const ICON_SEARCH = `<svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><line x1="15.5" y1="15.5" x2="21" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;

const ICON_UPLOAD = `<svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M12 3 L18 10 L14 10 L14 16 L10 16 L10 10 L6 10 Z" fill="currentColor"/><rect x="5" y="19" width="14" height="2" rx="1" fill="currentColor"/></svg>`;

const ICON_PLAY = `<svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg"><path d="M7 4 L20 12 L7 20 Z" fill="currentColor"/></svg>`;
const ICON_PAUSE = `<svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="4" width="5" height="16" rx="1" fill="currentColor"/><rect x="14" y="4" width="5" height="16" rx="1" fill="currentColor"/></svg>`;
const ICON_VOLUME_ON = `<svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg"><path d="M4 9 H8 L13 4 V20 L8 15 H4 Z" fill="currentColor"/><path d="M16 9 C18 11, 18 13, 16 15" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M18.5 6.5 C22 10, 22 14, 18.5 17.5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`;
const ICON_VOLUME_OFF = `<svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg"><path d="M4 9 H8 L13 4 V20 L8 15 H4 Z" fill="currentColor"/><line x1="16" y1="9" x2="22" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="22" y1="9" x2="16" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
const ICON_FULLSCREEN = `<svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M4 9 V4 H9 M15 4 H20 V9 M20 15 V20 H15 M9 20 H4 V15" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

// Íconos pequeños que distinguen la portada de cada categoría.
const CATEGORY_ICONS = {
  chili: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M8 4 C10 3, 12 4, 12 6" stroke="#3fae3f" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M9 7 C 6 9, 4 14, 8 19 C 13 22, 19 18, 18 12 C 17 7, 12 6, 9 7 Z" fill="#e8471c"/><ellipse cx="12" cy="11" rx="2" ry="3" fill="#ff8a4a" opacity=".5"/></svg>`,
  pot: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="11" width="16" height="9" rx="2" fill="#d97b29"/><rect x="2" y="9" width="20" height="3" rx="1.5" fill="#f0a04a"/><path d="M6 9 C6 4, 10 3, 12 3 C14 3, 18 4, 18 9" stroke="#f0a04a" stroke-width="2" fill="none"/><path d="M9 2 C 9 4, 10 4, 10 6 M14 2 C14 4, 15 4, 15 6" stroke="#fff" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".8"/></svg>`,
  wave: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="10" width="2.5" height="4" rx="1.2" fill="#2e7d6b"/><rect x="6" y="6" width="2.5" height="12" rx="1.2" fill="#2e7d6b"/><rect x="10" y="2" width="2.5" height="20" rx="1.2" fill="#3fae8a"/><rect x="14" y="6" width="2.5" height="12" rx="1.2" fill="#2e7d6b"/><rect x="18" y="9" width="2.5" height="6" rx="1.2" fill="#2e7d6b"/></svg>`,
  laugh: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#ffcf3f"/><circle cx="8.5" cy="10" r="1.4" fill="#3a2a05"/><circle cx="15.5" cy="10" r="1.4" fill="#3a2a05"/><path d="M6 14 C 8 19, 16 19, 18 14" stroke="#3a2a05" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
  film: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="5" width="20" height="14" rx="2" fill="#5b6bd6"/><rect x="5" y="8" width="14" height="8" fill="#0e0d1f"/><circle cx="5" cy="6" r="1" fill="#fff"/><circle cx="19" cy="6" r="1" fill="#fff"/><circle cx="5" cy="18" r="1" fill="#fff"/><circle cx="19" cy="18" r="1" fill="#fff"/></svg>`,
  wrench: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14 3 a5 5 0 0 0 -6.9 5.9 L3 13 L7 17 L11.1 12.9 A5 5 0 0 0 17 6 L14 9 L11 6 Z" fill="#7fae2b"/></svg>`,
  sprout: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 22 V12" stroke="#3fae3f" stroke-width="2"/><path d="M12 12 C 4 12, 4 4, 4 4 C 4 4, 12 4, 12 12 Z" fill="#3fae3f"/><path d="M12 15 C 20 15, 20 8, 20 8 C 20 8, 12 8, 12 15 Z" fill="#2f8a2f"/></svg>`,
  controller: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="8" width="20" height="10" rx="5" fill="#1f8ae0"/><rect x="5.5" y="11.5" width="4" height="1.6" fill="#fff"/><rect x="6.7" y="10.3" width="1.6" height="4" fill="#fff"/><circle cx="16" cy="11" r="1.2" fill="#fff"/><circle cx="18.5" cy="13.5" r="1.2" fill="#fff"/></svg>`,
  note: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="6" cy="18" r="3" fill="#8a3fe0"/><circle cx="17" cy="16" r="3" fill="#8a3fe0"/><path d="M9 18 V5 L20 3 V16" stroke="#8a3fe0" stroke-width="2" fill="none"/></svg>`,
  ball: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#fff"/><path d="M12 7 L16 10 L14.5 15 L9.5 15 L8 10 Z" fill="#111"/><path d="M12 2 V7 M12 17 V22 M2 12 H7 M17 12 H22" stroke="#3fe08a" stroke-width="1.6"/></svg>`,
  trophy: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7 4 H17 V9 A5 5 0 0 1 7 9 Z" fill="#ffcf3f"/><rect x="10.5" y="14" width="3" height="4" fill="#ffcf3f"/><rect x="8" y="18" width="8" height="2" rx="1" fill="#d4a010"/><path d="M7 5 C3 5, 3 10, 7 10" stroke="#d4a010" stroke-width="1.6" fill="none"/><path d="M17 5 C21 5, 21 10, 17 10" stroke="#d4a010" stroke-width="1.6" fill="none"/></svg>`,
  ghost: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 21 V11 a7 7 0 0 1 14 0 v10 l-2.5 -2 l-2 2 l-2 -2 l-2 2 l-2 -2 Z" fill="#e8e4f5"/><circle cx="9.5" cy="11" r="1.1" fill="#1a1a1a"/><circle cx="14.5" cy="11" r="1.1" fill="#1a1a1a"/></svg>`,
  heart: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 21 C 6 16, 2 12.5, 2 8.5 C 2 5.5, 4.5 3, 7.5 3 C 9.5 3, 11 4, 12 5.5 C 13 4, 14.5 3, 16.5 3 C 19.5 3, 22 5.5, 22 8.5 C 22 12.5, 18 16, 12 21 Z" fill="#f5a9b8"/><rect x="2" y="10" width="20" height="2.6" fill="#5bcefa"/><rect x="2" y="13.5" width="20" height="2.6" fill="#fff"/></svg>`,
};

const ICON_CH_WATERMARK = `
<svg viewBox="0 0 48 24" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="48" height="24" rx="6" fill="rgba(0,0,0,.55)"/>
  <text x="24" y="17" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-weight="800" font-size="14" fill="#ffcf3f">CH</text>
</svg>`;

function categoryIconBadge(icon) {
  const svg = CATEGORY_ICONS[icon];
  if (!svg) return "";
  return `<span class="category-badge" title="${icon}">${svg}</span>`;
}

function svgDataUri(svgString) {
  return "data:image/svg+xml;utf8," + encodeURIComponent(svgString);
}
