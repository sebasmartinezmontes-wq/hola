// Muestra la foto de perfil real del canal si la tiene, o su emoji si no.
function channelAvatarHTML(channel) {
  if (channel && channel.avatarUrl) return `<img src="${channel.avatarUrl}" alt="" />`;
  return (channel && channel.emoji) || "🌽";
}

// Construye la tarjeta de video usada tanto en el home como en la página de canal.
function makeCardEl(video) {
  const card = document.createElement("div");
  card.className = "card";

  const progress = randInt(0, 60);
  const isImage = !!video.imageUrl;
  const thumbInner = isImage
    ? `<img src="${video.imageUrl}" alt="" style="width:100%;height:100%;object-fit:cover;" />`
    : `<div class="corn-illustration">${cornSVG(video.paletteIndex)}</div>`;

  card.innerHTML = `
    <a href="watch.html?v=${video.id}" class="thumb-wrap" style="background:${video.gradient}">
      ${video.isLive ? '<span class="live-badge">EN VIVO</span>' : ""}
      ${thumbInner}
      ${categoryIconBadge(video.icon)}
      <div class="ch-watermark">${ICON_CH_WATERMARK}</div>
      ${isImage ? "" : `<div class="play-overlay">${ICON_PLAY_CIRCLE}</div>`}
      <span class="duration-badge">${isImage ? "📷" : video.isLive ? "LIVE" : formatDuration(video.duration)}</span>
      ${!video.isLive && !isImage && Math.random() < 0.3 ? `<div class="fake-progress" style="width:${progress}%"></div>` : ""}
    </a>
    <div class="card-body">
      <a href="watch.html?v=${video.id}"><h3 class="card-title">${video.title}</h3></a>
      <a href="channel.html?name=${encodeURIComponent(video.channel.name)}" class="channel-row">
        <span class="avatar">${channelAvatarHTML(video.channel)}</span>
        <span>${video.channel.name}</span>
      </a>
      <div class="card-meta">${formatViews(video.views)} vistas · ${timeAgo(video.daysAgo)}</div>
    </div>
  `;
  return card;
}
