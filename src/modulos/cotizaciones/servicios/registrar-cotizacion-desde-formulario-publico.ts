import "server-only";

import type {
  ResultadoCrearCotizacion,
  SolicitudCrearCotizacionPublica,
} from "../tipos/crear-cotizacion";
import { notificarCotizacionCreada } from "@/modulos/correos-transaccionales";
import {
  validarSolicitudCrearCotizacion,
  type ErroresCrearCotizacion,
} from "../validaciones/crear-cotizacion";
import { crearCotizacionDesdeFormularioSupabase } from "../repositorios/crear-cotizacion-supabase";

export class ErrorValidacionCrearCotizacion extends Error {
  public readonly codigo = "VALIDACION_COTIZACION";
  public readonly errores: ErroresCrearCotizacion;

  public constructor(errores: ErroresCrearCotizacion) {
    super("La solicitud de cotizacion no es valida.");
    this.errores = errores;
  }
}

export async function registrarCotizacionDesdeFormularioPublico(
  solicitud: SolicitudCrearCotizacionPublica,
): Promise<ResultadoCrearCotizacion> {
  const validacion = validarSolicitudCrearCotizacion(solicitud);

  if (!validacion.esValido) {
    throw new ErrorValidacionCrearCotizacion(validacion.errores);
  }

  const resultado = await crearCotizacionDesdeFormularioSupabase(solicitud);

  try {
    const notificacion = await notificarCotizacionCreada({
      solicitud,
      resultado,
    });

    if (notificacion.omitido) {
      console.warn(
        "Correos transaccionales omitidos para la cotizacion creada:",
        resultado.numeroCotizacion,
        notificacion.motivoOmitido,
      );
    } else {
      if (notificacion.solicitante && !notificacion.solicitante.exito) {
        console.error(
          "No fue posible enviar el correo al solicitante:",
          resultado.numeroCotizacion,
          notificacion.solicitante.error,
        );
      }

      if (notificacion.interno && !notificacion.interno.exito) {
        console.error(
          "No fue posible enviar el correo interno de respaldo:",
          resultado.numeroCotizacion,
          notificacion.interno.error,
        );
      }
    }
  } catch (error) {
    console.error(
      "Error inesperado enviando correos transaccionales de cotizacion:",
      resultado.numeroCotizacion,
      error,
    );
  }

  return resultado;
}

