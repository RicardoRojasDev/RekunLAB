import "server-only";

import type { RespuestaCatalogoProductos } from "../tipos/producto-catalogo";
import { consultarProductosCatalogoSupabase } from "./catalogo-supabase";

export type OpcionesObtencionCatalogo = Readonly<{
  incluirEsperaSimulada?: boolean;
}>;

export async function obtenerProductosCatalogo(
  opciones: OpcionesObtencionCatalogo = {},
): Promise<RespuestaCatalogoProductos> {
  return consultarProductosCatalogoSupabase(opciones);
}
