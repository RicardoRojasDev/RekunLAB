"use client";

import Image from "next/image";
import Link from "next/link";
import { Boton, Etiqueta, Tarjeta } from "@/compartido/componentes/ui";
import { formatearPrecioClp } from "@/compartido/utilidades/formatear-precio-clp";
import type { ItemCarrito, ResumenCarrito } from "@/modulos/carrito";

type PropiedadesResumenCheckout = Readonly<{
  items: readonly ItemCarrito[];
  resumen: ResumenCarrito;
  deshabilitado?: boolean;
  textoBoton?: string;
}>;

function FilaItemResumenCheckout({ item }: Readonly<{ item: ItemCarrito }>) {
  const totalLinea = item.cantidad * item.precioUnitarioIvaIncluido;
  const nombreVisible = item.nombreCompleto ?? item.nombre;

  return (
    <li className="flex gap-3 rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/78 p-3">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-[color:var(--color-fondo-suave)]">
        <Image
          src={item.imagen.src}
          alt={item.imagen.alt}
          width={item.imagen.ancho}
          height={item.imagen.alto}
          sizes="4rem"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="min-w-0 flex-1 space-y-1">
        <p className="truncate text-sm font-semibold text-slate-950">
          {nombreVisible}
        </p>
        <p className="text-xs text-slate-500">
          {item.variante ? `Variante ${item.variante.etiqueta}` : item.tipoProducto}
        </p>
        <p className="text-xs text-slate-500">
          {item.cantidad} x {formatearPrecioClp(item.precioUnitarioIvaIncluido)}
        </p>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-sm font-semibold text-slate-950">
          {formatearPrecioClp(totalLinea)}
        </p>
        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
          IVA incl.
        </p>
      </div>
    </li>
  );
}

export function ResumenCheckout({
  items,
  resumen,
  deshabilitado = false,
  textoBoton = "Continuar",
}: PropiedadesResumenCheckout) {
  return (
    <Tarjeta
      variante="elevada"
      etiqueta={<Etiqueta variante="premium">Resumen</Etiqueta>}
      titulo="Tu compra"
      descripcion="Subtotal con IVA incluido. Puedes editar el carrito antes de continuar."
      acciones={
        <Link
          href="/carrito"
          className="boton-base boton-secundario min-h-10 px-4 text-sm"
        >
          Editar carrito
        </Link>
      }
    >
      <ul className="space-y-3">
        {items.map((item) => (
          <FilaItemResumenCheckout key={item.idLinea} item={item} />
        ))}
      </ul>

      <div className="space-y-3 border-t border-[color:var(--color-borde)] pt-4">
        <div className="flex items-end justify-between gap-4">
          <p className="text-sm text-slate-600">Subtotal</p>
          <p className="font-[var(--fuente-titulos)] text-3xl font-semibold leading-none tracking-[-0.05em] text-slate-950">
            {formatearPrecioClp(resumen.subtotalIvaIncluido)}
          </p>
        </div>

        <p className="text-xs leading-6 text-slate-500">
          Precios con IVA incluido segun reglas actuales. El costo de envio se
          definira cuando exista una politica de despacho formal.
        </p>

        <Boton bloque tamanio="lg" type="submit" disabled={deshabilitado}>
          {textoBoton}
        </Boton>
      </div>
    </Tarjeta>
  );
}
