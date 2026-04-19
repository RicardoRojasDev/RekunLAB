import { ContenedorPrincipal } from "@/compartido/componentes/base/contenedor-principal";

const bloquesBase = [
  {
    titulo: "Header global",
    descripcion:
      "La cabecera queda lista para branding, carrito futuro y navegacion comercial con una presencia sobria y clara.",
  },
  {
    titulo: "Navegacion preparada",
    descripcion:
      "La navegacion principal se monto como estructura compartida para sumar catalogo, servicios y cotizaciones sin rehacer el layout.",
  },
  {
    titulo: "Footer consistente",
    descripcion:
      "El cierre global incorpora contexto de marca, operacion inicial y una base limpia para SEO tecnico y enlaces futuros.",
  },
] as const;

const capasPreparadas = [
  "Branding principal",
  "Contenedor principal reusable",
  "Carrito futuro",
  "Navegacion comercial escalable",
  "Estructura mobile first",
  "Metadata tecnica base",
] as const;

export function ResumenBaseProyecto() {
  return (
    <section>
      <ContenedorPrincipal claseName="flex flex-col gap-8">
        <header className="max-w-4xl space-y-5">
          <span className="inline-flex w-fit rounded-full border border-[color:var(--color-borde-fuerte)] bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 shadow-[0_14px_30px_rgba(12,25,22,0.06)] backdrop-blur">
            Modulo 3 - Layout global
          </span>

          <div className="space-y-4">
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Base visual sobria, premium y lista para sostener el ecommerce de
              Rekun LAB
            </h1>

            <p className="max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
              El sitio ya tiene layout raiz, cabecera global, navegacion
              principal, footer global, contenedor reusable y una capa minima
              de SEO tecnico para que las futuras paginas comerciales compartan
              una estructura coherente.
            </p>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
          <article className="rounded-[2rem] border border-[color:var(--color-borde)] bg-[color:var(--color-superficie)] p-6 shadow-[0_22px_60px_rgba(12,25,22,0.08)] backdrop-blur">
            <div className="max-w-2xl space-y-4">
              <span className="inline-flex rounded-full bg-slate-950 px-3 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-white">
                Estructura comercial
              </span>

              <h2 className="text-2xl font-semibold text-slate-950 sm:text-3xl">
                Un marco global preparado para branding, carrito y crecimiento
                por modulos
              </h2>

              <p className="text-sm leading-7 text-slate-600 sm:text-base">
                Esta base trabaja mobile first, usa landmarks semanticos y deja
                espacio claro para sumar catalogo, cotizaciones, carrito y
                otras rutas sin romper la consistencia visual del sitio.
              </p>
            </div>
          </article>

          <aside className="rounded-[2rem] border border-[color:var(--color-borde)] bg-white/82 p-6 shadow-[0_18px_40px_rgba(12,25,22,0.05)] backdrop-blur">
            <h2 className="text-lg font-semibold text-slate-950">
              Espacios ya resueltos
            </h2>

            <ul className="mt-5 grid gap-3 text-sm text-slate-700">
              {capasPreparadas.map((capa) => (
                <li
                  key={capa}
                  className="rounded-2xl border border-[color:var(--color-borde)] bg-slate-50/90 px-4 py-3"
                >
                  {capa}
                </li>
              ))}
            </ul>
          </aside>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {bloquesBase.map((bloque) => (
            <article
              key={bloque.titulo}
              className="rounded-[2rem] border border-[color:var(--color-borde)] bg-[color:var(--color-superficie)] p-6 shadow-[0_18px_45px_rgba(12,25,22,0.05)] backdrop-blur"
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

        <section className="rounded-[2rem] border border-[color:var(--color-borde)] bg-white/88 p-6 shadow-[0_20px_40px_rgba(12,25,22,0.05)] backdrop-blur">
          <div className="max-w-2xl space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900">
              Criterios del layout
            </h2>
            <p className="text-sm leading-7 text-slate-600">
              El layout no incorpora catalogo funcional ni flujos reales de
              compra. Solo resuelve la columna vertebral visual y tecnica sobre
              la que se montaran las paginas comerciales del ecommerce.
            </p>
          </div>

          <ul className="mt-6 grid gap-3 text-sm text-slate-700 md:grid-cols-2">
            <li className="rounded-2xl border border-[color:var(--color-borde)] bg-slate-50 px-4 py-3">
              Layout raiz con header, main y footer semanticos
            </li>
            <li className="rounded-2xl border border-[color:var(--color-borde)] bg-slate-50 px-4 py-3">
              Navegacion global responsive y preparada para futuras rutas
            </li>
            <li className="rounded-2xl border border-[color:var(--color-borde)] bg-slate-50 px-4 py-3">
              Footer global con contexto de marca y operacion inicial
            </li>
            <li className="rounded-2xl border border-[color:var(--color-borde)] bg-slate-50 px-4 py-3">
              SEO tecnico base con metadata, canonical, viewport y semantica
            </li>
          </ul>
        </section>
      </ContenedorPrincipal>
    </section>
  );
}
