import type { PropiedadesConHijos } from "@/compartido/tipos/comunes";
import { unirClases } from "@/compartido/utilidades/unir-clases";

type PropiedadesContenedorPrincipal = Readonly<
  PropiedadesConHijos & {
    claseName?: string;
  }
>;

export function ContenedorPrincipal({
  children,
  claseName,
}: PropiedadesContenedorPrincipal) {
  return (
    <div
      className={unirClases(
        "mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10 xl:px-12",
        claseName,
      )}
    >
      {children}
    </div>
  );
}
