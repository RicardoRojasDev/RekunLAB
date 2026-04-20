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
    etiqueta: "Impresoras y packs",
    titulo: "Equipamiento para crecer",
    descripcion:
      "Seleccion de impresoras 3D y packs listos para iniciar, equipar o ampliar una operacion real en Chile.",
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

  return (
    <section aria-labelledby="titulo-inicio-rekun-lab">
      <ContenedorPrincipal claseName="flex flex-col gap-[var(--espacio-xl)] pb-[var(--espacio-2xl)]">
        <header className="grid gap-6 xl:grid-cols-[1.06fr_0.94fr] xl:items-start">
          <Contenedor variante="oscuro" relleno="lg">
            <div className="space-y-7">
              <div className="flex flex-wrap gap-2">
                <Etiqueta variante="oscura">Rekun LAB</Etiqueta>
                <Etiqueta variante="premium">Tecnologia y sustentabilidad</Etiqueta>
              </div>

              <div className="space-y-4">
                <h1
                  id="titulo-inicio-rekun-lab"
                  className="titulo-display max-w-5xl text-white"
                >
                  Ecommerce chileno para filamentos PLA, impresion 3D y equipamiento
                  listo para negocio real
                </h1>

                <p className="max-w-3xl text-base leading-8 text-white/72 sm:text-[1.05rem]">
                  Rekun LAB combina economia circular, materiales con identidad y
                  seleccion de impresoras 3D para una compra clara, sobria y
                  orientada a operacion.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/catalogo"
                  className="boton-base boton-primario min-h-12 px-5 text-sm"
                >
                  Ver catalogo
                </Link>
                <Link
                  href="/catalogo?tipo=Filamento"
                  className="boton-base boton-secundario min-h-12 px-5 text-sm"
                >
                  Explorar filamentos PLA
                </Link>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {condicionesCompra.map((condicion) => (
                  <div
                    key={condicion.titulo}
                    className="rounded-[var(--radio-md)] border border-white/10 bg-white/6 px-4 py-4"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/56">
                      {condicion.titulo}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-white/82">
                      {condicion.descripcion}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Contenedor>

          <Tarjeta
            variante="elevada"
            etiqueta={<Etiqueta variante="primaria">Panorama actual</Etiqueta>}
            titulo="Catalogo activo para compra real"
            descripcion="La vitrina ya integra filamentos, impresoras 3D y packs bajo una experiencia de compra enfocada en Chile."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/78 px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Filamentos
                </p>
                <p className="mt-2 font-[var(--fuente-titulos)] text-3xl font-semibold tracking-[-0.04em] text-slate-950">
                  {String(cantidadFilamentos).padStart(2, "0")}
                </p>
              </div>

              <div className="rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/78 px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Impresoras
                </p>
                <p className="mt-2 font-[var(--fuente-titulos)] text-3xl font-semibold tracking-[-0.04em] text-slate-950">
                  {String(cantidadImpresoras).padStart(2, "0")}
                </p>
              </div>

              <div className="rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/78 px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Packs
                </p>
                <p className="mt-2 font-[var(--fuente-titulos)] text-3xl font-semibold tracking-[-0.04em] text-slate-950">
                  {String(cantidadPacks).padStart(2, "0")}
                </p>
              </div>

              <div className="rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/78 px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Colecciones
                </p>
                <p className="mt-2 font-[var(--fuente-titulos)] text-3xl font-semibold tracking-[-0.04em] text-slate-950">
                  {String(cantidadColecciones).padStart(2, "0")}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/74 px-4 py-4 text-sm leading-7 text-slate-700">
              Catalogo enfocado en una lectura simple: nombre comercial, categoria,
              precio final y acceso directo a compra.
            </div>
          </Tarjeta>
        </header>

        <section aria-labelledby="titulo-bloques-inicio" className="space-y-6">
          <div className="space-y-3">
            <Etiqueta variante="suave">Que hacemos</Etiqueta>
            <div className="space-y-2">
              <h2 id="titulo-bloques-inicio" className="titulo-seccion text-slate-950">
                Una propuesta mas clara y menos ruidosa
              </h2>
              <p className="texto-soporte max-w-3xl">
                Dejamos visibles solo las capas que hoy aportan valor real al
                ecommerce.
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
                  Productos visibles desde el catalogo real
                </h2>
                <p className="texto-soporte max-w-3xl">
                  Una seleccion breve para entrar al ecommerce sin secciones
                  decorativas ni promesas vacias.
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
