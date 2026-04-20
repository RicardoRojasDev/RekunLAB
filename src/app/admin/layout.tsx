import type { Metadata } from "next";
import type { ReactNode } from "react";
import { configuracionSitio } from "@/compartido/configuracion/sitio";
import { exigirAccesoAdministrador, LayoutAdminInterno } from "@/modulos/admin";

type PropiedadesLayoutAdmin = Readonly<{
  children: ReactNode;
}>;

export const metadata: Metadata = {
  title: {
    default: `Admin | ${configuracionSitio.nombre}`,
    template: `%s | Admin | ${configuracionSitio.nombre}`,
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LayoutAdmin({
  children,
}: PropiedadesLayoutAdmin) {
  const usuario = await exigirAccesoAdministrador();

  return <LayoutAdminInterno usuario={usuario}>{children}</LayoutAdminInterno>;
}
