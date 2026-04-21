import "server-only";

import type {
  ResultadoCrearPedido,
  SolicitudCrearPedido,
} from "@/modulos/pedidos";
import { construirCorreoConfirmacionPedidoCliente } from "../plantillas/correo-confirmacion-pedido-cliente";
import { construirCorreoRespaldoPedidoInterno } from "../plantillas/correo-respaldo-pedido-interno";
import { obtenerConfiguracionCorreosTransaccionales } from "../proveedores/proveedor-correos-transaccionales";
import { obtenerPedidoCorreoTransaccionalPorId } from "../repositorios/pedidos-correos-supabase";
import type {
  PedidoCorreoTransaccional,
  ResultadoNotificacionPedido,
} from "../tipos/correos-transaccionales";
import { construirPedidoCorreoTransaccionalDesdeSolicitud } from "../utilidades/construir-pedido-correo-transaccional";

type PropiedadesNotificacionPedidoCreado = Readonly<{
  solicitud: SolicitudCrearPedido;
  resultado: ResultadoCrearPedido;
}>;

async function resolverPedidoCorreoTransaccional({
  solicitud,
  resultado,
}: PropiedadesNotificacionPedidoCreado): Promise<PedidoCorreoTransaccional> {
  try {
    const pedidoPersistido = await obtenerPedidoCorreoTransaccionalPorId(
      resultado.pedidoId,
    );

    if (pedidoPersistido) {
      return pedidoPersistido;
    }

    console.warn(
      "No se encontro el pedido persistido para correos transaccionales. Se usara el payload validado del checkout como respaldo.",
      resultado.numeroPedido,
    );
  } catch (error) {
    console.error(
      "No pudimos reconstruir el pedido desde Supabase para correos transaccionales. Se usara el payload validado del checkout como respaldo.",
      resultado.numeroPedido,
      error,
    );
  }

  return construirPedidoCorreoTransaccionalDesdeSolicitud({
    solicitud,
    resultado,
  });
}

export async function notificarPedidoCreado({
  solicitud,
  resultado,
}: PropiedadesNotificacionPedidoCreado): Promise<ResultadoNotificacionPedido> {
  const configuracion = obtenerConfiguracionCorreosTransaccionales();

  if (!configuracion) {
    return {
      cliente: null,
      interno: null,
      omitido: true,
      motivoOmitido:
        "Faltan RESEND_API_KEY o CORREO_ORIGEN_TRANSACCIONAL.",
    };
  }

  const pedido = await resolverPedidoCorreoTransaccional({ solicitud, resultado });
  const correoCliente = {
    ...construirCorreoConfirmacionPedidoCliente(pedido),
    responderA: configuracion.correoInterno ?? configuracion.correoOrigen,
  };
  const correoInterno = configuracion.correoInterno
    ? {
        ...construirCorreoRespaldoPedidoInterno(
          pedido,
          configuracion.correoInterno,
        ),
        responderA: pedido.datosCliente.correo,
      }
    : null;
  const [resultadoCliente, resultadoInterno] = await Promise.all([
    configuracion.proveedor.enviar(correoCliente),
    correoInterno
      ? configuracion.proveedor.enviar(correoInterno)
      : Promise.resolve(null),
  ]);

  return {
    cliente: resultadoCliente,
    interno: resultadoInterno,
    omitido: false,
  };
}
