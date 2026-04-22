import type {
  RespuestaApiCrearCotizacion,
  ResultadoCrearCotizacion,
  SolicitudCrearCotizacionPublica,
} from "../tipos/crear-cotizacion";

export async function solicitarCotizacionPublica(
  solicitud: SolicitudCrearCotizacionPublica,
): Promise<ResultadoCrearCotizacion> {
  const respuesta = await fetch("/api/cotizaciones", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(solicitud),
  });

  const payload = (await respuesta.json()) as RespuestaApiCrearCotizacion;

  if (!payload.ok) {
    throw new Error(payload.mensaje || "No pudimos registrar tu cotizacion.");
  }

  if (!respuesta.ok) {
    throw new Error("No pudimos registrar tu cotizacion.");
  }

  return payload;
}

