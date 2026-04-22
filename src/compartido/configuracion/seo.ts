import type { Metadata } from "next";
import { configuracionSitio } from "./sitio";

type TipoOpenGraph = "website" | "article";

export type ImagenOpenGraph = Readonly<{
  url: string;
  alt: string;
}>;

export type OpcionesMetadataBasica = Readonly<{
  titulo: string;
  descripcion: string;
  canonical: string;
  tipoOpenGraph?: TipoOpenGraph;
  palabrasClaveExtra?: readonly string[];
  imagenOpenGraph?: ImagenOpenGraph;
}>;

export const rutasSeo = {
  imagenOpenGraphPorDefecto: "/opengraph-image",
  imagenTwitterPorDefecto: "/twitter-image",
} as const;

export function resolverUrlAbsoluta(ruta: string) {
  return new URL(ruta, configuracionSitio.urlBase).toString();
}

export function construirMetadataBasica({
  titulo,
  descripcion,
  canonical,
  tipoOpenGraph = "website",
  palabrasClaveExtra = [],
  imagenOpenGraph,
}: OpcionesMetadataBasica): Metadata {
  const tituloConMarca = `${titulo} | ${configuracionSitio.nombre}`;

  const imagenesOpenGraph = [
    imagenOpenGraph ?? {
      url: rutasSeo.imagenOpenGraphPorDefecto,
      alt: configuracionSitio.nombre,
    },
  ];

  return {
    title: titulo,
    description: descripcion,
    keywords: [...configuracionSitio.palabrasClave, ...palabrasClaveExtra].filter(
      (keyword) => keyword.trim().length > 0,
    ),
    alternates: {
      canonical,
    },
    openGraph: {
      title: tituloConMarca,
      description: descripcion,
      url: resolverUrlAbsoluta(canonical),
      siteName: configuracionSitio.nombre,
      locale: "es_CL",
      type: tipoOpenGraph,
      images: imagenesOpenGraph,
    },
    twitter: {
      card: "summary_large_image",
      title: tituloConMarca,
      description: descripcion,
      images: [rutasSeo.imagenTwitterPorDefecto],
    },
  };
}
