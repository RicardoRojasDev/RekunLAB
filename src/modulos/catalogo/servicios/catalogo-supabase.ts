import "server-only";

import { crearClienteSupabaseServidorServicio } from "@/compartido/servicios/supabase/index-servidor";
import type {
  EspecificacionProductoCatalogo,
  ImagenGaleriaProductoCatalogo,
  ImagenProductoCatalogo,
  ProductoCatalogo,
} from "../tipos/producto-catalogo";
import { obtenerCatalogoRealRespaldo } from "../datos/catalogo-real-respaldo";

type RegistroBase = Record<string, unknown>;

type RelacionSimple<T> = T | readonly T[] | null;

type FilaCatalogoSupabase = Readonly<{
  id: string;
  slug: string;
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
  metadatos: Record<string, unknown> | null;
  marca: RelacionSimple<Readonly<{ nombre: string | null }>>;
  nivel: RelacionSimple<Readonly<{ nombre: string | null }>>;
  estado: RelacionSimple<Readonly<{ codigo: string | null }>>;
  categorias:
    | readonly Readonly<{
        es_principal: boolean | null;
        orden_visual: number | null;
        categoria: Readonly<{
          slug: string | null;
          nombre: string | null;
        }> | null;
      }>[]
    | null;
  imagenes:
    | readonly Readonly<{
        url: string | null;
        alt: string | null;
        etiqueta: string | null;
        orden_visual: number | null;
        es_principal: boolean | null;
      }>[]
    | null;
}>;

export type OpcionesConsultaCatalogo = Readonly<{
  slug?: string;
  incluirEsperaSimulada?: boolean;
}>;

const rutaImagenFallbackCatalogo = "/imagenes/catalogo/producto-rekun-lab.svg";
let advertenciaPermisosCatalogoReportada = false;

const seleccionCatalogoSupabase = `
  id,
  slug,
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
  metadatos,
  marca:marca_producto(nombre),
  nivel:nivel_comercial_producto(nombre),
  estado:estado_entidad(codigo),
  categorias:asignacion_categoria_producto(
    es_principal,
    orden_visual,
    categoria:categoria_producto(slug, nombre)
  ),
  imagenes:imagen_producto(
    url,
    alt,
    etiqueta,
    orden_visual,
    es_principal
  )
`;

function esErrorPermisosSchemaPublic(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const registro = error as Record<string, unknown>;

  return (
    registro.code === "42501" ||
    registro.message === "permission denied for schema public"
  );
}

function obtenerCatalogoDesdeRespaldoLocal(slug?: string) {
  const catalogo = obtenerCatalogoRealRespaldo();

  if (!slug) {
    return catalogo;
  }

  return catalogo.filter((producto) => producto.slug === slug);
}

function advertirUsoRespaldoCatalogo(
  mensaje: string,
  error?: unknown,
) {
  if (advertenciaPermisosCatalogoReportada) {
    return;
  }

  advertenciaPermisosCatalogoReportada = true;

  console.warn(
    `${mensaje} Ejecuta la migracion 20260419233000_auditoria_catalogo_y_pedidos.sql en Supabase SQL Editor y luego valida con npm run supabase:diagnostico.`,
    error,
  );
}

