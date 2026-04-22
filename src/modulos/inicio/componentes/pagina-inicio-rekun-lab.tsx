import Link from "next/link";
import { ContenedorPrincipal } from "@/compartido/componentes/base/contenedor-principal";
import { Contenedor, Etiqueta, Tarjeta } from "@/compartido/componentes/ui";
import { obtenerProductosCatalogo } from "@/modulos/catalogo";
import { TarjetaProductoCatalogo } from "@/modulos/catalogo/componentes/tarjeta-producto-catalogo";

const bloquesInicio = [
  {
    etiqueta: "Filamentos PLA",
    titulo: "Materiales con identidad propia",
    descripcion:
      "Filamentos Rekun LAB pensados para prototipos, piezas finales y colecciones con un lenguaje visual cuidado.",
  },
  {
    etiqueta: "Impresion 3D",
    titulo: "Produccion personalizada",
    descripcion:
      "Desarrollamos soluciones a medida para marcas, talleres y proyectos que necesitan precision, consistencia y criterio tecnico.",
  },
  {
    etiqueta: "Impresoras y equipos",
    titulo: "Equipamiento para crecer",
    descripcion:
      "Seleccion de impresoras 3D y equipamiento para iniciar, equipar o ampliar una operacion en Chile.",
  },
] as const;

const condicionesCompra = [
  {
    titulo: "Solo Chile",
    descripcion: "La operacion actual contempla ventas y despacho dentro de Chile.",
  },
  {
    titulo: "IVA incluido",
    descripcion: "Los precios publicados ya consideran IVA desde la vitrina hasta el checkout.",
  },
  {
    titulo: "Despacho",
    descripcion: "Por ahora trabajamos solo con envio, sin retiro fisico.",
  },
] as const;

