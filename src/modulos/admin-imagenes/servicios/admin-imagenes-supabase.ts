import "server-only";

import { randomUUID } from "node:crypto";
import { listarProductosAdmin, type ProductoAdmin } from "@/modulos/admin-productos";
import { crearClienteSupabaseServidorServicio } from "@/compartido/servicios/supabase/index-servidor";
import type {
  ImagenProductoAdmin,
  VistaAdminImagenes,
} from "../tipos/admin-imagenes";

type FilaImagenProductoSupabase = Readonly<{
  id: string;
  producto_id: string;
  url: string;
  alt: string;
  etiqueta: string | null;
  orden_visual: number;
  es_principal: boolean;
  creado_en: string;
  metadatos: Record<string, unknown> | null;
}>;

type DatosSubidaImagenProductoAdmin = Readonly<{
  productoId: string;
  archivo: File;
  alt: string;
  etiqueta?: string | null;
  marcarComoPrincipal?: boolean;
}>;

const bucketImagenesProductos = "catalogo-productos";
const tiposPermitidosImagen = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);
const tamanoMaximoImagenBytes = 5 * 1024 * 1024;

export class ErrorOperacionAdminImagen extends Error {
  codigo: string;
  status: number;

  constructor(codigo: string, mensaje: string, status = 500) {
    super(mensaje);
    this.name = "ErrorOperacionAdminImagen";
    this.codigo = codigo;
    this.status = status;
  }
}

function limpiarTextoOpcional(valor: string | null | undefined) {
  if (!valor) {
    return null;
  }

  const texto = valor.trim();
  return texto.length ? texto : null;
}

