import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { configuracionSitio } from "@/compartido/configuracion/sitio";
import {
  obtenerProductoCatalogoPorSlug,
  obtenerProductosRelacionadosCatalogo,
  obtenerSlugsCatalogo,
  PaginaDetalleProducto,
} from "@/modulos/catalogo";

type PropiedadesPaginaDetalleProductoRuta = Readonly<{
  params: Promise<{
    slug: string;
  }>;
}>;

export async function generateStaticParams() {
  const slugs = await obtenerSlugsCatalogo();

  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: PropiedadesPaginaDetalleProductoRuta): Promise<Metadata> {
  const { slug } = await params;
  const producto = await obtenerProductoCatalogoPorSlug(slug);

  if (!producto) {
    return {
      title: "Producto no encontrado",
    };
  }

  return {
    title: producto.nombre,
    description: producto.resumen,
    keywords: [
      ...configuracionSitio.palabrasClave,
      producto.nombre,
      producto.categoria,
      producto.tipoProducto,
      producto.coleccion ?? "",
    ].filter(Boolean),
    alternates: {
      canonical: `/catalogo/${producto.slug}`,
    },
    openGraph: {
      title: `${producto.nombre} | ${configuracionSitio.nombre}`,
      description: producto.resumen,
      url: `${configuracionSitio.urlBase}/catalogo/${producto.slug}`,
      siteName: configuracionSitio.nombre,
      locale: "es_CL",
      type: "website",
      images: [
        {
          url: producto.imagen.src,
          alt: producto.imagen.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${producto.nombre} | ${configuracionSitio.nombre}`,
      description: producto.resumen,
    },
  };
}

export default async function PaginaDetalleProductoRuta({
  params,
}: PropiedadesPaginaDetalleProductoRuta) {
  const { slug } = await params;

  const [producto, productosRelacionados] = await Promise.all([
    obtenerProductoCatalogoPorSlug(slug),
    obtenerProductosRelacionadosCatalogo(slug),
  ]);

  if (!producto) {
    notFound();
  }

  return (
    <PaginaDetalleProducto
      producto={producto}
      productosRelacionados={productosRelacionados}
    />
  );
}
