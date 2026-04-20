import type { Metadata } from "next";
import { configuracionSitio } from "@/compartido/configuracion/sitio";
import { PaginaCarritoCompras } from "@/modulos/carrito";

const descripcionCarrito =
  "Carrito de compras de Rekun LAB con subtotal con IVA incluido y continuidad directa hacia checkout.";

export const metadata: Metadata = {
  title: "Carrito",
  description: descripcionCarrito,
  alternates: {
    canonical: "/carrito",
  },
  openGraph: {
    title: `Carrito | ${configuracionSitio.nombre}`,
    description: descripcionCarrito,
    url: `${configuracionSitio.urlBase}/carrito`,
    siteName: configuracionSitio.nombre,
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Carrito | ${configuracionSitio.nombre}`,
    description: descripcionCarrito,
  },
};

export default function PaginaCarrito() {
  return <PaginaCarritoCompras />;
}
