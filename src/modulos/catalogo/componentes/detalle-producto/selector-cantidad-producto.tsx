"use client";

import { unirClases } from "@/compartido/utilidades/unir-clases";

type PropiedadesSelectorCantidadProducto = Readonly<{
  cantidad: number;
  alCambiarCantidad: (cantidad: number) => void;
}>;

export function SelectorCantidadProducto({
  cantidad,
  alCambiarCantidad,
}: PropiedadesSelectorCantidadProducto) {
  function manejarCambioDirecto(valor: string) {
    const valorNumerico = Number(valor);

    if (!Number.isFinite(valorNumerico)) {
      return;
    }

    alCambiarCantidad(Math.max(1, Math.floor(valorNumerico)));
  }

  return (
    <div className="space-y-2">
      <label
        htmlFor="cantidad-producto"
        className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500"
      >
        Cantidad
      </label>

      <div className="flex items-center overflow-hidden rounded-[var(--radio-pill)] border border-[color:var(--color-borde)] bg-white/86 shadow-[var(--sombra-suave)]">
        <button
          type="button"
          onClick={() => alCambiarCantidad(Math.max(1, cantidad - 1))}
          className={unirClases(
            "inline-flex h-12 w-12 items-center justify-center text-lg font-semibold text-slate-700 transition-colors",
            cantidad <= 1 ? "cursor-not-allowed opacity-45" : "hover:bg-[color:var(--color-hover-capa)]",
          )}
          disabled={cantidad <= 1}
          aria-label="Disminuir cantidad"
        >
          -
        </button>

        <input
          id="cantidad-producto"
          type="number"
          min={1}
          inputMode="numeric"
          value={cantidad}
          onChange={(evento) => manejarCambioDirecto(evento.target.value)}
          className="h-12 w-full min-w-0 border-x border-[color:var(--color-borde)] bg-transparent px-3 text-center text-base font-semibold text-slate-950 outline-none"
        />

        <button
          type="button"
          onClick={() => alCambiarCantidad(cantidad + 1)}
          className="inline-flex h-12 w-12 items-center justify-center text-lg font-semibold text-slate-700 transition-colors hover:bg-[color:var(--color-hover-capa)]"
          aria-label="Aumentar cantidad"
        >
          +
        </button>
      </div>
    </div>
  );
}
