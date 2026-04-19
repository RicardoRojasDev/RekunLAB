import { ContenedorPrincipal } from "@/compartido/componentes/base/contenedor-principal";

export function CheckoutCargando() {
  return (
    <section aria-label="Cargando checkout">
      <ContenedorPrincipal claseName="pb-[var(--espacio-2xl)]">
        <div className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-4">
            <div className="esqueleto-carga esqueleto-carga-clara h-32 rounded-[var(--radio-lg)] border border-[color:var(--color-borde)]" />
            <div className="esqueleto-carga esqueleto-carga-clara h-72 rounded-[var(--radio-lg)] border border-[color:var(--color-borde)]" />
            <div className="esqueleto-carga esqueleto-carga-clara h-96 rounded-[var(--radio-lg)] border border-[color:var(--color-borde)]" />
          </div>

          <div className="space-y-4">
            <div className="esqueleto-carga esqueleto-carga-clara h-[34rem] rounded-[var(--radio-lg)] border border-[color:var(--color-borde)]" />
          </div>
        </div>
      </ContenedorPrincipal>
    </section>
  );
}

