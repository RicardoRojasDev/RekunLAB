import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { unirClases } from "@/compartido/utilidades/unir-clases";
import { CampoFormularioBase } from "./internos/campo-formulario-base";
import { useCampoControl } from "./internos/use-campo-control";

export type PropiedadesCampoTexto = Readonly<
  Omit<ComponentPropsWithoutRef<"input">, "className" | "size"> & {
    claseName?: string;
    claseNameContenedor?: string;
    etiqueta?: string;
    ayuda?: string;
    error?: string;
    obligatorio?: boolean;
    contenidoComplementarioEtiqueta?: ReactNode;
  }
>;

export function CampoTexto({
  claseName,
  claseNameContenedor,
  etiqueta,
  ayuda,
  error,
  obligatorio = false,
  contenidoComplementarioEtiqueta,
  id,
  type = "text",
  ...propiedadesInput
}: PropiedadesCampoTexto) {
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
      <input
        id={idControl}
        type={type}
        aria-describedby={ariaDescribedBy}
        aria-invalid={Boolean(error)}
        className={unirClases(
          "control-entrada",
          error ? "control-entrada-error" : undefined,
          claseName,
        )}
        {...propiedadesInput}
      />
    </CampoFormularioBase>
  );
}
