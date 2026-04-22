import type {
  DatosSolicitanteCotizacion,
  SolicitudCrearCotizacionPublica,
} from "../tipos/crear-cotizacion";

function normalizarTexto(valor: string) {
  return valor.trim();
}

function validarRequerido(valor: string, etiqueta: string) {
  return normalizarTexto(valor).length ? null : `Ingresa ${etiqueta}.`;
}

function esCorreoValido(correo: string) {
  const valor = normalizarTexto(correo);

  if (!valor.length) {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
}

function validarCorreo(correo: string) {
  if (!normalizarTexto(correo).length) {
    return "Ingresa correo.";
  }

  return esCorreoValido(correo)
    ? null
    : "Ingresa un correo valido (ej: nombre@dominio.cl).";
}

function obtenerSoloDigitos(valor: string) {
  return valor.replace(/\D/g, "");
}

function validarTelefono(telefono: string) {
  const valor = normalizarTexto(telefono);

  if (!valor.length) {
    return null;
  }

  const digitos = obtenerSoloDigitos(valor);

  if (digitos.length < 8) {
    return "El telefono debe tener al menos 8 digitos.";
  }

  if (digitos.length > 15) {
    return "El telefono parece demasiado largo.";
  }

  return null;
}

function algunErrorPresente(errores: Record<string, string | null>) {
  return Object.values(errores).some(Boolean);
}

export type ErroresCrearCotizacion = Readonly<{
  solicitante: Readonly<{
    nombre: string | null;
    apellido: string | null;
    correo: string | null;
    telefono: string | null;
  }>;
  mensaje: string | null;
}>;

export type ResultadoValidacionCrearCotizacion = Readonly<{
  esValido: boolean;
  errores: ErroresCrearCotizacion;
}>;

export function validarSolicitanteCotizacion(
  solicitante: DatosSolicitanteCotizacion,
): ErroresCrearCotizacion["solicitante"] {
  return {
    nombre: validarRequerido(solicitante.nombre, "nombre"),
    apellido: validarRequerido(solicitante.apellido, "apellido"),
    correo: validarCorreo(solicitante.correo),
    telefono: validarTelefono(solicitante.telefono),
  };
}

export function validarSolicitudCrearCotizacion(
  solicitud: SolicitudCrearCotizacionPublica,
): ResultadoValidacionCrearCotizacion {
  const erroresSolicitante = validarSolicitanteCotizacion(solicitud.solicitante);

  const mensaje = normalizarTexto(solicitud.mensaje);
  let errorMensaje: string | null = null;

  if (mensaje.length > 2000) {
    errorMensaje = "El mensaje es demasiado largo.";
  }

  const esValido = !algunErrorPresente(erroresSolicitante) && !Boolean(errorMensaje);

  return {
    esValido,
    errores: {
      solicitante: erroresSolicitante,
      mensaje: errorMensaje,
    },
  };
}

