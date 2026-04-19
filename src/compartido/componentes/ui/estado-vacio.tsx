import type { ReactNode } from "react";
import { Contenedor } from "./contenedor";

export type PropiedadesEstadoVacio = Readonly<{
  titulo: string;
  descripcion?: string;
  icono?: ReactNode;
  accion?: ReactNode;
  claseName?: string;
}>;

export function EstadoVacio({
  titulo,
  descripcion,
  icono,
  accion,
  claseName,
}: PropiedadesEstadoVacio) {
  return (
    <Contenedor variante="elevado" claseName={claseName}>
      <div className="flex flex-col items-start gap-5 sm:items-center sm:text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/82 text-slate-700 shadow-[var(--sombra-suave)]">
          {icono ?? (
            <span aria-hidden="true" className="text-xl">
              +
            </span>
          )}
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-slate-950">{titulo}</h2>
          {descripcion ? <p className="texto-soporte max-w-xl">{descripcion}</p> : null}
        </div>

        {accion ? <div>{accion}</div> : null}
      </div>
    </Contenedor>
  );
}
