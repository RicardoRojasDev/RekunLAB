import { ContenedorPrincipal } from "@/compartido/componentes/base/contenedor-principal";
import { Cargador, Contenedor, Etiqueta } from "@/compartido/componentes/ui";

const tarjetasSimuladas = Array.from({ length: 6 }, (_, indice) => indice);

export function CatalogoCargando() {
  return (
    <section aria-labelledby="titulo-catalogo-cargando">
      <ContenedorPrincipal claseName="flex flex-col gap-[var(--espacio-xl)] pb-[var(--espacio-2xl)]">
        <header className="grid gap-4 xl:grid-cols-[1.12fr_0.88fr]">
          <Contenedor variante="oscuro" relleno="lg">
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <Etiqueta variante="oscura">Catalogo en preparacion</Etiqueta>
                <Etiqueta variante="premium">Consultando Supabase</Etiqueta>
              </div>

              <div className="space-y-4">
                <div className="esqueleto-carga esqueleto-carga-oscura h-5 w-32 rounded-full" />
                <div
                  id="titulo-catalogo-cargando"
                  className="esqueleto-carga esqueleto-carga-oscura h-28 max-w-4xl rounded-[var(--radio-lg)]"
                />
                <div className="esqueleto-carga esqueleto-carga-oscura h-[4.5rem] max-w-3xl rounded-[var(--radio-lg)]" />
              </div>

              <Cargador etiqueta="Cargando catalogo visual" tamanio="lg" />
            </div>
          </Contenedor>

          <Contenedor variante="elevado" relleno="lg">
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="esqueleto-carga esqueleto-carga-clara h-5 w-36 rounded-full" />
                <div className="esqueleto-carga esqueleto-carga-clara h-[4.5rem] rounded-[var(--radio-lg)]" />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {Array.from({ length: 4 }, (_, indice) => (
                  <div
                    key={indice}
                    className="rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/72 p-4"
                  >
                    <div className="esqueleto-carga esqueleto-carga-clara h-4 w-20 rounded-full" />
                    <div className="esqueleto-carga esqueleto-carga-clara mt-3 h-10 w-16 rounded-[var(--radio-sm)]" />
                  </div>
                ))}
              </div>
            </div>
          </Contenedor>
        </header>

        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {tarjetasSimuladas.map((indice) => (
            <Contenedor
              key={indice}
              variante="elevado"
              claseName="overflow-hidden p-0"
            >
              <div className="esqueleto-carga esqueleto-carga-clara h-[22rem] w-full" />

              <div className="space-y-4 p-5 sm:p-6">
                <div className="esqueleto-carga esqueleto-carga-clara h-4 w-28 rounded-full" />
                <div className="space-y-2">
                  <div className="esqueleto-carga esqueleto-carga-clara h-8 rounded-[var(--radio-sm)]" />
                  <div className="esqueleto-carga esqueleto-carga-clara h-16 rounded-[var(--radio-sm)]" />
                </div>
                <div className="flex gap-2">
                  <div className="esqueleto-carga esqueleto-carga-clara h-7 w-24 rounded-full" />
                  <div className="esqueleto-carga esqueleto-carga-clara h-7 w-20 rounded-full" />
                </div>
                <div className="border-t border-[color:var(--color-borde)] pt-4">
                  <div className="esqueleto-carga esqueleto-carga-clara h-4 w-24 rounded-full" />
                  <div className="esqueleto-carga esqueleto-carga-clara mt-3 h-10 w-36 rounded-[var(--radio-sm)]" />
                </div>
              </div>
            </Contenedor>
          ))}
        </div>
      </ContenedorPrincipal>
    </section>
  );
}
