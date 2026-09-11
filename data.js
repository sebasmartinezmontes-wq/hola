// Datos 100% simulados. No hay archivos de video reales: todo se genera
// en el momento con canvas + temporizadores falsos para imitar un reproductor.

const CATEGORIES = [
  "Todos", "Picante", "Recetas", "ASMR", "Comedia", "Documental",
  "Tutorial", "Cultivo", "Gaming", "Música", "Deportes", "Retos", "Terror", "Orgullo",
];

const CHANNELS = [
  { name: "El Maicero Feliz", emoji: "🌽", subs: "812 K" },
  { name: "Elote Estudios", emoji: "🎬", subs: "1.4 M" },
  { name: "Cocina de Doña Chelo", emoji: "👩‍🍳", subs: "530 K" },
  { name: "AgroCorn Labs", emoji: "🧪", subs: "94 K" },
  { name: "Palomita Prod.", emoji: "🍿", subs: "2.1 M" },
  { name: "Rancho Amarillo", emoji: "🚜", subs: "268 K" },
  { name: "Elote Picante Oficial", emoji: "🌶️", subs: "1.9 M" },
  { name: "MazorcaGamer", emoji: "🎮", subs: "645 K" },
  { name: "DJ Elotazo", emoji: "🎧", subs: "310 K" },
  { name: "Cornazo FC", emoji: "⚽", subs: "455 K" },
  { name: "Retos Con Choclo", emoji: "🏆", subs: "1.1 M" },
  { name: "Leyendas del Maíz", emoji: "👻", subs: "702 K" },
  { name: "Elotes de Otro Mundo", emoji: "🛸", subs: "88 K" },
  { name: "Postres de Elote Fríos", emoji: "🍦", subs: "230 K" },
  { name: "Academia del Maíz", emoji: "📚", subs: "150 K" },
  { name: "Arte en Elote", emoji: "🎨", subs: "77 K" },
  { name: "Medianoche de Maíz", emoji: "🌙", subs: "410 K" },
  { name: "Rancho El Gallo", emoji: "🐔", subs: "192 K" },
  { name: "Elote Orgullo MX", emoji: "🏳️‍🌈", subs: "365 K" },
];

const EMOJIS = ["🌽", "🍿", "🌾", "🧑‍🌾", "🔥", "🥘", "🚜", "😂", "🌶️", "🎮", "🎧", "⚽", "🏆", "👻"];
const GRADIENTS = [
  "linear-gradient(135deg,#3a5a1f,#7fae2b)",
  "linear-gradient(135deg,#7a5c0e,#ffcf3f)",
  "linear-gradient(135deg,#1f3a3a,#2e7d6b)",
  "linear-gradient(135deg,#5a2a0e,#d97b29)",
  "linear-gradient(135deg,#2a2f5a,#5b6bd6)",
  "linear-gradient(135deg,#4a1f3a,#c93f8c)",
  "linear-gradient(135deg,#7a0e0e,#e8471c)",
  "linear-gradient(135deg,#0e2a5a,#1f8ae0)",
  "linear-gradient(135deg,#5a0e3a,#e01f8a)",
  "linear-gradient(135deg,#123312,#3fae3f)",
];

// Cada categoría tiene su propia portada: fondo, paleta de elote e ícono
// distintivo, para que las miniaturas no se vean todas iguales.
const CATEGORY_STYLE = {
  "Picante": { gradient: "linear-gradient(135deg,#5a0e0e,#e8471c)", palette: 6, icon: "chili" },
  "Recetas": { gradient: "linear-gradient(135deg,#5a2a0e,#d97b29)", palette: 3, icon: "pot" },
  "ASMR": { gradient: "linear-gradient(135deg,#1f3a3a,#2e7d6b)", palette: 1, icon: "wave" },
  "Comedia": { gradient: "linear-gradient(135deg,#5a0e3a,#e01f8a)", palette: 5, icon: "laugh" },
  "Documental": { gradient: "linear-gradient(135deg,#2a2f5a,#5b6bd6)", palette: 2, icon: "film" },
  "Tutorial": { gradient: "linear-gradient(135deg,#3a5a1f,#7fae2b)", palette: 0, icon: "wrench" },
  "Cultivo": { gradient: "linear-gradient(135deg,#123312,#3fae3f)", palette: 4, icon: "sprout" },
  "Gaming": { gradient: "linear-gradient(135deg,#0e2a5a,#1f8ae0)", palette: 2, icon: "controller" },
  "Música": { gradient: "linear-gradient(135deg,#3a0e5a,#8a3fe0)", palette: 5, icon: "note" },
  "Deportes": { gradient: "linear-gradient(135deg,#0e5a2a,#3fe08a)", palette: 4, icon: "ball" },
  "Retos": { gradient: "linear-gradient(135deg,#7a5c0e,#ffcf3f)", palette: 3, icon: "trophy" },
  "Terror": { gradient: "linear-gradient(135deg,#0a0a0f,#3a1f5a)", palette: 1, icon: "ghost" },
  "Orgullo": { gradient: "linear-gradient(135deg,#5bcefa,#f5a9b8)", palette: 7, icon: "heart" },
};

