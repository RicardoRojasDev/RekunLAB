import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { unirClases } from "@/compartido/utilidades/unir-clases";
import { CampoFormularioBase } from "./internos/campo-formulario-base";
import { useCampoControl } from "./internos/use-campo-control";

type OpcionSelector = Readonly<{
  valor: string;
  etiqueta: string;
  deshabilitada?: boolean;
}>;

export type PropiedadesSelector = Readonly<
  Omit<ComponentPropsWithoutRef<"select">, "className" | "children"> & {
    claseName?: string;
    claseNameContenedor?: string;
    etiqueta?: string;
    ayuda?: string;
    error?: string;
    obligatorio?: boolean;
    placeholder?: string;
    opciones?: readonly OpcionSelector[];
    children?: ReactNode;
    contenidoComplementarioEtiqueta?: ReactNode;
  }
>;

export function Selector({
  claseName,
  claseNameContenedor,
  etiqueta,
  ayuda,
  error,
  obligatorio = false,
  placeholder,
  opciones,
  children,
  contenidoComplementarioEtiqueta,
  id,
  ...propiedadesSelector
}: PropiedadesSelector) {
  const { idControl, idAyuda, idError, ariaDescribedBy } = useCampoControl({
    id,
    ayuda,
    error,
  });

  return (
    <CampoFormularioBase
      idControl={idControl}
      idAyuda={idAyuda}
      idError={idError}
      etiqueta={etiqueta}
      ayuda={ayuda}
      error={error}
      obligatorio={obligatorio}
      contenidoComplementarioEtiqueta={contenidoComplementarioEtiqueta}
      claseName={claseNameContenedor}
    >
      <div className="relative">
        <select
          id={idControl}
          aria-describedby={ariaDescribedBy}
          aria-invalid={Boolean(error)}
          className={unirClases(
            "control-entrada control-entrada-selector",
            error ? "control-entrada-error" : undefined,
            claseName,
          )}
          {...propiedadesSelector}
        >
          {placeholder ? <option value="">{placeholder}</option> : null}
          {opciones?.map((opcion) => (
            <option
              key={`${opcion.valor}-${opcion.etiqueta}`}
              value={opcion.valor}
              disabled={opcion.deshabilitada}
            >
              {opcion.etiqueta}
            </option>
          ))}
          {children}
        </select>

        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-500"
        >
          <svg
            viewBox="0 0 20 20"
            className="h-4 w-4"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 7.5L10 12.5L15 7.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </CampoFormularioBase>
  );
}
