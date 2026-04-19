import type { Metadata, Viewport } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import { EstructuraLayoutGlobal } from "@/compartido/componentes/layout/estructura-layout-global";
import { configuracionSitio } from "@/compartido/configuracion/sitio";
import type { PropiedadesConHijos } from "@/compartido/tipos/comunes";
import { CapaCarritoGlobal, ProveedorCarrito } from "@/modulos/carrito";
import "./globals.css";

const fuenteCuerpo = Manrope({
  subsets: ["latin"],
  variable: "--fuente-cuerpo",
  display: "swap",
});

const fuenteTitulos = Space_Grotesk({
  subsets: ["latin"],
  variable: "--fuente-titulos",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(configuracionSitio.urlBase),
  title: {
    default: configuracionSitio.nombre,
    template: `%s | ${configuracionSitio.nombre}`,
  },
  description: configuracionSitio.descripcion,
  keywords: [...configuracionSitio.palabrasClave],
  applicationName: configuracionSitio.nombre,
  referrer: "origin-when-cross-origin",
  category: "technology",
  robots: {
    index: true,
    follow: true,
  },
  formatDetection: {
    address: false,
    email: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: configuracionSitio.urlBase,
    siteName: configuracionSitio.nombre,
    title: configuracionSitio.nombre,
    description: configuracionSitio.descripcion,
  },
  twitter: {
    card: "summary_large_image",
    title: configuracionSitio.nombre,
    description: configuracionSitio.descripcion,
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d1715",
  colorScheme: "light",
};

export default function DisposicionRaiz({ children }: PropiedadesConHijos) {
  return (
    <html lang="es-CL">
      <body
        className={`${fuenteCuerpo.variable} ${fuenteTitulos.variable} antialiased`}
      >
        <a
          href="#contenido-principal"
          className="sr-only absolute left-4 top-4 z-50 rounded-full bg-slate-950 px-4 py-2 text-sm text-white focus:not-sr-only"
        >
          Saltar al contenido principal
        </a>

        <ProveedorCarrito>
          <EstructuraLayoutGlobal>{children}</EstructuraLayoutGlobal>
          <CapaCarritoGlobal />
        </ProveedorCarrito>
      </body>
    </html>
  );
}
