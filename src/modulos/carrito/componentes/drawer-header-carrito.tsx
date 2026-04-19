"use client";

import { Boton, Etiqueta } from "@/compartido/componentes/ui";
import { useCarrito } from "../hooks/use-carrito";

type PropiedadesDrawerHeaderCarrito = Readonly<{
  alCerrar: () => void;
}>;

export function DrawerHeaderCarrito({
  alCerrar,
}: PropiedadesDrawerHeaderCarrito) {
  const { hidratado, resumen } = useCarrito();

  return (
    <header className="border-b border-[color:var(--color-borde)] bg-white/84 px-5 py-5 sm:px-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Etiqueta variante="primaria">Carrito local</Etiqueta>
            <Etiqueta variante="suave">IVA incluido</Etiqueta>
          </div>

          <div className="space-y-2">
            <h2
              id="titulo-drawer-carrito"
              className="font-[var(--fuente-titulos)] text-[1.9rem] font-semibold leading-none tracking-[-0.05em] text-slate-950"
            >
              Carrito de compras
            </h2>
            <p className="text-sm leading-7 text-slate-600">
              {hidratado
                ? `${resumen.cantidadUnidades} unidades listas para continuar hacia el checkout en el siguiente modulo.`
                : "Cargando estado local del carrito."}
            </p>
          </div>
        </div>

        <Boton variante="fantasma" tamanio="sm" onClick={alCerrar}>
          Cerrar
        </Boton>
      </div>
    </header>
  );
}
