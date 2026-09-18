document.getElementById("logo-icon").innerHTML = ICON_LOGO;
document.getElementById("search-btn").innerHTML = ICON_SEARCH;
document.getElementById("intro-logo").innerHTML = ICON_LOGO;

const introSplash = document.getElementById("intro-splash");
setTimeout(() => introSplash.remove(), 2500);

document.getElementById("search-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const q = document.getElementById("search-input").value;
  window.location.href = `index.html?q=${encodeURIComponent(q)}`;
});

// El video pedido puede ser una subida compartida que todavía no llegó desde
// la base de datos: esperamos a CornDB antes de rendirnos con "no existe".
const params = new URLSearchParams(window.location.search);
const requestedId = params.get("v");
let playerStarted = false;

function tryStartPlayer() {
  if (playerStarted) return;
  const found = getAnyVideoById(requestedId);
  if (found) {
    playerStarted = true;
    startPlayer(found);
  } else if (CornDB.ready) {
    playerStarted = true;
    startPlayer(VIDEOS[0]);
  }
}

CornDB.onChange = tryStartPlayer;
tryStartPlayer();

function startPlayer(video) {
  let currentTime = 0;
  let playing = false;
  let muted = false;
  let liked = false;
  let disliked = false;
  let saved = false;
  let liveViewers = randInt(120, 9800);

  // ---------- Info de la página ----------
  document.title = `${video.title} — CornHub`;
  document.getElementById("video-title").textContent = video.title;
  document.getElementById("video-meta").textContent =
    `${formatViews(video.views)} vistas · ${timeAgo(video.daysAgo)}`;
  document.getElementById("like-count").textContent = formatViews(video.likes);
  document.getElementById("channel-avatar").innerHTML = channelAvatarHTML(video.channel);
  document.getElementById("channel-name").textContent = video.channel.name;
  document.getElementById("channel-subs").textContent = `${video.channel.subs} suscriptores`;
  document.getElementById("channel-link").href = `channel.html?name=${encodeURIComponent(video.channel.name)}`;
  document.getElementById("description-box").textContent = video.description;

  let allComments = video.comments.concat(loadExtraComments(video.id));

  function refreshMyAvatar() {
    const profile = loadProfile();
    document.getElementById("my-avatar").textContent = profile.avatar;
  }
  refreshMyAvatar();

  function renderComments() {
    document.getElementById("comments-count").textContent = `${allComments.length} comentarios`;
    const list = document.getElementById("comments-list");
    list.innerHTML = "";
    allComments.forEach((c) => {
      const el = document.createElement("div");
      el.className = "comment";
      el.innerHTML = `
        <span class="avatar">${c.avatar}</span>
        <div>
          <div class="comment-author">${c.author}<span class="comment-time">${c.time}</span></div>
          <div class="comment-text">${c.text}</div>
          <div class="comment-likes">👍 ${c.likes} &nbsp; 👎 &nbsp; Responder</div>
        </div>
      `;
      list.appendChild(el);
    });
  }
  renderComments();

  document.getElementById("comment-submit").addEventListener("click", () => {
    const input = document.getElementById("comment-input");
    const text = input.value.trim();
    if (!text) return;
    const profile = loadProfile();
    const comment = {
      author: profile.name,
      avatar: profile.avatar,
      text,
      likes: 0,
      time: "justo ahora",
    };
    allComments = [comment, ...allComments];
    addExtraComment(video.id, comment);
    input.value = "";
    renderComments();
  });

  document.getElementById("edit-profile-btn").addEventListener("click", () => {
    const profile = loadProfile();
    const name = prompt("Tu nombre para comentar:", profile.name);
    if (!name) return;
    const avatar = prompt("Tu avatar (un emoji):", profile.avatar) || profile.avatar;
    saveProfile({ name, avatar });
    refreshMyAvatar();
  });

  document.getElementById("comment-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") document.getElementById("comment-submit").click();
  });

  // ---------- Acciones ----------
  document.getElementById("like-btn").addEventListener("click", (e) => {
    liked = !liked;
    if (liked) disliked = false;
    e.currentTarget.classList.toggle("liked", liked);
    document.getElementById("dislike-btn").classList.remove("liked");
    document.getElementById("like-count").textContent = formatViews(video.likes + (liked ? 1 : 0));
  });

  document.getElementById("dislike-btn").addEventListener("click", (e) => {
    disliked = !disliked;
    if (disliked) liked = false;
    e.currentTarget.classList.toggle("liked", disliked);
    document.getElementById("like-btn").classList.remove("liked");
    document.getElementById("like-count").textContent = formatViews(video.likes);
  });

  document.getElementById("share-btn").addEventListener("click", () => {
    alert(`🌽 Enlace simulado copiado: cornhub.demo/watch?v=${video.id}`);
  });

  document.getElementById("save-btn").addEventListener("click", (e) => {
    saved = !saved;
    e.currentTarget.textContent = saved ? "✅ Guardado" : "💾 Guardar";
  });

  const subscribeBtn = document.getElementById("subscribe-btn");
  function refreshSubscribeBtn() {
    const subscribed = isSubscribed(video.channel.name);
    subscribeBtn.textContent = subscribed ? "✔ Suscrito" : "Suscribirse";
    subscribeBtn.classList.toggle("liked", subscribed);
  }
  refreshSubscribeBtn();
  subscribeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSubscription(video.channel.name);
    refreshSubscribeBtn();
  });

  // ---------- Publicación de imagen (foto en vez de video) ----------
  const imageEl = document.getElementById("player-image");
  if (video.imageUrl) {
    document.getElementById("player-canvas").style.display = "none";
    document.getElementById("player-overlay-msg").style.display = "none";
    document.getElementById("buffering-spinner").style.display = "none";
    document.getElementById("player-controls").style.display = "none";
    imageEl.style.display = "block";
    imageEl.src = video.imageUrl;
    return startSidebar();
  }

  // ---------- Reproductor real (si el video tiene un archivo subido) ----------
  const videoEl = document.getElementById("player-video");
  const isRealVideo = !!video.videoUrl;

  if (isRealVideo) {
    document.getElementById("player-canvas").style.display = "none";
    document.getElementById("player-overlay-msg").style.display = "none";
    document.getElementById("buffering-spinner").style.display = "none";
    document.getElementById("player-controls").style.display = "none";
    videoEl.style.display = "block";
    videoEl.src = video.videoUrl;
    videoEl.play().catch(() => {});
    return startSidebar();
  }

  // ---------- Reproductor simulado (canvas) ----------
  const canvas = document.getElementById("player-canvas");
  const ctx = canvas.getContext("2d");
  let angle = 0;

  function drawFrame() {
    const w = canvas.width, h = canvas.height;
    ctx.fillStyle = "#0c0f0c";
    ctx.fillRect(0, 0, w, h);

    // "Elote" giratorio hecho de granos, puramente decorativo
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(angle);

    const palette = CORN_PALETTES[video.paletteIndex % CORN_PALETTES.length];
    const cobLength = h * 0.55;
    const cobWidth = h * 0.16;
    ctx.fillStyle = palette.kernel;
    ctx.beginPath();
    ctx.ellipse(0, 0, cobLength / 2, cobWidth / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = palette.kernelDark;
    const rows = 8;
    const cols = 4;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const px = -cobLength / 2 + (r + 0.5) * (cobLength / rows);
        const py = -cobWidth / 2 + (c + 0.5) * (cobWidth / cols);
        ctx.beginPath();
        ctx.ellipse(px, py, cobLength / rows / 2.6, cobWidth / cols / 2.6, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();

    ctx.fillStyle = "rgba(255,255,255,.35)";
    ctx.font = "13px sans-serif";
    ctx.fillText(video.isLive ? "TRANSMISIÓN SIMULADA EN VIVO" : "REPRODUCCIÓN SIMULADA", 14, h - 16);

    if (playing) angle += 0.01;
  }

  function animate() {
    drawFrame();
    requestAnimationFrame(animate);
  }
  animate();

  // ---------- Control de progreso / tiempo ----------
  const spinner = document.getElementById("buffering-spinner");
  const playBtn = document.getElementById("play-btn");
  const muteBtn = document.getElementById("mute-btn");
  const progressFill = document.getElementById("progress-fill");
  const progressTrack = document.getElementById("progress-track");
  const timeLabel = document.getElementById("time-label");

  function updateTimeLabel() {
    timeLabel.textContent = `${formatDuration(Math.floor(currentTime))} / ${
      video.isLive ? "EN VIVO" : formatDuration(video.duration)
    }`;
  }
  updateTimeLabel();

  function updateProgressUI() {
    const pct = video.isLive ? 100 : Math.min(100, (currentTime / video.duration) * 100);
    progressFill.style.width = pct + "%";
  }

  function maybeBuffer() {
    if (Math.random() < 0.04) {
      spinner.style.display = "block";
      playing = false;
      setTimeout(() => {
        spinner.style.display = "none";
        playing = true;
      }, randInt(500, 1400));
    }
  }

  function tick() {
    if (playing) {
      if (!video.isLive) {
        currentTime += 1;
        if (currentTime >= video.duration) {
          currentTime = video.duration;
          playing = false;
          playBtn.innerHTML = ICON_PLAY;
        }
      } else {
        liveViewers += randInt(-15, 25);
        document.getElementById("live-viewers").textContent = `🔴 ${formatViews(Math.max(1, liveViewers))} viendo`;
      }
      updateProgressUI();
      updateTimeLabel();
      maybeBuffer();
    }
  }
  setInterval(tick, 1000);

  playBtn.innerHTML = ICON_PAUSE;
  muteBtn.innerHTML = ICON_VOLUME_ON;
  document.getElementById("fullscreen-btn").innerHTML = ICON_FULLSCREEN;

  playBtn.addEventListener("click", () => {
    playing = !playing;
    playBtn.innerHTML = playing ? ICON_PAUSE : ICON_PLAY;
  });

  muteBtn.addEventListener("click", () => {
    muted = !muted;
    muteBtn.innerHTML = muted ? ICON_VOLUME_OFF : ICON_VOLUME_ON;
  });

  progressTrack.addEventListener("click", (e) => {
    if (video.isLive) return;
    const rect = progressTrack.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    currentTime = Math.max(0, Math.min(video.duration, pct * video.duration));
    updateProgressUI();
    updateTimeLabel();
  });

  document.getElementById("fullscreen-btn").addEventListener("click", () => {
    const player = document.getElementById("player");
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      player.requestFullscreen?.();
    }
  });

  // autoplay simulado al cargar
  playing = true;

  startSidebar();

  // ---------- Sidebar de recomendados ----------
  function startSidebar() {
    const sidebarList = document.getElementById("sidebar-list");
    const recommended = getAllVideos().filter((v) => v.id !== video.id)
      .sort((a, b) => (a.category === video.category ? -1 : 0) - (b.category === video.category ? -1 : 0))
      .slice(0, 10);

    recommended.forEach((v) => {
      const el = document.createElement("a");
      el.href = `watch.html?v=${v.id}`;
      el.className = "side-card";
      el.innerHTML = `
        <div class="side-thumb" style="background:${v.gradient}">
          <div class="corn-illustration">${cornSVG(v.paletteIndex)}</div>
          ${categoryIconBadge(v.icon)}
          <div class="ch-watermark">${ICON_CH_WATERMARK}</div>
          <span class="duration-badge">${v.isLive ? "LIVE" : formatDuration(v.duration)}</span>
        </div>
        <div class="side-info">
          <div class="card-title">${v.title}</div>
          <div class="card-meta">${v.channel.name}</div>
          <div class="card-meta">${formatViews(v.views)} vistas · ${timeAgo(v.daysAgo)}</div>
        </div>
      `;
      sidebarList.appendChild(el);
    });
  }
}
