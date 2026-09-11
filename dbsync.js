// Sincroniza los videos "subidos" entre todos los que tengan la página abierta,
// usando la base de datos del Artifact. Si no está disponible (por ejemplo,
// abriendo los archivos localmente en tu compu), cae de vuelta a localStorage
// para que el sitio siga funcionando igual que antes.

const CornDB = {
  videos: [],
  ready: false,
  db: null,
  _onChange: null,
  set onChange(fn) {
    this._onChange = fn;
    if (this.ready && fn) fn();
  },
  get onChange() {
    return this._onChange;
  },
};

async function initCornDB() {
  if (typeof claude === "undefined" || !claude.use) {
    // No estamos corriendo dentro del visor de Artifacts (ej. archivo local).
    CornDB.videos = loadUploads();
    CornDB.ready = true;
    if (CornDB.onChange) CornDB.onChange();
    return;
  }

  try {
    const db = await claude.use("db");
    if (!db) {
      CornDB.videos = loadUploads();
      CornDB.ready = true;
      if (CornDB.onChange) CornDB.onChange();
      return;
    }

    CornDB.db = db;
    db.collection("uploads")
      .limit(200)
      .onSnapshot(
        (snap) => {
          CornDB.videos = snap.docs.map((d) => d.data());
          CornDB.ready = true;
          if (CornDB.onChange) CornDB.onChange();
        },
        () => {
          // Suscripción caída: usa lo último que sepamos + copia local.
          if (!CornDB.ready) {
            CornDB.videos = loadUploads();
            CornDB.ready = true;
            if (CornDB.onChange) CornDB.onChange();
          }
        }
      );
  } catch (e) {
    CornDB.videos = loadUploads();
    CornDB.ready = true;
    if (CornDB.onChange) CornDB.onChange();
  }
}

async function publishUpload(video) {
  if (CornDB.db) {
    await CornDB.db.collection("uploads").doc(video.id).set(video);
    // onSnapshot se encarga de refrescar CornDB.videos para todos, incluido este viewer.
  } else {
    addUpload(video);
    CornDB.videos = [video, ...CornDB.videos];
    if (CornDB.onChange) CornDB.onChange();
  }
}

initCornDB();
