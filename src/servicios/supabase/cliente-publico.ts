import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { obtenerCredencialesPublicasSupabase } from "@/configuracion/entorno";

export function crearClienteSupabasePublico(): SupabaseClient {
  const { url, claveAnonima } = obtenerCredencialesPublicasSupabase();

  return createClient(url, claveAnonima);
}
