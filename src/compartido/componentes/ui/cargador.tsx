import { unirClases } from "@/compartido/utilidades/unir-clases";

type TamanioCargador = "sm" | "md" | "lg";

export type PropiedadesCargador = Readonly<{
  etiqueta?: string;
  claseName?: string;
  centrado?: boolean;
  tamanio?: TamanioCargador;
}>;

const clasesTamanio: Record<TamanioCargador, string> = {
  sm: "cargador-ui-sm",
  md: "cargador-ui-md",
  lg: "cargador-ui-lg",
};

export function Cargador({
  etiqueta = "Cargando",
  claseName,
  centrado = false,
  tamanio = "md",
}: PropiedadesCargador) {
  return (
    <div
      role="status"
      className={unirClases(
        "inline-flex items-center gap-3",
        centrado ? "w-full justify-center" : undefined,
        claseName,
      )}
    >
      <span
        aria-hidden="true"
        className={unirClases("cargador-ui", clasesTamanio[tamanio])}
      />
      <span className="text-sm text-slate-600">{etiqueta}</span>
    </div>
  );
}
