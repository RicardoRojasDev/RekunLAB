"use client";

import { useContext } from "react";
import { ContextoCarrito } from "../contexto/proveedor-carrito";

export function useCarrito() {
  const contexto = useContext(ContextoCarrito);

  if (!contexto) {
    throw new Error("useCarrito debe utilizarse dentro de ProveedorCarrito.");
  }

  return contexto;
}
