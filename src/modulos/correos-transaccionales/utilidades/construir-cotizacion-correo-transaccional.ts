import type { ResultadoCrearCotizacion, SolicitudCrearCotizacionPublica } from "@/modulos/cotizaciones";
import type { CotizacionCorreoTransaccional } from "../tipos/correos-cotizacion";

type PropiedadesConstruirCotizacionCorreo = Readonly<{
  solicitud: SolicitudCrearCotizacionPublica;
  resultado: ResultadoCrearCotizacion;
}>;

export function construirCotizacionCorreoTransaccionalDesdeSolicitud({
  solicitud,
  resultado,
}: PropiedadesConstruirCotizacionCorreo): CotizacionCorreoTransaccional {
  return {
    cotizacionId: resultado.cotizacionId,
    numeroCotizacion: resultado.numeroCotizacion,
    fechaISO: new Date().toISOString(),
    solicitante: {
      nombreCompleto: [solicitud.solicitante.nombre.trim(), solicitud.solicitante.apellido.trim()]
        .filter(Boolean)
        .join(" "),
      correo: solicitud.solicitante.correo,
      telefono: solicitud.solicitante.telefono,
    },
    mensaje: solicitud.mensaje,
  };
}