export async function PaginaInicioRekunLab() {
  const productos = await obtenerProductosCatalogo();
  const fuenteDestacados = productos.some((producto) => producto.esDestacado)
    ? productos.filter((producto) => producto.esDestacado)
    : productos;
  const productosDestacados = fuenteDestacados.slice(0, 3);

  const cantidadFilamentos = productos.filter(
    (producto) => producto.tipoProducto === "Filamento",
  ).length;
  const cantidadImpresoras = productos.filter(
    (producto) => producto.tipoProducto === "Impresora",
  ).length;
  const cantidadPacks = productos.filter(
    (producto) => producto.tipoProducto === "Pack",
  ).length;
  const cantidadColecciones = new Set(
    productos.flatMap((producto) =>
      producto.coleccion ? [producto.coleccion] : [],
    ),
  ).size;
  const resumenTienda: Array<{ etiqueta: string; valor: number }> = [
    { etiqueta: "Filamentos", valor: cantidadFilamentos },
    { etiqueta: "Impresoras", valor: cantidadImpresoras },
    ...(cantidadPacks > 0 ? [{ etiqueta: "Packs", valor: cantidadPacks }] : []),
    ...(cantidadColecciones > 0
      ? [{ etiqueta: "Colecciones", valor: cantidadColecciones }]
      : []),
  ];

  return (
    <section aria-labelledby="titulo-inicio-rekun-lab">
      <ContenedorPrincipal claseName="flex flex-col gap-[var(--espacio-xl)] pb-[var(--espacio-2xl)] lg:gap-[var(--espacio-2xl)] xl:!max-w-[88rem] 2xl:!max-w-[94rem]">
        <div className="relative z-0">
          <header className="grid gap-5 lg:gap-6 xl:grid-cols-[0.92fr_1.08fr] xl:items-start xl:gap-7 2xl:grid-cols-[0.88fr_1.12fr]">
            <Contenedor variante="oscuro" relleno="md" claseName="relative overflow-hidden">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(13,124,102,0.22),transparent_52%),radial-gradient(circle_at_bottom_right,rgba(188,174,124,0.16),transparent_55%)]"
              />

              <div className="relative space-y-6 xl:space-y-5">
              <div className="flex flex-wrap gap-2">
                <Etiqueta variante="oscura">Rekun LAB</Etiqueta>
                <Etiqueta variante="premium">Tecnologia y sustentabilidad</Etiqueta>
              </div>

              <div className="space-y-4">
                <h1
                  id="titulo-inicio-rekun-lab"
                  className="max-w-4xl text-balance font-[var(--fuente-titulos)] text-[clamp(2.35rem,3.35vw,3.85rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-white"
                >
                  Ecommerce chileno para impresion 3D, filamentos PLA y equipamiento
                </h1>

                <p className="max-w-3xl text-pretty text-base leading-8 text-white/70 sm:text-[1.05rem]">
                  Rekun LAB combina economia circular, materiales con identidad y
                  seleccion de impresoras 3D para una compra clara, sobria y
                  enfocada en Chile.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/catalogo"
                  className="boton-base boton-primario min-h-11 px-5 text-sm"
                >
                  Ver catalogo
                </Link>
                {cantidadFilamentos > 0 ? (
                  <Link
                    href="/catalogo?tipo=Filamento"
                    className="boton-base boton-secundario min-h-11 px-5 text-sm"
                  >
                    Explorar filamentos PLA
                  </Link>
                ) : null}
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {condicionesCompra.map((condicion) => (
                  <div
                    key={condicion.titulo}
                    className="rounded-[var(--radio-md)] border border-white/10 bg-white/6 px-4 py-3.5"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/56">
                      {condicion.titulo}
                    </p>
                    <p className="mt-1.5 text-sm leading-6 text-white/82">
                      {condicion.descripcion}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Contenedor>

          <Tarjeta
            variante="elevada"
            etiqueta={<Etiqueta variante="primaria">En tienda</Etiqueta>}
            titulo="Catalogo disponible"
            descripcion="Explora el catalogo disponible con precios finales con IVA incluido y acceso directo al detalle."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {resumenTienda.map((item) => (
                <div
                  key={item.etiqueta}
                  className="rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/78 px-4 py-3.5"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {item.etiqueta}
                  </p>
                  <p className="mt-2 font-[var(--fuente-titulos)] text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                    {String(item.valor).padStart(2, "0")}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/74 px-4 py-3.5 text-sm leading-7 text-slate-700">
              Informacion clara para comparar: categoria, precio final con IVA incluido y
              acceso al detalle.
            </div>
          </Tarjeta>
          </header>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -bottom-10 -z-10 h-16 bg-[radial-gradient(circle_at_top,rgba(13,124,102,0.12),transparent_62%)]"
          />
        </div>

        <section aria-labelledby="titulo-bloques-inicio" className="space-y-6">
          <div className="space-y-3">
            <Etiqueta variante="suave">Que hacemos</Etiqueta>
            <div className="space-y-2">
              <h2 id="titulo-bloques-inicio" className="titulo-seccion text-slate-950">
                Tres lineas principales
              </h2>
              <p className="texto-soporte max-w-3xl">
                Filamentos PLA, impresion 3D y equipamiento para proyectos que
                necesitan precision y continuidad.
              </p>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            {bloquesInicio.map((bloque) => (
              <Tarjeta
                key={bloque.titulo}
                variante="elevada"
                etiqueta={<Etiqueta variante="premium">{bloque.etiqueta}</Etiqueta>}
                titulo={bloque.titulo}
                descripcion={bloque.descripcion}
              />
            ))}
          </div>
        </section>

        <section aria-labelledby="titulo-destacados-inicio" className="space-y-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <Etiqueta variante="primaria">Destacados</Etiqueta>
              <div className="space-y-2">
                <h2
                  id="titulo-destacados-inicio"
                  className="titulo-seccion text-slate-950"
                >
                  Productos destacados
                </h2>
                <p className="texto-soporte max-w-3xl">
                  Una seleccion breve para empezar a explorar el catalogo.
                </p>
              </div>
            </div>

            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition-colors hover:text-slate-950"
            >
              Ver todo el catalogo
              <span aria-hidden="true">/</span>
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {productosDestacados.map((producto) => (
              <TarjetaProductoCatalogo key={producto.id} producto={producto} />
            ))}
          </div>
        </section>
      </ContenedorPrincipal>
    </section>
  );
}
