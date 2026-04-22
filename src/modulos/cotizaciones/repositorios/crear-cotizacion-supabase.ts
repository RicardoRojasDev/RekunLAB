import "server-only";

import { crearClienteSupabaseServidorServicio } from "@/compartido/servicios/supabase/index-servidor";
import { exigirRespuestaSupabase } from "@/compartido/servicios/supabase";
import type {
  ResultadoCrearCotizacion,
  SolicitudCrearCotizacionPublica,
} from "../tipos/crear-cotizacion";

type PayloadRpcCrearCotizacion = Readonly<{
  solicitante: SolicitudCrearCotizacionPublica["solicitante"];
  mensaje: string;
}>;

type ResultadoRpcCrearCotizacion = Readonly<{
  cotizacion_id: string;
  numero_cotizacion: string;
}>;

function construirPayloadRpc(
  solicitud: SolicitudCrearCotizacionPublica,
): PayloadRpcCrearCotizacion {
  return {
    solicitante: solicitud.solicitante,
    mensaje: solicitud.mensaje,
  };
}

export async function crearCotizacionDesdeFormularioSupabase(
  solicitud: SolicitudCrearCotizacionPublica,
): Promise<ResultadoCrearCotizacion> {
  const cliente = crearClienteSupabaseServidorServicio();
  const payload = construirPayloadRpc(solicitud);

  const respuesta = await cliente.rpc("crear_cotizacion_desde_formulario", {
    p_solicitud: payload,
  });

  const data = exigirRespuestaSupabase(
    respuesta,
    "crear_cotizacion_desde_formulario",
  ) as unknown as readonly ResultadoRpcCrearCotizacion[];

  const resultado = data[0];

  if (!resultado) {
    throw new Error(
      "Supabase no devolvio datos al crear la cotizacion. Revisa la funcion RPC.",
    );
  }

  return {
    cotizacionId: resultado.cotizacion_id,
    numeroCotizacion: resultado.numero_cotizacion,
  };
}

