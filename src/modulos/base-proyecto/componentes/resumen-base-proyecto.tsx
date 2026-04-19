import { ContenedorPagina } from "@/compartido/componentes/base/contenedor-pagina";

const bloquesBase = [
  {
    titulo: "Arquitectura modular",
    descripcion:
      "La aplicacion separa rutas, componentes compartidos, configuracion, servicios e integraciones para evitar acoplamientos tempranos.",
  },
  {
    titulo: "Escalabilidad real",
    descripcion:
      "La carpeta modulos queda lista para encapsular futuros dominios como catalogo, checkout, pedidos o administracion sin contaminar la capa global.",
  },
  {
    titulo: "Infraestructura preparada",
    descripcion:
      "Supabase se deja configurado como integracion externa con variables de entorno centralizadas y una fabrica base de cliente publico.",
  },
] as const;

const capasPreparadas = [
  "Entrada por App Router en src/app",
  "Codigo compartido transversal en src/compartido",
  "Dominios futuros en src/modulos",
  "Componentes reutilizables en src/compartido/componentes",
  "Servicios de infraestructura en src/compartido/servicios",
  "Configuracion y contratos en src/compartido/configuracion y tipos",
  "Convenciones tecnicas centralizadas en docs/",
] as const;

export function ResumenBaseProyecto() {
  return (
    <main className="min-h-screen">
      <ContenedorPagina claseName="gap-10">
        <header className="max-w-4xl space-y-4">
          <span className="inline-flex w-fit rounded-full border border-[color:var(--color-borde)] bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur">
            Modulos 1 y 2 - Base y arquitectura
          </span>

          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Base tecnica y reglas de arquitectura para Rekun LAB
            </h1>

            <p className="max-w-3xl text-lg leading-8 text-slate-600">
              Esta pagina solo confirma que la fundacion del proyecto esta
              montada: Next.js con App Router, TypeScript, Tailwind CSS, alias
              de imports, estructura modular, codigo compartido ordenado y
              preparacion inicial para Supabase.
            </p>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {bloquesBase.map((bloque) => (
            <article
              key={bloque.titulo}
              className="rounded-3xl border border-[color:var(--color-borde)] bg-[color:var(--color-superficie)] p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-slate-900">
                {bloque.titulo}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {bloque.descripcion}
              </p>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-[color:var(--color-borde)] bg-white/90 p-6 shadow-sm">
          <div className="max-w-2xl space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900">
              Capas preparadas para crecer
            </h2>
            <p className="text-sm leading-7 text-slate-600">
              La estructura no incorpora reglas de negocio ni modulos
              funcionales todavia. Solo deja una base ordenada para construirlos
              correctamente en las siguientes etapas, con criterios explicitos
              para naming, imports y separacion de responsabilidades.
            </p>
          </div>

          <ul className="mt-6 grid gap-3 text-sm text-slate-700 md:grid-cols-2">
            {capasPreparadas.map((capa) => (
              <li
                key={capa}
                className="rounded-2xl border border-[color:var(--color-borde)] bg-slate-50 px-4 py-3"
              >
                {capa}
              </li>
            ))}
          </ul>
        </section>
      </ContenedorPagina>
    </main>
  );
}
