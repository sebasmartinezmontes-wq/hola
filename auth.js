// Sesión real de usuario vía Supabase Auth + tabla "profiles" (nombre,
// avatar y banner). Si Supabase no está disponible, no hay sesión posible.

const CornAuth = {
  user: null,
  profile: null,
  ready: false,
  _onChange: null,
  set onChange(fn) {
    this._onChange = fn;
    if (this.ready && fn) fn();
  },
  get onChange() {
    return this._onChange;
  },
};

async function loadProfileRow(userId) {
  const { data, error } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) {
    console.warn("No se pudo cargar el perfil.", error);
    return null;
  }
  return data;
}

async function refreshCornAuth(session) {
  CornAuth.user = session ? session.user : null;
  CornAuth.profile = CornAuth.user ? await loadProfileRow(CornAuth.user.id) : null;
  CornAuth.ready = true;
  renderAuthSlot();
  if (CornAuth.onChange) CornAuth.onChange();
}

async function initCornAuth() {
  if (!supabaseClient) {
    CornAuth.ready = true;
    renderAuthSlot();
    if (CornAuth.onChange) CornAuth.onChange();
    return;
  }

  const { data } = await supabaseClient.auth.getSession();
  await refreshCornAuth(data.session);

  supabaseClient.auth.onAuthStateChange((_event, session) => {
    refreshCornAuth(session);
  });
}

async function logoutAccount() {
  if (supabaseClient) await supabaseClient.auth.signOut();
}

function avatarInnerHTML(entity) {
  if (entity && entity.avatar_url) return `<img src="${entity.avatar_url}" alt="" />`;
  if (entity && entity.avatarUrl) return `<img src="${entity.avatarUrl}" alt="" />`;
  return (entity && entity.emoji) || "🌽";
}

function renderAuthSlot() {
  const slot = document.getElementById("auth-slot");
  if (!slot || !CornAuth.ready) return;

  if (!CornAuth.user || !CornAuth.profile) {
    slot.innerHTML = `<a href="login.html" class="auth-login-btn">Iniciar sesión</a>`;
    return;
  }

  const profile = CornAuth.profile;
  slot.innerHTML = `
    <div class="auth-box">
      <a href="channel.html?name=${encodeURIComponent(profile.name)}" class="auth-avatar" title="Mi canal">${avatarInnerHTML(profile)}</a>
      <div class="auth-menu">
        <div class="auth-menu-name">${profile.name}</div>
        <a href="channel.html?name=${encodeURIComponent(profile.name)}">Mi canal</a>
        <a href="upload.html">Subir video</a>
        <button id="logout-btn">Cerrar sesión</button>
      </div>
    </div>
  `;

  document.getElementById("logout-btn").addEventListener("click", async () => {
    await logoutAccount();
    window.location.href = "index.html";
  });
}

initCornAuth();

// El botón "Subir" del home requiere sesión iniciada.
document.addEventListener("DOMContentLoaded", () => {
  const uploadBtn = document.getElementById("upload-btn");
  if (uploadBtn) {
    uploadBtn.addEventListener("click", () => {
      window.location.href = CornAuth.user ? "upload.html" : "login.html";
    });
  }
});
