"use client";

import { Boton, Contenedor, Etiqueta, Selector } from "@/compartido/componentes/ui";
import type {
  ClaveFiltroCatalogo,
  EstadoFiltrosCatalogo,
  OpcionesPanelFiltrosCatalogo,
} from "../tipos/filtros-catalogo";

type PropiedadesPanelFiltrosCatalogo = Readonly<{
  filtros: EstadoFiltrosCatalogo;
  opcionesFiltros: OpcionesPanelFiltrosCatalogo;
  cantidadResultados: number;
  cantidadProductosTotales: number;
  cantidadFiltrosActivos: number;
  sincronizandoUrl: boolean;
  alCambiarFiltro: (clave: ClaveFiltroCatalogo, valor: string) => void;
  alLimpiarFiltros: () => void;
}>;

export function PanelFiltrosCatalogo({
  filtros,
  opcionesFiltros,
  cantidadResultados,
  cantidadProductosTotales,
  cantidadFiltrosActivos,
  sincronizandoUrl,
  alCambiarFiltro,
  alLimpiarFiltros,
}: PropiedadesPanelFiltrosCatalogo) {
  return (
    <Contenedor etiquetaHtml="section" variante="base" relleno="lg">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <Etiqueta variante="primaria">Sistema de filtros</Etiqueta>

            <div className="space-y-2">
              <h2 className="titulo-seccion text-slate-950">
                Explora por categoria, coleccion, tipo y orden sin acoplar la
                UI a una fuente fija de datos
              </h2>
              <p className="texto-soporte max-w-3xl">
                La URL conserva el estado base de filtrado y deja el contrato
                listo para que despues la misma interfaz pueda hablar con datos
                reales.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Etiqueta variante="suave">
              {cantidadResultados} de {cantidadProductosTotales} productos
            </Etiqueta>
            <Etiqueta variante="premium">
              {cantidadFiltrosActivos} filtros activos
            </Etiqueta>

            <Boton
              variante="fantasma"
              tamanio="sm"
              disabled={cantidadFiltrosActivos === 0}
              onClick={alLimpiarFiltros}
            >
              Limpiar filtros
            </Boton>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Selector
            etiqueta="Categoria"
            placeholder="Todas las categorias"
            opciones={opcionesFiltros.categorias}
            value={filtros.categoria}
            onChange={(evento) =>
              alCambiarFiltro("categoria", evento.target.value)
            }
          />

          <Selector
            etiqueta="Coleccion"
            placeholder="Todas las colecciones"
            opciones={opcionesFiltros.colecciones}
            value={filtros.coleccion}
            onChange={(evento) =>
              alCambiarFiltro("coleccion", evento.target.value)
            }
          />

          <Selector
            etiqueta="Tipo de producto"
            placeholder="Todos los tipos"
            opciones={opcionesFiltros.tiposProducto}
            value={filtros.tipoProducto}
            onChange={(evento) =>
              alCambiarFiltro("tipoProducto", evento.target.value)
            }
          />

          <Selector
            etiqueta="Ordenamiento"
            opciones={opcionesFiltros.ordenamiento}
            value={filtros.orden}
            onChange={(evento) => alCambiarFiltro("orden", evento.target.value)}
          />
        </div>

        <div className="flex min-h-6 items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Query params base habilitados para categoria, coleccion, tipo y
            orden.
          </p>

          {sincronizandoUrl ? (
            <span className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Sincronizando URL...
            </span>
          ) : null}
        </div>
      </div>
    </Contenedor>
  );
}
