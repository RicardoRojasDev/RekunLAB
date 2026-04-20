import type { Metadata } from "next";
import { PaginaSeccionAdminBase } from "@/modulos/admin";

const basePreparada = [
  {
    titulo: "Seccion dedicada a medios",
    descripcion:
      "La ruta queda reservada para imagenes y storage sin contaminar productos o pedidos.",
  },
  {
    titulo: "Espacio para integracion de storage",
    descripcion:
      "La base ya esta lista para sumar carga, asociacion y organizacion de archivos.",
  },
  {
    titulo: "Preparada para crecimiento modular",
    descripcion:
      "La capa visual y la navegacion ya permiten evolucionar esta seccion sin rehacer el backoffice.",
  },
] as const;

const siguientePaso = [
  {
    titulo: "Carga de imagenes",
    descripcion: "Subida controlada de imagenes y archivos al storage configurado.",
  },
  {
    titulo: "Asociacion con productos",
    descripcion: "Relacion entre archivos, catalogo y orden visual del producto.",
  },
  {
    titulo: "Gestion de medios",
    descripcion: "Vista para revisar, ordenar y mantener activos los recursos cargados.",
  },
] as const;

export const metadata: Metadata = {
  title: "Imagenes",
};

export default function PaginaAdminImagenes() {
  return (
    <PaginaSeccionAdminBase
      etiqueta="Imagenes"
      titulo="Base para medios y storage"
      descripcion="Seccion lista para alojar la gestion de imagenes del ecommerce."
      resumen="El objetivo aqui es dejar preparada la zona donde el modulo 22 conectara storage, carga de archivos y asociacion con productos, manteniendo esa responsabilidad separada del resto del panel."
      preparado={basePreparada}
      siguientePaso={siguientePaso}
    />
  );
}
