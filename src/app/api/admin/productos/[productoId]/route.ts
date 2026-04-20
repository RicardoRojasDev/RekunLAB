import { NextResponse } from "next/server";
import { resolverRespuestaAccesoAdministradorApi } from "@/modulos/admin/servicios/acceso-admin-api";
import {
  actualizarProductoAdmin,
  cambiarEstadoProductoAdmin,
  eliminarLogicoProductoAdmin,
  ErrorOperacionAdminProducto,
  ErrorValidacionProductoAdmin,
  type RespuestaApiAdminProductos,
  validarDatosFormularioProductoAdmin,
} from "@/modulos/admin-productos";

export const runtime = "nodejs";

type PropiedadesRutaProductoAdmin = Readonly<{
  params: Promise<{
    productoId: string;
  }>;
}>;

type PayloadAccionProductoAdmin = Readonly<{
  accion?: unknown;
  estadoCodigo?: unknown;
}>;

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

function obtenerTextoAccion(valor: unknown) {
  return typeof valor === "string" && valor.trim().length ? valor.trim() : null;
}

export async function PATCH(
  request: Request,
  { params }: PropiedadesRutaProductoAdmin,
) {
  const respuestaAcceso = await resolverRespuestaAccesoAdministradorApi();

  if (respuestaAcceso) {
    return respuestaAcceso;
  }

  const { productoId } = await params;
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return responderError(
      "SOLICITUD_INVALIDA",
      "No pudimos leer la actualizacion del producto.",
      400,
    );
  }

  const payloadAccion = (body ?? {}) as PayloadAccionProductoAdmin;
  const accion = obtenerTextoAccion(payloadAccion.accion);

  try {
    if (accion === "actualizar-estado") {
      const estadoCodigo = obtenerTextoAccion(payloadAccion.estadoCodigo);

      if (!estadoCodigo) {
        return responderError(
          "ESTADO_INVALIDO",
          "Debes indicar el estado destino para el producto.",
          400,
        );
      }

      const producto = await cambiarEstadoProductoAdmin(productoId, estadoCodigo);
      const respuesta: RespuestaApiAdminProductos = {
        ok: true,
        producto,
        mensaje: "Estado del producto actualizado correctamente.",
      };

      return NextResponse.json(respuesta);
    }

    if (accion === "eliminacion-logica") {
      const producto = await eliminarLogicoProductoAdmin(productoId);
      const respuesta: RespuestaApiAdminProductos = {
        ok: true,
        producto,
        mensaje: "Producto ocultado logicamente.",
      };

      return NextResponse.json(respuesta);
    }

    const datos = validarDatosFormularioProductoAdmin(body);
    const producto = await actualizarProductoAdmin(productoId, datos);
    const respuesta: RespuestaApiAdminProductos = {
      ok: true,
      producto,
      mensaje: "Producto actualizado correctamente.",
    };

    return NextResponse.json(respuesta);
  } catch (error) {
    if (error instanceof ErrorValidacionProductoAdmin) {
      return responderError(
        "VALIDACION_PRODUCTO",
        error.errores[0] ?? "Revisa los datos del producto antes de guardar.",
        422,
        error.errores.join(" "),
      );
    }

    if (error instanceof ErrorOperacionAdminProducto) {
      return responderError(error.codigo, error.message, error.status);
    }

    return responderError(
      "ERROR_ACTUALIZAR_PRODUCTO",
      "No pudimos actualizar el producto.",
      500,
      error instanceof Error ? error.message : undefined,
    );
  }
}
