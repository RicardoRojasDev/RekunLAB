import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { unirClases } from "@/compartido/utilidades/unir-clases";
import { CampoFormularioBase } from "./internos/campo-formulario-base";
import { useCampoControl } from "./internos/use-campo-control";

export type PropiedadesAreaTexto = Readonly<
  Omit<ComponentPropsWithoutRef<"textarea">, "className"> & {
    claseName?: string;
    claseNameContenedor?: string;
    etiqueta?: string;
    ayuda?: string;
    error?: string;
    obligatorio?: boolean;
    contenidoComplementarioEtiqueta?: ReactNode;
  }
>;

export function AreaTexto({
  claseName,
  claseNameContenedor,
  etiqueta,
  ayuda,
  error,
  obligatorio = false,
  contenidoComplementarioEtiqueta,
  id,
  rows = 5,
  ...propiedadesAreaTexto
}: PropiedadesAreaTexto) {
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
      <textarea
        id={idControl}
        rows={rows}
        aria-describedby={ariaDescribedBy}
        aria-invalid={Boolean(error)}
        className={unirClases(
          "control-entrada control-entrada-area",
          error ? "control-entrada-error" : undefined,
          claseName,
        )}
        {...propiedadesAreaTexto}
      />
    </CampoFormularioBase>
  );
}
