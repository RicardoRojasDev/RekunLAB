import type { ProductoCatalogo } from "../tipos/producto-catalogo";
import {
  opcionesOrdenCatalogo,
  type OpcionFiltroCatalogo,
  type OpcionesPanelFiltrosCatalogo,
} from "../tipos/filtros-catalogo";

const comparadorCatalogo = new Intl.Collator("es-CL", {
  sensitivity: "base",
});

function construirOpcionesTexto(
  valores: readonly string[],
): readonly OpcionFiltroCatalogo[] {
  return [...new Set(valores)]
    .filter(Boolean)
    .sort(comparadorCatalogo.compare)
    .map((valor) => ({
      valor,
      etiqueta: valor,
    }));
}

export function extraerOpcionesFiltrosCatalogo(
  productos: readonly ProductoCatalogo[],
): OpcionesPanelFiltrosCatalogo {
  return {
    categorias: construirOpcionesTexto(
      productos.map((producto) => producto.categoria),
    ),
    colecciones: construirOpcionesTexto(
      productos.flatMap((producto) =>
        producto.coleccion ? [producto.coleccion] : [],
      ),
    ),
    tiposProducto: construirOpcionesTexto(
      productos.map((producto) => producto.tipoProducto),
    ),
    ordenamiento: opcionesOrdenCatalogo,
  };
}
