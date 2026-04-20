import type { Metadata } from "next";
import {
  obtenerVistaAdminImagenes,
  PaginaAdminImagenes,
} from "@/modulos/admin-imagenes";

type PropiedadesPaginaAdminImagenesRuta = Readonly<{
  searchParams: Promise<{
    producto?: string | string[];
  }>;
}>;

export const metadata: Metadata = {
  title: "Imagenes",
};

function obtenerProductoIdDesdeQuery(
  valor?: string | string[],
) {
  if (typeof valor === "string" && valor.trim().length) {
    return valor.trim();
  }

  if (Array.isArray(valor)) {
    const primero = valor.find(
      (item) => typeof item === "string" && item.trim().length,
    );
    return primero?.trim() ?? null;
  }

  return null;
}

export default async function PaginaAdminImagenesRuta({
  searchParams,
}: PropiedadesPaginaAdminImagenesRuta) {
  const query = await searchParams;
  const productoId = obtenerProductoIdDesdeQuery(query.producto);
  const vista = await obtenerVistaAdminImagenes(productoId);

  return (
    <PaginaAdminImagenes
      key={`admin-imagenes-${vista.productoSeleccionado?.id ?? "sin-producto"}-${vista.imagenes.length}`}
      productos={vista.productos}
      productoSeleccionado={vista.productoSeleccionado}
      imagenes={vista.imagenes}
    />
  );
}
