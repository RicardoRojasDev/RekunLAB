"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { enlacesNavegacionPrincipal } from "@/compartido/configuracion/layout-global";
import { unirClases } from "@/compartido/utilidades/unir-clases";

type PropiedadesNavegacionPrincipal = Readonly<{
  claseName?: string;
}>;

export function NavegacionPrincipal({
  claseName,
}: PropiedadesNavegacionPrincipal) {
  const pathname = usePathname();

  return (
    <nav
      id="navegacion-principal"
      aria-label="Navegacion principal"
      className={claseName}
    >
      <ul className="flex min-w-max items-center gap-2">
        {enlacesNavegacionPrincipal.map((enlace) => {
          const estaActivo =
            enlace.href === "/"
              ? pathname === enlace.href
              : pathname === enlace.href || pathname.startsWith(`${enlace.href}/`);

          return (
            <li key={enlace.etiqueta}>
              <Link
                href={enlace.href}
                aria-current={estaActivo ? "page" : undefined}
                className={unirClases(
                  "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition-colors",
                  estaActivo
                    ? "border-[color:var(--color-borde-fuerte)] bg-white/88 text-slate-950 shadow-[0_10px_30px_rgba(15,31,28,0.08)]"
                    : "border-transparent bg-transparent text-slate-600 hover:border-[color:var(--color-borde)] hover:bg-white/70 hover:text-slate-900",
                )}
              >
                {enlace.etiqueta}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
