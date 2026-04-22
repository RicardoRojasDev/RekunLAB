import type { SolicitudCrearCotizacionPublica } from "../tipos/crear-cotizacion";

type RegistroDesconocido = Record<string, unknown>;

function esRegistro(valor: unknown): valor is RegistroDesconocido {
  return Boolean(valor) && typeof valor === "object" && !Array.isArray(valor);
}

function obtenerTexto(registro: RegistroDesconocido, clave: string) {
  const valor = registro[clave];
  return typeof valor === "string" ? valor : "";
}

export function parsearSolicitudCrearCotizacion(
  valor: unknown,
): SolicitudCrearCotizacionPublica | null {
  if (!esRegistro(valor)) {
    return null;
  }

  const solicitanteRegistro = valor.solicitante;

  if (!esRegistro(solicitanteRegistro)) {
    return null;
  }

  return {
    solicitante: {
      nombre: obtenerTexto(solicitanteRegistro, "nombre"),
      apellido: obtenerTexto(solicitanteRegistro, "apellido"),
      correo: obtenerTexto(solicitanteRegistro, "correo"),
      telefono: obtenerTexto(solicitanteRegistro, "telefono"),
    },
    mensaje: obtenerTexto(valor, "mensaje"),
  };
}

