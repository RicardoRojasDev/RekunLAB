import type { ReactNode } from "react";
import { EstadoVacio } from "@/compartido/componentes/ui";

type PropiedadesEstadoVacioCatalogo = Readonly<{
  titulo?: string;
  descripcion?: string;
  accion?: ReactNode;
}>;

export function EstadoVacioCatalogo({
  titulo = "No hay productos para mostrar todavia",
  descripcion = "La estructura del catalogo ya esta preparada. Cuando la fuente real o los mocks queden vacios, este estado mantiene la experiencia controlada y consistente.",
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
