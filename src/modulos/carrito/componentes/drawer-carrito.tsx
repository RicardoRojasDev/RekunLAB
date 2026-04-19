"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Cargador } from "@/compartido/componentes/ui";
import { useCarrito } from "../hooks/use-carrito";
import { DrawerHeaderCarrito } from "./drawer-header-carrito";
import { EstadoVacioCarrito } from "./estado-vacio-carrito";
import { ListaItemsCarrito } from "./lista-items-carrito";
import { ResumenCarrito } from "./resumen-carrito";

type PropiedadesDrawerCarrito = Readonly<{
  abierto: boolean;
  alCerrar: () => void;
}>;

export function DrawerCarrito({
  abierto,
  alCerrar,
}: PropiedadesDrawerCarrito) {
  const { hidratado, items, resumen } = useCarrito();

  useEffect(() => {
    if (!abierto) {
      return;
    }

    const overflowAnterior = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    function manejarTeclaEscape(evento: KeyboardEvent) {
      if (evento.key === "Escape") {
        alCerrar();
      }
    }

    window.addEventListener("keydown", manejarTeclaEscape);

    return () => {
      document.body.style.overflow = overflowAnterior;
      window.removeEventListener("keydown", manejarTeclaEscape);
    };
  }, [abierto, alCerrar]);

  if (!abierto) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Cerrar carrito"
        onClick={alCerrar}
        className="absolute inset-0 bg-[rgba(10,22,20,0.45)] backdrop-blur-[2px]"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-drawer-carrito"
        className="absolute inset-y-0 right-0 flex h-full w-full max-w-[30rem] flex-col border-l border-white/12 bg-[linear-gradient(180deg,rgba(247,250,248,0.98),rgba(240,244,241,0.98))] shadow-[0_30px_90px_rgba(10,22,20,0.22)]"
      >
        <DrawerHeaderCarrito alCerrar={alCerrar} />

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {!hidratado ? (
            <div className="flex min-h-[18rem] flex-col items-center justify-center gap-4 text-center">
              <Cargador tamanio="lg" />
              <p className="text-sm text-slate-500">
                Recuperando tu carrito local...
              </p>
            </div>
          ) : !items.length ? (
            <EstadoVacioCarrito
              compacto
              accion={
                <Link
                  href="/catalogo"
                  onClick={alCerrar}
                  className="boton-base boton-secundario min-h-11 px-4 text-sm"
                >
                  Explorar catalogo
                </Link>
              }
            />
          ) : (
            <ListaItemsCarrito items={items} modo="drawer" alNavegar={alCerrar} />
          )}
        </div>

        {hidratado && items.length ? (
          <footer className="border-t border-[color:var(--color-borde)] bg-white/82 px-5 py-5 sm:px-6">
            <ResumenCarrito
              modo="drawer"
              resumen={resumen}
              pie={
                <div className="grid gap-3">
                  <Link
                    href="/carrito"
                    onClick={alCerrar}
                    className="boton-base boton-primario min-h-11 justify-center px-4 text-sm"
                  >
                    Ver carrito completo
                  </Link>

                  <Link
                    href="/catalogo"
                    onClick={alCerrar}
                    className="boton-base boton-secundario min-h-11 justify-center px-4 text-sm"
                  >
                    Seguir explorando
                  </Link>
                </div>
              }
            />
          </footer>
        ) : null}
      </aside>
    </div>
  );
}
