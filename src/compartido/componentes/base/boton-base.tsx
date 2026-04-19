import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { unirClases } from "@/compartido/utilidades/unir-clases";

type VarianteBoton = "primario" | "secundario" | "fantasma";
type TamanioBoton = "md" | "lg";

type PropiedadesBotonBase = Readonly<
  Omit<ComponentPropsWithoutRef<"button">, "className" | "children"> & {
    children: ReactNode;
    claseName?: string;
    variante?: VarianteBoton;
    tamanio?: TamanioBoton;
    bloque?: boolean;
  }
>;

const clasesVariante: Record<VarianteBoton, string> = {
  primario: "boton-primario",
  secundario: "boton-secundario",
  fantasma: "boton-fantasma",
};

const clasesTamanio: Record<TamanioBoton, string> = {
  md: "min-h-11 px-4 text-sm",
  lg: "min-h-12 px-5 text-sm sm:text-[15px]",
};

export function BotonBase({
  children,
  claseName,
  variante = "primario",
  tamanio = "md",
  bloque = false,
  type = "button",
  ...propiedadesBoton
}: PropiedadesBotonBase) {
  return (
    <button
      type={type}
      className={unirClases(
        "boton-base",
        clasesVariante[variante],
        clasesTamanio[tamanio],
        bloque ? "w-full" : undefined,
        claseName,
      )}
      {...propiedadesBoton}
    >
      {children}
    </button>
  );
}
