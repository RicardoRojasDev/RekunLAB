import { NextResponse } from "next/server";
import { obtenerVariableEntorno } from "@/compartido/configuracion/entorno";
import {
  confirmarPagoWebpayPlus,
  type EstadoPago,
} from "@/modulos/pagos";

export const runtime = "nodejs";

function normalizarUrlBase(urlBase: string) {
  return urlBase.endsWith("/") ? urlBase.slice(0, -1) : urlBase;
}

async function extraerParametrosRetorno(request: Request) {
  const url = new URL(request.url);
  const contentType = request.headers.get("content-type") ?? "";

  if (request.method === "POST" && contentType.includes("application/x-www-form-urlencoded")) {
    const data = await request.formData();

    return {
      tokenWs:
        typeof data.get("token_ws") === "string"
          ? String(data.get("token_ws"))
          : null,
      tbkToken:
        typeof data.get("TBK_TOKEN") === "string"
          ? String(data.get("TBK_TOKEN"))
          : null,
      tbkOrdenCompra:
        typeof data.get("TBK_ORDEN_COMPRA") === "string"
          ? String(data.get("TBK_ORDEN_COMPRA"))
          : null,
      tbkIdSesion:
        typeof data.get("TBK_ID_SESION") === "string"
          ? String(data.get("TBK_ID_SESION"))
          : null,
    };
  }

  return {
    tokenWs: url.searchParams.get("token_ws"),
    tbkToken: url.searchParams.get("TBK_TOKEN"),
    tbkOrdenCompra: url.searchParams.get("TBK_ORDEN_COMPRA"),
    tbkIdSesion: url.searchParams.get("TBK_ID_SESION"),
  };
}

function construirUrlResultado(
  pedidoId: string,
  estadoPago: EstadoPago,
) {
  const base = normalizarUrlBase(obtenerVariableEntorno("NEXT_PUBLIC_URL_BASE"));
  const url = new URL(`${base}/checkout/resultado`);
  url.searchParams.set("pedido", pedidoId);
  url.searchParams.set("estado", estadoPago);
  return url;
}

async function manejarRetorno(request: Request) {
  try {
    const parametros = await extraerParametrosRetorno(request);
    const resultado = await confirmarPagoWebpayPlus(parametros);

    return NextResponse.redirect(
      construirUrlResultado(resultado.pedidoId, resultado.estadoPago),
      { status: 303 },
    );
  } catch (error) {
    const base = normalizarUrlBase(obtenerVariableEntorno("NEXT_PUBLIC_URL_BASE"));
    const url = new URL(`${base}/checkout/resultado`);
    url.searchParams.set("estado", "fallido");
    url.searchParams.set(
      "error",
      error instanceof Error
        ? error.message
        : "No fue posible confirmar el pago retornado por Webpay Plus.",
    );

    return NextResponse.redirect(url, { status: 303 });
  }
}

export async function GET(request: Request) {
  return manejarRetorno(request);
}

export async function POST(request: Request) {
  return manejarRetorno(request);
}
