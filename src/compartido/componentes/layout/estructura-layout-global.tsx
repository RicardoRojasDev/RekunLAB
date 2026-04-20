"use client";

import { usePathname } from "next/navigation";
import type { PropiedadesConHijos } from "@/compartido/tipos/comunes";
import { FooterGlobal } from "./footer-global";
import { HeaderGlobal } from "./header-global";

export function EstructuraLayoutGlobal({
  children,
}: PropiedadesConHijos) {
  const pathname = usePathname();
  const esRutaAdmin = pathname === "/admin" || pathname.startsWith("/admin/");

  return (
    <div className="relative flex min-h-screen flex-col">
      {!esRutaAdmin ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[26rem] bg-[radial-gradient(circle_at_top_left,rgba(13,124,102,0.18),transparent_42%),radial-gradient(circle_at_top_right,rgba(188,174,124,0.18),transparent_30%)]"
        />
      ) : null}

      {!esRutaAdmin ? <HeaderGlobal /> : null}

      <main
        id="contenido-principal"
        className={
          esRutaAdmin
            ? "relative flex-1"
            : "relative flex-1 pb-16 pt-5 sm:pb-20 sm:pt-8"
        }
      >
        {children}
      </main>

      {!esRutaAdmin ? <FooterGlobal /> : null}
    </div>
  );
}
