"use client";

import { Boton } from "@/compartido/componentes/ui";
import { useCarrito } from "../hooks/use-carrito";

function IconoCarrito() {
  return (
    <span aria-hidden="true" className="inline-flex h-4 w-4 items-center justify-center">
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 5h2l1.1 5.4a1 1 0 0 0 1 .8h9.6a1 1 0 0 0 1-.8L19 7H7" />
        <circle cx="9" cy="18" r="1.5" />
        <circle cx="17" cy="18" r="1.5" />
      </svg>
    </span>
  );
}

export function AccionesCarritoCabecera() {
  const { abrirDrawer, resumen, hidratado } = useCarrito();

  return (
    <Boton
      variante="secundario"
      tamanio="md"
      onClick={abrirDrawer}
      claseName="min-w-[9.75rem] justify-between border-[color:var(--color-borde-fuerte)] bg-white/88"
      aria-label={
        hidratado
          ? `Abrir carrito con ${resumen.cantidadUnidades} unidades`
          : "Abrir carrito"
      }
      inicio={<IconoCarrito />}
      fin={
        <span className="inline-flex min-w-8 justify-center rounded-full bg-slate-950 px-2 py-1 text-[11px] font-semibold text-white">
          {hidratado ? resumen.cantidadUnidades : "..."}
        </span>
      }
    >
      Carrito
    </Boton>
  );
}
