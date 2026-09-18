// Sincroniza los videos "subidos" entre todos los que tengan la página abierta,
// usando la tabla "uploads" de Supabase. Si Supabase no está disponible (por
// ejemplo, abriendo los archivos localmente sin internet), cae de vuelta a
// localStorage para que el sitio siga funcionando igual que antes.

const CornDB = {
  videos: [],
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

async function refreshCornDB() {
  const { data, error } = await supabaseClient
    .from("uploads")
    .select("data")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    console.warn("No se pudo leer Supabase, usando localStorage.", error);
    if (!CornDB.ready) CornDB.videos = loadUploads();
  } else {
    CornDB.videos = data.map((row) => row.data);
  }
  CornDB.ready = true;
  if (CornDB.onChange) CornDB.onChange();
}

async function initCornDB() {
  if (!supabaseClient) {
    CornDB.videos = loadUploads();
    CornDB.ready = true;
    if (CornDB.onChange) CornDB.onChange();
    return;
  }

  await refreshCornDB();

  supabaseClient
    .channel("uploads-changes")
    .on("postgres_changes", { event: "*", schema: "public", table: "uploads" }, refreshCornDB)
    .subscribe();
}

async function publishUpload(video) {
  if (supabaseClient) {
    const { error } = await supabaseClient
      .from("uploads")
      .upsert({ id: video.id, data: video });
    if (error) {
      console.warn("No se pudo publicar en Supabase, guardando local.", error);
      addUpload(video);
      CornDB.videos = [video, ...CornDB.videos];
      if (CornDB.onChange) CornDB.onChange();
    }
    // La suscripción realtime se encarga de refrescar para todos, incluido este viewer.
  } else {
    addUpload(video);
    CornDB.videos = [video, ...CornDB.videos];
    if (CornDB.onChange) CornDB.onChange();
  }
}

initCornDB();
