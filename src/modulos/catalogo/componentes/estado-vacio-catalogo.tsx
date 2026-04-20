import type { ReactNode } from "react";
import { EstadoVacio } from "@/compartido/componentes/ui";

type PropiedadesEstadoVacioCatalogo = Readonly<{
  titulo?: string;
  descripcion?: string;
  accion?: ReactNode;
}>;

export function EstadoVacioCatalogo({
  titulo = "No hay productos para mostrar todavia",
  descripcion = "No hay productos activos disponibles en el catalogo real. Revisa la carga en Supabase o ajusta los filtros aplicados.",
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
