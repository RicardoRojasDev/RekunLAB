import { NextResponse } from "next/server";
import { resolverAccesoAdministrador } from "./acceso-admin-servidor";

export async function resolverRespuestaAccesoAdministradorApi() {
  const acceso = await resolverAccesoAdministrador();

  if (!acceso.configuracionCompleta) {
    return NextResponse.json(
      {
        ok: false,
        codigo: "ADMIN_NO_CONFIGURADO",
        mensaje:
          "La zona administrativa todavia no tiene correos permitidos configurados.",
      },
      { status: 503 },
    );
  }

  if (!acceso.sesionActiva) {
    return NextResponse.json(
      {
        ok: false,
        codigo: "SESION_REQUERIDA",
        mensaje: "Necesitas iniciar sesion para usar la administracion.",
      },
      { status: 401 },
    );
  }

  if (!acceso.esAdministrador || !acceso.usuario) {
    return NextResponse.json(
      {
        ok: false,
        codigo: "ACCESO_DENEGADO",
        mensaje: "Tu cuenta no tiene permiso para operar el panel admin.",
      },
      { status: 403 },
    );
  }

  return null;
}
