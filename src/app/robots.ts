import type { MetadataRoute } from "next";
import { configuracionSitio } from "@/compartido/configuracion/sitio";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
    ],
    sitemap: `${configuracionSitio.urlBase}/sitemap.xml`,
  };
}

