import "server-only";

import { crearClienteSupabaseServidorServicio } from "@/compartido/servicios/supabase/index-servidor";
import type {
  DatosFormularioProductoAdmin,
  OpcionReferenciaAdminProducto,
  OpcionesAdminProductos,
  ProductoAdmin,
  VistaAdminProductos,
} from "../tipos/admin-productos";

type RegistroBase = Record<string, unknown>;
type RelacionSimple<T> = T | readonly T[] | null;

type FilaProductoAdminSupabase = Readonly<{
  id: string;
  creado_en: string;
  actualizado_en: string;
  slug: string;
  sku_base: string;
  nombre: string;
  resumen: string;
  descripcion: string;
  precio_base_iva_incluido: number | string | null;
  tipo_producto: string | null;
  coleccion: string | null;
  formato: string | null;
  peso_kg: number | string | null;
  subcategoria: string | null;
  es_destacado: boolean | null;
  vende_directo: boolean | null;
  permite_cotizacion: boolean | null;
  metadatos: Record<string, unknown> | null;
  marca: RelacionSimple<Readonly<{ id: string; codigo: string | null; nombre: string | null }>>;
  nivel: RelacionSimple<Readonly<{ id: string; codigo: string | null; nombre: string | null }>>;
  estado: RelacionSimple<Readonly<{ id: string; codigo: string | null; nombre: string | null }>>;
  categorias:
    | readonly Readonly<{
        es_principal: boolean | null;
        orden_visual: number | null;
        categoria: Readonly<{
          id: string;
          slug: string | null;
          nombre: string | null;
        }> | null;
      }>[]
    | null;
}>;

type FilaCategoriaOpcionSupabase = Readonly<{
  id: string;
  slug: string;
  nombre: string;
  estado: RelacionSimple<Readonly<{ codigo: string | null }>>;
}>;

type FilaOpcionSimpleSupabase = Readonly<{
  id: string;
  codigo: string;
  nombre: string;
  slug?: string | null;
  esta_activo?: boolean | null;
}>;

type ProductoBaseParaGuardar = Readonly<{
  id: string;
  metadatos: Record<string, unknown> | null;
  vende_directo: boolean | null;
  permite_cotizacion: boolean | null;
}>;

const seleccionProductoAdmin = `
  id,
  creado_en,
  actualizado_en,
  slug,
  sku_base,
  nombre,
  resumen,
  descripcion,
  precio_base_iva_incluido,
  tipo_producto,
  coleccion,
  formato,
  peso_kg,
  subcategoria,
  es_destacado,
  vende_directo,
  permite_cotizacion,
  metadatos,
  marca:marca_producto(id, codigo, nombre),
  nivel:nivel_comercial_producto(id, codigo, nombre),
  estado:estado_entidad(id, codigo, nombre),
  categorias:asignacion_categoria_producto(
    es_principal,
    orden_visual,
    categoria:categoria_producto(id, slug, nombre)
  )
`;

const cacheEstadoProducto = new Map<string, string>();

export class ErrorOperacionAdminProducto extends Error {
  codigo: string;
  status: number;

  constructor(codigo: string, mensaje: string, status = 500) {
    super(mensaje);
    this.name = "ErrorOperacionAdminProducto";
    this.codigo = codigo;
    this.status = status;
  }
}

