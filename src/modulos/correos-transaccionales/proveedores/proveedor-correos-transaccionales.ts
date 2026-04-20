import "server-only";

import { obtenerVariableEntornoOpcional } from "@/compartido/configuracion/entorno";
import type { ProveedorCorreosTransaccionales } from "../tipos/correos-transaccionales";
import { crearProveedorResend } from "./proveedor-resend";

export type ConfiguracionCorreosTransaccionales = Readonly<{
  correoOrigen: string;
  correoInterno: string | null;
  proveedor: ProveedorCorreosTransaccionales;
}>;

export function obtenerConfiguracionCorreosTransaccionales():
  | ConfiguracionCorreosTransaccionales
  | null {
  const apiKey = obtenerVariableEntornoOpcional("RESEND_API_KEY");
  const correoOrigen = obtenerVariableEntornoOpcional("CORREO_ORIGEN_TRANSACCIONAL");
  const correoInterno = obtenerVariableEntornoOpcional("CORREO_RESPALDO_PEDIDOS");

  if (!apiKey || !correoOrigen) {
    return null;
  }

  return {
    correoOrigen,
    correoInterno,
    proveedor: crearProveedorResend({
      apiKey,
      correoOrigen,
    }),
  };
}
