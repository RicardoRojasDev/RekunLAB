import Image from "next/image";
import Link from "next/link";
import { Contenedor } from "@/compartido/componentes/ui/contenedor";
import { Etiqueta } from "@/compartido/componentes/ui/etiqueta";
import { formatearPrecioClp } from "@/compartido/utilidades/formatear-precio-clp";
import type { ResumenProductoCatalogo } from "../tipos/producto-catalogo";

type PropiedadesTarjetaProductoCatalogo = Readonly<{
  producto: ResumenProductoCatalogo;
}>;

function resolverVarianteEtiquetaComercial(etiqueta: string) {
  const valorNormalizado = etiqueta.toLowerCase();

  if (
    valorNormalizado.includes("recicl") ||
    valorNormalizado.includes("ecologico")
  ) {
    return "primaria" as const;
  }

  if (
    valorNormalizado.includes("premium") ||
    valorNormalizado.includes("edicion") ||
    valorNormalizado.includes("nueva")
  ) {
    return "premium" as const;
  }

  return "suave" as const;
}

export function TarjetaProductoCatalogo({
  producto,
}: PropiedadesTarjetaProductoCatalogo) {
  const nombreVisible = producto.nombreCompleto ?? producto.nombre;

  return (
    <Contenedor
      etiquetaHtml="article"
      variante="elevado"
      claseName="group flex h-full flex-col overflow-hidden p-0 transition duration-[220ms] hover:-translate-y-1 hover:shadow-[0_34px_90px_rgba(10,22,20,0.16)]"
    >
      <Link
        href={`/catalogo/${producto.slug}`}
        className="flex h-full flex-col"
        aria-label={`Ver detalle de ${nombreVisible}`}
      >
        <div className="relative aspect-[4/4.6] overflow-hidden border-b border-[color:var(--color-borde)] bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(237,242,238,0.92))]">
          <Image
            src={producto.imagen.src}
            alt={producto.imagen.alt}
            width={producto.imagen.ancho}
            height={producto.imagen.alto}
            sizes="(min-width: 1536px) 28rem, (min-width: 768px) 50vw, 100vw"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]"
          />

          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4">
            <div className="flex flex-wrap gap-2">
              <Etiqueta variante="oscura" tamanio="sm">
                {producto.categoria}
              </Etiqueta>
              <Etiqueta variante="suave" tamanio="sm">
                {producto.tipoProducto}
              </Etiqueta>
            </div>

            <span className="rounded-full border border-white/14 bg-[rgba(13,23,21,0.88)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/78">
              IVA incl.
            </span>
          </div>
        </div>

        <div className="flex h-full flex-col gap-5 p-5 sm:p-6">
          <div className="space-y-3">
            {producto.coleccion ? (
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-acento-premium)]">
                Coleccion {producto.coleccion}
              </p>
            ) : null}

            <div className="space-y-2">
              <h3 className="font-[var(--fuente-titulos)] text-[1.45rem] font-semibold leading-tight tracking-[-0.04em] text-slate-950">
                {nombreVisible}
              </h3>

              <p className="text-sm leading-7 text-slate-600">
                {producto.resumen}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {producto.etiquetasComerciales.map((etiqueta) => (
              <Etiqueta
                key={`${producto.id}-${etiqueta}`}
                variante={resolverVarianteEtiquetaComercial(etiqueta)}
                tamanio="sm"
              >
                {etiqueta}
              </Etiqueta>
            ))}
          </div>

          <div className="mt-auto flex items-end justify-between gap-4 border-t border-[color:var(--color-borde)] pt-4">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Precio final
              </p>
              <p className="font-[var(--fuente-titulos)] text-[1.95rem] font-semibold leading-none tracking-[-0.05em] text-slate-950">
                {formatearPrecioClp(producto.precioIvaIncluido)}
              </p>
              <p className="text-xs text-slate-500">IVA incluido</p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <Etiqueta variante="suave" tamanio="sm">
                Chile
              </Etiqueta>
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700">
                Ver detalle
              </span>
            </div>
          </div>
        </div>
      </Link>
    </Contenedor>
  );
}
