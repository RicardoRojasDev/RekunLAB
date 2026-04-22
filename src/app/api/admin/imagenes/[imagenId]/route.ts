import { NextResponse } from "next/server";
import { resolverRespuestaAccesoAdministradorApi } from "@/modulos/admin/servicios/acceso-admin-api";
import {
  eliminarImagenProductoAdmin,
  ErrorOperacionAdminImagen,
  marcarImagenProductoComoPrincipalAdmin,
  type RespuestaApiAdminImagenes,
} from "@/modulos/admin-imagenes";
import { esUuid } from "@/compartido/utilidades/es-uuid";

export const runtime = "nodejs";

type PropiedadesRutaImagenAdmin = Readonly<{
  params: Promise<{
    imagenId: string;
  }>;
}>;

type PayloadImagenAdmin = Readonly<{
  accion?: unknown;
}>;

function responderError(
  codigo: string,
  mensaje: string,
  status: number,
  detalle?: string,
) {
  const respuesta: RespuestaApiAdminImagenes = {
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
  { params }: PropiedadesRutaImagenAdmin,
) {
  const respuestaAcceso = await resolverRespuestaAccesoAdministradorApi();

  if (respuestaAcceso) {
    return respuestaAcceso;
  }

  const { imagenId } = await params;

  if (!esUuid(imagenId)) {
    return responderError(
      "IMAGEN_INVALIDA",
      "El identificador de la imagen no es valido.",
      400,
    );
  }
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return responderError(
      "SOLICITUD_INVALIDA",
      "No pudimos leer la accion sobre la imagen.",
      400,
    );
  }

  const accion = obtenerTextoAccion((body as PayloadImagenAdmin)?.accion);

  if (accion !== "marcar-principal") {
    return responderError(
      "ACCION_INVALIDA",
      "La accion solicitada sobre la imagen no es valida.",
      400,
    );
  }

  try {
    const imagen = await marcarImagenProductoComoPrincipalAdmin(imagenId);
    const respuesta: RespuestaApiAdminImagenes = {
      ok: true,
      imagen,
      mensaje: "Imagen principal actualizada correctamente.",
    };

    return NextResponse.json(respuesta);
  } catch (error) {
    if (error instanceof ErrorOperacionAdminImagen) {
      return responderError(error.codigo, error.message, error.status);
    }

    return responderError(
      "ERROR_ACTUALIZAR_IMAGEN",
      "No pudimos actualizar la imagen seleccionada.",
      500,
      error instanceof Error ? error.message : undefined,
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: PropiedadesRutaImagenAdmin,
) {
  const respuestaAcceso = await resolverRespuestaAccesoAdministradorApi();

  if (respuestaAcceso) {
    return respuestaAcceso;
  }

  const { imagenId } = await params;

  if (!esUuid(imagenId)) {
    return responderError(
      "IMAGEN_INVALIDA",
      "El identificador de la imagen no es valido.",
      400,
    );
  }

  try {
    await eliminarImagenProductoAdmin(imagenId);
    const respuesta: RespuestaApiAdminImagenes = {
      ok: true,
      mensaje: "Imagen eliminada correctamente.",
    };

    return NextResponse.json(respuesta);
  } catch (error) {
    if (error instanceof ErrorOperacionAdminImagen) {
      return responderError(error.codigo, error.message, error.status);
    }

    return responderError(
      "ERROR_ELIMINAR_IMAGEN",
      "No pudimos eliminar la imagen seleccionada.",
      500,
      error instanceof Error ? error.message : undefined,
    );
  }
}
