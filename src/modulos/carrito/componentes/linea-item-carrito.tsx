"use client";

import Image from "next/image";
import Link from "next/link";
import { Etiqueta } from "@/compartido/componentes/ui";
import { formatearPrecioClp } from "@/compartido/utilidades/formatear-precio-clp";
import { useCarrito } from "../hooks/use-carrito";
import type { ItemCarrito } from "../tipos/carrito";
import { calcularMontoLineaItemCarrito } from "../utilidades/operaciones-carrito";
import { ControlCantidadLineaCarrito } from "./control-cantidad-linea-carrito";

type ModoLineaItemCarrito = "pagina" | "drawer";

type PropiedadesLineaItemCarrito = Readonly<{
  item: ItemCarrito;
  modo?: ModoLineaItemCarrito;
  alNavegar?: () => void;
}>;

export function LineaItemCarrito({
  item,
  modo = "pagina",
  alNavegar,
}: PropiedadesLineaItemCarrito) {
  const { actualizarCantidadItem, eliminarItem } = useCarrito();
  const montoLinea = calcularMontoLineaItemCarrito(item);

  return (
    <article className="grid gap-4 rounded-[var(--radio-lg)] border border-[color:var(--color-borde)] bg-white/72 p-4 sm:grid-cols-[7rem_minmax(0,1fr)] sm:p-5">
      <div className="relative aspect-[4/4.2] overflow-hidden rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(237,242,238,0.92))]">
        <Image
          src={item.imagen.src}
          alt={item.imagen.alt}
          width={item.imagen.ancho}
          height={item.imagen.alto}
          sizes={modo === "drawer" ? "8rem" : "(min-width: 640px) 10rem, 100vw"}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="min-w-0 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap gap-2">
              <Etiqueta variante="suave" tamanio="sm">
                {item.categoria}
              </Etiqueta>
              <Etiqueta variante="suave" tamanio="sm">
                {item.tipoProducto}
              </Etiqueta>
              {item.variante ? (
                <Etiqueta variante="premium" tamanio="sm">
                  {item.variante.etiqueta}
                </Etiqueta>
              ) : null}
            </div>

            <div className="space-y-2">
              <Link
                href={`/catalogo/${item.slug}`}
                onClick={alNavegar}
                className="block font-[var(--fuente-titulos)] text-xl font-semibold leading-tight tracking-[-0.04em] text-slate-950 hover:text-[color:var(--color-primario-700)]"
              >
                {item.nombre}
              </Link>

              <p className="text-sm leading-7 text-slate-600">{item.resumen}</p>
            </div>

            {item.variante?.selecciones.length ? (
              <ul className="flex flex-wrap gap-2">
                {item.variante.selecciones.map((seleccion) => (
                  <li
                    key={`${item.idLinea}-${seleccion.codigoAtributo}`}
                    className="rounded-full border border-[color:var(--color-borde)] bg-white/86 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-slate-600"
                  >
                    {seleccion.etiquetaAtributo}: {seleccion.etiquetaOpcion}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => eliminarItem(item.idLinea)}
            className="shrink-0 text-sm font-semibold text-[color:var(--color-error-600)] transition-opacity hover:opacity-75"
          >
            Eliminar
          </button>
        </div>

        <div className="flex flex-col gap-4 border-t border-[color:var(--color-borde)] pt-4 sm:flex-row sm:items-end sm:justify-between">
          <ControlCantidadLineaCarrito
            cantidad={item.cantidad}
            compacto={modo === "drawer"}
            alDisminuir={() =>
              actualizarCantidadItem(item.idLinea, Math.max(1, item.cantidad - 1))
            }
            alAumentar={() =>
              actualizarCantidadItem(item.idLinea, item.cantidad + 1)
            }
          />

          <div className={modo === "pagina" ? "space-y-1 sm:text-right" : "space-y-1"}>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Unitario {formatearPrecioClp(item.precioUnitarioIvaIncluido)}
            </p>
            <p className="font-[var(--fuente-titulos)] text-[1.65rem] font-semibold leading-none tracking-[-0.05em] text-slate-950">
              {formatearPrecioClp(montoLinea)}
            </p>
            <p className="text-xs text-slate-500">IVA incluido</p>
          </div>
        </div>
      </div>
    </article>
  );
}