function esRegistro(valor: unknown): valor is RegistroBase {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

function extraerRelacionSimple<T>(valor: RelacionSimple<T>) {
  if (Array.isArray(valor)) {
    return valor[0] ?? null;
  }

  return valor ?? null;
}

function limpiarTextoOpcional(valor: string | null | undefined) {
  if (!valor) {
    return undefined;
  }

  const texto = valor.trim();
  return texto.length ? texto : undefined;
}

function obtenerNumero(valor: number | string | null | undefined) {
  if (typeof valor === "number" && Number.isFinite(valor)) {
    return valor;
  }

  if (typeof valor === "string" && valor.trim().length) {
    const numero = Number(valor);
    return Number.isFinite(numero) ? numero : undefined;
  }

  return undefined;
}

function obtenerTextoMetadato(
  metadatos: Record<string, unknown> | null,
  clave: string,
) {
  const valor = metadatos?.[clave];
  return typeof valor === "string" && valor.trim().length ? valor.trim() : undefined;
}

function obtenerBooleanoMetadato(
  metadatos: Record<string, unknown> | null,
  clave: string,
) {
  return typeof metadatos?.[clave] === "boolean"
    ? (metadatos[clave] as boolean)
    : undefined;
}

function resolverCategoriaPrincipal(fila: FilaProductoAdminSupabase) {
  const categorias = (fila.categorias ?? [])
    .filter((item) => item?.categoria?.id)
    .sort((categoriaA, categoriaB) => {
      if (Boolean(categoriaA.es_principal) !== Boolean(categoriaB.es_principal)) {
        return categoriaA.es_principal ? -1 : 1;
      }

      return (categoriaA.orden_visual ?? 0) - (categoriaB.orden_visual ?? 0);
    });

  return categorias[0]?.categoria ?? null;
}

function mapearFilaProductoAdmin(fila: FilaProductoAdminSupabase): ProductoAdmin {
  const metadatos = esRegistro(fila.metadatos) ? fila.metadatos : null;
  const categoriaPrincipal = resolverCategoriaPrincipal(fila);
  const marca = extraerRelacionSimple(fila.marca);
  const nivel = extraerRelacionSimple(fila.nivel);
  const estado = extraerRelacionSimple(fila.estado);
  const pesoKg = obtenerNumero(fila.peso_kg);

  return {
    id: fila.id,
    creadoEnISO: fila.creado_en,
    actualizadoEnISO: fila.actualizado_en,
    skuBase: fila.sku_base,
    nombre: fila.nombre,
    nombreCompleto: obtenerTextoMetadato(metadatos, "nombre_completo"),
    slug: fila.slug,
    resumen: fila.resumen,
    descripcion: fila.descripcion,
    categoriaId: categoriaPrincipal?.id ?? null,
    categoria: limpiarTextoOpcional(categoriaPrincipal?.nombre) ?? "Sin categoria",
    subcategoria: limpiarTextoOpcional(fila.subcategoria),
    nivelId: nivel?.id,
    nivel: limpiarTextoOpcional(nivel?.nombre),
    marcaId: marca?.id,
    marca: limpiarTextoOpcional(marca?.nombre),
    tipoProducto: limpiarTextoOpcional(fila.tipo_producto) ?? "Producto",
    precioCLP: obtenerNumero(fila.precio_base_iva_incluido) ?? 0,
    formato: limpiarTextoOpcional(fila.formato),
    pesoKg: pesoKg && pesoKg > 0 ? pesoKg : undefined,
    acabado: obtenerTextoMetadato(metadatos, "acabado"),
    efecto: obtenerTextoMetadato(metadatos, "efecto"),
    colorHex: obtenerTextoMetadato(metadatos, "color_hex"),
    compatiblePLA: obtenerBooleanoMetadato(metadatos, "compatible_pla"),
    coleccion: limpiarTextoOpcional(fila.coleccion),
    esDestacado: Boolean(fila.es_destacado),
    estadoId: estado?.id ?? "",
    estado: limpiarTextoOpcional(estado?.codigo) ?? "desconocido",
    estadoNombre: limpiarTextoOpcional(estado?.nombre) ?? "Sin estado",
  };
}

function mapearOpcionSimple(
  fila: FilaOpcionSimpleSupabase,
): OpcionReferenciaAdminProducto {
  return {
    id: fila.id,
    codigo: fila.codigo,
    nombre: fila.nombre,
    slug: limpiarTextoOpcional(fila.slug),
  };
}

function normalizarMetadatosProducto(
  metadatos: Record<string, unknown>,
) {
  return Object.entries(metadatos).reduce<Record<string, unknown>>((acumulado, [clave, valor]) => {
    if (valor === null || valor === undefined) {
      return acumulado;
    }

    if (typeof valor === "string" && !valor.trim().length) {
      return acumulado;
    }

    acumulado[clave] = valor;
    return acumulado;
  }, {});
}

function construirMetadatosProducto(
  datos: DatosFormularioProductoAdmin,
  metadatosBase: Record<string, unknown> | null,
) {
  return normalizarMetadatosProducto({
    ...(esRegistro(metadatosBase) ? metadatosBase : {}),
    nombre_completo: datos.nombreCompleto ?? null,
    acabado: datos.acabado ?? null,
    efecto: datos.efecto ?? null,
    color_hex: datos.colorHex ?? null,
    compatible_pla: datos.compatiblePLA ?? false,
  });
}

function describirErrorPersistenciaProducto(mensaje: string) {
  if (mensaje.includes("producto_slug_unico")) {
    return new ErrorOperacionAdminProducto(
      "SLUG_DUPLICADO",
      "Ya existe un producto con ese slug. Usa un identificador distinto.",
      409,
    );
  }

  if (mensaje.includes("producto_sku_base_unico")) {
    return new ErrorOperacionAdminProducto(
      "SKU_DUPLICADO",
      "Ya existe un producto con ese SKU base. Revisa el identificador comercial.",
      409,
    );
  }

  return new ErrorOperacionAdminProducto(
    "ERROR_PERSISTENCIA_PRODUCTO",
    mensaje,
    500,
  );
}

async function obtenerProductoBaseParaGuardar(productoId: string) {
  const cliente = crearClienteSupabaseServidorServicio();
  const { data, error } = await cliente
    .from("producto")
    .select("id, metadatos, vende_directo, permite_cotizacion")
    .eq("id", productoId)
    .maybeSingle();

  if (error) {
    throw new ErrorOperacionAdminProducto(
      "ERROR_BUSCAR_PRODUCTO",
      `No pudimos leer el producto antes de guardarlo: ${error.message}`,
    );
  }

  return (data ?? null) as ProductoBaseParaGuardar | null;
}

async function obtenerProductoAdminPorId(productoId: string) {
  const cliente = crearClienteSupabaseServidorServicio();
  const { data, error } = await cliente
    .from("producto")
    .select(seleccionProductoAdmin)
    .eq("id", productoId)
    .maybeSingle();

  if (error) {
    throw new ErrorOperacionAdminProducto(
      "ERROR_OBTENER_PRODUCTO_ADMIN",
      `No pudimos cargar el producto desde Supabase: ${error.message}`,
    );
  }

  if (!data) {
    return null;
  }

  return mapearFilaProductoAdmin(data as unknown as FilaProductoAdminSupabase);
}

async function guardarCategoriaPrincipalProducto(productoId: string, categoriaId: string) {
  const cliente = crearClienteSupabaseServidorServicio();

  const { error: errorDesmarcar } = await cliente
    .from("asignacion_categoria_producto")
    .update({ es_principal: false })
    .eq("producto_id", productoId);

  if (errorDesmarcar) {
    throw new ErrorOperacionAdminProducto(
      "ERROR_CATEGORIA_PRODUCTO",
      `No pudimos preparar la categoria principal del producto: ${errorDesmarcar.message}`,
    );
  }

  const { error: errorAsignar } = await cliente
    .from("asignacion_categoria_producto")
    .upsert(
      {
        producto_id: productoId,
        categoria_id: categoriaId,
        es_principal: true,
        orden_visual: 0,
      },
      { onConflict: "producto_id,categoria_id" },
    );

  if (errorAsignar) {
    throw new ErrorOperacionAdminProducto(
      "ERROR_CATEGORIA_PRODUCTO",
      `No pudimos guardar la categoria principal del producto: ${errorAsignar.message}`,
    );
  }
}

async function resolverEstadoProductoIdPorCodigo(codigo: string) {
  const existente = cacheEstadoProducto.get(codigo);

  if (existente) {
    return existente;
  }

  const cliente = crearClienteSupabaseServidorServicio();
  const { data, error } = await cliente
    .from("estado_entidad")
    .select("id")
    .eq("entidad_objetivo", "producto")
    .eq("codigo", codigo)
    .maybeSingle();

  if (error) {
    throw new ErrorOperacionAdminProducto(
      "ERROR_ESTADO_PRODUCTO",
      `No pudimos resolver el estado ${codigo}: ${error.message}`,
    );
  }

  if (!data?.id) {
    throw new ErrorOperacionAdminProducto(
      "ESTADO_PRODUCTO_INEXISTENTE",
      `No existe un estado de producto con codigo ${codigo}.`,
      422,
    );
  }

  cacheEstadoProducto.set(codigo, data.id);
  return data.id;
}

function construirPayloadProducto(
  datos: DatosFormularioProductoAdmin,
  productoBase?: ProductoBaseParaGuardar | null,
) {
  return {
    slug: datos.slug,
    sku_base: datos.skuBase,
    nombre: datos.nombre,
    resumen: datos.resumen,
    descripcion: datos.descripcion,
    precio_base_iva_incluido: datos.precioCLP,
    marca_id: datos.marcaId ?? null,
    nivel_comercial_id: datos.nivelId ?? null,
    estado_id: datos.estadoId,
    tipo_producto: datos.tipoProducto,
    es_destacado: datos.esDestacado,
    coleccion: datos.coleccion ?? null,
    formato: datos.formato ?? null,
    peso_kg: datos.pesoKg ?? null,
    subcategoria: datos.subcategoria ?? null,
    vende_directo: productoBase?.vende_directo ?? true,
    permite_cotizacion: productoBase?.permite_cotizacion ?? false,
    metadatos: construirMetadatosProducto(datos, productoBase?.metadatos ?? null),
  };
}

export async function listarProductosAdmin(): Promise<readonly ProductoAdmin[]> {
  const cliente = crearClienteSupabaseServidorServicio();
  const { data, error } = await cliente
    .from("producto")
    .select(seleccionProductoAdmin)
    .order("actualizado_en", { ascending: false });

  if (error) {
    throw new ErrorOperacionAdminProducto(
      "ERROR_LISTAR_PRODUCTOS",
      `No pudimos obtener el listado de productos: ${error.message}`,
    );
  }

  return ((data ?? []) as unknown as readonly FilaProductoAdminSupabase[]).map((fila) =>
    mapearFilaProductoAdmin(fila),
  );
}

export async function listarOpcionesAdminProductos(): Promise<OpcionesAdminProductos> {
  const cliente = crearClienteSupabaseServidorServicio();

  const [
    respuestaCategorias,
    respuestaMarcas,
    respuestaNiveles,
    respuestaEstados,
  ] = await Promise.all([
    cliente
      .from("categoria_producto")
      .select("id, slug, nombre, estado:estado_entidad(codigo)")
      .order("nombre", { ascending: true }),
    cliente
      .from("marca_producto")
      .select("id, codigo, nombre, slug, esta_activo")
      .eq("esta_activo", true)
      .order("nombre", { ascending: true }),
    cliente
      .from("nivel_comercial_producto")
      .select("id, codigo, nombre, esta_activo")
      .eq("esta_activo", true)
      .order("orden_visual", { ascending: true })
      .order("nombre", { ascending: true }),
    cliente
      .from("estado_entidad")
      .select("id, codigo, nombre, orden_visual, esta_activo")
      .eq("entidad_objetivo", "producto")
      .eq("esta_activo", true)
      .order("orden_visual", { ascending: true })
      .order("nombre", { ascending: true }),
  ]);

  if (respuestaCategorias.error) {
    throw new ErrorOperacionAdminProducto(
      "ERROR_OPCIONES_CATEGORIAS",
      `No pudimos obtener las categorias del formulario: ${respuestaCategorias.error.message}`,
    );
  }

  if (respuestaMarcas.error) {
    throw new ErrorOperacionAdminProducto(
      "ERROR_OPCIONES_MARCAS",
      `No pudimos obtener las marcas del formulario: ${respuestaMarcas.error.message}`,
    );
  }

  if (respuestaNiveles.error) {
    throw new ErrorOperacionAdminProducto(
      "ERROR_OPCIONES_NIVELES",
      `No pudimos obtener los niveles comerciales del formulario: ${respuestaNiveles.error.message}`,
    );
  }

  if (respuestaEstados.error) {
    throw new ErrorOperacionAdminProducto(
      "ERROR_OPCIONES_ESTADOS",
      `No pudimos obtener los estados del formulario: ${respuestaEstados.error.message}`,
    );
  }

  const categorias = ((respuestaCategorias.data ?? []) as unknown as readonly FilaCategoriaOpcionSupabase[])
    .filter(
      (fila) => limpiarTextoOpcional(extraerRelacionSimple(fila.estado)?.codigo) === "activo",
    )
    .map<OpcionReferenciaAdminProducto>((fila) => ({
      id: fila.id,
      codigo: fila.slug,
      nombre: fila.nombre,
      slug: fila.slug,
    }));

  return {
    categorias,
    marcas: ((respuestaMarcas.data ?? []) as unknown as readonly FilaOpcionSimpleSupabase[]).map(
      (fila) => mapearOpcionSimple(fila),
    ),
    niveles: ((respuestaNiveles.data ?? []) as unknown as readonly FilaOpcionSimpleSupabase[]).map(
      (fila) => mapearOpcionSimple(fila),
    ),
    estados: ((respuestaEstados.data ?? []) as unknown as readonly FilaOpcionSimpleSupabase[]).map(
      (fila) => mapearOpcionSimple(fila),
    ),
  };
}

export async function obtenerVistaAdminProductos(): Promise<VistaAdminProductos> {
  const [productos, opciones] = await Promise.all([
    listarProductosAdmin(),
    listarOpcionesAdminProductos(),
  ]);

  return {
    productos,
    opciones,
  };
}

export async function crearProductoAdmin(datos: DatosFormularioProductoAdmin) {
  const cliente = crearClienteSupabaseServidorServicio();
  const { data, error } = await cliente
    .from("producto")
    .insert(construirPayloadProducto(datos))
    .select("id")
    .single();

  if (error) {
    throw describirErrorPersistenciaProducto(
      `No pudimos crear el producto: ${error.message}`,
    );
  }

  const productoId = (data as { id: string }).id;
  await guardarCategoriaPrincipalProducto(productoId, datos.categoriaId);

  const producto = await obtenerProductoAdminPorId(productoId);

  if (!producto) {
    throw new ErrorOperacionAdminProducto(
      "ERROR_PRODUCTO_CREADO_SIN_LECTURA",
      "El producto se creo, pero no pudimos recargarlo para el panel admin.",
    );
  }

  return producto;
}

export async function actualizarProductoAdmin(
  productoId: string,
  datos: DatosFormularioProductoAdmin,
) {
  const productoBase = await obtenerProductoBaseParaGuardar(productoId);

  if (!productoBase) {
    throw new ErrorOperacionAdminProducto(
      "PRODUCTO_NO_ENCONTRADO",
      "No encontramos el producto que intentas editar.",
      404,
    );
  }

  const cliente = crearClienteSupabaseServidorServicio();
  const { error } = await cliente
    .from("producto")
    .update(construirPayloadProducto(datos, productoBase))
    .eq("id", productoId);

  if (error) {
    throw describirErrorPersistenciaProducto(
      `No pudimos actualizar el producto: ${error.message}`,
    );
  }

  await guardarCategoriaPrincipalProducto(productoId, datos.categoriaId);

  const producto = await obtenerProductoAdminPorId(productoId);

  if (!producto) {
    throw new ErrorOperacionAdminProducto(
      "ERROR_RECARGAR_PRODUCTO",
      "Guardamos el producto, pero no pudimos recargarlo para el panel.",
    );
  }

  return producto;
}

export async function cambiarEstadoProductoAdmin(
  productoId: string,
  codigoEstado: string,
) {
  const estadoId = await resolverEstadoProductoIdPorCodigo(codigoEstado);
  const cliente = crearClienteSupabaseServidorServicio();
  const { error } = await cliente
    .from("producto")
    .update({ estado_id: estadoId })
    .eq("id", productoId);

  if (error) {
    throw new ErrorOperacionAdminProducto(
      "ERROR_CAMBIAR_ESTADO_PRODUCTO",
      `No pudimos actualizar el estado del producto: ${error.message}`,
    );
  }

  const producto = await obtenerProductoAdminPorId(productoId);

  if (!producto) {
    throw new ErrorOperacionAdminProducto(
      "ERROR_RECARGAR_PRODUCTO",
      "El estado cambio, pero no pudimos recargar el producto actualizado.",
    );
  }

  return producto;
}

export async function eliminarLogicoProductoAdmin(productoId: string) {
  return cambiarEstadoProductoAdmin(productoId, "eliminado");
}
