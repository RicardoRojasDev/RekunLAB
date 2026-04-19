import type { Metadata } from "next";
import { configuracionSitio } from "@/compartido/configuracion/sitio";
import type { PropiedadesConHijos } from "@/compartido/tipos/comunes";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(configuracionSitio.urlBase),
  title: {
    default: configuracionSitio.nombre,
    template: `%s | ${configuracionSitio.nombre}`,
  },
  description: configuracionSitio.descripcion,
  applicationName: configuracionSitio.nombre,
  alternates: {
    canonical: "/",
  },
};

export default function DisposicionRaiz({ children }: PropiedadesConHijos) {
  return (
    <html lang="es-CL">
      <body className="antialiased">{children}</body>
    </html>
  );
}
