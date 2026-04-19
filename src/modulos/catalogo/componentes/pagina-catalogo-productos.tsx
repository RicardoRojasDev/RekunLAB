import { ContenedorPrincipal } from "@/compartido/componentes/base/contenedor-principal";
import type { ProductoCatalogo } from "../tipos/producto-catalogo";
import { EncabezadoCatalogoProductos } from "./encabezado-catalogo-productos";
import { GrillaProductosCatalogo } from "./grilla-productos-catalogo";

type PropiedadesPaginaCatalogoProductos = Readonly<{
  productos: readonly ProductoCatalogo[];
}>;

export function PaginaCatalogoProductos({
  productos,
}: PropiedadesPaginaCatalogoProductos) {
  const cantidadCategorias = new Set(
    productos.map((producto) => producto.categoria),
  ).size;

  const cantidadColecciones = new Set(
    productos.flatMap((producto) =>
      producto.coleccion ? [producto.coleccion] : [],
    ),
  ).size;

  return (
    <section aria-labelledby="titulo-catalogo-productos">
      <ContenedorPrincipal claseName="flex flex-col gap-[var(--espacio-xl)] pb-[var(--espacio-2xl)]">
        <EncabezadoCatalogoProductos
          cantidadProductos={productos.length}
          cantidadCategorias={cantidadCategorias}
          cantidadColecciones={cantidadColecciones}
        />

        <GrillaProductosCatalogo
          productos={productos}
          cantidadColecciones={cantidadColecciones}
        />
      </ContenedorPrincipal>
    </section>
  );
}
