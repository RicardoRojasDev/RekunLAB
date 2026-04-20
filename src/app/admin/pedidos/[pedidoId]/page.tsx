import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  obtenerDetallePedidoAdmin,
  PaginaDetallePedidoAdmin,
} from "@/modulos/admin-pedidos";

type PropiedadesPaginaDetallePedidoAdminRuta = Readonly<{
  params: Promise<{
    pedidoId: string;
  }>;
}>;

export const metadata: Metadata = {
  title: "Detalle de pedido",
};

export default async function PaginaDetallePedidoAdminRuta({
  params,
}: PropiedadesPaginaDetallePedidoAdminRuta) {
  const { pedidoId } = await params;
  const pedido = await obtenerDetallePedidoAdmin(pedidoId);

  if (!pedido) {
    notFound();
  }

  return <PaginaDetallePedidoAdmin pedido={pedido} />;
}
