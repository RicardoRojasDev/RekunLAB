import { NextResponse } from "next/server";
import { resolverRespuestaAccesoAdministradorApi } from "@/modulos/admin/servicios/acceso-admin-api";
import {
  ErrorOperacionAdminImagen,
  subirImagenProductoAdmin,
  type RespuestaApiAdminImagenes,
} from "@/modulos/admin-imagenes";

export const runtime = "nodejs";

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

function obtenerTexto(formData: FormData, clave: string) {
  const valor = formData.get(clave);
  return typeof valor === "string" && valor.trim().length ? valor.trim() : null;
}

function obtenerBooleano(formData: FormData, clave: string) {
  const valor = formData.get(clave);
  return valor === "true" || valor === "on" || valor === "1";
}

export async function POST(request: Request) {
  const respuestaAcceso = await resolverRespuestaAccesoAdministradorApi();

  if (respuestaAcceso) {
    return respuestaAcceso;
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return responderError(
      "SOLICITUD_INVALIDA",
      "No pudimos leer la carga de imagen enviada.",
      400,
    );
  }

  const productoId = obtenerTexto(formData, "productoId");
  const alt = obtenerTexto(formData, "alt");
  const etiqueta = obtenerTexto(formData, "etiqueta");
  const marcarComoPrincipal = obtenerBooleano(formData, "marcarComoPrincipal");
  const archivo = formData.get("archivo");

  if (!productoId) {
    return responderError(
      "PRODUCTO_REQUERIDO",
      "Debes seleccionar un producto para asociar la imagen.",
      400,
    );
  }

  if (!(archivo instanceof File)) {
    return responderError(
      "ARCHIVO_REQUERIDO",
      "Debes seleccionar una imagen valida para subir.",
      400,
    );
  }

  try {
    const imagen = await subirImagenProductoAdmin({
      productoId,
      archivo,
      alt: alt ?? "",
      etiqueta,
      marcarComoPrincipal,
    });

    const respuesta: RespuestaApiAdminImagenes = {
      ok: true,
      imagen,
      mensaje: "Imagen subida y asociada correctamente al producto.",
    };

    return NextResponse.json(respuesta, { status: 201 });
  } catch (error) {
    if (error instanceof ErrorOperacionAdminImagen) {
      return responderError(error.codigo, error.message, error.status);
    }

    return responderError(
      "ERROR_SUBIR_IMAGEN",
      "No pudimos completar la carga de imagen.",
      500,
      error instanceof Error ? error.message : undefined,
    );
  }
}
