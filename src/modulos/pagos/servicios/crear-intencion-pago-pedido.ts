import "server-only";

import {
  actualizarCreacionPago,
  crearPagoPendiente,
  listarPagosPedido,
  marcarPagoComoFallido,
  obtenerPedidoParaPagoPorId,
  type PagoRegistrado,
} from "../repositorios/pagos-supabase";
import { crearTransaccionWebpayPlus } from "../proveedores/transbank-webpay-plus";
import type { ResultadoCrearIntencionPago } from "../tipos/pagos";

function construirReferenciaExterna(numeroPedido: string, intento: number) {
  const sufijo = `-P${intento}`;
  const maximo = 26;

  if (`${numeroPedido}${sufijo}`.length <= maximo) {
    return `${numeroPedido}${sufijo}`;
  }

  return `${numeroPedido.slice(0, maximo - sufijo.length)}${sufijo}`;
}

function construirSessionIdPasarela(pedidoId: string, intento: number) {
  return `PED-${pedidoId}-${intento}`.slice(0, 61);
}

function mapearResultadoIntencion(
  pago: PagoRegistrado,
  numeroPedido: string,
): ResultadoCrearIntencionPago {
  if (!pago.urlRedireccion || !pago.tokenPasarela) {
    throw new Error("La intencion de pago no tiene datos de redireccion disponibles.");
  }

  return {
    pagoId: pago.id,
    pedidoId: pago.pedidoId,
    numeroPedido,
    proveedor: pago.proveedor,
    estado: "pendiente",
    referenciaExterna: pago.referenciaExterna,
    urlRedireccion: pago.urlRedireccion,
    tokenRedireccion: pago.tokenPasarela,
  };
}

export async function crearIntencionPagoPedido(
  pedidoId: string,
): Promise<ResultadoCrearIntencionPago> {
  const pedido = await obtenerPedidoParaPagoPorId(pedidoId);

  if (!pedido) {
    throw new Error("No encontramos el pedido indicado para iniciar el pago.");
  }

  if (pedido.monedaCodigo !== "CLP") {
    throw new Error(
      `La pasarela configurada solo soporta pagos CLP y el pedido viene en ${pedido.monedaCodigo}.`,
    );
  }

  if (pedido.totalIvaIncluido < 1) {
    throw new Error("El pedido no tiene un total valido para iniciar el pago.");
  }

  const pagosExistentes = await listarPagosPedido(pedidoId);
  const pagoPagado = pagosExistentes.find((pago) => pago.estado === "pagado");

  if (pagoPagado) {
    throw new Error("Este pedido ya tiene un pago confirmado.");
  }

  const pagoPendiente = pagosExistentes.find((pago) => pago.estado === "pendiente");

  if (pagoPendiente?.urlRedireccion && pagoPendiente.tokenPasarela) {
    return mapearResultadoIntencion(pagoPendiente, pedido.numeroPedido);
  }

  if (pagoPendiente && !pagoPendiente.tokenPasarela) {
    await marcarPagoComoFallido({
      pagoId: pagoPendiente.id,
      ultimoError:
        "Se cerro una intencion pendiente inconsistente antes de crear una nueva.",
    });
  }

  const intento = (pagosExistentes[0]?.intento ?? 0) + 1;
  const referenciaExterna = construirReferenciaExterna(pedido.numeroPedido, intento);
  const sessionIdPasarela = construirSessionIdPasarela(pedido.id, intento);

  const pagoPendienteLocal = await crearPagoPendiente({
    pedidoId: pedido.id,
    proveedor: "webpay-plus",
    intento,
    referenciaExterna,
    sessionIdPasarela,
    monto: pedido.totalIvaIncluido,
    monedaCodigo: pedido.monedaCodigo,
    metadatos: {
      numeroPedido: pedido.numeroPedido,
      correoCliente: pedido.correoClienteSnapshot,
    },
  });

  try {
    const transaccion = await crearTransaccionWebpayPlus({
      ordenCompra: referenciaExterna,
      sessionId: sessionIdPasarela,
      monto: pedido.totalIvaIncluido,
    });

    const pagoActualizado = await actualizarCreacionPago({
      pagoId: pagoPendienteLocal.id,
      tokenPasarela: transaccion.token,
      urlRedireccion: transaccion.url,
      payloadCreacion: transaccion.raw,
    });

    return mapearResultadoIntencion(pagoActualizado, pedido.numeroPedido);
  } catch (error) {
    await marcarPagoComoFallido({
      pagoId: pagoPendienteLocal.id,
      ultimoError: `No fue posible crear la transaccion en la pasarela: ${
        error instanceof Error ? error.message : "error desconocido"
      }`,
    });

    throw new Error(
      `No pudimos crear la transaccion con la pasarela de pago: ${
        error instanceof Error ? error.message : "error desconocido"
      }`,
    );
  }
}
