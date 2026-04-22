import type { Metadata } from "next";
import { construirMetadataBasica } from "@/compartido/configuracion/seo";
import { obtenerResumenPagoPedido, PaginaResultadoPago } from "@/modulos/pagos";

type PropiedadesPaginaResultadoCheckout = Readonly<{
  searchParams: Promise<Readonly<Record<string, string | string[] | undefined>>>;
}>;

const descripcion =
  "Estado del pago y del pedido en Rekun LAB con confirmacion clara y opcion de reintento si corresponde.";

export const metadata: Metadata = {
  ...construirMetadataBasica({
    titulo: "Resultado del pago",
    descripcion,
    canonical: "/checkout/resultado",
  }),
};

function obtenerParametroTexto(
  valor: string | string[] | undefined,
) {
  if (typeof valor === "string") {
    return valor;
  }

  if (Array.isArray(valor)) {
    return valor[0] ?? null;
  }

  return null;
}

export default async function PaginaResultadoCheckout({
  searchParams,
}: PropiedadesPaginaResultadoCheckout) {
  const params = await searchParams;
  const pedidoId = obtenerParametroTexto(params.pedido);
  const errorRetorno = obtenerParametroTexto(params.error);
  const resumen = pedidoId ? await obtenerResumenPagoPedido(pedidoId) : null;

  return <PaginaResultadoPago resumen={resumen} errorRetorno={errorRetorno} />;
}
