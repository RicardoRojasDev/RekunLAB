import { unirClases } from "@/compartido/utilidades/unir-clases";

type PropiedadesControlCantidadLineaCarrito = Readonly<{
  cantidad: number;
  compacto?: boolean;
  alDisminuir: () => void;
  alAumentar: () => void;
}>;

export function ControlCantidadLineaCarrito({
  cantidad,
  compacto = false,
  alDisminuir,
  alAumentar,
}: PropiedadesControlCantidadLineaCarrito) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        Cantidad
      </p>

      <div className="flex items-center overflow-hidden rounded-[var(--radio-pill)] border border-[color:var(--color-borde)] bg-white/86 shadow-[var(--sombra-suave)]">
        <button
          type="button"
          onClick={alDisminuir}
          disabled={cantidad <= 1}
          aria-label="Disminuir cantidad"
          className={unirClases(
            "inline-flex items-center justify-center text-lg font-semibold text-slate-700 transition-colors",
            compacto ? "h-10 w-10" : "h-11 w-11",
            cantidad <= 1
              ? "cursor-not-allowed opacity-45"
              : "hover:bg-[color:var(--color-hover-capa)]",
          )}
        >
          -
        </button>

        <span
          aria-live="polite"
          className={unirClases(
            "inline-flex min-w-11 items-center justify-center border-x border-[color:var(--color-borde)] px-3 font-semibold text-slate-950",
            compacto ? "h-10 text-sm" : "h-11 text-base",
          )}
        >
          {cantidad}
        </span>

        <button
          type="button"
          onClick={alAumentar}
          aria-label="Aumentar cantidad"
          className={unirClases(
            "inline-flex items-center justify-center text-lg font-semibold text-slate-700 transition-colors hover:bg-[color:var(--color-hover-capa)]",
            compacto ? "h-10 w-10" : "h-11 w-11",
          )}
        >
          +
        </button>
      </div>
    </div>
  );
}
