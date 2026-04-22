import "server-only";

import type { ResultadoCrearCotizacion, SolicitudCrearCotizacionPublica } from "@/modulos/cotizaciones";
import { construirCorreoConfirmacionCotizacionSolicitante } from "../plantillas/correo-confirmacion-cotizacion-solicitante";
import { construirCorreoRespaldoCotizacionInterno } from "../plantillas/correo-respaldo-cotizacion-interno";
import { obtenerConfiguracionCorreosTransaccionales } from "../proveedores/proveedor-correos-transaccionales";
import { obtenerCotizacionCorreoTransaccionalPorId } from "../repositorios/cotizaciones-correos-supabase";
import type { CotizacionCorreoTransaccional, ResultadoNotificacionCotizacion } from "../tipos/correos-cotizacion";
import { construirCotizacionCorreoTransaccionalDesdeSolicitud } from "../utilidades/construir-cotizacion-correo-transaccional";

type PropiedadesNotificacionCotizacionCreada = Readonly<{
  solicitud: SolicitudCrearCotizacionPublica;
  resultado: ResultadoCrearCotizacion;
}>;

async function resolverCotizacionCorreoTransaccional({
  solicitud,
  resultado,
}: PropiedadesNotificacionCotizacionCreada): Promise<CotizacionCorreoTransaccional> {
  try {
    const cotizacionPersistida = await obtenerCotizacionCorreoTransaccionalPorId(
      resultado.cotizacionId,
    );

    if (cotizacionPersistida) {
      return cotizacionPersistida;
    }

    console.warn(
      "No se encontro la cotizacion persistida para correos transaccionales. Se usara el payload validado del formulario como respaldo.",
      resultado.numeroCotizacion,
    );
  } catch (error) {
    console.error(
      "No pudimos reconstruir la cotizacion desde Supabase para correos transaccionales. Se usara el payload validado del formulario como respaldo.",
      resultado.numeroCotizacion,
      error,
    );
  }

  return construirCotizacionCorreoTransaccionalDesdeSolicitud({
    solicitud,
    resultado,
  });
}

export async function notificarCotizacionCreada({
  solicitud,
  resultado,
}: PropiedadesNotificacionCotizacionCreada): Promise<ResultadoNotificacionCotizacion> {
  const configuracion = obtenerConfiguracionCorreosTransaccionales();

  if (!configuracion) {
    return {
      solicitante: null,
      interno: null,
      omitido: true,
      motivoOmitido: "Faltan RESEND_API_KEY o CORREO_ORIGEN_TRANSACCIONAL.",
    };
  }

  const cotizacion = await resolverCotizacionCorreoTransaccional({ solicitud, resultado });
  const correoSolicitante = {
    ...construirCorreoConfirmacionCotizacionSolicitante(cotizacion),
    responderA: configuracion.correoInterno ?? configuracion.correoOrigen,
  };
  const correoInterno = configuracion.correoInterno
    ? {
        ...construirCorreoRespaldoCotizacionInterno(
          cotizacion,
          configuracion.correoInterno,
        ),
        responderA: cotizacion.solicitante.correo,
      }
    : null;

  const [resultadoSolicitante, resultadoInterno] = await Promise.all([
    configuracion.proveedor.enviar(correoSolicitante),
    correoInterno
      ? configuracion.proveedor.enviar(correoInterno)
      : Promise.resolve(null),
  ]);

  return {
    solicitante: resultadoSolicitante,
    interno: resultadoInterno,
    omitido: false,
  };
}

