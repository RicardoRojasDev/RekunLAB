"use client";

import { Boton, Etiqueta } from "@/compartido/componentes/ui";
import { unirClases } from "@/compartido/utilidades/unir-clases";
import type {
  ClaveFiltroCatalogo,
  FiltroActivoCatalogo,
} from "../tipos/filtros-catalogo";

type PropiedadesResumenFiltrosActivosCatalogo = Readonly<{
  filtrosActivos: readonly FiltroActivoCatalogo[];
  alQuitarFiltro: (clave: ClaveFiltroCatalogo) => void;
  alLimpiarFiltros: () => void;
}>;

export function ResumenFiltrosActivosCatalogo({
  filtrosActivos,
  alQuitarFiltro,
  alLimpiarFiltros,
}: PropiedadesResumenFiltrosActivosCatalogo) {
  if (!filtrosActivos.length) {
    return null;
  }

  return (
    <section
      aria-label="Filtros activos"
      className="flex flex-col gap-3 rounded-[var(--radio-lg)] border border-[color:var(--color-borde)] bg-white/58 p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Etiqueta variante="suave">Activos</Etiqueta>

        {filtrosActivos.map((filtro) => (
          <button
            key={`${filtro.clave}-${filtro.valor}`}
            type="button"
            onClick={() => alQuitarFiltro(filtro.clave)}
            className={unirClases(
              "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors",
              "border-[color:var(--color-borde)] bg-white/86 text-slate-700 hover:border-[color:var(--color-borde-fuerte)] hover:bg-white",
            )}
          >
            <span className="text-slate-500">{filtro.etiqueta}</span>
            <span className="text-slate-950">{filtro.valor}</span>
            <span aria-hidden="true" className="text-slate-400">
              x
            </span>
          </button>
        ))}
      </div>

      <Boton variante="fantasma" tamanio="sm" onClick={alLimpiarFiltros}>
        Limpiar filtros
      </Boton>
    </section>
  );
}
