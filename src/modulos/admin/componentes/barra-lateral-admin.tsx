"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MarcaPrincipal } from "@/compartido/componentes/layout/marca-principal";
import { Etiqueta } from "@/compartido/componentes/ui";
import { unirClases } from "@/compartido/utilidades/unir-clases";
import { enlacesNavegacionAdmin } from "../configuracion/navegacion-admin";
import type { UsuarioAdministrador } from "../tipos/admin";

type PropiedadesBarraLateralAdmin = Readonly<{
  usuario: UsuarioAdministrador;
}>;

export function BarraLateralAdmin({
  usuario,
}: PropiedadesBarraLateralAdmin) {
  const pathname = usePathname();

  return (
    <aside className="w-full xl:max-w-[19rem]">
      <div className="rounded-[var(--radio-xl)] border border-[color:var(--color-borde)] bg-[linear-gradient(180deg,rgba(10,24,22,0.98),rgba(16,39,35,0.98))] p-5 text-white shadow-[0_24px_70px_rgba(7,18,16,0.24)] sm:p-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <MarcaPrincipal variante="clara" mostrarDescriptor={false} />
              <Etiqueta variante="premium" tamanio="sm">
                Admin
              </Etiqueta>
            </div>

            <div className="rounded-[var(--radio-md)] border border-white/10 bg-white/6 px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/54">
                Sesion habilitada
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                {usuario.nombreCompleto}
              </p>
              <p className="mt-1 text-sm text-white/64">{usuario.correo}</p>
            </div>
          </div>

          <nav aria-label="Navegacion administrativa" className="space-y-2">
            {enlacesNavegacionAdmin.map((enlace) => {
              const estaActivo =
                enlace.href === "/admin"
                  ? pathname === enlace.href
                  : pathname === enlace.href || pathname.startsWith(`${enlace.href}/`);

              return (
                <Link
                  key={enlace.href}
                  href={enlace.href}
                  aria-current={estaActivo ? "page" : undefined}
                  className={unirClases(
                    "flex items-start gap-3 rounded-[var(--radio-md)] border px-4 py-3 transition-colors",
                    estaActivo
                      ? "border-white/16 bg-white/10 text-white"
                      : "border-transparent bg-transparent text-white/70 hover:border-white/10 hover:bg-white/6 hover:text-white",
                  )}
                >
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radio-sm)] border border-white/10 bg-white/6 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/82">
                    {enlace.claveVisual}
                  </span>

                  <span className="space-y-1">
                    <span className="block text-sm font-semibold">
                      {enlace.etiqueta}
                    </span>
                    <span className="block text-xs leading-6 text-current/75">
                      {enlace.descripcion}
                    </span>
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="boton-base boton-secundario min-h-10 px-4 text-sm"
            >
              Ver tienda
            </Link>
            <Link
              href="/catalogo"
              className="boton-base boton-fantasma min-h-10 px-4 text-sm text-white"
            >
              Catalogo publico
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
