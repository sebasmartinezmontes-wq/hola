// Persistencia local (localStorage) para que los comentarios que escribes
// y tu perfil de "usuario" sobrevivan a un refresco de página.
// Todo vive solo en tu navegador: no hay servidor ni base de datos real.

const LS_KEYS = {
  profile: "cornhub_profile",
  comments: "cornhub_comments", // { [videoId]: [comment, ...] }
  subs: "cornhub_subscriptions", // [channelName, ...]
  uploads: "cornhub_uploads", // [video, ...] subidos sin sincronización disponible
};

// ---------- Videos "subidos" (respaldo local si Supabase no está disponible) ----------
function loadUploads() {
  try {
    const raw = localStorage.getItem(LS_KEYS.uploads);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function addUpload(video) {
  const uploads = loadUploads();
  uploads.unshift(video);
  try {
    localStorage.setItem(LS_KEYS.uploads, JSON.stringify(uploads));
  } catch (e) {}
}

function getAllVideos() {
  if (typeof CornDB !== "undefined" && CornDB.ready) {
    return CornDB.videos.concat(VIDEOS);
  }
  return loadUploads().concat(VIDEOS);
}

function getAnyVideoById(id) {
  if (typeof SECRET_VIDEO !== "undefined" && id === SECRET_VIDEO.id) return SECRET_VIDEO;
  return getAllVideos().find((v) => v.id === id);
}

function getAnyVideosByChannel(name) {
  return getAllVideos().filter((v) => v.channel.name === name);
}

function loadProfile() {
  try {
    const raw = localStorage.getItem(LS_KEYS.profile);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { name: "Tú", avatar: "🙂" };
}

function saveProfile(profile) {
  try {
    localStorage.setItem(LS_KEYS.profile, JSON.stringify(profile));
  } catch (e) {}
}

function loadExtraComments(videoId) {
  try {
    const raw = localStorage.getItem(LS_KEYS.comments);
    const all = raw ? JSON.parse(raw) : {};
    return all[videoId] || [];
  } catch (e) {
    return [];
  }
}

function addExtraComment(videoId, comment) {
  try {
    const raw = localStorage.getItem(LS_KEYS.comments);
    const all = raw ? JSON.parse(raw) : {};
    all[videoId] = all[videoId] || [];
    all[videoId].unshift(comment);
    localStorage.setItem(LS_KEYS.comments, JSON.stringify(all));
  } catch (e) {}
}

function loadSubscriptions() {
  try {
    const raw = localStorage.getItem(LS_KEYS.subs);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function toggleSubscription(channelName) {
  const subs = loadSubscriptions();
  const idx = subs.indexOf(channelName);
  let nowSubscribed;
  if (idx === -1) {
    subs.push(channelName);
    nowSubscribed = true;
  } else {
    subs.splice(idx, 1);
    nowSubscribed = false;
  }
  try {
    localStorage.setItem(LS_KEYS.subs, JSON.stringify(subs));
  } catch (e) {}
  return nowSubscribed;
}

function isSubscribed(channelName) {
  return loadSubscriptions().includes(channelName);
}
