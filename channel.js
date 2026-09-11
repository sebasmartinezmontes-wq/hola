document.getElementById("logo-icon").innerHTML = ICON_LOGO;
document.getElementById("search-btn").innerHTML = ICON_SEARCH;

document.getElementById("search-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const q = document.getElementById("search-input").value;
  window.location.href = `index.html?q=${encodeURIComponent(q)}`;
});

const params = new URLSearchParams(window.location.search);
const account = loadAccount();
const channelName = params.get("name") || (account && account.name) || VIDEOS[0].channel.name;
const isMyChannel = account && account.name === channelName;

document.title = `${channelName} — CornHub`;

const subBtn = document.getElementById("subscribe-btn");
if (isMyChannel) {
  subBtn.style.display = "none";
} else {
  function refreshSubBtn() {
    const subscribed = isSubscribed(channelName);
    subBtn.textContent = subscribed ? "✔ Suscrito" : "Suscribirse";
    subBtn.classList.toggle("liked", subscribed);
  }
  refreshSubBtn();
  subBtn.addEventListener("click", () => {
    toggleSubscription(channelName);
    refreshSubBtn();
  });
}

function renderChannel() {
  const channelVideos = getAnyVideosByChannel(channelName);
  const channelInfo = isMyChannel
    ? account
    : channelVideos[0] ? channelVideos[0].channel : getChannelByName(channelName);

  document.getElementById("channel-avatar").textContent = channelInfo ? channelInfo.emoji : "🌽";
  document.getElementById("channel-name").textContent = channelName;
  document.getElementById("channel-subs").textContent = channelInfo
    ? `${channelInfo.subs} suscriptores · ${channelVideos.length} videos`
    : "0 videos";

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

renderChannel();
CornDB.onChange = renderChannel;
