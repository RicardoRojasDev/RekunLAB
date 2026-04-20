import type { DatosFormularioProductoAdmin } from "../tipos/admin-productos";

type RegistroDesconocido = Record<string, unknown>;

const expresionSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const expresionColorHex = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

export class ErrorValidacionProductoAdmin extends Error {
  errores: readonly string[];

  constructor(errores: readonly string[]) {
    super("Los datos del producto no pasaron la validacion.");
    this.name = "ErrorValidacionProductoAdmin";
    this.errores = errores;
  }
}

function esRegistro(valor: unknown): valor is RegistroDesconocido {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

function normalizarTextoOpcional(valor: unknown) {
  return typeof valor === "string" && valor.trim().length ? valor.trim() : undefined;
}

function normalizarBooleano(valor: unknown, valorPorDefecto = false) {
  if (typeof valor === "boolean") {
    return valor;
  }

  if (typeof valor === "string") {
    const texto = valor.trim().toLowerCase();

    if (texto === "true") {
      return true;
    }

    if (texto === "false") {
      return false;
    }
  }

  return valorPorDefecto;
}

function normalizarEnteroNoNegativo(valor: unknown) {
  if (typeof valor === "number" && Number.isInteger(valor) && valor >= 0) {
    return valor;
  }

  if (typeof valor === "string" && valor.trim().length) {
    const numero = Number(valor.trim());

    if (Number.isInteger(numero) && numero >= 0) {
      return numero;
    }
  }

  return undefined;
}

function normalizarDecimalNoNegativo(valor: unknown) {
  if (typeof valor === "number" && Number.isFinite(valor) && valor >= 0) {
    return valor;
  }

  if (typeof valor === "string" && valor.trim().length) {
    const numero = Number(valor.trim().replace(",", "."));

    if (Number.isFinite(numero) && numero >= 0) {
      return numero;
    }
  }

  return undefined;
}

function slugificarTexto(valor: string) {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function validarDatosFormularioProductoAdmin(
  entrada: unknown,
): DatosFormularioProductoAdmin {
  if (!esRegistro(entrada)) {
    throw new ErrorValidacionProductoAdmin([
      "No recibimos un objeto valido para el formulario del producto.",
    ]);
  }

  const errores: string[] = [];
  const skuBase = normalizarTextoOpcional(entrada.skuBase);
  const nombre = normalizarTextoOpcional(entrada.nombre);
  const nombreCompleto = normalizarTextoOpcional(entrada.nombreCompleto);
  const resumen = normalizarTextoOpcional(entrada.resumen);
  const descripcion = normalizarTextoOpcional(entrada.descripcion);
  const categoriaId = normalizarTextoOpcional(entrada.categoriaId);
  const subcategoria = normalizarTextoOpcional(entrada.subcategoria);
  const nivelId = normalizarTextoOpcional(entrada.nivelId);
  const marcaId = normalizarTextoOpcional(entrada.marcaId);
  const tipoProducto = normalizarTextoOpcional(entrada.tipoProducto);
  const formato = normalizarTextoOpcional(entrada.formato);
  const acabado = normalizarTextoOpcional(entrada.acabado);
  const efecto = normalizarTextoOpcional(entrada.efecto);
  const coleccion = normalizarTextoOpcional(entrada.coleccion);
  const estadoId = normalizarTextoOpcional(entrada.estadoId);
  const colorHexSinNormalizar = normalizarTextoOpcional(entrada.colorHex);
  const colorHex = colorHexSinNormalizar?.toUpperCase();
  const precioCLP = normalizarEnteroNoNegativo(entrada.precioCLP);
  const pesoKg = normalizarDecimalNoNegativo(entrada.pesoKg);
  const compatiblePLA = normalizarBooleano(entrada.compatiblePLA);
  const esDestacado = normalizarBooleano(entrada.esDestacado);

  if (!skuBase) {
    errores.push("Debes indicar un SKU base para el producto.");
  }

  if (!nombre) {
    errores.push("Debes indicar el nombre comercial del producto.");
  }

  const slugBase = normalizarTextoOpcional(entrada.slug);
  const slug =
    slugBase && slugBase.length
      ? slugificarTexto(slugBase)
      : nombreCompleto
        ? slugificarTexto(nombreCompleto)
        : nombre
          ? slugificarTexto(nombre)
          : "";

  if (!slug.length || !expresionSlug.test(slug)) {
    errores.push("El slug debe usar solo minusculas, numeros y guiones.");
  }

  if (!resumen) {
    errores.push("Debes incluir un resumen comercial breve.");
  }

  if (!descripcion) {
    errores.push("Debes incluir una descripcion para la ficha del producto.");
  }

  if (!categoriaId) {
    errores.push("Debes elegir una categoria principal.");
  }

  if (!tipoProducto) {
    errores.push("Debes indicar el tipo de producto.");
  }

  if (precioCLP === undefined) {
    errores.push("El precio CLP debe ser un numero entero igual o mayor a cero.");
  }

  if (entrada.pesoKg !== undefined && entrada.pesoKg !== "" && pesoKg === undefined) {
    errores.push("El peso en kg debe ser un numero valido igual o mayor a cero.");
  }

  if (colorHex && !expresionColorHex.test(colorHex)) {
    errores.push("El color hexadecimal debe respetar el formato #RRGGBB o #RGB.");
  }

  if (!estadoId) {
    errores.push("Debes seleccionar un estado para el producto.");
  }

  if (errores.length) {
    throw new ErrorValidacionProductoAdmin(errores);
  }

  return {
    skuBase: skuBase!,
    nombre: nombre!,
    nombreCompleto,
    slug,
    resumen: resumen!,
    descripcion: descripcion!,
    categoriaId: categoriaId!,
    subcategoria,
    nivelId,
    marcaId,
    tipoProducto: tipoProducto!,
    precioCLP: precioCLP!,
    formato,
    pesoKg,
    acabado,
    efecto,
    colorHex,
    compatiblePLA,
    coleccion,
    esDestacado,
    estadoId: estadoId!,
  };
}
