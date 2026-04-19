import type { Metadata } from "next";
import { configuracionSitio } from "@/compartido/configuracion/sitio";
import { PaginaAccesoUsuario } from "@/modulos/autenticacion";

const descripcionAcceso =
  "Acceso frontend de Rekun LAB con Google, deteccion de sesion y convivencia entre usuario autenticado e invitado.";

export const metadata: Metadata = {
  title: "Acceso",
  description: descripcionAcceso,
  alternates: {
    canonical: "/acceso",
  },
  openGraph: {
    title: `Acceso | ${configuracionSitio.nombre}`,
    description: descripcionAcceso,
    url: `${configuracionSitio.urlBase}/acceso`,
    siteName: configuracionSitio.nombre,
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Acceso | ${configuracionSitio.nombre}`,
    description: descripcionAcceso,
  },
};

export default function PaginaAcceso() {
  return <PaginaAccesoUsuario />;
}
