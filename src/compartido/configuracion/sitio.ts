export const configuracionSitio = {
  nombre: "Rekun LAB",
  descriptorMarca: "Impresion 3D sustentable",
  descripcion:
    "Ecommerce de Rekun LAB enfocado en filamentos PLA, impresion 3D personalizada, impresoras 3D, packs y soluciones sustentables para Chile.",
  descripcionCorta:
    "Marca chilena enfocada en filamentos PLA, impresion 3D y soluciones sustentables con una experiencia de compra clara y profesional.",
  urlBase: (() => {
    const valor = process.env.NEXT_PUBLIC_URL_BASE?.trim();

    if (!valor) {
      return "http://localhost:3000";
    }

    // Evita dobles slashes al construir URLs absolutas en metadata, sitemap y Open Graph.
    return valor.endsWith("/") ? valor.slice(0, -1) : valor;
  })(),
  locale: "es-CL",
  palabrasClave: [
    "impresion 3d sustentable",
    "reciclaje de plastico",
    "filamento pla ecologico",
    "insumos 3d",
    "maquinas 3d",
    "servicios 3d personalizados",
    "ecommerce chile",
  ],
} as const;
