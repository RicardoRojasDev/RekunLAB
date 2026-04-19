import type { HTMLAttributes } from "react";
import { unirClases } from "@/compartido/utilidades/unir-clases";

type EtiquetaHtmlContenedor = "div" | "section" | "article" | "aside";
type VarianteContenedor = "base" | "elevado" | "oscuro";
type RellenoContenedor = "sm" | "md" | "lg";

export type PropiedadesContenedor = Readonly<
  Omit<HTMLAttributes<HTMLElement>, "className"> & {
    claseName?: string;
    etiquetaHtml?: EtiquetaHtmlContenedor;
    variante?: VarianteContenedor;
    relleno?: RellenoContenedor;
  }
>;

const clasesVariante: Record<VarianteContenedor, string> = {
  base: "contenedor-ui contenedor-ui-base",
  elevado: "contenedor-ui contenedor-ui-elevado",
  oscuro: "contenedor-ui contenedor-ui-oscuro",
};

const clasesRelleno: Record<RellenoContenedor, string> = {
  sm: "p-4",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-8",
};

export function Contenedor({
  claseName,
  etiquetaHtml = "div",
  variante = "base",
  relleno = "md",
  children,
  ...propiedadesContenedor
}: PropiedadesContenedor) {
  const Etiqueta = etiquetaHtml;

  return (
    <Etiqueta
      className={unirClases(
        clasesVariante[variante],
        clasesRelleno[relleno],
        claseName,
      )}
      {...propiedadesContenedor}
    >
      {children}
    </Etiqueta>
  );
}
