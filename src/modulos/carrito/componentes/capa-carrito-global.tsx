"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCarrito } from "../hooks/use-carrito";
import { DrawerCarrito } from "./drawer-carrito";

export function CapaCarritoGlobal() {
  const pathname = usePathname();
  const { drawerAbierto, cerrarDrawer } = useCarrito();

  useEffect(() => {
    cerrarDrawer();
  }, [cerrarDrawer, pathname]);

  return <DrawerCarrito abierto={drawerAbierto} alCerrar={cerrarDrawer} />;
}
