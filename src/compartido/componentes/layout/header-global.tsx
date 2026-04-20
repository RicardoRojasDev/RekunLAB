import { ContenedorPrincipal } from "@/compartido/componentes/base/contenedor-principal";
import { NavegacionPrincipal } from "@/compartido/componentes/layout/navegacion-principal";
import { AccionesAutenticacionCabecera } from "@/modulos/autenticacion";
import { AccionesCarritoCabecera } from "@/modulos/carrito";
import { MarcaPrincipal } from "./marca-principal";

export function HeaderGlobal() {
  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--color-borde)] bg-[rgba(248,250,247,0.86)] backdrop-blur-2xl">
      <ContenedorPrincipal claseName="py-4 sm:py-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <MarcaPrincipal />

            <div className="flex flex-col gap-3 sm:items-end">
              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <AccionesAutenticacionCabecera />
                <AccionesCarritoCabecera />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <NavegacionPrincipal claseName="w-full" />
            </div>
          </div>
        </div>
      </ContenedorPrincipal>
    </header>
  );
}
