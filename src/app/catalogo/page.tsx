import type { Metadata } from "next";
import { configuracionSitio } from "@/compartido/configuracion/sitio";
import {
  PaginaCatalogoProductos,
  obtenerProductosCatalogo,
} from "@/modulos/catalogo";

const descripcionCatalogo =
  "Catalogo visual de Rekun LAB con datos mock profesionales, grilla responsive y base lista para reemplazar mocks por datos reales.";

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

export default async function PaginaCatalogo() {
  const productos = await obtenerProductosCatalogo();

  return <PaginaCatalogoProductos productos={productos} />;
}
