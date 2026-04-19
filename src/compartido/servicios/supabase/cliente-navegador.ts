import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  obtenerCredencialesPublicasSupabase,
  obtenerCredencialesPublicasSupabaseOpcionales,
} from "@/compartido/configuracion/entorno";
import type { CredencialesPublicasSupabase } from "@/compartido/tipos/entorno";

let clienteSupabaseNavegadorSingleton: SupabaseClient | null | undefined;

export function crearClienteSupabaseNavegador(
  credenciales: CredencialesPublicasSupabase = obtenerCredencialesPublicasSupabase(),
): SupabaseClient {
  return createClient(credenciales.url, credenciales.claveAnonima, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

export function obtenerClienteSupabaseNavegador(): SupabaseClient | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (clienteSupabaseNavegadorSingleton !== undefined) {
    return clienteSupabaseNavegadorSingleton;
  }

  const credenciales = obtenerCredencialesPublicasSupabaseOpcionales();

  if (!credenciales) {
    clienteSupabaseNavegadorSingleton = null;
    return clienteSupabaseNavegadorSingleton;
  }

  clienteSupabaseNavegadorSingleton = crearClienteSupabaseNavegador(credenciales);

  return clienteSupabaseNavegadorSingleton;
}

export function supabaseNavegadorEstaDisponible(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return Boolean(obtenerCredencialesPublicasSupabaseOpcionales());
}

