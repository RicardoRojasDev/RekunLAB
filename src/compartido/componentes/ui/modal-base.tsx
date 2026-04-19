"use client";

import { useEffect, useId } from "react";
import type { ReactNode } from "react";
import { unirClases } from "@/compartido/utilidades/unir-clases";

type TamanioModal = "sm" | "md" | "lg";

export type PropiedadesModalBase = Readonly<{
  abierto: boolean;
  alCerrar: () => void;
  titulo?: string;
  descripcion?: string;
  children: ReactNode;
  pie?: ReactNode;
  claseName?: string;
  tamanio?: TamanioModal;
  mostrarBotonCerrar?: boolean;
  cerrarAlHacerClickFuera?: boolean;
}>;

const clasesTamanio: Record<TamanioModal, string> = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl",
};

export function ModalBase({
  abierto,
  alCerrar,
  titulo,
  descripcion,
  children,
  pie,
  claseName,
  tamanio = "md",
  mostrarBotonCerrar = true,
  cerrarAlHacerClickFuera = true,
}: PropiedadesModalBase) {
  const idBase = useId().replace(/:/g, "");
  const idTitulo = titulo ? `modal-${idBase}-titulo` : undefined;
  const idDescripcion = descripcion ? `modal-${idBase}-descripcion` : undefined;

  useEffect(() => {
    if (!abierto) {
      return;
    }

    const overflowOriginal = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function manejarTecla(evento: KeyboardEvent) {
      if (evento.key === "Escape") {
        alCerrar();
      }
    }

    window.addEventListener("keydown", manejarTecla);

    return () => {
      document.body.style.overflow = overflowOriginal;
      window.removeEventListener("keydown", manejarTecla);
    };
  }, [abierto, alCerrar]);

  if (!abierto) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center p-4 sm:items-center sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Cerrar modal"
        className="absolute inset-0 bg-[rgba(13,23,21,0.58)] backdrop-blur-sm"
        onClick={cerrarAlHacerClickFuera ? alCerrar : undefined}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        aria-describedby={idDescripcion}
        className={unirClases(
          "relative z-[1] flex max-h-[90vh] w-full flex-col overflow-hidden rounded-[var(--radio-xl)] border border-[color:var(--color-borde)] bg-[color:var(--color-superficie-fuerte)] shadow-[var(--sombra-elevada)] backdrop-blur-xl",
          clasesTamanio[tamanio],
          claseName,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[color:var(--color-borde)] px-5 py-4 sm:px-6">
          <div className="space-y-1">
            {titulo ? (
              <h2 id={idTitulo} className="text-2xl font-semibold text-slate-950">
                {titulo}
              </h2>
            ) : null}
            {descripcion ? (
              <p id={idDescripcion} className="texto-soporte">
                {descripcion}
              </p>
            ) : null}
          </div>

          {mostrarBotonCerrar ? (
            <button
              type="button"
              aria-label="Cerrar"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--color-borde)] bg-white/82 text-sm font-semibold text-slate-700 transition-colors hover:bg-white"
              onClick={alCerrar}
            >
              Cerrar
            </button>
          ) : null}
        </div>

        <div className="overflow-y-auto px-5 py-5 sm:px-6">{children}</div>

        {pie ? (
          <div className="border-t border-[color:var(--color-borde)] px-5 py-4 sm:px-6">
            {pie}
          </div>
        ) : null}
      </div>
    </div>
  );
}
