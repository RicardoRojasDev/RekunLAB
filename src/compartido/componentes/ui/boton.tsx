import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { unirClases } from "@/compartido/utilidades/unir-clases";

type VarianteBoton = "primario" | "secundario" | "fantasma";
type TamanioBoton = "sm" | "md" | "lg";

export type PropiedadesBoton = Readonly<
  Omit<ComponentPropsWithoutRef<"button">, "className" | "children"> & {
    children: ReactNode;
    claseName?: string;
    variante?: VarianteBoton;
    tamanio?: TamanioBoton;
    bloque?: boolean;
    inicio?: ReactNode;
    fin?: ReactNode;
    cargando?: boolean;
  }
>;

const clasesVariante: Record<VarianteBoton, string> = {
  primario: "boton-primario",
  secundario: "boton-secundario",
  fantasma: "boton-fantasma",
};

const clasesTamanio: Record<TamanioBoton, string> = {
  sm: "min-h-10 px-4 text-sm",
  md: "min-h-11 px-4 text-sm",
  lg: "min-h-12 px-5 text-sm sm:text-[15px]",
};

export function Boton({
  children,
  claseName,
  variante = "primario",
  tamanio = "md",
  bloque = false,
  inicio,
  fin,
  cargando = false,
  disabled,
  type = "button",
  ...propiedadesBoton
}: PropiedadesBoton) {
  const deshabilitado = disabled || cargando;

  return (
    <button
      type={type}
      aria-busy={cargando || undefined}
      className={unirClases(
        "boton-base",
        clasesVariante[variante],
        clasesTamanio[tamanio],
        bloque ? "w-full" : undefined,
        claseName,
      )}
      disabled={deshabilitado}
      {...propiedadesBoton}
    >
      {cargando ? <span aria-hidden="true" className="cargador-ui cargador-ui-sm" /> : inicio}
      {children}
      {cargando ? null : fin}
    </button>
  );
}