function esRegistro(valor: unknown): valor is RegistroBase {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
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

function limpiarTextoOpcional(valor: string | null | undefined) {
  if (!valor) {
    return undefined;
  }

  const texto = valor.trim();

  if (!texto.length || texto.toLowerCase() === "n/a") {
    return undefined;
  }

  return texto;
}

function extraerRelacionSimple<T>(valor: RelacionSimple<T>) {
  if (Array.isArray(valor)) {
    return valor[0] ?? null;
  }

  return valor ?? null;
}

function construirImagenFallback(
  nombreVisible: string,
): {
  principal: ImagenProductoCatalogo;
  galeria: readonly ImagenGaleriaProductoCatalogo[];
} {
  const principal: ImagenProductoCatalogo = {
    src: rutaImagenFallbackCatalogo,
    alt: `Referencia visual de ${nombreVisible}`,
    ancho: 1200,
    alto: 1440,
  };

  return {
    principal,
    galeria: [
      {
        ...principal,
        etiqueta: "Referencia de catalogo",
        posicionObjeto: "center",
      },
    ],
  };
}

function construirImagenesCatalogo(
  fila: FilaCatalogoSupabase,
  nombreVisible: string,
) {
  const imagenesValidas = (fila.imagenes ?? [])
    .filter(
      (imagen): imagen is NonNullable<FilaCatalogoSupabase["imagenes"]>[number] =>
        Boolean(imagen?.url && imagen.alt),
    )
    .sort((imagenA, imagenB) => {
      if (Boolean(imagenA.es_principal) !== Boolean(imagenB.es_principal)) {
        return imagenA.es_principal ? -1 : 1;
      }

      return (imagenA.orden_visual ?? 0) - (imagenB.orden_visual ?? 0);
    });

  if (!imagenesValidas.length) {
    return construirImagenFallback(nombreVisible);
  }

  const galeria = imagenesValidas.map<ImagenGaleriaProductoCatalogo>((imagen) => ({
    src: imagen.url!,
    alt: imagen.alt!,
    ancho: 1200,
    alto: 1440,
      etiqueta: limpiarTextoOpcional(imagen.etiqueta) ?? "Vista del producto",
      posicionObjeto: "center",
  }));

  const imagenPrincipal = galeria[0];

  if (!imagenPrincipal) {
    return construirImagenFallback(nombreVisible);
  }

  return {
    principal: {
      src: imagenPrincipal.src,
      alt: imagenPrincipal.alt,
      ancho: imagenPrincipal.ancho,
      alto: imagenPrincipal.alto,
    },
    galeria,
  };
}

function resolverCategoriaPrincipal(fila: FilaCatalogoSupabase) {
  const categorias = (fila.categorias ?? [])
    .filter((item) => item?.categoria?.nombre)
    .sort((categoriaA, categoriaB) => {
      if (Boolean(categoriaA.es_principal) !== Boolean(categoriaB.es_principal)) {
        return categoriaA.es_principal ? -1 : 1;
      }

      return (categoriaA.orden_visual ?? 0) - (categoriaB.orden_visual ?? 0);
    });

  return categorias[0]?.categoria?.nombre ?? "Sin categoria";
}

function construirEtiquetasComerciales(
  fila: FilaCatalogoSupabase,
  compatiblePLA: boolean | undefined,
  nivel: string | undefined,
) {
  const etiquetas: string[] = [];

  if (fila.es_destacado) {
    etiquetas.push("Destacado");
  }

  if (compatiblePLA) {
    etiquetas.push("Compatible PLA");
  }

  if (nivel) {
    etiquetas.push(`Nivel ${nivel}`);
  }

  return etiquetas;
}

function agregarEspecificacion(
  especificaciones: EspecificacionProductoCatalogo[],
  etiqueta: string,
  valor: string | undefined,
) {
  if (!valor || !valor.trim().length) {
    return;
  }

  especificaciones.push({
    etiqueta,
    valor,
  });
}

function construirEspecificacionesCatalogo(
  fila: FilaCatalogoSupabase,
  categoria: string,
  nombreCompleto: string | undefined,
  marca: string | undefined,
  nivel: string | undefined,
  formato: string | undefined,
  pesoKg: number | undefined,
  acabado: string | undefined,
  efecto: string | undefined,
  compatiblePLA: boolean | undefined,
) {
  const especificaciones: EspecificacionProductoCatalogo[] = [];

  agregarEspecificacion(especificaciones, "Nombre completo", nombreCompleto);
  agregarEspecificacion(especificaciones, "Categoria", categoria);
  agregarEspecificacion(
    especificaciones,
    "Subcategoria",
    limpiarTextoOpcional(fila.subcategoria),
  );
  agregarEspecificacion(especificaciones, "Marca", marca);
  agregarEspecificacion(especificaciones, "Nivel", nivel);
  agregarEspecificacion(
    especificaciones,
    "Coleccion",
    limpiarTextoOpcional(fila.coleccion),
  );
  agregarEspecificacion(especificaciones, "Formato", formato);

  if (pesoKg && pesoKg > 0) {
    agregarEspecificacion(especificaciones, "Peso", `${pesoKg} kg`);
  }

  agregarEspecificacion(especificaciones, "Acabado", acabado);
  agregarEspecificacion(especificaciones, "Efecto", efecto);
  agregarEspecificacion(
    especificaciones,
    "Compatible con PLA",
    compatiblePLA === undefined ? undefined : compatiblePLA ? "Si" : "No",
  );

  return especificaciones;
}

function construirProductoCatalogoDesdeFila(
  fila: FilaCatalogoSupabase,
): ProductoCatalogo {
  const metadatos = esRegistro(fila.metadatos) ? fila.metadatos : null;
  const categoria = resolverCategoriaPrincipal(fila);
  const nombreCompleto = obtenerTextoMetadato(metadatos, "nombre_completo");
  const marca = limpiarTextoOpcional(
    extraerRelacionSimple(fila.marca)?.nombre ?? undefined,
  );
  const nivel = limpiarTextoOpcional(
    extraerRelacionSimple(fila.nivel)?.nombre ?? undefined,
  );
  const formato = limpiarTextoOpcional(fila.formato);
  const pesoKg = obtenerNumero(fila.peso_kg);
  const acabado = obtenerTextoMetadato(metadatos, "acabado");
  const efecto = obtenerTextoMetadato(metadatos, "efecto");
  const colorHex = obtenerTextoMetadato(metadatos, "color_hex");
  const compatiblePLA = obtenerBooleanoMetadato(metadatos, "compatible_pla");
  const nombreVisible = nombreCompleto ?? fila.nombre;
  const imagenes = construirImagenesCatalogo(fila, nombreVisible);

  return {
    id: fila.id,
    slug: fila.slug,
    nombre: fila.nombre,
    nombreCompleto,
    resumen: fila.resumen,
    categoria,
    subcategoria: limpiarTextoOpcional(fila.subcategoria),
    marca,
    tipoProducto: limpiarTextoOpcional(fila.tipo_producto) ?? "Producto",
    nivel,
    coleccion: limpiarTextoOpcional(fila.coleccion),
    formato,
    pesoKg: pesoKg && pesoKg > 0 ? pesoKg : undefined,
    acabado,
    efecto,
    colorHex,
    compatiblePLA,
    esDestacado: Boolean(fila.es_destacado),
    estado:
      limpiarTextoOpcional(
        extraerRelacionSimple(fila.estado)?.codigo ?? undefined,
      ) ?? "activo",
    precioIvaIncluido: obtenerNumero(fila.precio_base_iva_incluido) ?? 0,
    imagen: imagenes.principal,
    descripcion: fila.descripcion || fila.resumen,
    imagenesGaleria: imagenes.galeria,
    especificaciones: construirEspecificacionesCatalogo(
      fila,
      categoria,
      nombreCompleto,
      marca,
      nivel,
      formato,
      pesoKg && pesoKg > 0 ? pesoKg : undefined,
      acabado,
      efecto,
      compatiblePLA,
    ),
    configuracionVariantes: undefined,
    etiquetasComerciales: construirEtiquetasComerciales(fila, compatiblePLA, nivel),
  };
}

export async function consultarProductosCatalogoSupabase(
  opciones: OpcionesConsultaCatalogo = {},
): Promise<readonly ProductoCatalogo[]> {
  const { slug, incluirEsperaSimulada = false } = opciones;

  try {
    const cliente = crearClienteSupabaseServidorServicio();
    const { data: estadoActivo, error: errorEstado } = await cliente
      .from("estado_entidad")
      .select("id")
      .eq("entidad_objetivo", "producto")
      .eq("codigo", "activo")
      .maybeSingle();

    if (errorEstado) {
      if (esErrorPermisosSchemaPublic(errorEstado)) {
        advertirUsoRespaldoCatalogo(
          "Supabase no permite leer el catalogo real desde este entorno. Se usa respaldo local hasta corregir permisos.",
          errorEstado,
        );
        return obtenerCatalogoDesdeRespaldoLocal(slug);
      }

      console.error("No fue posible resolver el estado activo del catalogo:", errorEstado);
      return obtenerCatalogoDesdeRespaldoLocal(slug);
    }

    if (!estadoActivo?.id) {
      advertirUsoRespaldoCatalogo(
        "No existe un estado activo configurado para producto. Se usa respaldo local del catalogo.",
      );
      return obtenerCatalogoDesdeRespaldoLocal(slug);
    }

    let consulta = cliente
      .from("producto")
      .select(seleccionCatalogoSupabase)
      .eq("estado_id", estadoActivo.id)
      .order("nombre", { ascending: true });

    if (slug) {
      consulta = consulta.eq("slug", slug);
    }

    const { data, error } = await consulta;

    if (error) {
      if (esErrorPermisosSchemaPublic(error)) {
        advertirUsoRespaldoCatalogo(
          "Supabase devolvio un problema de permisos al consultar productos. Se usa respaldo local.",
          error,
        );
        return obtenerCatalogoDesdeRespaldoLocal(slug);
      }

      console.error("Error obteniendo catalogo real desde Supabase:", error);
      return obtenerCatalogoDesdeRespaldoLocal(slug);
    }

    const filas = (data ?? []) as unknown as readonly FilaCatalogoSupabase[];
    const productos = filas.map((fila) => construirProductoCatalogoDesdeFila(fila));

    if (incluirEsperaSimulada && process.env.NODE_ENV === "development") {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    return productos;
  } catch (error) {
    if (esErrorPermisosSchemaPublic(error)) {
      advertirUsoRespaldoCatalogo(
        "Supabase no permite acceder al esquema publico. Se usa respaldo local del catalogo.",
        error,
      );
      return obtenerCatalogoDesdeRespaldoLocal(slug);
    }

    console.error("Error inesperado consultando el catalogo real:", error);
    return obtenerCatalogoDesdeRespaldoLocal(slug);
  }
}
