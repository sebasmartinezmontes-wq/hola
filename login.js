document.getElementById("logo-icon").innerHTML = ICON_LOGO;

let mode = "login"; // "login" | "signup"

const form = document.getElementById("auth-form");
const title = document.getElementById("auth-title");
const note = document.getElementById("auth-note");
const nameField = document.getElementById("name-field");
const nameInput = document.getElementById("name-input");
const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");
const errorEl = document.getElementById("auth-error");
const submitBtn = document.getElementById("auth-submit-btn");
const switchBtn = document.getElementById("auth-switch-btn");

function applyMode() {
  const isSignup = mode === "signup";
  title.textContent = isSignup ? "Crear cuenta" : "Iniciar sesión";
  note.textContent = isSignup
    ? "Elegí el nombre de tu canal y creá tu cuenta con correo y contraseña."
    : "Entrá con tu correo y contraseña.";
  nameField.style.display = isSignup ? "block" : "none";
  nameInput.required = isSignup;
  submitBtn.textContent = isSignup ? "Crear cuenta" : "Iniciar sesión";
  switchBtn.textContent = isSignup ? "¿Ya tenés cuenta? Iniciá sesión" : "¿No tenés cuenta? Creá una";
  errorEl.style.display = "none";
}
applyMode();

switchBtn.addEventListener("click", () => {
  mode = mode === "login" ? "signup" : "login";
  applyMode();
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorEl.style.display = "none";

  if (!supabaseClient) {
    errorEl.textContent = "El inicio de sesión no está disponible ahora mismo.";
    errorEl.style.display = "block";
    return;
  }

  const email = emailInput.value.trim();
  const password = passwordInput.value;
  submitBtn.disabled = true;

  try {
    if (mode === "signup") {
      const name = nameInput.value.trim();
      if (!name) throw new Error("Ponele un nombre a tu canal.");

      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error) throw error;

      if (data.session) {
        window.location.href = `channel.html?name=${encodeURIComponent(name)}`;
      } else {
        mode = "login";
        applyMode();
        note.textContent = "¡Listo! Revisá tu correo para confirmar la cuenta y después iniciá sesión.";
      }
    } else {
      const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (error) throw error;
      window.location.href = "index.html";
    }
  } catch (err) {
    errorEl.textContent = err.message || "Algo salió mal.";
    errorEl.style.display = "block";
  } finally {
    submitBtn.disabled = false;
  }
});
