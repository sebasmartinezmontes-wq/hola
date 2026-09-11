// Barra de sesión simulada: se repite en todas las páginas.
// No hay servidor: "iniciar sesión" solo guarda un nombre/avatar en este navegador.

function renderAuthSlot() {
  const slot = document.getElementById("auth-slot");
  if (!slot) return;
  const account = loadAccount();

  if (!account) {
    slot.innerHTML = `<a href="login.html" class="auth-login-btn">Iniciar sesión</a>`;
    return;
  }

  slot.innerHTML = `
    <div class="auth-box">
      <a href="channel.html?name=${encodeURIComponent(account.name)}" class="auth-avatar" title="Mi canal">${account.emoji}</a>
      <div class="auth-menu">
        <div class="auth-menu-name">${account.name}</div>
        <a href="channel.html?name=${encodeURIComponent(account.name)}">Mi canal</a>
        <a href="upload.html">Subir video</a>
        <button id="logout-btn">Cerrar sesión</button>
      </div>
    </div>
  `;

  document.getElementById("logout-btn").addEventListener("click", () => {
    logoutAccount();
    renderAuthSlot();
    window.location.href = "index.html";
  });
}

renderAuthSlot();

// El botón "Subir" del home requiere sesión iniciada.
document.addEventListener("DOMContentLoaded", () => {
  const uploadBtn = document.getElementById("upload-btn");
  if (uploadBtn) {
    uploadBtn.addEventListener("click", () => {
      window.location.href = loadAccount() ? "upload.html" : "login.html";
    });
  }
});
