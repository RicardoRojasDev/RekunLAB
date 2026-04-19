import { productosCatalogoMock } from "../datos/productos-catalogo-mock";
import type { RespuestaCatalogoProductos } from "../tipos/producto-catalogo";

export type OpcionesObtencionCatalogo = Readonly<{
  incluirEsperaSimulada?: boolean;
}>;

const demoraMockCatalogoMs = 650;

function esperar(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function obtenerProductosCatalogo(
  opciones: OpcionesObtencionCatalogo = {},
): Promise<RespuestaCatalogoProductos> {
  const { incluirEsperaSimulada = true } = opciones;

  if (incluirEsperaSimulada) {
    await esperar(demoraMockCatalogoMs);
  }

  return productosCatalogoMock;
}
