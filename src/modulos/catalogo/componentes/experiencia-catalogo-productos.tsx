"use client";

import type {
  EstadoFiltrosCatalogo,
  OpcionesPanelFiltrosCatalogo,
} from "../tipos/filtros-catalogo";
import type { ProductoCatalogo } from "../tipos/producto-catalogo";
import {
  aplicarFiltrosYOrdenCatalogo,
  contarFiltrosActivosCatalogo,
  extraerFiltrosActivosCatalogo,
} from "../utilidades/aplicar-filtros-catalogo";
import { useFiltrosCatalogo } from "../hooks/use-filtros-catalogo";
import { GrillaProductosCatalogo } from "./grilla-productos-catalogo";
import { PanelFiltrosCatalogo } from "./panel-filtros-catalogo";
import { ResumenFiltrosActivosCatalogo } from "./resumen-filtros-activos-catalogo";

type PropiedadesExperienciaCatalogoProductos = Readonly<{
  productos: readonly ProductoCatalogo[];
  filtrosIniciales: EstadoFiltrosCatalogo;
  opcionesFiltros: OpcionesPanelFiltrosCatalogo;
}>;

export function ExperienciaCatalogoProductos({
  productos,
  filtrosIniciales,
  opcionesFiltros,
}: PropiedadesExperienciaCatalogoProductos) {
  const {
    filtros,
    actualizarFiltro,
    limpiarFiltro,
    limpiarFiltros,
    sincronizandoUrl,
  } = useFiltrosCatalogo({
    filtrosIniciales,
    opcionesFiltros,
  });

  const productosVisibles = aplicarFiltrosYOrdenCatalogo(productos, filtros);
  const cantidadFiltrosActivos = contarFiltrosActivosCatalogo(filtros);
  const filtrosActivos = extraerFiltrosActivosCatalogo(filtros);
  const cantidadColeccionesVisibles = new Set(
    productosVisibles.flatMap((producto) =>
      producto.coleccion ? [producto.coleccion] : [],
    ),
  ).size;

  return (
    <div className="space-y-6">
      <PanelFiltrosCatalogo
        filtros={filtros}
        opcionesFiltros={opcionesFiltros}
        cantidadResultados={productosVisibles.length}
        cantidadProductosTotales={productos.length}
        cantidadFiltrosActivos={cantidadFiltrosActivos}
        sincronizandoUrl={sincronizandoUrl}
        alCambiarFiltro={actualizarFiltro}
        alLimpiarFiltros={limpiarFiltros}
      />

      <ResumenFiltrosActivosCatalogo
        filtrosActivos={filtrosActivos}
        alQuitarFiltro={limpiarFiltro}
        alLimpiarFiltros={limpiarFiltros}
      />

      <GrillaProductosCatalogo
        productos={productosVisibles}
        cantidadColecciones={cantidadColeccionesVisibles}
        cantidadProductosTotales={productos.length}
        cantidadFiltrosActivos={cantidadFiltrosActivos}
        alLimpiarFiltros={limpiarFiltros}
      />
    </div>
  );
}
