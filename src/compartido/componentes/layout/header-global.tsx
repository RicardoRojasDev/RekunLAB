import { ContenedorPrincipal } from "@/compartido/componentes/base/contenedor-principal";
import { NavegacionPrincipal } from "@/compartido/componentes/layout/navegacion-principal";
import { espaciosPreparadosLayout } from "@/compartido/configuracion/layout-global";
import { unirClases } from "@/compartido/utilidades/unir-clases";
import { MarcaPrincipal } from "./marca-principal";

const etiquetasCabecera = [
  "Solo Chile",
  "Carrito preparado",
] as const;

export function HeaderGlobal() {
  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--color-borde)] bg-[rgba(248,250,247,0.86)] backdrop-blur-2xl">
      <ContenedorPrincipal claseName="py-4 sm:py-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <MarcaPrincipal />

            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
              {etiquetasCabecera.map((etiqueta) => (
                <span
                  key={etiqueta}
                  className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-borde)] bg-white/75 px-3 py-2 text-xs font-medium tracking-[0.14em] uppercase text-slate-600"
                >
                  <span className="h-2 w-2 rounded-full bg-[color:var(--color-acento)]" />
                  {etiqueta}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <NavegacionPrincipal claseName="w-full" />
            </div>

            <div className="hidden flex-wrap items-center gap-2 lg:flex">
              {espaciosPreparadosLayout.slice(0, 2).map((etiqueta) => (
                <span
                  key={etiqueta}
                  className={unirClases(
                    "rounded-full px-3 py-2 text-xs tracking-[0.16em] uppercase",
                    "bg-slate-950 text-white",
                  )}
                >
                  {etiqueta}
                </span>
              ))}
            </div>
          </div>
        </div>
      </ContenedorPrincipal>
    </header>
  );
}
