import type { Metadata } from "next";
import { construirMetadataBasica } from "@/compartido/configuracion/seo";
import { PaginaCheckoutVisual } from "@/modulos/checkout";

const descripcionCheckout =
  "Checkout de Rekun LAB con compra como invitado, direccion de envio y resumen claro del pedido antes de pagar.";

export const metadata: Metadata = {
  ...construirMetadataBasica({
    titulo: "Checkout",
    descripcion: descripcionCheckout,
    canonical: "/checkout",
  }),
};

export default function PaginaCheckout() {
  return <PaginaCheckoutVisual />;
}
