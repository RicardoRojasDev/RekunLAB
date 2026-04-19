export { ExperienciaCatalogoProductos } from "./componentes/experiencia-catalogo-productos";
export { CatalogoCargando } from "./componentes/catalogo-cargando";
export { ExperienciaDetalleProducto } from "./componentes/detalle-producto/experiencia-detalle-producto";
export { PaginaDetalleProducto } from "./componentes/pagina-detalle-producto";
export { PaginaCatalogoProductos } from "./componentes/pagina-catalogo-productos";
export { DetalleProductoCargando } from "./componentes/detalle-producto/detalle-producto-cargando";
export {
  obtenerProductoCatalogoPorSlug,
  obtenerProductosRelacionadosCatalogo,
  obtenerSlugsCatalogo,
} from "./servicios/obtener-detalle-producto-catalogo";
export { obtenerProductosCatalogo } from "./servicios/obtener-productos-catalogo";
export type {
  EstadoFiltrosCatalogo,
  OpcionFiltroCatalogo,
  OpcionesPanelFiltrosCatalogo,
} from "./tipos/filtros-catalogo";
export type {
  ConfiguracionVariantesProductoCatalogo,
  EstadoValidacionVariantesProductoCatalogo,
  MapaOpcionesDisponiblesVariantesProductoCatalogo,
  ProductoCatalogo,
  ProductoRelacionadoCatalogo,
  ResumenProductoCatalogo,
  SeleccionVarianteProductoCatalogo,
  VarianteProductoCatalogo,
  VistaDetalleProductoCatalogo,
} from "./tipos/producto-catalogo";
export { normalizarFiltrosCatalogoDesdeQuery } from "./utilidades/query-params-catalogo";
export {
  normalizarSeleccionVariantesProducto,
  obtenerSeleccionInicialVariantesProducto,
  productoTieneVariantes,
  resolverOpcionesDisponiblesVariantesProducto,
  resolverVarianteSeleccionadaProducto,
  resolverVistaDetalleProducto,
  validarSeleccionVariantesProducto,
} from "./utilidades/variantes-producto-catalogo";
