import type { Metadata } from "next";
import { PaginaSeccionAdminBase } from "@/modulos/admin";

const basePreparada = [
  {
    titulo: "Entrada propia del modulo",
    descripcion:
      "La seccion ya vive en una ruta administrativa separada del catalogo publico.",
  },
  {
    titulo: "Lugar para tabla y formularios",
    descripcion:
      "La vista queda lista para incorporar listado, edicion y controles sin rehacer el shell admin.",
  },
  {
    titulo: "Enfoque sobre catalogo y categorias",
    descripcion:
      "La navegacion ya anticipa el espacio desde donde se administraran productos y sus agrupaciones.",
  },
] as const;

const siguientePaso = [
  {
    titulo: "CRUD de productos",
    descripcion: "Alta, edicion, activacion, desactivacion y eliminacion controlada.",
  },
  {
    titulo: "Gestion de categorias",
    descripcion: "Relacion entre productos, categorias y estado comercial.",
  },
  {
    titulo: "Controles de publicacion",
    descripcion: "Estado visible, datos comerciales y orden de catalogo.",
  },
] as const;

export const metadata: Metadata = {
  title: "Productos",
};

export default function PaginaAdminProductos() {
  return (
    <PaginaSeccionAdminBase
      etiqueta="Productos"
      titulo="Base para administrar catalogo y categorias"
      descripcion="Seccion reservada para la operacion del catalogo desde el backoffice."
      resumen="Todavia no hay CRUD activos en esta vista. El objetivo del modulo 19 es dejar una base sobria, clara y separada para que el modulo 20 se concentre solo en la gestion real de productos."
      preparado={basePreparada}
      siguientePaso={siguientePaso}
    />
  );
}
