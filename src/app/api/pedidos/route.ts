import { NextResponse } from "next/server";
import type { RespuestaApiCrearPedido } from "@/modulos/pedidos";
import { parsearSolicitudCrearPedido } from "@/modulos/pedidos/validaciones/parsear-solicitud-crear-pedido";
import {
  ErrorValidacionCrearPedido,
  registrarPedidoDesdeCheckout,
} from "@/modulos/pedidos/servicios/registrar-pedido-desde-checkout";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    const respuesta: RespuestaApiCrearPedido = {
      ok: false,
      codigo: "SOLICITUD_INVALIDA",
      mensaje: "No pudimos leer la solicitud. Revisa el contenido enviado.",
    };
    return NextResponse.json(respuesta, { status: 400 });
  }

  const solicitud = parsearSolicitudCrearPedido(body);

  if (!solicitud) {
    const respuesta: RespuestaApiCrearPedido = {
      ok: false,
      codigo: "SOLICITUD_INVALIDA",
      mensaje: "La solicitud no tiene el formato esperado.",
    };
    return NextResponse.json(respuesta, { status: 400 });
  }

  try {
    const resultado = await registrarPedidoDesdeCheckout(solicitud);
    const respuesta: RespuestaApiCrearPedido = {
      ok: true,
      ...resultado,
    };
    return NextResponse.json(respuesta);
  } catch (error) {
    if (error instanceof ErrorValidacionCrearPedido) {
      const respuesta: RespuestaApiCrearPedido = {
        ok: false,
        codigo: error.codigo,
        mensaje: "Revisa los campos del checkout antes de continuar.",
        detalle: JSON.stringify(error.errores),
      };
      return NextResponse.json(respuesta, { status: 422 });
    }

    const respuesta: RespuestaApiCrearPedido = {
      ok: false,
      codigo: "ERROR_CREAR_PEDIDO",
      mensaje: "No pudimos registrar tu pedido. Intenta nuevamente.",
      detalle: error instanceof Error ? error.message : undefined,
    };

    return NextResponse.json(respuesta, { status: 500 });
  }
}

