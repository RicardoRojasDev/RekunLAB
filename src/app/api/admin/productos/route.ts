import { NextResponse } from "next/server";
import { resolverRespuestaAccesoAdministradorApi } from "@/modulos/admin/servicios/acceso-admin-api";
import {
  crearProductoAdmin,
  ErrorOperacionAdminProducto,
  ErrorValidacionProductoAdmin,
  obtenerVistaAdminProductos,
  type RespuestaApiAdminProductos,
  validarDatosFormularioProductoAdmin,
} from "@/modulos/admin-productos";

export const runtime = "nodejs";

function responderError(
  codigo: string,
  mensaje: string,
  status: number,
  detalle?: string,
) {
  const respuesta: RespuestaApiAdminProductos = {
    ok: false,
    codigo,
    mensaje,
    detalle,
  };

  return NextResponse.json(respuesta, { status });
}

export async function GET() {
  const respuestaAcceso = await resolverRespuestaAccesoAdministradorApi();

  if (respuestaAcceso) {
    return respuestaAcceso;
  }

  try {
    const vista = await obtenerVistaAdminProductos();
    const respuesta: RespuestaApiAdminProductos = {
      ok: true,
      productos: vista.productos,
      opciones: vista.opciones,
    };

    return NextResponse.json(respuesta);
  } catch (error) {
    return responderError(
      "ERROR_VISTA_PRODUCTOS_ADMIN",
      "No pudimos cargar la administracion de productos.",
      500,
      error instanceof Error ? error.message : undefined,
    );
  }
}

export async function POST(request: Request) {
  const respuestaAcceso = await resolverRespuestaAccesoAdministradorApi();

  if (respuestaAcceso) {
    return respuestaAcceso;
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return responderError(
      "SOLICITUD_INVALIDA",
      "No pudimos leer la solicitud del producto.",
      400,
    );
  }

  try {
    const datos = validarDatosFormularioProductoAdmin(body);
    const producto = await crearProductoAdmin(datos);
    const respuesta: RespuestaApiAdminProductos = {
      ok: true,
      producto,
      mensaje: "Producto creado correctamente.",
    };

    return NextResponse.json(respuesta, { status: 201 });
  } catch (error) {
    if (error instanceof ErrorValidacionProductoAdmin) {
      return responderError(
        "VALIDACION_PRODUCTO",
        error.errores[0] ?? "Revisa los datos del producto antes de guardarlo.",
        422,
        error.errores.join(" "),
      );
    }

    if (error instanceof ErrorOperacionAdminProducto) {
      return responderError(error.codigo, error.message, error.status);
    }

    return responderError(
      "ERROR_CREAR_PRODUCTO",
      "No pudimos crear el producto en este momento.",
      500,
      error instanceof Error ? error.message : undefined,
    );
  }
}
