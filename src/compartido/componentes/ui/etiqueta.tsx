import type { ReactNode } from "react";
import { unirClases } from "@/compartido/utilidades/unir-clases";

type VarianteEtiqueta =
  | "suave"
  | "primaria"
  | "premium"
  | "oscura"
  | "critica";

type TamanioEtiqueta = "sm" | "md";

export type PropiedadesEtiqueta = Readonly<{
  children: ReactNode;
  claseName?: string;
  variante?: VarianteEtiqueta;
  tamanio?: TamanioEtiqueta;
  inicio?: ReactNode;
  fin?: ReactNode;
}>;

const clasesVariante: Record<VarianteEtiqueta, string> = {
  suave: "etiqueta-ui-suave",
  primaria: "etiqueta-ui-primaria",
  premium: "etiqueta-ui-premium",
  oscura: "etiqueta-ui-oscura",
  critica: "etiqueta-ui-critica",
};

const clasesTamanio: Record<TamanioEtiqueta, string> = {
  sm: "px-3 py-1.5 text-[11px]",
  md: "px-3.5 py-2 text-xs",
};

export function Etiqueta({
  children,
  claseName,
  variante = "suave",
  tamanio = "md",
  inicio,
  fin,
}: PropiedadesEtiqueta) {
  return (
    <span
      className={unirClases(
        "etiqueta-ui",
        clasesVariante[variante],
        clasesTamanio[tamanio],
        claseName,
      )}
    >
      {inicio}
      {children}
      {fin}
    </span>
  );
}
