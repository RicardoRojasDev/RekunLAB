import type { ReactNode } from "react";
import { Etiqueta } from "@/compartido/componentes/ui";
import type { UsuarioAdministrador } from "../tipos/admin";
import { BarraLateralAdmin } from "./barra-lateral-admin";

type PropiedadesLayoutAdminInterno = Readonly<{
  usuario: UsuarioAdministrador;
  children: ReactNode;
}>;

export function LayoutAdminInterno({
  usuario,
  children,
}: PropiedadesLayoutAdminInterno) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eef3ef_0%,#f8faf8_100%)]">
      <div className="mx-auto flex w-full max-w-[1680px] flex-col gap-4 px-4 py-4 xl:min-h-screen xl:flex-row xl:gap-6 xl:px-6 xl:py-6">
        <BarraLateralAdmin usuario={usuario} />

        <div className="flex min-w-0 flex-1 flex-col gap-4 xl:gap-6">
          <header className="rounded-[var(--radio-xl)] border border-[color:var(--color-borde)] bg-white/84 px-5 py-5 shadow-[var(--sombra-panel)] backdrop-blur-xl sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Etiqueta variante="primaria">Zona administrativa</Etiqueta>
                  <Etiqueta variante="suave">Separada de la tienda publica</Etiqueta>
                </div>
                <h1 className="text-[clamp(1.7rem,3vw,2.5rem)] font-semibold tracking-[-0.04em] text-slate-950">
                  Backoffice Rekun LAB
                </h1>
                <p className="max-w-3xl text-sm leading-7 text-slate-600">
                  Base sobria para operar catalogo, pedidos e imagenes sin mezclar
                  la gestion interna con la experiencia publica.
                </p>
              </div>

              <div className="rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/82 px-4 py-4 text-sm text-slate-600">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Administrador
                </p>
                <p className="mt-1 font-semibold text-slate-950">
                  {usuario.nombreCompleto}
                </p>
                <p className="mt-1">{usuario.correo}</p>
              </div>
            </div>
          </header>

          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
