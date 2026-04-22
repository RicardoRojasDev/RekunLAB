"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ContenedorPrincipal } from "@/compartido/componentes/base/contenedor-principal";
import { Boton, MensajeError } from "@/compartido/componentes/ui";

type PropiedadesPaginaError = Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>;

export default function PaginaError({ error, reset }: PropiedadesPaginaError) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error no controlado en ruta:", error);
    }
  }, [error]);

  return (
    <section>
      <ContenedorPrincipal claseName="pb-[var(--espacio-2xl)]">
        <MensajeError
          titulo="No pudimos cargar esta pagina"
          mensaje="Ocurrio un problema inesperado. Intenta nuevamente."
          accion={
            <div className="grid gap-3">
              <Boton
                variante="primario"
                onClick={() => {
                  reset();
                }}
              >
                Reintentar
              </Boton>
              <Link
                href="/"
                className="boton-base boton-secundario min-h-11 justify-center px-4 text-sm"
              >
                Volver al inicio
              </Link>
            </div>
          }
        />
      </ContenedorPrincipal>
    </section>
  );
}
