import Link from "next/link";
import { enlacesNavegacionPrincipal } from "@/compartido/configuracion/layout-global";
import { unirClases } from "@/compartido/utilidades/unir-clases";

type PropiedadesNavegacionPrincipal = Readonly<{
  claseName?: string;
}>;

export function NavegacionPrincipal({
  claseName,
}: PropiedadesNavegacionPrincipal) {
  return (
    <nav
      id="navegacion-principal"
      aria-label="Navegacion principal"
      className={claseName}
    >
      <ul className="flex min-w-max items-center gap-2">
        {enlacesNavegacionPrincipal.map((enlace) => (
          <li key={enlace.etiqueta}>
            {enlace.href ? (
              <Link
                href={enlace.href}
                className={unirClases(
                  "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition-colors",
                  enlace.estado === "activo"
                    ? "border-[color:var(--color-borde-fuerte)] bg-white/88 text-slate-950 shadow-[0_10px_30px_rgba(15,31,28,0.08)]"
                    : "border-transparent bg-transparent text-slate-600 hover:border-[color:var(--color-borde)] hover:bg-white/70 hover:text-slate-900",
                )}
              >
                {enlace.etiqueta}
              </Link>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-borde)] bg-white/40 px-4 py-2.5 text-sm text-slate-500">
                {enlace.etiqueta}
                <span className="rounded-full bg-slate-900/5 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">
                  Pronto
                </span>
              </span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
