import type { ReactNode } from "react";
import { unirClases } from "@/compartido/utilidades/unir-clases";

type PropiedadesCampoFormularioBase = Readonly<{
  idControl: string;
  idAyuda?: string;
  idError?: string;
  etiqueta?: string;
  ayuda?: string;
  error?: string;
  obligatorio?: boolean;
  contenidoComplementarioEtiqueta?: ReactNode;
  claseName?: string;
  children: ReactNode;
}>;

export function CampoFormularioBase({
  idControl,
  idAyuda,
  idError,
  etiqueta,
  ayuda,
  error,
  obligatorio = false,
  contenidoComplementarioEtiqueta,
  claseName,
  children,
}: PropiedadesCampoFormularioBase) {
  return (
    <div className={unirClases("control-formulario", claseName)}>
      {etiqueta ? (
        <div className="flex items-center justify-between gap-3">
          <label
            htmlFor={idControl}
            className="text-sm font-semibold text-slate-900"
          >
            {etiqueta}
            {obligatorio ? (
              <span className="ml-1 text-[color:var(--color-acento-premium)]">
                *
              </span>
            ) : null}
          </label>

          {contenidoComplementarioEtiqueta ? (
            <div className="text-xs text-slate-500">
              {contenidoComplementarioEtiqueta}
            </div>
          ) : null}
        </div>
      ) : null}

      {children}

      {ayuda ? (
        <p id={idAyuda} className="texto-soporte text-xs sm:text-sm">
          {ayuda}
        </p>
      ) : null}

      {error ? (
        <p
          id={idError}
          role="alert"
          className="text-sm font-medium text-[color:var(--color-error-600)]"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
