import { NextResponse } from "next/server";
import type { RespuestaApiCrearCotizacion } from "@/modulos/cotizaciones";
import { parsearSolicitudCrearCotizacion } from "@/modulos/cotizaciones/validaciones/parsear-solicitud-crear-cotizacion";
import {
  ErrorValidacionCrearCotizacion,
  registrarCotizacionDesdeFormularioPublico,
} from "@/modulos/cotizaciones/servicios/registrar-cotizacion-desde-formulario-publico";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    const respuesta: RespuestaApiCrearCotizacion = {
      ok: false,
      codigo: "SOLICITUD_INVALIDA",
      mensaje: "No pudimos leer la solicitud. Revisa el contenido enviado.",
    };

    return NextResponse.json(respuesta, { status: 400 });
  }

  const solicitud = parsearSolicitudCrearCotizacion(body);

  if (!solicitud) {
    const respuesta: RespuestaApiCrearCotizacion = {
      ok: false,
      codigo: "SOLICITUD_INVALIDA",
      mensaje: "La solicitud no tiene el formato esperado.",
    };

    return NextResponse.json(respuesta, { status: 400 });
  }

  try {
    const resultado = await registrarCotizacionDesdeFormularioPublico(solicitud);
    const respuesta: RespuestaApiCrearCotizacion = {
      ok: true,
      ...resultado,
    };

    return NextResponse.json(respuesta);
  } catch (error) {
    if (error instanceof ErrorValidacionCrearCotizacion) {
      const respuesta: RespuestaApiCrearCotizacion = {
        ok: false,
        codigo: error.codigo,
        mensaje: "Revisa los campos del formulario antes de continuar.",
        detalle: JSON.stringify(error.errores),
      };

      return NextResponse.json(respuesta, { status: 422 });
    }

    const respuesta: RespuestaApiCrearCotizacion = {
      ok: false,
      codigo: "ERROR_CREAR_COTIZACION",
      mensaje: "No pudimos registrar tu cotizacion. Intenta nuevamente.",
      detalle: error instanceof Error ? error.message : undefined,
    };

    return NextResponse.json(respuesta, { status: 500 });
  }
}

