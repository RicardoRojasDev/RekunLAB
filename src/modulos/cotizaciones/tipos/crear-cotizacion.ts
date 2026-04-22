export type DatosSolicitanteCotizacion = Readonly<{
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
}>;

export type SolicitudCrearCotizacionPublica = Readonly<{
  solicitante: DatosSolicitanteCotizacion;
  mensaje: string;
}>;

export type ResultadoCrearCotizacion = Readonly<{
  cotizacionId: string;
  numeroCotizacion: string;
}>;

export type RespuestaApiCrearCotizacion =
  | (Readonly<{ ok: true }> & ResultadoCrearCotizacion)
  | Readonly<{
      ok: false;
      codigo: string;
      mensaje: string;
      detalle?: string;
    }>;

