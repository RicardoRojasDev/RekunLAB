import "server-only";

import {
  actualizarEstadoPedidoPorCodigo,
  buscarPagoPorReferenciaExterna,
  buscarPagoPorSessionYReferencia,
  buscarPagoPorTokenPasarela,
  marcarPagoComoFallido,
  marcarPagoComoPagado,
  obtenerPedidoParaPagoPorId,
} from "../repositorios/pagos-supabase";
import {
  confirmarTransaccionWebpayPlus,
  obtenerEstadoTransaccionWebpayPlus,
} from "../proveedores/transbank-webpay-plus";

export type ParametrosRetornoWebpayPlus = Readonly<{
  tokenWs: string | null;
  tbkToken: string | null;
  tbkOrdenCompra: string | null;
  tbkIdSesion: string | null;
}>;

export type ResultadoConfirmacionPago = Readonly<{
  pedidoId: string;
  numeroPedido: string;
  estadoPago: "pagado" | "fallido";
}>;

function obtenerTextoSeguro(valor: unknown) {
  return typeof valor === "string" && valor.trim().length ? valor.trim() : null;
}

function esRespuestaPagoAprobada(respuesta: {
  status: string | null;
  responseCode: number | null;
}) {
  return respuesta.status === "AUTHORIZED" && respuesta.responseCode === 0;
}

async function resolverPagoSegunRetorno(parametros: ParametrosRetornoWebpayPlus) {
  if (parametros.tokenWs) {
    const pagoPorToken = await buscarPagoPorTokenPasarela(parametros.tokenWs);

    if (pagoPorToken) {
      return pagoPorToken;
    }
  }

  if (parametros.tbkToken) {
    const pagoPorTokenAbortado = await buscarPagoPorTokenPasarela(parametros.tbkToken);

    if (pagoPorTokenAbortado) {
      return pagoPorTokenAbortado;
    }
  }

  if (parametros.tbkOrdenCompra && parametros.tbkIdSesion) {
    const pagoPorReferencia = await buscarPagoPorSessionYReferencia(
      parametros.tbkIdSesion,
      parametros.tbkOrdenCompra,
    );

    if (pagoPorReferencia) {
      return pagoPorReferencia;
    }
  }

  if (parametros.tbkOrdenCompra) {
    return buscarPagoPorReferenciaExterna(parametros.tbkOrdenCompra);
  }

  return null;
}

function obtenerUltimosDigitosTarjeta(
  cardNumber: string | null,
) {
  if (!cardNumber) {
    return null;
  }

  const digitos = cardNumber.replace(/\D/g, "");

  return digitos.length ? digitos.slice(-4) : null;
}

function extraerCuotas(respuesta: {
  installmentsNumber: number | null;
}) {
  if (
    typeof respuesta.installmentsNumber === "number" &&
    Number.isFinite(respuesta.installmentsNumber)
  ) {
    return respuesta.installmentsNumber;
  }

  return null;
}

export async function confirmarPagoWebpayPlus(
  parametros: ParametrosRetornoWebpayPlus,
): Promise<ResultadoConfirmacionPago> {
  const pago = await resolverPagoSegunRetorno(parametros);

  if (!pago) {
    throw new Error("No encontramos un pago registrado para los datos devueltos por Webpay Plus.");
  }

  const pedido = await obtenerPedidoParaPagoPorId(pago.pedidoId);

  if (!pedido) {
    throw new Error("No encontramos el pedido asociado al pago retornado por Webpay Plus.");
  }

  if (pago.estado === "pagado") {
    return {
      pedidoId: pedido.id,
      numeroPedido: pedido.numeroPedido,
      estadoPago: "pagado",
    };
  }

  if (!parametros.tokenWs) {
    await marcarPagoComoFallido({
      pagoId: pago.id,
      ultimoError:
        "El flujo de pago fue abortado o expiro antes de recibir token_ws desde Webpay Plus.",
      codigoRespuesta: null,
      payloadConfirmacion: {
        token_ws: parametros.tokenWs,
        TBK_TOKEN: parametros.tbkToken,
        TBK_ORDEN_COMPRA: parametros.tbkOrdenCompra,
        TBK_ID_SESION: parametros.tbkIdSesion,
      },
    });

    await actualizarEstadoPedidoPorCodigo(pedido.id, "pago-fallido");

    return {
      pedidoId: pedido.id,
      numeroPedido: pedido.numeroPedido,
      estadoPago: "fallido",
    };
  }

  let confirmacion:
    | Awaited<ReturnType<typeof confirmarTransaccionWebpayPlus>>
    | Awaited<ReturnType<typeof obtenerEstadoTransaccionWebpayPlus>>;

  try {
    confirmacion = await confirmarTransaccionWebpayPlus(parametros.tokenWs);
  } catch (error) {
    confirmacion = await obtenerEstadoTransaccionWebpayPlus(parametros.tokenWs);

    if (!confirmacion.status) {
      throw new Error(
        `No fue posible confirmar ni recuperar el estado del pago: ${
          error instanceof Error ? error.message : "error desconocido"
        }`,
      );
    }
  }

  if (confirmacion.buyOrder !== pago.referenciaExterna) {
    throw new Error(
      "La referencia confirmada por Webpay Plus no coincide con la referencia almacenada para este pago.",
    );
  }

  if (confirmacion.sessionId !== pago.sessionIdPasarela) {
    throw new Error(
      "El session_id confirmado por Webpay Plus no coincide con la intencion registrada.",
    );
  }

  if (confirmacion.amount !== pago.monto) {
    throw new Error(
      "El monto confirmado por Webpay Plus no coincide con el total registrado del pedido.",
    );
  }

  if (esRespuestaPagoAprobada(confirmacion)) {
    await marcarPagoComoPagado({
      pagoId: pago.id,
      codigoAutorizacion: confirmacion.authorizationCode,
      codigoRespuesta:
        confirmacion.responseCode === null
          ? null
          : String(confirmacion.responseCode),
      tipoPago: confirmacion.paymentTypeCode,
      cuotas: extraerCuotas(confirmacion),
      tarjetaUltimosDigitos: obtenerUltimosDigitosTarjeta(
        confirmacion.cardDetail?.cardNumber ?? null,
      ),
      payloadConfirmacion: confirmacion.raw,
    });

    await actualizarEstadoPedidoPorCodigo(pedido.id, "pagado");

    return {
      pedidoId: pedido.id,
      numeroPedido: pedido.numeroPedido,
      estadoPago: "pagado",
    };
  }

  await marcarPagoComoFallido({
    pagoId: pago.id,
    codigoRespuesta:
      confirmacion.responseCode === null ? null : String(confirmacion.responseCode),
    payloadConfirmacion: confirmacion.raw,
    ultimoError: `Webpay Plus devolvio un estado no aprobado (${obtenerTextoSeguro(confirmacion.status) ?? "sin-status"}).`,
  });

  await actualizarEstadoPedidoPorCodigo(pedido.id, "pago-fallido");

  return {
    pedidoId: pedido.id,
    numeroPedido: pedido.numeroPedido,
    estadoPago: "fallido",
  };
}
