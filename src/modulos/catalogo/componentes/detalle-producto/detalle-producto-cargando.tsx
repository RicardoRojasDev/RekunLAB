import { ContenedorPrincipal } from "@/compartido/componentes/base/contenedor-principal";
import { Contenedor, Etiqueta } from "@/compartido/componentes/ui";

export function DetalleProductoCargando() {
  return (
    <section aria-labelledby="titulo-cargando-detalle-producto">
      <ContenedorPrincipal claseName="flex flex-col gap-[var(--espacio-xl)] pb-[var(--espacio-2xl)]">
        <div className="grid gap-6 xl:grid-cols-[0.94fr_1.06fr]">
          <Contenedor variante="elevado" claseName="overflow-hidden p-0">
            <div className="esqueleto-carga esqueleto-carga-clara h-[34rem] w-full" />
            <div className="grid gap-3 p-4 sm:grid-cols-3">
              {Array.from({ length: 3 }, (_, indice) => (
                <div
                  key={indice}
                  className="overflow-hidden rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/86"
                >
                  <div className="esqueleto-carga esqueleto-carga-clara h-28 w-full" />
                  <div className="space-y-2 p-3">
                    <div className="esqueleto-carga esqueleto-carga-clara h-3 w-16 rounded-full" />
                    <div className="esqueleto-carga esqueleto-carga-clara h-5 rounded-[var(--radio-sm)]" />
                  </div>
                </div>
              ))}
            </div>
          </Contenedor>

          <div className="space-y-4">
            <Contenedor variante="elevado" relleno="lg">
              <div className="space-y-6">
                <div className="flex gap-2">
                  <Etiqueta variante="suave">Cargando ficha</Etiqueta>
                  <Etiqueta variante="premium">Detalle de producto</Etiqueta>
                </div>

                <div className="space-y-4">
                  <div
                    id="titulo-cargando-detalle-producto"
                    className="esqueleto-carga esqueleto-carga-clara h-24 rounded-[var(--radio-lg)]"
                  />
                  <div className="esqueleto-carga esqueleto-carga-clara h-20 rounded-[var(--radio-lg)]" />
                </div>

                <div className="rounded-[var(--radio-lg)] border border-[color:var(--color-borde)] bg-white/78 p-5">
                  <div className="esqueleto-carga esqueleto-carga-clara h-4 w-24 rounded-full" />
                  <div className="esqueleto-carga esqueleto-carga-clara mt-4 h-12 w-40 rounded-[var(--radio-sm)]" />
                </div>

                <div className="space-y-4 rounded-[var(--radio-lg)] border border-[color:var(--color-borde)] bg-white/72 p-5">
                  <div className="grid gap-4 md:grid-cols-[11rem_1fr]">
                    <div className="space-y-2">
                      <div className="esqueleto-carga esqueleto-carga-clara h-3 w-20 rounded-full" />
                      <div className="esqueleto-carga esqueleto-carga-clara h-12 rounded-full" />
                    </div>
                    <div className="esqueleto-carga esqueleto-carga-clara h-12 rounded-full" />
                  </div>
                </div>
              </div>
            </Contenedor>
          </div>
        </div>
      </ContenedorPrincipal>
    </section>
  );
}
