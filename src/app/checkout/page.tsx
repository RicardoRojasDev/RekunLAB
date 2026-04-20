import type { Metadata } from "next";
import { configuracionSitio } from "@/compartido/configuracion/sitio";
import { PaginaCheckoutVisual } from "@/modulos/checkout";

const descripcionCheckout =
  "Checkout de Rekun LAB con compra como invitado, direccion de envio y resumen claro del pedido antes de pagar.";

export const metadata: Metadata = {
  title: "Checkout",
  description: descripcionCheckout,
  alternates: {
    canonical: "/checkout",
  },
  openGraph: {
    title: `Checkout | ${configuracionSitio.nombre}`,
    description: descripcionCheckout,
    url: `${configuracionSitio.urlBase}/checkout`,
    siteName: configuracionSitio.nombre,
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Checkout | ${configuracionSitio.nombre}`,
    description: descripcionCheckout,
  },
};

export default function PaginaCheckout() {
  return <PaginaCheckoutVisual />;
}
