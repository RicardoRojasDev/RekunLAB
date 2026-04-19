import {
  createClient,
  type Session,
  type SupabaseClient,
  type User,
} from "@supabase/supabase-js";
import type { UsuarioAutenticadoFrontend } from "../tipos/autenticacion";

let clienteSupabaseAutenticacionSingleton: SupabaseClient | null | undefined;

function obtenerTextoMetadata(
  metadatos: Record<string, unknown> | undefined,
  clave: string,
) {
  const valor = metadatos?.[clave];
  return typeof valor === "string" ? valor : null;
}

function capitalizarPalabra(valor: string) {
  return valor
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((fragmento) => {
      const texto = fragmento.toLowerCase();
      return texto.charAt(0).toUpperCase() + texto.slice(1);
    })
    .join(" ");
}

function normalizarNombreBase(valor: string) {
  return capitalizarPalabra(valor.replace(/[._-]+/g, " "));
}

function resolverNombreCompletoUsuario(usuario: User) {
  const metadatos = usuario.user_metadata as Record<string, unknown> | undefined;
  const nombreDesdeCorreo = usuario.email?.split("@")[0] ?? "Cliente Rekun";
  const nombreCompleto =
    obtenerTextoMetadata(metadatos, "full_name") ??
    obtenerTextoMetadata(metadatos, "name") ??
    nombreDesdeCorreo;

  return normalizarNombreBase(nombreCompleto);
}

function dividirNombreCompleto(nombreCompleto: string) {
  const fragmentos = nombreCompleto.split(/\s+/).filter(Boolean);
  const nombre = fragmentos[0] ?? "Cliente";
  const apellido = fragmentos.slice(1).join(" ");

  return {
    nombre,
    apellido,
  };
}

function obtenerCredencialesPublicasSupabaseSeguras() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const claveAnonima = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !claveAnonima) {
    return null;
  }

  return {
    url,
    claveAnonima,
  };
}

export function obtenerClienteSupabaseAutenticacion() {
  if (typeof window === "undefined") {
    return null;
  }

  if (clienteSupabaseAutenticacionSingleton !== undefined) {
    return clienteSupabaseAutenticacionSingleton;
  }

  const credenciales = obtenerCredencialesPublicasSupabaseSeguras();

  if (!credenciales) {
    clienteSupabaseAutenticacionSingleton = null;
    return clienteSupabaseAutenticacionSingleton;
  }

  clienteSupabaseAutenticacionSingleton = createClient(
    credenciales.url,
    credenciales.claveAnonima,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    },
  );

  return clienteSupabaseAutenticacionSingleton;
}

export function autenticacionSupabaseEstaDisponible() {
  return Boolean(obtenerCredencialesPublicasSupabaseSeguras());
}

export function mapearUsuarioAutenticadoFrontend(
  usuario: User,
): UsuarioAutenticadoFrontend {
  const nombreCompleto = resolverNombreCompletoUsuario(usuario);
  const { nombre, apellido } = dividirNombreCompleto(nombreCompleto);
  const metadatos = usuario.user_metadata as Record<string, unknown> | undefined;

  return {
    id: usuario.id,
    correo: usuario.email ?? null,
    nombre,
    apellido,
    nombreCompleto,
    avatarUrl: obtenerTextoMetadata(metadatos, "avatar_url"),
    proveedor:
      obtenerTextoMetadata(metadatos, "provider") ??
      usuario.app_metadata.provider ??
      null,
  };
}

export function mapearSesionAUsuarioAutenticado(
  sesion: Session | null,
): UsuarioAutenticadoFrontend | null {
  return sesion?.user ? mapearUsuarioAutenticadoFrontend(sesion.user) : null;
}

export function resolverUrlRetornoAutenticacion() {
  if (typeof window === "undefined") {
    return undefined;
  }

  return window.location.href;
}
