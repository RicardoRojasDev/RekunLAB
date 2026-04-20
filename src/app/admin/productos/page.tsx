import type { Metadata } from "next";
import {
  obtenerVistaAdminProductos,
  PaginaAdminProductos,
} from "@/modulos/admin-productos";

export const metadata: Metadata = {
  title: "Productos",
};

export default async function PaginaAdminProductosRuta() {
  const vista = await obtenerVistaAdminProductos();

  return (
    <PaginaAdminProductos
      productosIniciales={vista.productos}
      opcionesIniciales={vista.opciones}
    />
  );
}
