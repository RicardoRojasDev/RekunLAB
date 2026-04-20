import "server-only";

import { createServerClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  obtenerCredencialesPublicasSupabase,
  obtenerVariableEntornoOpcional,
} from "@/compartido/configuracion/entorno";
import type {
  ResultadoAccesoAdministrador,
  UsuarioAdministrador,
} from "../tipos/admin";

function normalizarCorreo(correo: string) {
  return correo.trim().toLowerCase();
}

function resolverCorreosAdministradoresPermitidos() {
  const valor = obtenerVariableEntornoOpcional("ADMIN_CORREOS_PERMITIDOS");

  if (!valor) {
    return [] as string[];
  }

  return Array.from(
    new Set(
      valor
        .split(/[,;\n]/)
        .map((fragmento) => normalizarCorreo(fragmento))
        .filter(Boolean),
    ),
  );
}

function obtenerTextoMetadata(
  metadatos: Record<string, unknown> | undefined,
  clave: string,
) {
  const valor = metadatos?.[clave];
  return typeof valor === "string" && valor.trim().length ? valor.trim() : null;
}

function capitalizarFragmento(valor: string) {
  const texto = valor.trim().toLowerCase();
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function resolverNombreCompletoAdministrador(usuario: User) {
  const metadatos = usuario.user_metadata as Record<string, unknown> | undefined;
  const nombreDesdeMetadata =
    obtenerTextoMetadata(metadatos, "full_name") ??
    obtenerTextoMetadata(metadatos, "name");
  const nombreBase = nombreDesdeMetadata ?? usuario.email?.split("@")[0] ?? "Administrador";

  return nombreBase
    .replace(/[._-]+/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((fragmento) => capitalizarFragmento(fragmento))
    .join(" ");
}

function mapearUsuarioAdministrador(usuario: User): UsuarioAdministrador | null {
  const correo = usuario.email ? normalizarCorreo(usuario.email) : null;

  if (!correo) {
    return null;
  }

  const metadatos = usuario.user_metadata as Record<string, unknown> | undefined;

  return {
    id: usuario.id,
    correo,
    nombreCompleto: resolverNombreCompletoAdministrador(usuario),
    proveedor:
      obtenerTextoMetadata(metadatos, "provider") ??
      (typeof usuario.app_metadata.provider === "string"
        ? usuario.app_metadata.provider
        : null),
  };
}

async function crearClienteSupabaseServidorSesion() {
  const almacenCookies = await cookies();
  const { url, claveAnonima } = obtenerCredencialesPublicasSupabase();

  return createServerClient(url, claveAnonima, {
    cookies: {
      getAll() {
        return almacenCookies.getAll();
      },
      setAll(cookiesAConfigurar) {
        try {
          cookiesAConfigurar.forEach(({ name, value, options }) => {
            almacenCookies.set(name, value, options);
          });
        } catch {
          // En componentes de servidor la escritura de cookies puede no estar disponible.
        }
      },
    },
  });
}

export async function resolverAccesoAdministrador(): Promise<ResultadoAccesoAdministrador> {
  const correosPermitidos = resolverCorreosAdministradoresPermitidos();
  const configuracionCompleta = correosPermitidos.length > 0;

  if (!configuracionCompleta) {
    return {
      configuracionCompleta: false,
      sesionActiva: false,
      esAdministrador: false,
      usuario: null,
    };
  }

  const cliente = await crearClienteSupabaseServidorSesion();
  const { data, error } = await cliente.auth.getUser();

  if (error || !data.user) {
    return {
      configuracionCompleta: true,
      sesionActiva: false,
      esAdministrador: false,
      usuario: null,
    };
  }

  const usuario = mapearUsuarioAdministrador(data.user);

  if (!usuario) {
    return {
      configuracionCompleta: true,
      sesionActiva: false,
      esAdministrador: false,
      usuario: null,
    };
  }

  return {
    configuracionCompleta: true,
    sesionActiva: true,
    esAdministrador: correosPermitidos.includes(usuario.correo),
    usuario,
  };
}

export async function exigirAccesoAdministrador() {
  const acceso = await resolverAccesoAdministrador();

  if (!acceso.configuracionCompleta) {
    redirect("/");
  }

  if (!acceso.sesionActiva) {
    redirect("/acceso");
  }

  if (!acceso.esAdministrador || !acceso.usuario) {
    redirect("/");
  }

  return acceso.usuario;
}
