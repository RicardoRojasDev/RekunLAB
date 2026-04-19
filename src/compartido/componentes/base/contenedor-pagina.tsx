import type { PropiedadesConHijos } from "@/compartido/tipos/comunes";
import { unirClases } from "@/compartido/utilidades/unir-clases";

type PropiedadesContenedorPagina = Readonly<
  PropiedadesConHijos & {
    claseName?: string;
  }
>;

export function ContenedorPagina({
  children,
  claseName,
}: PropiedadesContenedorPagina) {
  return (
    <div
      className={unirClases(
        "mx-auto flex w-full max-w-7xl flex-col px-6 py-10 sm:px-8 lg:px-10",
        claseName,
      )}
    >
      {children}
    </div>
  );
}
