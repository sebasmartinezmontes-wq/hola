document.getElementById("logo-icon").innerHTML = ICON_LOGO;
document.getElementById("search-btn").innerHTML = ICON_SEARCH;

document.getElementById("search-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const q = document.getElementById("search-input").value;
  window.location.href = `index.html?q=${encodeURIComponent(q)}`;
});

const params = new URLSearchParams(window.location.search);
let channelName = params.get("name");

function renderChannel() {
  if (!CornAuth.ready) return;

  const isMyChannel = !!(CornAuth.profile && (!channelName || CornAuth.profile.name === channelName));
  if (!channelName) {
    channelName = isMyChannel ? CornAuth.profile.name : VIDEOS[0].channel.name;
  }

  document.title = `${channelName} — CornHub`;

  const subBtn = document.getElementById("subscribe-btn");
  if (isMyChannel) {
    subBtn.style.display = "none";
  } else {
    subBtn.style.display = "";
    function refreshSubBtn() {
      const subscribed = isSubscribed(channelName);
      subBtn.textContent = subscribed ? "✔ Suscrito" : "Suscribirse";
      subBtn.classList.toggle("liked", subscribed);
    }
    refreshSubBtn();
    subBtn.onclick = () => {
      toggleSubscription(channelName);
      refreshSubBtn();
    };
  }

  const channelVideos = getAnyVideosByChannel(channelName);
  const channelInfo = isMyChannel
    ? {
        emoji: "🌽",
        avatarUrl: CornAuth.profile.avatar_url,
        bannerUrl: CornAuth.profile.banner_url,
        subs: CornAuth.profile.subs,
      }
    : channelVideos[0] ? channelVideos[0].channel : getChannelByName(channelName);

  document.getElementById("channel-avatar").innerHTML = channelAvatarHTML(channelInfo);
  document.getElementById("channel-name").textContent = channelName;
  document.getElementById("channel-subs").textContent = channelInfo
    ? `${channelInfo.subs} suscriptores · ${channelVideos.length} videos`
    : "0 videos";

  const banner = document.getElementById("channel-banner");
  const bannerUrl = channelInfo && channelInfo.bannerUrl;
  banner.style.backgroundImage = bannerUrl ? `url(${bannerUrl})` : "";
  banner.classList.toggle("has-image", !!bannerUrl);

  document.getElementById("edit-channel-wrap").hidden = !isMyChannel;
  if (isMyChannel) {
    document.getElementById("edit-name-input").value = CornAuth.profile.name;
  }

  const grid = document.getElementById("video-grid");
  const empty = document.getElementById("empty-state");
  grid.innerHTML = "";
  if (channelVideos.length === 0) {
    empty.style.display = "block";
  } else {
    empty.style.display = "none";
    channelVideos.forEach((v) => grid.appendChild(makeCardEl(v)));
  }
}

CornDB.onChange = renderChannel;
CornAuth.onChange = renderChannel;

// ---------- Edición de canal (solo el dueño) ----------
document.getElementById("edit-channel-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!CornAuth.user || !supabaseClient) return;

  const saveBtn = document.getElementById("edit-channel-save-btn");
  saveBtn.disabled = true;
  saveBtn.textContent = "Guardando...";

  try {
    const newName = document.getElementById("edit-name-input").value.trim() || CornAuth.profile.name;
    const avatarFile = document.getElementById("edit-avatar-input").files[0];
    const bannerFile = document.getElementById("edit-banner-input").files[0];
    const updates = { name: newName };

    if (avatarFile) {
      const path = `${CornAuth.user.id}/${Date.now()}-${avatarFile.name}`;
      const { error } = await supabaseClient.storage.from("avatars").upload(path, avatarFile, { upsert: true });
      if (error) throw error;
      updates.avatar_url = `${SUPABASE_URL}/storage/v1/object/public/avatars/${path}`;
    }
    if (bannerFile) {
      const path = `${CornAuth.user.id}/${Date.now()}-${bannerFile.name}`;
      const { error } = await supabaseClient.storage.from("banners").upload(path, bannerFile, { upsert: true });
      if (error) throw error;
      updates.banner_url = `${SUPABASE_URL}/storage/v1/object/public/banners/${path}`;
    }

    const { error: updateError } = await supabaseClient.from("profiles").update(updates).eq("id", CornAuth.user.id);
    if (updateError) throw updateError;

    CornAuth.profile = { ...CornAuth.profile, ...updates };
    channelName = CornAuth.profile.name;
    history.replaceState(null, "", `channel.html?name=${encodeURIComponent(channelName)}`);
    renderChannel();
    renderAuthSlot();
  } catch (err) {
    alert("No se pudo guardar: " + err.message);
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = "Guardar cambios";
  }
});
