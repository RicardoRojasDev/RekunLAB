import type { Metadata } from "next";
import { configuracionSitio } from "@/compartido/configuracion/sitio";
import {
  normalizarFiltrosCatalogoDesdeQuery,
  PaginaCatalogoProductos,
  obtenerProductosCatalogo,
} from "@/modulos/catalogo";

const descripcionCatalogo =
  "Catalogo de Rekun LAB con filamentos PLA, impresoras 3D y packs, pensado para una compra clara en Chile.";

export const metadata: Metadata = {
  title: "Catalogo",
  description: descripcionCatalogo,
  keywords: [
    ...configuracionSitio.palabrasClave,
    "catalogo 3d",
    "productos impresos 3d",
    "filamento pla chile",
  ],
  alternates: {
    canonical: "/catalogo",
  },
  openGraph: {
    title: `Catalogo | ${configuracionSitio.nombre}`,
    description: descripcionCatalogo,
    url: `${configuracionSitio.urlBase}/catalogo`,
    siteName: configuracionSitio.nombre,
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Catalogo | ${configuracionSitio.nombre}`,
    description: descripcionCatalogo,
  },
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
