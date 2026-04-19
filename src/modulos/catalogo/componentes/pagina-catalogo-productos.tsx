import { ContenedorPrincipal } from "@/compartido/componentes/base/contenedor-principal";
import type { EstadoFiltrosCatalogo } from "../tipos/filtros-catalogo";
import type { ProductoCatalogo } from "../tipos/producto-catalogo";
import { extraerOpcionesFiltrosCatalogo } from "../utilidades/extraer-opciones-filtros-catalogo";
import { depurarFiltrosCatalogoConOpciones } from "../utilidades/query-params-catalogo";
import { EncabezadoCatalogoProductos } from "./encabezado-catalogo-productos";
import { ExperienciaCatalogoProductos } from "./experiencia-catalogo-productos";

type PropiedadesPaginaCatalogoProductos = Readonly<{
  productos: readonly ProductoCatalogo[];
  filtrosIniciales: EstadoFiltrosCatalogo;
}>;

export function PaginaCatalogoProductos({
  productos,
  filtrosIniciales,
}: PropiedadesPaginaCatalogoProductos) {
  const opcionesFiltros = extraerOpcionesFiltrosCatalogo(productos);
  const filtrosDepurados = depurarFiltrosCatalogoConOpciones(
    filtrosIniciales,
    opcionesFiltros,
  );
  const cantidadCategorias = new Set(
    productos.map((producto) => producto.categoria),
  ).size;

  const cantidadColecciones = new Set(
    productos.flatMap((producto) =>
      producto.coleccion ? [producto.coleccion] : [],
    ),
  ).size;
  const cantidadTiposProducto = new Set(
    productos.map((producto) => producto.tipoProducto),
  ).size;

  return (
    <section aria-labelledby="titulo-catalogo-productos">
      <ContenedorPrincipal claseName="flex flex-col gap-[var(--espacio-xl)] pb-[var(--espacio-2xl)]">
        <EncabezadoCatalogoProductos
          cantidadProductos={productos.length}
          cantidadCategorias={cantidadCategorias}
          cantidadColecciones={cantidadColecciones}
          cantidadTiposProducto={cantidadTiposProducto}
        />

        <ExperienciaCatalogoProductos
          productos={productos}
          filtrosIniciales={filtrosDepurados}
          opcionesFiltros={opcionesFiltros}
        />
      </ContenedorPrincipal>
    </section>
  );
}
