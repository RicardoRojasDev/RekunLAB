export { ExperienciaCatalogoProductos } from "./componentes/experiencia-catalogo-productos";
export { CatalogoCargando } from "./componentes/catalogo-cargando";
export { PaginaCatalogoProductos } from "./componentes/pagina-catalogo-productos";
export { obtenerProductosCatalogo } from "./servicios/obtener-productos-catalogo";
export type {
  EstadoFiltrosCatalogo,
  OpcionFiltroCatalogo,
  OpcionesPanelFiltrosCatalogo,
} from "./tipos/filtros-catalogo";
export type { ProductoCatalogo } from "./tipos/producto-catalogo";
export { normalizarFiltrosCatalogoDesdeQuery } from "./utilidades/query-params-catalogo";
