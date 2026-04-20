import "server-only";

import type {
  ResultadoCrearPedido,
  SolicitudCrearPedido,
} from "@/modulos/pedidos";
import { construirCorreoConfirmacionPedidoCliente } from "../plantillas/correo-confirmacion-pedido-cliente";
import { construirCorreoRespaldoPedidoInterno } from "../plantillas/correo-respaldo-pedido-interno";
import { obtenerConfiguracionCorreosTransaccionales } from "../proveedores/proveedor-correos-transaccionales";
import type {
  PedidoCorreoTransaccional,
  ResultadoNotificacionPedido,
} from "../tipos/correos-transaccionales";

type PropiedadesNotificacionPedidoCreado = Readonly<{
  solicitud: SolicitudCrearPedido;
  resultado: ResultadoCrearPedido;
}>;

function construirPedidoCorreoTransaccional({
  solicitud,
  resultado,
}: PropiedadesNotificacionPedidoCreado): PedidoCorreoTransaccional {
  return {
    pedidoId: resultado.pedidoId,
    numeroPedido: resultado.numeroPedido,
    fechaISO: new Date().toISOString(),
    subtotalCLP: resultado.subtotalIvaIncluido,
    totalCLP: resultado.totalIvaIncluido,
    datosCliente: {
      nombreCompleto: `${solicitud.datosCliente.nombre} ${solicitud.datosCliente.apellido}`.trim(),
      correo: solicitud.datosCliente.correo,
      telefono: solicitud.datosCliente.telefono,
    },
    direccionDespacho: {
      region: solicitud.direccionDespacho.region,
      comuna: solicitud.direccionDespacho.comuna,
      calle: solicitud.direccionDespacho.calle,
      numero: solicitud.direccionDespacho.numero,
      departamento: solicitud.direccionDespacho.departamento,
      referencias: solicitud.direccionDespacho.referencias,
      codigoPostal: solicitud.direccionDespacho.codigoPostal,
    },
    items: solicitud.items.map((item) => ({
      nombreProducto: item.nombre,
      nombreCompleto: item.nombreCompleto ?? item.nombre,
      marca: item.marca ?? "Sin marca",
      tipoProducto: item.tipoProducto,
      precioUnitarioCLP: item.precioUnitarioIvaIncluidoSnapshot,
      cantidad: item.cantidad,
      subtotalCLP: item.precioUnitarioIvaIncluidoSnapshot * item.cantidad,
    })),
  };
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

  const pedido = construirPedidoCorreoTransaccional({ solicitud, resultado });
  const correoCliente = construirCorreoConfirmacionPedidoCliente(pedido);
  const resultadoCliente = await configuracion.proveedor.enviar(correoCliente);
  const resultadoInterno = configuracion.correoInterno
    ? await configuracion.proveedor.enviar(
        construirCorreoRespaldoPedidoInterno(
          pedido,
          configuracion.correoInterno,
        ),
      )
    : null;

  return {
    cliente: resultadoCliente,
    interno: resultadoInterno,
    omitido: false,
  };
}
