import Link from "next/link";
import { ContenedorPrincipal } from "@/compartido/componentes/base/contenedor-principal";
import { Etiqueta, Tarjeta } from "@/compartido/componentes/ui";
import type {
  ProductoCatalogo,
  ProductoRelacionadoCatalogo,
} from "../tipos/producto-catalogo";
import { GaleriaProductoDetalle } from "./detalle-producto/galeria-producto-detalle";
import { PanelCompraProductoDetalle } from "./detalle-producto/panel-compra-producto-detalle";
import { ProductosRelacionadosDetalle } from "./detalle-producto/productos-relacionados-detalle";

type PropiedadesPaginaDetalleProducto = Readonly<{
  producto: ProductoCatalogo;
  productosRelacionados: readonly ProductoRelacionadoCatalogo[];
}>;

export function PaginaDetalleProducto({
  producto,
  productosRelacionados,
}: PropiedadesPaginaDetalleProducto) {
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
          <span className="text-slate-900">{producto.nombre}</span>
        </nav>

        <div className="grid gap-6 xl:grid-cols-[0.94fr_1.06fr] xl:items-start">
          <GaleriaProductoDetalle producto={producto} />
          <PanelCompraProductoDetalle producto={producto} />
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
          <Tarjeta
            variante="elevada"
            etiqueta={<Etiqueta variante="primaria">Descripcion</Etiqueta>}
            titulo="Pensado para una lectura comercial clara y una decision de compra mas rapida"
            descripcion={producto.resumen}
          >
            <div className="space-y-4">
              <p className="texto-destacado">{producto.descripcion}</p>

              <div className="flex flex-wrap gap-2">
                <Etiqueta variante="suave">{producto.categoria}</Etiqueta>
                <Etiqueta variante="suave">{producto.tipoProducto}</Etiqueta>
                {producto.coleccion ? (
                  <Etiqueta variante="premium">
                    Coleccion {producto.coleccion}
                  </Etiqueta>
                ) : null}
              </div>
            </div>
          </Tarjeta>

          <Tarjeta
            variante="base"
            etiqueta={<Etiqueta variante="premium">Especificaciones</Etiqueta>}
            titulo="Ficha tecnica base"
            descripcion="Estructura pensada para que en la integracion real estas filas puedan venir desde Supabase sin rehacer la UI."
          >
            <dl className="grid gap-3">
              {producto.especificaciones.map((especificacion) => (
                <div
                  key={`${producto.id}-${especificacion.etiqueta}`}
                  className="grid gap-1 rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/76 px-4 py-4"
                >
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {especificacion.etiqueta}
                  </dt>
                  <dd className="text-sm leading-7 text-slate-800">
                    {especificacion.valor}
                  </dd>
                </div>
              ))}
            </dl>
          </Tarjeta>
        </div>

        <ProductosRelacionadosDetalle productos={productosRelacionados} />
      </ContenedorPrincipal>
    </section>
  );
}
