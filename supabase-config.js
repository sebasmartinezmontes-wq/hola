// Config pública de Supabase. Estos valores NO son secretos: la clave
// "publishable" está hecha para vivir en el navegador. La seguridad real
// la dan las políticas de RLS configuradas en el proyecto de Supabase.

const SUPABASE_URL = "https://dvfubytpxgarjfethedj.supabase.co";
const SUPABASE_KEY = "sb_publishable_C3-dejjTq9hfVv7nHLxatw_iV9AqycI";

let supabaseClient = null;
try {
  supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} catch (e) {
  console.warn("Supabase no configurado todavía, usando solo localStorage.", e);
}
