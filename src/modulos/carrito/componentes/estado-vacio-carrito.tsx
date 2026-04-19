import type { ReactNode } from "react";
import { EstadoVacio } from "@/compartido/componentes/ui";

type PropiedadesEstadoVacioCarrito = Readonly<{
  accion?: ReactNode;
  claseName?: string;
  compacto?: boolean;
}>;

function IconoCarritoVacio() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
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
  );
}

export function EstadoVacioCarrito({
  accion,
  claseName,
  compacto = false,
}: PropiedadesEstadoVacioCarrito) {
  return (
    <EstadoVacio
      claseName={claseName}
      icono={<IconoCarritoVacio />}
      titulo="Tu carrito esta vacio"
      descripcion={
        compacto
          ? "Explora el catalogo y agrega productos para continuar armando tu compra."
          : "Todavia no has agregado productos. El carrito ya queda listo para persistir localmente y conectarse despues al checkout."
      }
      accion={accion}
    />
  );
}