const COMMENT_POOL = [
  "esto es más real que mi vida amorosa 🌽",
  "el algoritmo me trajo aquí y no me arrepiento",
  "quién más viendo esto a las 3am",
  "el maíz nunca decepciona",
  "necesito la receta YA",
  "esto merece más vistas",
  "jajajaja el final no me lo esperaba",
  "primera vez que un elote me hace sentir algo",
  "guardado para después 📌",
  "el sonido del minuto 2 es todo",
  "esto debería ser documental oficial",
  "no puedo dejar de verlo, ayuda",
  "el nivel de picante está ilegal 🌶️🔥",
  "me arde pero no puedo parar de verlo",
  "esto necesita una segunda parte urgente",
  "el elote definitivamente ganó este reto",
  "cómo que todo en este canal es sobre maíz jajaja",
  "aquí llegué por el meme y me quedé por el contenido",
];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatViews(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(".0", "") + " M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(".0", "") + " K";
  return String(n);
}

function formatDuration(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function timeAgo(daysAgo) {
  if (daysAgo < 1) return "hace unas horas";
  if (daysAgo === 1) return "hace 1 día";
  if (daysAgo < 30) return `hace ${daysAgo} días`;
  const months = Math.floor(daysAgo / 30);
  if (months < 12) return `hace ${months} mes${months > 1 ? "es" : ""}`;
  return `hace ${Math.floor(months / 12)} año(s)`;
}

const RAW_VIDEOS = [
  // Picante 🌶️
  { title: "Elote Callejero Bañado en 5 Salsas Extremas", cat: "Picante" },
  { title: "Reto: Aguantar el Elote Más Picante del Mercado", cat: "Picante" },
  { title: "Cómo Preparar Elote Enchilado Nivel Infierno", cat: "Picante" },
  { title: "Probando Chile Habanero Directo en la Mazorca", cat: "Picante" },
  { title: "Ranking Oficial: Los Picantes Más Brutales para Elote", cat: "Picante" },

  // Tutorial
  { title: "Cómo Desgranar un Elote en 3 Segundos (IMPOSIBLE)", cat: "Tutorial" },
  { title: "Tutorial: Elote Asado Perfecto en Parrilla", cat: "Tutorial" },
  { title: "Tutorial: Palomitas Perfectas Sin Quemar Nada", cat: "Tutorial" },

  // ASMR
  { title: "ASMR: Sonido de Elote Hirviendo por 1 Hora", cat: "ASMR" },
  { title: "ASMR: Crujido de Palomitas Recién Hechas", cat: "ASMR" },
  { title: "ASMR: Untando Mantequilla en Elote Caliente", cat: "ASMR" },

  // Documental
  { title: "Documental: La Historia Secreta del Maíz", cat: "Documental" },
  { title: "Top 10 Elotes Más Grandes del Mundo", cat: "Documental" },
  { title: "El Maíz que Cambió mi Vida (Historia Real)", cat: "Documental" },

  // Recetas
  { title: "Receta: Esquites Callejeros Nivel Dios", cat: "Recetas" },
  { title: "Cómo Hacer Pozole sin Arruinar tu Cocina", cat: "Recetas" },
  { title: "Receta: Crema de Elote en 10 Minutos", cat: "Recetas" },

  // Comedia
  { title: "Mi Elote se Cayó y Fue lo Peor de mi Vida", cat: "Comedia" },
  { title: "Reaccionando a Memes de Elote", cat: "Comedia" },
  { title: "Elote vs Choclo: El Debate Que Dividió Internet", cat: "Comedia" },

  // Cultivo
  { title: "Cultivando Maíz en mi Balcón - Día 1 al 90", cat: "Cultivo" },
  { title: "Cultivo Hidropónico de Maíz Explicado", cat: "Cultivo" },

  // Gaming
  { title: "Jugando Minecraft pero Todo es de Maíz", cat: "Gaming" },
  { title: "Speedrun: Cosechar 1000 Elotes en Stardew Valley", cat: "Gaming" },
  { title: "Probando el Nuevo Mod de Elotes Gigantes", cat: "Gaming" },

  // Música
  { title: "Cover: Despacito Versión Elote (con Marimba)", cat: "Música" },
  { title: "Beat Lo-Fi Grabado Solo con Sonidos de Maíz", cat: "Música" },
  { title: "Concierto en Vivo: La Banda del Elote", cat: "Música" },

  // Deportes
  { title: "Final de la Liga de Fútbol con Elote en Vez de Balón", cat: "Deportes" },
  { title: "Entrenamiento Extremo: Cardio Cargando Costales de Maíz", cat: "Deportes" },

  // Retos
  { title: "Reto: Comer 50 Elotes en 10 Minutos", cat: "Retos" },
  { title: "24 Horas Viviendo Solo de Maíz (Reto Extremo)", cat: "Retos" },

  // Terror
  { title: "La Leyenda del Elote Maldito de Medianoche", cat: "Terror" },
  { title: "Encontré Algo Raro en mi Campo de Maíz a las 3AM", cat: "Terror" },

  // Orgullo 🏳️‍⚧️
  { title: "Elote Arcoíris Edición Orgullo", cat: "Orgullo" },
  { title: "Así Decoramos la Carroza de Elotes para el Desfile", cat: "Orgullo" },
  { title: "Receta: Esquites de Colores para Celebrar el Orgullo", cat: "Orgullo" },
];

const VIDEOS = RAW_VIDEOS.map((v, i) => {
  const channel = CHANNELS[i % CHANNELS.length];
  const views = randInt(800, 4_200_000);
  const likes = Math.round(views * (randInt(2, 9) / 100));
  const duration = randInt(35, 720);
  const daysAgo = randInt(0, 400);
  const commentCount = randInt(3, 6);
  const comments = Array.from({ length: commentCount }, (_, ci) => ({
    author: CHANNELS[(i + ci + 1) % CHANNELS.length].name,
    avatar: EMOJIS[(i + ci) % EMOJIS.length],
    text: COMMENT_POOL[randInt(0, COMMENT_POOL.length - 1)],
    likes: randInt(0, 900),
    time: timeAgo(randInt(0, daysAgo)),
  }));

  const style = CATEGORY_STYLE[v.cat] || CATEGORY_STYLE["Documental"];

  return {
    id: "v" + (i + 1),
    title: v.title,
    category: v.cat,
    emoji: EMOJIS[i % EMOJIS.length],
    gradient: style.gradient,
    paletteIndex: style.palette,
    icon: style.icon,
    channel,
    views,
    likes,
    duration,
    daysAgo,
    isLive: Math.random() < 0.08,
    description:
      `Video 100% simulado generado para CornHub 🌽\n\n` +
      `Categoría: ${v.cat}. Este contenido es una demostración: no existe archivo de video real, ` +
      `el reproductor dibuja una animación en <canvas> y simula el progreso, el buffering y las vistas.\n\n` +
      `#maiz #elote #corn #simulado`,
    comments,
  };
});

function getVideoById(id) {
  return VIDEOS.find((v) => v.id === id);
}

// Video oculto: no aparece en el grid normal, solo si buscas la palabra clave "secreto".
const SECRET_VIDEO = {
  id: "secret1",
  title: "El Elote Prohibido (No Deberías Estar Viendo Esto)",
  category: "Comedia",
  channel: { name: "??? Canal Desconocido", emoji: "🕵️", subs: "??? K" },
  gradient: "linear-gradient(135deg,#000,#3a3a3a)",
  paletteIndex: 1,
  icon: "ghost",
  views: 999999,
  likes: 66666,
  duration: 42,
  daysAgo: 0,
  isLive: false,
  description: "Encontraste el easter egg secreto de CornHub 🌽🕵️\n\nNo hay nada raro aquí, solo un elote más misterioso de lo normal.",
  comments: [
    { author: "Cazador de Secretos", avatar: "🕵️", text: "sabía que existía este video", likes: 420, time: "hace 1 año" },
    { author: "??? ", avatar: "👻", text: "shhh no le digas a nadie", likes: 88, time: "hace 3 meses" },
  ],
};

function getVideosByChannel(channelName) {
  return VIDEOS.filter((v) => v.channel.name === channelName);
}

function getChannelByName(channelName) {
  return CHANNELS.find((c) => c.name === channelName);
}
