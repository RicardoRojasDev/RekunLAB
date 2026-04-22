import Link from "next/link";
import { ContenedorPrincipal } from "@/compartido/componentes/base/contenedor-principal";
import {
  capacidadesMarca,
  enlacesNavegacionPrincipal,
} from "@/compartido/configuracion/layout-global";
import { configuracionSitio } from "@/compartido/configuracion/sitio";
import { MarcaPrincipal } from "./marca-principal";

export function FooterGlobal() {
  return (
    <footer className="border-t border-[color:var(--color-borde)] bg-[#0d1715] text-white">
      <ContenedorPrincipal claseName="py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.35fr_0.9fr_0.9fr]">
          <section className="space-y-6">
            <MarcaPrincipal variante="clara" />

            <p className="max-w-md text-sm leading-7 text-white/68">
              {configuracionSitio.descripcionCorta}
            </p>

            <ul className="flex flex-wrap gap-2">
              {capacidadesMarca.map((capacidad) => (
                <li
                  key={capacidad}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.12em] text-white/72"
                >
                  {capacidad}
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/78">
              Navegacion
            </h2>

            <ul className="space-y-3 text-sm text-white/68">
              {enlacesNavegacionPrincipal.map((enlace) => (
                <li key={enlace.etiqueta}>
                  <Link
                    href={enlace.href}
                    className="transition-colors hover:text-white"
                  >
                    {enlace.etiqueta}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/acceso" className="transition-colors hover:text-white">
                  Acceso
                </Link>
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/78">
              Compra
            </h2>

            <p className="max-w-xs text-sm leading-7 text-white/54">
              Productos de impresion 3D presentados con una lectura simple, precios
              con IVA incluido y foco en despacho dentro de Chile.
            </p>
          </section>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs tracking-[0.1em] text-white/42 sm:flex-row sm:items-center sm:justify-between">
          <p>Rekun LAB | tecnologia, economia circular y compra clara.</p>
          <p>{new Date().getFullYear()} Rekun LAB</p>
        </div>
      </ContenedorPrincipal>
    </footer>
  );
}
