import type { ResultadoEnvioCorreoTransaccional } from "./correos-transaccionales";

export type CotizacionCorreoTransaccional = Readonly<{
  cotizacionId: string;
  numeroCotizacion: string;
  fechaISO: string;
  solicitante: Readonly<{
    nombreCompleto: string;
    correo: string;
    telefono: string;
  }>;
  mensaje: string;
}>;

export type ResultadoNotificacionCotizacion = Readonly<{
  solicitante: ResultadoEnvioCorreoTransaccional | null;
  interno: ResultadoEnvioCorreoTransaccional | null;
  omitido: boolean;
  motivoOmitido?: string;
}>;

