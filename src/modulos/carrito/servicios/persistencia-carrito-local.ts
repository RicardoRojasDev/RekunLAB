import type {
  ImagenItemCarrito,
  ItemCarrito,
  SeleccionVarianteItemCarrito,
  VarianteItemCarrito,
} from "../tipos/carrito";

const CLAVE_STORAGE_CARRITO = "rekun-lab.carrito.v1";

type CarritoPersistido = Readonly<{
  version: 1;
  items: readonly ItemCarrito[];
}>;

function esRegistro(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null;
}

function obtenerTexto(valor: unknown) {
  return typeof valor === "string" ? valor : null;
}

function obtenerNumeroPositivo(valor: unknown) {
  return typeof valor === "number" && Number.isFinite(valor) && valor > 0
    ? valor
    : null;
}

function normalizarImagenItemCarrito(valor: unknown): ImagenItemCarrito | null {
  if (!esRegistro(valor)) {
    return null;
  }

  const src = obtenerTexto(valor.src);
  const alt = obtenerTexto(valor.alt);
  const ancho = obtenerNumeroPositivo(valor.ancho);
  const alto = obtenerNumeroPositivo(valor.alto);

  if (!src || !alt || !ancho || !alto) {
    return null;
  }

  return {
    src,
    alt,
    ancho,
    alto,
  };
}

function normalizarSeleccionVarianteItemCarrito(
  valor: unknown,
): SeleccionVarianteItemCarrito | null {
  if (!esRegistro(valor)) {
    return null;
  }

  const codigoAtributo = obtenerTexto(valor.codigoAtributo);
  const etiquetaAtributo = obtenerTexto(valor.etiquetaAtributo);
  const opcionId = obtenerTexto(valor.opcionId);
  const etiquetaOpcion = obtenerTexto(valor.etiquetaOpcion);
  const valorOpcion = obtenerTexto(valor.valorOpcion);

  if (
    !codigoAtributo ||
    !etiquetaAtributo ||
    !opcionId ||
    !etiquetaOpcion ||
    !valorOpcion
  ) {
    return null;
  }

  return {
    codigoAtributo,
    etiquetaAtributo,
    opcionId,
    etiquetaOpcion,
    valorOpcion,
  };
}

function normalizarVarianteItemCarrito(
  valor: unknown,
): VarianteItemCarrito | null {
  if (!esRegistro(valor)) {
    return null;
  }

  const id = obtenerTexto(valor.id);
  const etiqueta = obtenerTexto(valor.etiqueta);
  const codigoReferencia = obtenerTexto(valor.codigoReferencia);
  const selecciones = Array.isArray(valor.selecciones)
    ? valor.selecciones
        .map(normalizarSeleccionVarianteItemCarrito)
        .filter(
          (
            seleccion,
          ): seleccion is SeleccionVarianteItemCarrito => Boolean(seleccion),
        )
    : [];

  if (!id || !etiqueta || !codigoReferencia) {
    return null;
  }

  return {
    id,
    etiqueta,
    codigoReferencia,
    selecciones,
  };
}

function normalizarItemCarrito(valor: unknown): ItemCarrito | null {
  if (!esRegistro(valor)) {
    return null;
  }

  const idLinea = obtenerTexto(valor.idLinea);
  const productoId = obtenerTexto(valor.productoId);
  const slug = obtenerTexto(valor.slug);
  const nombre = obtenerTexto(valor.nombre);
  const resumen = obtenerTexto(valor.resumen);
  const categoria = obtenerTexto(valor.categoria);
  const tipoProducto = obtenerTexto(valor.tipoProducto);
  const coleccion = obtenerTexto(valor.coleccion) ?? undefined;
  const imagen = normalizarImagenItemCarrito(valor.imagen);
  const precioUnitarioIvaIncluido = obtenerNumeroPositivo(
    valor.precioUnitarioIvaIncluido,
  );
  const cantidad = obtenerNumeroPositivo(valor.cantidad);
  const etiquetasComerciales = Array.isArray(valor.etiquetasComerciales)
    ? valor.etiquetasComerciales.filter(
        (etiqueta): etiqueta is string => typeof etiqueta === "string",
      )
    : [];
  const variante = valor.variante
    ? normalizarVarianteItemCarrito(valor.variante)
    : null;

  if (
    !idLinea ||
    !productoId ||
    !slug ||
    !nombre ||
    !resumen ||
    !categoria ||
    !tipoProducto ||
    !imagen ||
    !precioUnitarioIvaIncluido ||
    !cantidad
  ) {
    return null;
  }

  return {
    idLinea,
    productoId,
    slug,
    nombre,
    resumen,
    categoria,
    tipoProducto,
    coleccion,
    imagen,
    precioUnitarioIvaIncluido,
    cantidad,
    etiquetasComerciales,
    variante,
  };
}

export function cargarItemsCarritoLocal() {
  if (typeof window === "undefined") {
    return [] as const;
  }

  try {
    const contenidoPersistido = window.localStorage.getItem(CLAVE_STORAGE_CARRITO);

    if (!contenidoPersistido) {
      return [] as const;
    }

    const valorParseado = JSON.parse(contenidoPersistido) as unknown;
    const itemsPersistidos =
      esRegistro(valorParseado) && Array.isArray(valorParseado.items)
        ? valorParseado.items
        : [];

    return itemsPersistidos
      .map(normalizarItemCarrito)
      .filter((item): item is ItemCarrito => Boolean(item));
  } catch {
    return [] as const;
  }
}

export function guardarItemsCarritoLocal(items: readonly ItemCarrito[]) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    if (!items.length) {
      window.localStorage.removeItem(CLAVE_STORAGE_CARRITO);
      return;
    }

    const cargaPersistida: CarritoPersistido = {
      version: 1,
      items,
    };

    window.localStorage.setItem(
      CLAVE_STORAGE_CARRITO,
      JSON.stringify(cargaPersistida),
    );
  } catch {
    // La persistencia local es una mejora progresiva; si falla, la UI sigue operando en memoria.
  }
}
