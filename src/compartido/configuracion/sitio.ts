export const configuracionSitio = {
  nombre: "Rekun LAB",
  descriptorMarca: "Impresion 3D sustentable",
  descripcion:
    "Ecommerce de Rekun LAB enfocado en impresion 3D sustentable, reciclaje de plastico, filamento PLA ecologico, insumos, maquinas 3D y servicios personalizados en Chile.",
  descripcionCorta:
    "Base comercial de Rekun LAB preparada para montar catalogo, servicios, cotizaciones y experiencia de compra sobre una estructura tecnica escalable.",
  urlBase: process.env.NEXT_PUBLIC_URL_BASE?.trim() || "http://localhost:3000",
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
