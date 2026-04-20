import type { ReactNode } from "react";
import { EstadoVacio } from "@/compartido/componentes/ui";

type PropiedadesEstadoVacioCatalogo = Readonly<{
  titulo?: string;
  descripcion?: string;
  accion?: ReactNode;
}>;

export function EstadoVacioCatalogo({
  titulo = "No hay productos disponibles por ahora",
  descripcion = "No encontramos productos activos para mostrar en este momento. Vuelve a intentarlo en unos minutos o revisa otro filtro.",
  accion,
}: PropiedadesEstadoVacioCatalogo) {
  return (
    <EstadoVacio
      titulo={titulo}
      descripcion={descripcion}
      icono={
        <span aria-hidden="true" className="text-lg tracking-[0.18em]">
          []
        </span>
      }
      accion={accion}
      claseName="min-h-[18rem]"
    />
  );
}
