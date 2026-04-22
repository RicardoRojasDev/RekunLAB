import type { Metadata } from "next";
import { construirMetadataBasica } from "@/compartido/configuracion/seo";
import {
  normalizarFiltrosCatalogoDesdeQuery,
  PaginaCatalogoProductos,
  obtenerProductosCatalogo,
} from "@/modulos/catalogo";

const descripcionCatalogo =
  "Catalogo de Rekun LAB con filamentos PLA, impresoras 3D y packs, pensado para una compra clara en Chile.";

export const metadata: Metadata = {
  ...construirMetadataBasica({
    titulo: "Catalogo",
    descripcion: descripcionCatalogo,
    canonical: "/catalogo",
    palabrasClaveExtra: ["catalogo 3d", "productos impresos 3d", "filamento pla chile"],
  }),
};

type PropiedadesPaginaCatalogo = Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>;

export default async function PaginaCatalogo({
  searchParams,
}: PropiedadesPaginaCatalogo) {
  const [productos, query] = await Promise.all([
    obtenerProductosCatalogo(),
    searchParams,
  ]);
  const filtrosIniciales = normalizarFiltrosCatalogoDesdeQuery(query);

  return (
    <PaginaCatalogoProductos
      productos={productos}
      filtrosIniciales={filtrosIniciales}
    />
  );
}
