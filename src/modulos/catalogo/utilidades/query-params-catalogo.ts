import type {
  EstadoFiltrosCatalogo,
  OpcionesPanelFiltrosCatalogo,
  ValorOrdenCatalogo,
} from "../tipos/filtros-catalogo";
import {
  filtrosCatalogoPorDefecto,
  opcionesOrdenCatalogo,
} from "../tipos/filtros-catalogo";

type ValorQueryCatalogo = string | readonly string[] | string[] | undefined;

type RegistroQueryCatalogo = Readonly<Record<string, ValorQueryCatalogo>>;

type FuenteQueryCatalogo =
  | RegistroQueryCatalogo
  | Pick<URLSearchParams, "get">
  | null
  | undefined;

const valoresOrdenPermitidos = new Set<ValorOrdenCatalogo>(
  opcionesOrdenCatalogo.map((opcion) => opcion.valor),
);

function extraerValorQuery(
  fuente: FuenteQueryCatalogo,
  clave: string,
): string {
  if (!fuente) {
    return "";
  }

  if (tieneMetodoGet(fuente)) {
    return fuente.get(clave)?.trim() ?? "";
  }

  const valor = fuente[clave];

  if (typeof valor === "string") {
    return valor.trim();
  }

  if (Array.isArray(valor)) {
    return valor[0]?.trim() ?? "";
  }

  return "";
}

function tieneMetodoGet(
  fuente: FuenteQueryCatalogo,
): fuente is Pick<URLSearchParams, "get"> {
  return typeof fuente?.get === "function";
}

function construirConjuntoPermitido(
  opciones: readonly { valor: string }[],
): ReadonlySet<string> {
  return new Set(opciones.map((opcion) => opcion.valor));
}

export function normalizarFiltrosCatalogoDesdeQuery(
  fuente: FuenteQueryCatalogo,
): EstadoFiltrosCatalogo {
  const valorOrden = extraerValorQuery(fuente, "orden");

  return {
    categoria: extraerValorQuery(fuente, "categoria"),
    coleccion: extraerValorQuery(fuente, "coleccion"),
    tipoProducto: extraerValorQuery(fuente, "tipo"),
    orden: valoresOrdenPermitidos.has(valorOrden as ValorOrdenCatalogo)
      ? (valorOrden as ValorOrdenCatalogo)
      : filtrosCatalogoPorDefecto.orden,
  };
}

export function depurarFiltrosCatalogoConOpciones(
  filtros: EstadoFiltrosCatalogo,
  opciones: OpcionesPanelFiltrosCatalogo,
): EstadoFiltrosCatalogo {
  const categoriasPermitidas = construirConjuntoPermitido(opciones.categorias);
  const coleccionesPermitidas = construirConjuntoPermitido(opciones.colecciones);
  const tiposPermitidos = construirConjuntoPermitido(opciones.tiposProducto);

  return {
    categoria: categoriasPermitidas.has(filtros.categoria)
      ? filtros.categoria
      : "",
    coleccion: coleccionesPermitidas.has(filtros.coleccion)
      ? filtros.coleccion
      : "",
    tipoProducto: tiposPermitidos.has(filtros.tipoProducto)
      ? filtros.tipoProducto
      : "",
    orden: valoresOrdenPermitidos.has(filtros.orden)
      ? filtros.orden
      : filtrosCatalogoPorDefecto.orden,
  };
}

export function serializarFiltrosCatalogoEnQuery(
  filtros: EstadoFiltrosCatalogo,
): string {
  const query = new URLSearchParams();

  if (filtros.categoria) {
    query.set("categoria", filtros.categoria);
  }

  if (filtros.coleccion) {
    query.set("coleccion", filtros.coleccion);
  }

  if (filtros.tipoProducto) {
    query.set("tipo", filtros.tipoProducto);
  }

  if (filtros.orden !== filtrosCatalogoPorDefecto.orden) {
    query.set("orden", filtros.orden);
  }

  return query.toString();
}
