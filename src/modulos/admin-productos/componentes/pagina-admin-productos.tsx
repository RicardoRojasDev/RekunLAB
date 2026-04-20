"use client";

import type { FormEvent } from "react";
import { useDeferredValue, useState, useTransition } from "react";
import { formatearPrecioClp } from "@/compartido/utilidades/formatear-precio-clp";
import {
  Boton,
  CampoTexto,
  EstadoVacio,
  Etiqueta,
  MensajeError,
  ModalBase,
  Selector,
  Tarjeta,
} from "@/compartido/componentes/ui";
import { unirClases } from "@/compartido/utilidades/unir-clases";
import type {
  DatosFormularioProductoAdmin,
  OpcionesAdminProductos,
  ProductoAdmin,
  RespuestaApiAdminProductos,
} from "../tipos/admin-productos";
import { FormularioProductoAdmin } from "./formulario-producto-admin";

type PropiedadesPaginaAdminProductos = Readonly<{
  productosIniciales: readonly ProductoAdmin[];
  opcionesIniciales: OpcionesAdminProductos;
}>;

function crearBorradorProducto(
  opciones: OpcionesAdminProductos,
): DatosFormularioProductoAdmin {
  return {
    skuBase: "",
    nombre: "",
    nombreCompleto: undefined,
    slug: "",
    resumen: "",
    descripcion: "",
    categoriaId: opciones.categorias[0]?.id ?? "",
    subcategoria: undefined,
    nivelId: undefined,
    marcaId: undefined,
    tipoProducto: "",
    precioCLP: 0,
    formato: undefined,
    pesoKg: undefined,
    acabado: undefined,
    efecto: undefined,
    colorHex: undefined,
    compatiblePLA: false,
    coleccion: undefined,
    esDestacado: false,
    estadoId: opciones.estados[0]?.id ?? "",
  };
}

function crearFormularioDesdeProducto(
  producto: ProductoAdmin,
): DatosFormularioProductoAdmin {
  return {
    skuBase: producto.skuBase,
    nombre: producto.nombre,
    nombreCompleto: producto.nombreCompleto,
    slug: producto.slug,
    resumen: producto.resumen,
    descripcion: producto.descripcion,
    categoriaId: producto.categoriaId ?? "",
    subcategoria: producto.subcategoria,
    nivelId: producto.nivelId,
    marcaId: producto.marcaId,
    tipoProducto: producto.tipoProducto,
    precioCLP: producto.precioCLP,
    formato: producto.formato,
    pesoKg: producto.pesoKg,
    acabado: producto.acabado,
    efecto: producto.efecto,
    colorHex: producto.colorHex,
    compatiblePLA: producto.compatiblePLA ?? false,
    coleccion: producto.coleccion,
    esDestacado: producto.esDestacado,
    estadoId: producto.estadoId,
  };
}

function varianteEtiquetaEstado(codigoEstado: string) {
  if (codigoEstado === "activo") {
    return "primaria";
  }

  if (codigoEstado === "inactivo") {
    return "suave";
  }

  if (codigoEstado === "eliminado") {
    return "critica";
  }

  return "oscura";
}

function contarProductosPorEstado(
  productos: readonly ProductoAdmin[],
  estado: string,
) {
  return productos.filter((producto) => producto.estado === estado).length;
}

function obtenerTiposProducto(productos: readonly ProductoAdmin[]) {
  return Array.from(
    new Set(
      productos
        .map((producto) => producto.tipoProducto.trim())
        .filter(Boolean)
        .sort((tipoA, tipoB) => tipoA.localeCompare(tipoB, "es-CL")),
    ),
  );
}

