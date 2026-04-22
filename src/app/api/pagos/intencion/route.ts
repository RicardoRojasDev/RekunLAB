import { NextResponse } from "next/server";
import type { RespuestaApiCrearIntencionPago } from "@/modulos/pagos";
import { crearIntencionPagoPedido } from "@/modulos/pagos";
import { esUuid } from "@/compartido/utilidades/es-uuid";

export const runtime = "nodejs";

type BodyCrearIntencionPago = Readonly<{
  pedidoId?: unknown;
}>;

function obtenerPedidoId(body: BodyCrearIntencionPago) {
  return typeof body.pedidoId === "string" && body.pedidoId.trim().length
    ? body.pedidoId.trim()
    : null;
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    const respuesta: RespuestaApiCrearIntencionPago = {
      ok: false,
      codigo: "SOLICITUD_INVALIDA",
      mensaje: "No pudimos leer la solicitud para iniciar el pago.",
    };

    return NextResponse.json(respuesta, { status: 400 });
  }

  const pedidoId = obtenerPedidoId((body ?? {}) as BodyCrearIntencionPago);

  if (!pedidoId) {
    const respuesta: RespuestaApiCrearIntencionPago = {
      ok: false,
      codigo: "PEDIDO_INVALIDO",
      mensaje: "Necesitamos un pedido valido para crear la intencion de pago.",
    };

    return NextResponse.json(respuesta, { status: 400 });
  }

  if (!esUuid(pedidoId)) {
    const respuesta: RespuestaApiCrearIntencionPago = {
      ok: false,
      codigo: "PEDIDO_INVALIDO",
      mensaje: "Necesitamos un pedido valido para crear la intencion de pago.",
    };

    return NextResponse.json(respuesta, { status: 400 });
  }

  try {
    const resultado = await crearIntencionPagoPedido(pedidoId);
    const respuesta: RespuestaApiCrearIntencionPago = {
      ok: true,
      ...resultado,
    };

    return NextResponse.json(respuesta);
  } catch (error) {
    const respuesta: RespuestaApiCrearIntencionPago = {
      ok: false,
      codigo: "ERROR_INTENCION_PAGO",
      mensaje: "No pudimos iniciar el pago del pedido.",
      detalle: error instanceof Error ? error.message : undefined,
    };

    return NextResponse.json(respuesta, { status: 500 });
  }
}
