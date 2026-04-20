import type { Metadata } from "next";
import { PaginaSeccionAdminBase } from "@/modulos/admin";

const basePreparada = [
  {
    titulo: "Punto de entrada operativo",
    descripcion:
      "La seccion ya queda ubicada dentro del backoffice y separada del flujo publico de checkout.",
  },
  {
    titulo: "Espacio para estados y seguimiento",
    descripcion:
      "La base visual ya permite sumar columnas, filtros y acciones operativas sin rehacer el layout.",
  },
  {
    titulo: "Base para gestion diaria",
    descripcion:
      "El panel ya contempla una vista dedicada a pedidos para la operacion interna del ecommerce.",
  },
] as const;

const siguientePaso = [
  {
    titulo: "Listado de pedidos",
    descripcion: "Consulta diaria, detalle de comprador y seguimiento operativo.",
  },
  {
    titulo: "Actualizacion de estados",
    descripcion: "Gestion controlada del ciclo de vida del pedido y del pago.",
  },
  {
    titulo: "Herramientas internas",
    descripcion: "Filtros, observaciones y apoyo para la operacion comercial.",
  },
] as const;

export const metadata: Metadata = {
  title: "Pedidos",
};

export default function PaginaAdminPedidos() {
  return (
    <PaginaSeccionAdminBase
      etiqueta="Pedidos"
      titulo="Base para operacion y seguimiento interno"
      descripcion="Seccion preparada para administrar el ciclo operativo del ecommerce."
      resumen="En este modulo no se agregan tablas ni acciones complejas. Solo dejamos lista la estructura para que el modulo 21 pueda enfocarse en la gestion diaria de pedidos sin mezclar navegacion, layout y seguridad."
      preparado={basePreparada}
      siguientePaso={siguientePaso}
    />
  );
}
