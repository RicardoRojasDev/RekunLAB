import Link from "next/link";
import { ContenedorPrincipal } from "@/compartido/componentes/base/contenedor-principal";
import { Etiqueta } from "@/compartido/componentes/ui";
import type {
  ProductoCatalogo,
  ProductoRelacionadoCatalogo,
} from "../tipos/producto-catalogo";
import { ExperienciaDetalleProducto } from "./detalle-producto/experiencia-detalle-producto";
import { ProductosRelacionadosDetalle } from "./detalle-producto/productos-relacionados-detalle";

type PropiedadesPaginaDetalleProducto = Readonly<{
  producto: ProductoCatalogo;
  productosRelacionados: readonly ProductoRelacionadoCatalogo[];
}>;

export function PaginaDetalleProducto({
  producto,
  productosRelacionados,
}: PropiedadesPaginaDetalleProducto) {
  const nombreVisible = producto.nombreCompleto ?? producto.nombre;

  return (
    <section aria-labelledby="titulo-detalle-producto">
      <ContenedorPrincipal claseName="flex flex-col gap-[var(--espacio-xl)] pb-[var(--espacio-2xl)]">
        <nav
          aria-label="Ruta de navegacion"
          className="flex flex-wrap items-center gap-2 text-sm text-slate-500"
        >
          <Link href="/" className="hover:text-slate-900">
            Inicio
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/catalogo" className="hover:text-slate-900">
            Catalogo
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-slate-900">{nombreVisible}</span>
        </nav>

        <div className="flex flex-wrap gap-2">
          <Etiqueta variante="suave">Detalle de producto</Etiqueta>
          {producto.configuracionVariantes ? (
            <Etiqueta variante="premium">Variantes disponibles</Etiqueta>
          ) : null}
        </div>

        <ExperienciaDetalleProducto producto={producto} />

        <ProductosRelacionadosDetalle productos={productosRelacionados} />
      </ContenedorPrincipal>
    </section>
  );
}
