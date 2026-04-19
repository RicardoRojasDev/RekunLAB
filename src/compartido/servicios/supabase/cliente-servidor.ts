import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  obtenerCredencialesPublicasSupabase,
  obtenerVariableEntorno,
} from "@/compartido/configuracion/entorno";

const opcionesAutenticacionServidor = {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
} as const;

export function crearClienteSupabaseServidorAnonimo(): SupabaseClient {
  const { url, claveAnonima } = obtenerCredencialesPublicasSupabase();

  return createClient(url, claveAnonima, opcionesAutenticacionServidor);
}

export function crearClienteSupabaseServidorServicio(): SupabaseClient {
  const { url } = obtenerCredencialesPublicasSupabase();
  const claveServicio = obtenerVariableEntorno("SUPABASE_SERVICE_ROLE_KEY");

  return createClient(url, claveServicio, opcionesAutenticacionServidor);
}

