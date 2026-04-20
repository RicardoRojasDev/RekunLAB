import type { Metadata } from "next";
import {
  obtenerVistaAdminPedidos,
  PaginaAdminPedidos,
} from "@/modulos/admin-pedidos";

export const metadata: Metadata = {
  title: "Pedidos",
};

export default async function PaginaAdminPedidosRuta() {
  const vista = await obtenerVistaAdminPedidos();

  return (
    <PaginaAdminPedidos
      pedidos={vista.pedidos}
      estadosPedido={vista.estadosPedido}
    />
  );
}