function esRegistro(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

function obtenerTextoMetadato(
  metadatos: Record<string, unknown> | null,
  clave: string,
) {
  const valor = metadatos?.[clave];
  return typeof valor === "string" && valor.trim().length ? valor.trim() : null;
}

function obtenerNumeroMetadato(
  metadatos: Record<string, unknown> | null,
  clave: string,
) {
  const valor = metadatos?.[clave];

  if (typeof valor === "number" && Number.isFinite(valor)) {
    return valor;
  }

  if (typeof valor === "string" && valor.trim().length) {
    const numero = Number(valor);
    return Number.isFinite(numero) ? numero : null;
  }

  return null;
}

function slugificarSegmento(valor: string) {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function resolverExtensionArchivo(archivo: File) {
  const nombre = archivo.name.trim();
  const extensionNombre = nombre.includes(".")
    ? nombre.split(".").pop()?.toLowerCase() ?? null
    : null;

  if (extensionNombre && /^[a-z0-9]+$/.test(extensionNombre)) {
    return extensionNombre;
  }

  if (archivo.type === "image/jpeg") {
    return "jpg";
  }

  if (archivo.type === "image/png") {
    return "png";
  }

  if (archivo.type === "image/webp") {
    return "webp";
  }

  if (archivo.type === "image/avif") {
    return "avif";
  }

  return "bin";
}

function construirRutaStorageImagenProducto(
  producto: Pick<ProductoAdmin, "id" | "slug">,
  archivo: File,
) {
  const fecha = new Date();
  const anio = String(fecha.getFullYear());
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const marcaTiempo = `${fecha.getTime()}-${randomUUID().slice(0, 8)}`;
  const extension = resolverExtensionArchivo(archivo);
  const slugProducto = slugificarSegmento(producto.slug || producto.id);

  return `productos/${producto.id}/${anio}/${mes}/${slugProducto}-${marcaTiempo}.${extension}`;
}

function mapearImagenProductoAdmin(
  fila: FilaImagenProductoSupabase,
): ImagenProductoAdmin {
  const metadatos = esRegistro(fila.metadatos) ? fila.metadatos : null;

  return {
    id: fila.id,
    productoId: fila.producto_id,
    url: fila.url,
    alt: fila.alt,
    etiqueta: limpiarTextoOpcional(fila.etiqueta),
    ordenVisual: fila.orden_visual,
    esPrincipal: fila.es_principal,
    creadoEnISO: fila.creado_en,
    rutaStorage: obtenerTextoMetadato(metadatos, "ruta_storage"),
    bucketStorage: obtenerTextoMetadato(metadatos, "bucket_storage"),
    nombreArchivoOriginal: obtenerTextoMetadato(metadatos, "nombre_archivo_original"),
    tamanoBytes: obtenerNumeroMetadato(metadatos, "tamano_bytes"),
    mimeType: obtenerTextoMetadato(metadatos, "mime_type"),
  };
}

async function obtenerProductoAdminBasico(productoId: string) {
  const productos = await listarProductosAdmin();
  return productos.find((producto) => producto.id === productoId) ?? null;
}

async function listarImagenesProducto(productoId: string) {
  const cliente = crearClienteSupabaseServidorServicio();
  const { data, error } = await cliente
    .from("imagen_producto")
    .select("id, producto_id, url, alt, etiqueta, orden_visual, es_principal, creado_en, metadatos")
    .eq("producto_id", productoId)
    .order("es_principal", { ascending: false })
    .order("orden_visual", { ascending: true })
    .order("creado_en", { ascending: true });

  if (error) {
    throw new ErrorOperacionAdminImagen(
      "ERROR_LISTAR_IMAGENES_PRODUCTO",
      `No pudimos obtener las imagenes del producto: ${error.message}`,
    );
  }

  return ((data ?? []) as unknown as readonly FilaImagenProductoSupabase[]).map((fila) =>
    mapearImagenProductoAdmin(fila),
  );
}

async function obtenerImagenProductoPorId(imagenId: string) {
  const cliente = crearClienteSupabaseServidorServicio();
  const { data, error } = await cliente
    .from("imagen_producto")
    .select("id, producto_id, url, alt, etiqueta, orden_visual, es_principal, creado_en, metadatos")
    .eq("id", imagenId)
    .maybeSingle();

  if (error) {
    throw new ErrorOperacionAdminImagen(
      "ERROR_OBTENER_IMAGEN_PRODUCTO",
      `No pudimos cargar la imagen solicitada: ${error.message}`,
    );
  }

  if (!data) {
    return null;
  }

  return mapearImagenProductoAdmin(data as unknown as FilaImagenProductoSupabase);
}

async function desmarcarImagenPrincipalProducto(productoId: string) {
  const cliente = crearClienteSupabaseServidorServicio();
  const { error } = await cliente
    .from("imagen_producto")
    .update({ es_principal: false })
    .eq("producto_id", productoId)
    .is("variante_id", null);

  if (error) {
    throw new ErrorOperacionAdminImagen(
      "ERROR_REORDENAR_IMAGEN_PRINCIPAL",
      `No pudimos actualizar la imagen principal del producto: ${error.message}`,
    );
  }
}

async function promoverPrimeraImagenDisponible(productoId: string) {
  const imagenes = await listarImagenesProducto(productoId);
  const primera = imagenes[0];

  if (!primera || primera.esPrincipal) {
    return;
  }

  await desmarcarImagenPrincipalProducto(productoId);
  const cliente = crearClienteSupabaseServidorServicio();
  const { error } = await cliente
    .from("imagen_producto")
    .update({ es_principal: true })
    .eq("id", primera.id);

  if (error) {
    throw new ErrorOperacionAdminImagen(
      "ERROR_REASIGNAR_PRINCIPAL",
      `No pudimos reasignar una imagen principal al producto: ${error.message}`,
    );
  }
}

function validarArchivoImagen(archivo: File) {
  if (!tiposPermitidosImagen.has(archivo.type)) {
    throw new ErrorOperacionAdminImagen(
      "ARCHIVO_NO_PERMITIDO",
      "Solo se permiten imagenes JPG, PNG, WEBP o AVIF.",
      422,
    );
  }

  if (archivo.size < 1) {
    throw new ErrorOperacionAdminImagen(
      "ARCHIVO_VACIO",
      "El archivo seleccionado esta vacio.",
      422,
    );
  }

  if (archivo.size > tamanoMaximoImagenBytes) {
    throw new ErrorOperacionAdminImagen(
      "ARCHIVO_MUY_GRANDE",
      "La imagen supera el maximo permitido de 5 MB.",
      422,
    );
  }
}

export async function obtenerVistaAdminImagenes(
  productoId?: string | null,
): Promise<VistaAdminImagenes> {
  const productos = await listarProductosAdmin();
  const productoSeleccionado =
    (productoId
      ? productos.find((producto) => producto.id === productoId) ?? null
      : productos[0] ?? null) ?? null;

  const imagenes = productoSeleccionado
    ? await listarImagenesProducto(productoSeleccionado.id)
    : [];

  return {
    productos,
    productoSeleccionado,
    imagenes,
  };
}

export async function subirImagenProductoAdmin({
  productoId,
  archivo,
  alt,
  etiqueta,
  marcarComoPrincipal = false,
}: DatosSubidaImagenProductoAdmin) {
  const altNormalizado = limpiarTextoOpcional(alt);

  if (!altNormalizado) {
    throw new ErrorOperacionAdminImagen(
      "ALT_REQUERIDO",
      "Debes indicar un texto alternativo para la imagen.",
      422,
    );
  }

  validarArchivoImagen(archivo);

  const producto = await obtenerProductoAdminBasico(productoId);

  if (!producto) {
    throw new ErrorOperacionAdminImagen(
      "PRODUCTO_NO_ENCONTRADO",
      "No encontramos el producto al que intentas asociar la imagen.",
      404,
    );
  }

  const imagenesExistentes = await listarImagenesProducto(productoId);
  const esPrincipal = marcarComoPrincipal || imagenesExistentes.length === 0;

  if (esPrincipal) {
    await desmarcarImagenPrincipalProducto(productoId);
  }

  const cliente = crearClienteSupabaseServidorServicio();
  const rutaStorage = construirRutaStorageImagenProducto(producto, archivo);
  const contenido = Buffer.from(await archivo.arrayBuffer());
  const { error: errorStorage } = await cliente.storage
    .from(bucketImagenesProductos)
    .upload(rutaStorage, contenido, {
      contentType: archivo.type,
      upsert: false,
    });

  if (errorStorage) {
    throw new ErrorOperacionAdminImagen(
      "ERROR_SUBIR_STORAGE",
      `No pudimos subir la imagen a Supabase Storage: ${errorStorage.message}`,
    );
  }

  const {
    data: { publicUrl },
  } = cliente.storage.from(bucketImagenesProductos).getPublicUrl(rutaStorage);

  const siguienteOrdenVisual =
    imagenesExistentes.length > 0
      ? Math.max(...imagenesExistentes.map((imagen) => imagen.ordenVisual)) + 1
      : 0;

  const { data, error } = await cliente
    .from("imagen_producto")
    .insert({
      producto_id: productoId,
      url: publicUrl,
      alt: altNormalizado,
      etiqueta: limpiarTextoOpcional(etiqueta),
      orden_visual: siguienteOrdenVisual,
      es_principal: esPrincipal,
      metadatos: {
        bucket_storage: bucketImagenesProductos,
        ruta_storage: rutaStorage,
        nombre_archivo_original: archivo.name,
        tamano_bytes: archivo.size,
        mime_type: archivo.type,
      },
    })
    .select("id, producto_id, url, alt, etiqueta, orden_visual, es_principal, creado_en, metadatos")
    .single();

  if (error) {
    await cliente.storage.from(bucketImagenesProductos).remove([rutaStorage]);

    throw new ErrorOperacionAdminImagen(
      "ERROR_GUARDAR_IMAGEN_PRODUCTO",
      `No pudimos asociar la imagen al producto: ${error.message}`,
    );
  }

  return mapearImagenProductoAdmin(data as unknown as FilaImagenProductoSupabase);
}

export async function marcarImagenProductoComoPrincipalAdmin(imagenId: string) {
  const imagen = await obtenerImagenProductoPorId(imagenId);

  if (!imagen) {
    throw new ErrorOperacionAdminImagen(
      "IMAGEN_NO_ENCONTRADA",
      "No encontramos la imagen que intentas marcar como principal.",
      404,
    );
  }

  await desmarcarImagenPrincipalProducto(imagen.productoId);

  const cliente = crearClienteSupabaseServidorServicio();
  const { error } = await cliente
    .from("imagen_producto")
    .update({ es_principal: true })
    .eq("id", imagenId);

  if (error) {
    throw new ErrorOperacionAdminImagen(
      "ERROR_MARCAR_IMAGEN_PRINCIPAL",
      `No pudimos actualizar la imagen principal: ${error.message}`,
    );
  }

  const actualizada = await obtenerImagenProductoPorId(imagenId);

  if (!actualizada) {
    throw new ErrorOperacionAdminImagen(
      "IMAGEN_NO_DISPONIBLE",
      "La imagen se actualizo, pero no pudimos recargarla.",
    );
  }

  return actualizada;
}

export async function eliminarImagenProductoAdmin(imagenId: string) {
  const imagen = await obtenerImagenProductoPorId(imagenId);

  if (!imagen) {
    throw new ErrorOperacionAdminImagen(
      "IMAGEN_NO_ENCONTRADA",
      "No encontramos la imagen que intentas eliminar.",
      404,
    );
  }

  const cliente = crearClienteSupabaseServidorServicio();

  if (imagen.rutaStorage) {
    const { error: errorStorage } = await cliente.storage
      .from(imagen.bucketStorage ?? bucketImagenesProductos)
      .remove([imagen.rutaStorage]);

    if (errorStorage) {
      throw new ErrorOperacionAdminImagen(
        "ERROR_ELIMINAR_STORAGE",
        `No pudimos eliminar el archivo desde Storage: ${errorStorage.message}`,
      );
    }
  }

  const { error } = await cliente
    .from("imagen_producto")
    .delete()
    .eq("id", imagenId);

  if (error) {
    throw new ErrorOperacionAdminImagen(
      "ERROR_ELIMINAR_IMAGEN_PRODUCTO",
      `No pudimos eliminar la asociacion de imagen: ${error.message}`,
    );
  }

  if (imagen.esPrincipal) {
    await promoverPrimeraImagenDisponible(imagen.productoId);
  }

  return imagen;
}
