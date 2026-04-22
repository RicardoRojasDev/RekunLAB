import type { Metadata } from "next";
import { construirMetadataBasica } from "@/compartido/configuracion/seo";
import { PaginaCarritoCompras } from "@/modulos/carrito";

const descripcionCarrito =
  "Carrito de compras de Rekun LAB con subtotal con IVA incluido y continuidad directa hacia checkout.";

export const metadata: Metadata = {
  ...construirMetadataBasica({
    titulo: "Carrito",
    descripcion: descripcionCarrito,
    canonical: "/carrito",
  }),
};

export default function PaginaCarrito() {
  return <PaginaCarritoCompras />;
}
