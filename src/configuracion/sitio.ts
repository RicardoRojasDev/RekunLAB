export const configuracionSitio = {
  nombre: "Rekun LAB",
  descripcion:
    "Base tecnica inicial del ecommerce de Rekun LAB preparada para crecer con Next.js, Tailwind CSS y Supabase.",
  urlBase: process.env.NEXT_PUBLIC_URL_BASE?.trim() || "http://localhost:3000",
  locale: "es-CL",
} as const;
