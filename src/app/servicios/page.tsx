import type { Metadata } from "next";
import { construirMetadataBasica } from "@/compartido/configuracion/seo";
import { PaginaFormularioCotizacion } from "@/modulos/cotizaciones";

const descripcionServicios =
  "Formulario publico para solicitar cotizaciones en Rekun LAB: impresion 3D personalizada, productos especiales y requerimientos sustentables.";

export const metadata: Metadata = {
  ...construirMetadataBasica({
    titulo: "Cotizacion",
    descripcion: descripcionServicios,
    canonical: "/servicios",
  }),
};

export default function PaginaServicios() {
  return <PaginaFormularioCotizacion />;
}
