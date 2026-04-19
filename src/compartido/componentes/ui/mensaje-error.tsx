import type { ReactNode } from "react";
import { Contenedor } from "./contenedor";

export type PropiedadesMensajeError = Readonly<{
  mensaje: string;
  titulo?: string;
  detalle?: string;
  accion?: ReactNode;
  claseName?: string;
}>;

export function MensajeError({
  mensaje,
  titulo = "Ocurrio un problema",
  detalle,
  accion,
  claseName,
}: PropiedadesMensajeError) {
  return (
    <Contenedor
      variante="base"
      claseName={claseName}
      style={{
        borderColor: "rgba(180, 78, 58, 0.18)",
        background:
          "linear-gradient(180deg, rgba(255, 248, 246, 0.96) 0%, rgba(255, 245, 241, 0.92) 100%)",
      }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-error-600)]">
            Error
          </span>
          <h2 className="text-lg font-semibold text-slate-950">{titulo}</h2>
          <p className="text-sm leading-7 text-slate-700">{mensaje}</p>
          {detalle ? <p className="texto-soporte">{detalle}</p> : null}
        </div>

        {accion ? <div className="shrink-0">{accion}</div> : null}
      </div>
    </Contenedor>
  );
}