export function PaginaAdminProductos({
  productosIniciales,
  opcionesIniciales,
}: PropiedadesPaginaAdminProductos) {
  const [productos, setProductos] = useState(productosIniciales);
  const [opciones, setOpciones] = useState(opcionesIniciales);
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [errorVista, setErrorVista] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoEditando, setProductoEditando] = useState<ProductoAdmin | null>(null);
  const [formulario, setFormulario] = useState<DatosFormularioProductoAdmin>(() =>
    crearBorradorProducto(opcionesIniciales),
  );
  const [errorFormulario, setErrorFormulario] = useState<string | null>(null);
  const [guardandoFormulario, setGuardandoFormulario] = useState(false);
  const [productoProcesandoId, setProductoProcesandoId] = useState<string | null>(null);
  const [esRecargaPendiente, startTransition] = useTransition();
  const busquedaDiferida = useDeferredValue(busqueda);

  const tiposProducto = obtenerTiposProducto(productos);
  const productosFiltrados = productos.filter((producto) => {
    const termino = busquedaDiferida.trim().toLowerCase();
    const coincideBusqueda =
      !termino ||
      [
        producto.nombre,
        producto.nombreCompleto ?? "",
        producto.slug,
        producto.skuBase,
        producto.categoria,
        producto.marca ?? "",
        producto.tipoProducto,
      ].some((valor) => valor.toLowerCase().includes(termino));

    if (!coincideBusqueda) {
      return false;
    }

    if (filtroCategoria && producto.categoriaId !== filtroCategoria) {
      return false;
    }

    if (filtroEstado && producto.estado !== filtroEstado) {
      return false;
    }

    if (filtroTipo && producto.tipoProducto !== filtroTipo) {
      return false;
    }

    return true;
  });

  async function recargarVista() {
    const respuesta = await fetch("/api/admin/productos", {
      method: "GET",
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    const cuerpo = (await respuesta.json()) as RespuestaApiAdminProductos;

    if (!respuesta.ok || !cuerpo.ok || !cuerpo.productos || !cuerpo.opciones) {
      throw new Error(
        cuerpo.mensaje ?? "No pudimos refrescar el catalogo administrativo.",
      );
    }

    startTransition(() => {
      setProductos(cuerpo.productos ?? []);
      setOpciones(cuerpo.opciones ?? opcionesIniciales);
    });
  }

  function abrirModalCreacion() {
    setProductoEditando(null);
    setFormulario(crearBorradorProducto(opciones));
    setErrorFormulario(null);
    setMensajeExito(null);
    setModalAbierto(true);
  }

  function abrirModalEdicion(producto: ProductoAdmin) {
    setProductoEditando(producto);
    setFormulario(crearFormularioDesdeProducto(producto));
    setErrorFormulario(null);
    setMensajeExito(null);
    setModalAbierto(true);
  }

  function cerrarModal() {
    if (guardandoFormulario) {
      return;
    }

    setModalAbierto(false);
    setErrorFormulario(null);
  }

  function cambiarCampoFormulario<Campo extends keyof DatosFormularioProductoAdmin>(
    campo: Campo,
    valor: DatosFormularioProductoAdmin[Campo],
  ) {
    setFormulario((actual) => ({
      ...actual,
      [campo]: valor,
    }));
  }

  async function enviarFormulario(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setGuardandoFormulario(true);
    setErrorFormulario(null);
    setErrorVista(null);

    try {
      const url = productoEditando
        ? `/api/admin/productos/${productoEditando.id}`
        : "/api/admin/productos";
      const metodo = productoEditando ? "PATCH" : "POST";
      const respuesta = await fetch(url, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formulario),
      });

      const cuerpo = (await respuesta.json()) as RespuestaApiAdminProductos;

      if (!respuesta.ok || !cuerpo.ok) {
        throw new Error(cuerpo.mensaje ?? "No pudimos guardar el producto.");
      }

      await recargarVista();
      setModalAbierto(false);
      setMensajeExito(
        productoEditando
          ? "Producto actualizado correctamente."
          : "Producto creado correctamente.",
      );
    } catch (error) {
      setErrorFormulario(
        error instanceof Error
          ? error.message
          : "No pudimos guardar los cambios del producto.",
      );
    } finally {
      setGuardandoFormulario(false);
    }
  }

  async function ejecutarAccionRapida(
    producto: ProductoAdmin,
    payload: Record<string, unknown>,
    mensaje: string,
  ) {
    setProductoProcesandoId(producto.id);
    setErrorVista(null);
    setMensajeExito(null);

    try {
      const respuesta = await fetch(`/api/admin/productos/${producto.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const cuerpo = (await respuesta.json()) as RespuestaApiAdminProductos;

      if (!respuesta.ok || !cuerpo.ok) {
        throw new Error(cuerpo.mensaje ?? "No pudimos aplicar la accion al producto.");
      }

      await recargarVista();
      setMensajeExito(mensaje);
    } catch (error) {
      setErrorVista(
        error instanceof Error
          ? error.message
          : "No pudimos actualizar el producto.",
      );
    } finally {
      setProductoProcesandoId(null);
    }
  }

  async function activarODesactivarProducto(producto: ProductoAdmin) {
    const codigoEstadoDestino = producto.estado === "activo" ? "inactivo" : "activo";

    await ejecutarAccionRapida(
      producto,
      {
        accion: "actualizar-estado",
        estadoCodigo: codigoEstadoDestino,
      },
      `Producto ${producto.nombre} actualizado a estado ${codigoEstadoDestino}.`,
    );

    if (productoEditando?.id === producto.id) {
      setFormulario((actual) => ({
        ...actual,
        estadoId:
          opciones.estados.find((estado) => estado.codigo === codigoEstadoDestino)?.id ??
          actual.estadoId,
      }));
    }
  }

  async function eliminarProducto(producto: ProductoAdmin) {
    const confirmar = window.confirm(
      `Vas a ocultar logicamente ${producto.nombre} del catalogo activo. Deseas continuar?`,
    );

    if (!confirmar) {
      return;
    }

    await ejecutarAccionRapida(
      producto,
      {
        accion: "eliminacion-logica",
      },
      `Producto ${producto.nombre} marcado con eliminacion logica.`,
    );
  }

  return (
    <section className="space-y-6">
      <Tarjeta
        variante="elevada"
        etiqueta={<Etiqueta variante="primaria">Modulo 20</Etiqueta>}
        titulo="Administracion de productos"
        descripcion="Gestiona el catalogo real de Rekun LAB desde el panel admin, sin tocar codigo y manteniendo la estructura preparada para crecer."
        acciones={
          <Boton onClick={abrirModalCreacion} disabled={!opciones.categorias.length}>
            Crear producto
          </Boton>
        }
      >
        <div className="grid gap-3 md:grid-cols-4">
          <div className="rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/84 px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Total
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{productos.length}</p>
          </div>
          <div className="rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/84 px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Activos
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">
              {contarProductosPorEstado(productos, "activo")}
            </p>
          </div>
          <div className="rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/84 px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Inactivos
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">
              {contarProductosPorEstado(productos, "inactivo")}
            </p>
          </div>
          <div className="rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/84 px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Ocultos
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">
              {contarProductosPorEstado(productos, "eliminado")}
            </p>
          </div>
        </div>
      </Tarjeta>

      {errorVista ? (
        <MensajeError
          titulo="No pudimos completar la operacion"
          mensaje={errorVista}
        />
      ) : null}

      {mensajeExito ? (
        <div className="rounded-[var(--radio-md)] border border-[rgba(14,124,103,0.18)] bg-[rgba(243,251,248,0.96)] px-4 py-4 text-sm leading-7 text-[color:var(--color-primario-800)]">
          {mensajeExito}
        </div>
      ) : null}

      <Tarjeta
        etiqueta={<Etiqueta variante="suave">Listado</Etiqueta>}
        titulo="Catalogo administrable"
        descripcion="Busca por nombre, slug o SKU y filtra por categoria, estado o tipo para operar el catalogo con rapidez."
      >
        <div className="grid gap-4 xl:grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr]">
          <CampoTexto
            etiqueta="Busqueda"
            placeholder="Nombre, nombre completo, slug o SKU"
            value={busqueda}
            onChange={(evento) => setBusqueda(evento.target.value)}
          />

          <Selector
            etiqueta="Categoria"
            placeholder="Todas las categorias"
            opciones={opciones.categorias.map((categoria) => ({
              valor: categoria.id,
              etiqueta: categoria.nombre,
            }))}
            value={filtroCategoria}
            onChange={(evento) => setFiltroCategoria(evento.target.value)}
          />

          <Selector
            etiqueta="Estado"
            placeholder="Todos los estados"
            opciones={opciones.estados.map((estado) => ({
              valor: estado.codigo,
              etiqueta: estado.nombre,
            }))}
            value={filtroEstado}
            onChange={(evento) => setFiltroEstado(evento.target.value)}
          />

          <Selector
            etiqueta="Tipo"
            placeholder="Todos los tipos"
            opciones={tiposProducto.map((tipoProducto) => ({
              valor: tipoProducto,
              etiqueta: tipoProducto,
            }))}
            value={filtroTipo}
            onChange={(evento) => setFiltroTipo(evento.target.value)}
          />
        </div>

        {productosFiltrados.length ? (
          <div className="space-y-3">
            {productosFiltrados.map((producto) => {
              const estaProcesando = productoProcesandoId === producto.id;
              const nombreVisible = producto.nombreCompleto ?? producto.nombre;

              return (
                <article
                  key={producto.id}
                  className={unirClases(
                    "rounded-[var(--radio-lg)] border border-[color:var(--color-borde)] bg-white/86 px-4 py-4 shadow-[var(--sombra-suave)]",
                    estaProcesando ? "opacity-70" : undefined,
                  )}
                >
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0 flex-1 space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <Etiqueta variante={varianteEtiquetaEstado(producto.estado)}>
                          {producto.estadoNombre}
                        </Etiqueta>
                        <Etiqueta variante="suave">{producto.categoria}</Etiqueta>
                        <Etiqueta variante="suave">{producto.tipoProducto}</Etiqueta>
                        {producto.marca ? (
                          <Etiqueta variante="suave">{producto.marca}</Etiqueta>
                        ) : null}
                        {producto.esDestacado ? (
                          <Etiqueta variante="premium">Destacado</Etiqueta>
                        ) : null}
                      </div>

                      <div className="space-y-1">
                        <h2 className="text-lg font-semibold text-slate-950">
                          {nombreVisible}
                        </h2>
                        <p className="text-sm leading-7 text-slate-600">
                          {producto.resumen}
                        </p>
                      </div>

                      <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-2 xl:grid-cols-4">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Slug
                          </p>
                          <p className="mt-1 break-all">{producto.slug}</p>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                            SKU
                          </p>
                          <p className="mt-1">{producto.skuBase}</p>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Precio
                          </p>
                          <p className="mt-1 font-semibold text-slate-950">
                            {formatearPrecioClp(producto.precioCLP)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Actualizado
                          </p>
                          <p className="mt-1">
                            {new Date(producto.actualizadoEnISO).toLocaleDateString("es-CL")}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 xl:max-w-[18rem] xl:justify-end">
                      <Boton
                        variante="secundario"
                        onClick={() => abrirModalEdicion(producto)}
                        disabled={estaProcesando}
                      >
                        Editar
                      </Boton>
                      <Boton
                        variante="fantasma"
                        onClick={() => activarODesactivarProducto(producto)}
                        cargando={estaProcesando}
                      >
                        {producto.estado === "activo" ? "Desactivar" : "Activar"}
                      </Boton>
                      <Boton
                        variante="fantasma"
                        onClick={() => eliminarProducto(producto)}
                        disabled={estaProcesando || producto.estado === "eliminado"}
                      >
                        Eliminacion logica
                      </Boton>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <EstadoVacio
            titulo="No hay productos para este filtro"
            descripcion="Ajusta la busqueda o los selectores para volver a ver productos del catalogo."
            accion={
              <Boton
                variante="secundario"
                onClick={() => {
                  setBusqueda("");
                  setFiltroCategoria("");
                  setFiltroEstado("");
                  setFiltroTipo("");
                }}
              >
                Limpiar filtros
              </Boton>
            }
            claseName="min-h-[18rem]"
          />
        )}
      </Tarjeta>

      <ModalBase
        abierto={modalAbierto}
        alCerrar={cerrarModal}
        titulo={productoEditando ? "Editar producto" : "Crear producto"}
        descripcion={
          productoEditando
            ? "Actualiza datos comerciales, atributos y estado del producto."
            : "Crea un nuevo producto sobre la estructura real del catalogo."
        }
        tamanio="lg"
        cerrarAlHacerClickFuera={!guardandoFormulario}
      >
        <FormularioProductoAdmin
          modo={productoEditando ? "editar" : "crear"}
          opciones={opciones}
          valores={formulario}
          error={errorFormulario}
          guardando={guardandoFormulario}
          alCancelar={cerrarModal}
          alEnviar={enviarFormulario}
          alCambiarCampo={cambiarCampoFormulario}
        />
      </ModalBase>

      {esRecargaPendiente ? (
        <p className="text-sm leading-7 text-slate-500">
          Actualizando vista administrativa del catalogo...
        </p>
      ) : null}
    </section>
  );
}
