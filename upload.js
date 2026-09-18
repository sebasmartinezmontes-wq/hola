document.getElementById("logo-icon").innerHTML = ICON_LOGO;

let formReady = false;
CornAuth.onChange = () => {
  if (!CornAuth.ready) return;
  if (!CornAuth.user || !CornAuth.profile) {
    window.location.href = "login.html";
    return;
  }
  if (!formReady) {
    formReady = true;
    setupUploadForm();
  }
};

const select = document.getElementById("cat-select");
CATEGORIES.filter((c) => c !== "Todos").forEach((cat) => {
  const opt = document.createElement("option");
  opt.value = cat;
  opt.textContent = cat;
  select.appendChild(opt);
});

// Sube el archivo directo a la API de Supabase Storage para poder mostrar
// progreso real (el SDK de supabase-js no expone eventos de progreso).
function uploadVideoFile(file, path, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${SUPABASE_URL}/storage/v1/object/videos/${encodeURIComponent(path)}`);
    xhr.setRequestHeader("apikey", SUPABASE_KEY);
    xhr.setRequestHeader("Authorization", `Bearer ${SUPABASE_KEY}`);
    xhr.setRequestHeader("Content-Type", file.type || "video/mp4");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(`${SUPABASE_URL}/storage/v1/object/public/videos/${path}`);
      } else {
        reject(new Error(`No se pudo subir el video (código ${xhr.status})`));
      }
    };
    xhr.onerror = () => reject(new Error("Error de red al subir el video"));
    xhr.send(file);
  });
}

function setupUploadForm() {
  document.getElementById("upload-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("title-input").value.trim();
    const file = document.getElementById("video-file-input").files[0];
    if (!title || !file) return;
    const category = select.value;
    const account = CornAuth.profile;

    const progressWrap = document.getElementById("upload-progress-wrap");
    const progressFill = document.getElementById("upload-progress-fill");
    const submitBtn = document.getElementById("upload-submit-btn");
    progressWrap.style.display = "block";
    submitBtn.disabled = true;
    submitBtn.textContent = "Subiendo...";

    const id = "u" + Date.now();
    const path = `${id}-${file.name}`;

    try {
      const videoUrl = await uploadVideoFile(file, path, (pct) => {
        progressFill.style.width = pct + "%";
      });

      const style = CATEGORY_STYLE[category] || CATEGORY_STYLE["Documental"];
      const video = {
        id,
        title,
        category,
        channel: { name: account.name, avatarUrl: account.avatar_url, subs: account.subs },
        gradient: style.gradient,
        paletteIndex: style.palette,
        icon: style.icon,
        views: 0,
        likes: 0,
        duration: randInt(20, 300),
        daysAgo: 0,
        isLive: false,
        videoUrl,
        description: `Video subido por ${account.name} 🌽`,
        comments: [],
      };
      await publishUpload(video);
      window.location.href = `watch.html?v=${id}`;
    } catch (err) {
      console.error(err);
      alert("No se pudo subir el video: " + err.message);
      submitBtn.disabled = false;
      submitBtn.textContent = "Publicar";
    }
  });
}
