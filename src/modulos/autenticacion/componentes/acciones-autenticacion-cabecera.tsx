"use client";

import Link from "next/link";
import { useAutenticacion } from "../hooks/use-autenticacion";

function resolverIniciales(nombre: string, apellido: string) {
  const inicialNombre = nombre.charAt(0);
  const inicialApellido = apellido.charAt(0);

  return `${inicialNombre}${inicialApellido}`.trim().toUpperCase() || "RK";
}

function IconoCuenta() {
  return (
    <span aria-hidden="true" className="inline-flex h-4 w-4 items-center justify-center">
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 12a4 4 0 1 0 0-8a4 4 0 0 0 0 8Z" />
        <path d="M5 20a7 7 0 0 1 14 0" />
      </svg>
    </span>
  );
}

export function AccionesAutenticacionCabecera() {
  const { disponibilidad, estadoSesion, esAutenticado, usuario } =
    useAutenticacion();

  const etiquetaPrincipal =
    estadoSesion === "cargando"
      ? "Sesion"
      : esAutenticado
        ? usuario?.nombre ?? "Cuenta"
        : "Acceso";

  const etiquetaEstado =
    estadoSesion === "cargando"
      ? "..."
      : esAutenticado && usuario
        ? resolverIniciales(usuario.nombre, usuario.apellido)
        : disponibilidad === "configurada"
          ? "GO"
          : "INV";

  return (
    <Link
      href="/acceso"
      aria-label={
        esAutenticado && usuario
          ? `Abrir acceso de ${usuario.nombreCompleto}`
          : "Abrir acceso"
      }
      className="boton-base boton-secundario min-h-11 min-w-[10.5rem] justify-between border-[color:var(--color-borde-fuerte)] bg-white/88 px-4 text-sm"
    >
      <span className="inline-flex items-center gap-2">
        <IconoCuenta />
        {etiquetaPrincipal}
      </span>

      <span className="inline-flex min-w-8 justify-center rounded-full bg-slate-950 px-2 py-1 text-[11px] font-semibold text-white">
        {etiquetaEstado}
      </span>
    </Link>
  );
}
