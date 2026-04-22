import type { Metadata } from "next";
import { construirMetadataBasica } from "@/compartido/configuracion/seo";
import { PaginaAccesoUsuario } from "@/modulos/autenticacion";

const descripcionAcceso =
  "Acceso de Rekun LAB con Google cuando esta disponible y continuidad de compra como invitado.";

export const metadata: Metadata = {
  ...construirMetadataBasica({
    titulo: "Acceso",
    descripcion: descripcionAcceso,
    canonical: "/acceso",
  }),
};

export default function PaginaAcceso() {
  return <PaginaAccesoUsuario />;
}
