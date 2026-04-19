import type {
  EstadoFiltrosCatalogo,
  FiltroActivoCatalogo,
} from "../tipos/filtros-catalogo";
import {
  filtrosCatalogoPorDefecto,
  opcionesOrdenCatalogo,
} from "../tipos/filtros-catalogo";
import type { ProductoCatalogo } from "../tipos/producto-catalogo";

const comparadorTextoCatalogo = new Intl.Collator("es-CL", {
  sensitivity: "base",
});

const mapaEtiquetasOrden = new Map(
  opcionesOrdenCatalogo.map((opcion) => [opcion.valor, opcion.etiqueta]),
);

export function aplicarFiltrosYOrdenCatalogo(
  productos: readonly ProductoCatalogo[],
  filtros: EstadoFiltrosCatalogo,
): readonly ProductoCatalogo[] {
  const productosFiltrados = productos.filter((producto) => {
    if (filtros.categoria && producto.categoria !== filtros.categoria) {
      return false;
    }

    if (filtros.coleccion && producto.coleccion !== filtros.coleccion) {
      return false;
    }

    if (filtros.tipoProducto && producto.tipoProducto !== filtros.tipoProducto) {
      return false;
    }

    return true;
  });

  const productosOrdenados = [...productosFiltrados];

  switch (filtros.orden) {
    case "precio-menor":
      productosOrdenados.sort(
        (productoA, productoB) =>
          productoA.precioIvaIncluido - productoB.precioIvaIncluido,
      );
      break;
    case "precio-mayor":
      productosOrdenados.sort(
        (productoA, productoB) =>
          productoB.precioIvaIncluido - productoA.precioIvaIncluido,
      );
      break;
    case "nombre-az":
      productosOrdenados.sort((productoA, productoB) =>
        comparadorTextoCatalogo.compare(productoA.nombre, productoB.nombre),
      );
      break;
    default:
      break;
  }

  return productosOrdenados;
}

export function contarFiltrosActivosCatalogo(
  filtros: EstadoFiltrosCatalogo,
): number {
  let cantidadActivos = 0;

  if (filtros.categoria) {
    cantidadActivos += 1;
  }

  if (filtros.coleccion) {
    cantidadActivos += 1;
  }

  if (filtros.tipoProducto) {
    cantidadActivos += 1;
  }

  if (filtros.orden !== filtrosCatalogoPorDefecto.orden) {
    cantidadActivos += 1;
  }

  return cantidadActivos;
}

export function extraerFiltrosActivosCatalogo(
  filtros: EstadoFiltrosCatalogo,
): readonly FiltroActivoCatalogo[] {
  const filtrosActivos: FiltroActivoCatalogo[] = [];

  if (filtros.categoria) {
    filtrosActivos.push({
      clave: "categoria",
      etiqueta: "Categoria",
      valor: filtros.categoria,
    });
  }

  if (filtros.coleccion) {
    filtrosActivos.push({
      clave: "coleccion",
      etiqueta: "Coleccion",
      valor: filtros.coleccion,
    });
  }

  if (filtros.tipoProducto) {
    filtrosActivos.push({
      clave: "tipoProducto",
      etiqueta: "Tipo",
      valor: filtros.tipoProducto,
    });
  }

  if (filtros.orden !== filtrosCatalogoPorDefecto.orden) {
    filtrosActivos.push({
      clave: "orden",
      etiqueta: "Orden",
      valor:
        mapaEtiquetasOrden.get(filtros.orden) ?? filtrosCatalogoPorDefecto.orden,
    });
  }

  return filtrosActivos;
}
