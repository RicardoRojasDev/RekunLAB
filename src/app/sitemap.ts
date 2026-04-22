import type { MetadataRoute } from "next";
import { configuracionSitio } from "@/compartido/configuracion/sitio";
import { obtenerSlugsCatalogo } from "@/modulos/catalogo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const ahora = new Date();
  const slugs = await obtenerSlugsCatalogo();

  const rutasEstaticas: MetadataRoute.Sitemap = [
    {
      url: `${configuracionSitio.urlBase}/`,
      lastModified: ahora,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${configuracionSitio.urlBase}/catalogo`,
      lastModified: ahora,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${configuracionSitio.urlBase}/servicios`,
      lastModified: ahora,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${configuracionSitio.urlBase}/acceso`,
      lastModified: ahora,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const rutasProductos: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${configuracionSitio.urlBase}/catalogo/${slug}`,
    lastModified: ahora,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...rutasEstaticas, ...rutasProductos];
}

