import type {
  ItemCrearPedido,
  SeleccionVariantePedido,
  SolicitudCrearPedido,
  VariantePedido,
} from "../tipos/crear-pedido";

type RegistroDesconocido = Record<string, unknown>;

function esRegistro(valor: unknown): valor is RegistroDesconocido {
  return Boolean(valor) && typeof valor === "object" && !Array.isArray(valor);
}

function obtenerTexto(registro: RegistroDesconocido, clave: string) {
  const valor = registro[clave];
  return typeof valor === "string" ? valor : "";
}

function obtenerNumero(registro: RegistroDesconocido, clave: string) {
  const valor = registro[clave];
  return typeof valor === "number" ? valor : Number.NaN;
}

function obtenerArreglo(registro: RegistroDesconocido, clave: string) {
  const valor = registro[clave];
  return Array.isArray(valor) ? valor : [];
}

function parsearSeleccionVariante(valor: unknown): SeleccionVariantePedido | null {
  if (!esRegistro(valor)) {
    return null;
  }

  return {
    codigoAtributo: obtenerTexto(valor, "codigoAtributo"),
    etiquetaAtributo: obtenerTexto(valor, "etiquetaAtributo"),
    opcionId: obtenerTexto(valor, "opcionId"),
    etiquetaOpcion: obtenerTexto(valor, "etiquetaOpcion"),
    valorOpcion: obtenerTexto(valor, "valorOpcion"),
  };
}

function parsearVariantePedido(valor: unknown): VariantePedido | null {
  if (!esRegistro(valor)) {
    return null;
  }

  const selecciones = obtenerArreglo(valor, "selecciones")
    .map((seleccion) => parsearSeleccionVariante(seleccion))
    .filter(Boolean) as SeleccionVariantePedido[];

  const codigoReferencia = obtenerTexto(valor, "codigoReferencia");

  return {
    etiqueta: obtenerTexto(valor, "etiqueta"),
    codigoReferencia: codigoReferencia.length ? codigoReferencia : null,
    selecciones,
  };
}

function parsearItemCrearPedido(valor: unknown): ItemCrearPedido | null {
  if (!esRegistro(valor)) {
    return null;
  }

  const etiquetasComerciales = obtenerArreglo(valor, "etiquetasComerciales").filter(
    (etiqueta) => typeof etiqueta === "string",
  ) as string[];

  const variante = parsearVariantePedido(valor.variante);

  const coleccion = obtenerTexto(valor, "coleccion");

  return {
    slug: obtenerTexto(valor, "slug"),
    nombre: obtenerTexto(valor, "nombre"),
    resumen: obtenerTexto(valor, "resumen"),
    categoria: obtenerTexto(valor, "categoria"),
    tipoProducto: obtenerTexto(valor, "tipoProducto"),
    coleccion: coleccion.length ? coleccion : undefined,
    precioUnitarioIvaIncluidoSnapshot: obtenerNumero(
      valor,
      "precioUnitarioIvaIncluidoSnapshot",
    ),
    cantidad: obtenerNumero(valor, "cantidad"),
    etiquetasComerciales: etiquetasComerciales.length ? etiquetasComerciales : undefined,
    variante,
  };
}

export function parsearSolicitudCrearPedido(
  valor: unknown,
): SolicitudCrearPedido | null {
  if (!esRegistro(valor)) {
    return null;
  }

  const datosClienteRegistro = valor.datosCliente;
  const direccionRegistro = valor.direccionDespacho;
  const itemsRegistro = valor.items;

  if (!esRegistro(datosClienteRegistro) || !esRegistro(direccionRegistro)) {
    return null;
  }

  const items = (Array.isArray(itemsRegistro) ? itemsRegistro : [])
    .map((item) => parsearItemCrearPedido(item))
    .filter(Boolean) as ItemCrearPedido[];

  return {
    datosCliente: {
      nombre: obtenerTexto(datosClienteRegistro, "nombre"),
      apellido: obtenerTexto(datosClienteRegistro, "apellido"),
      correo: obtenerTexto(datosClienteRegistro, "correo"),
      telefono: obtenerTexto(datosClienteRegistro, "telefono"),
    },
    direccionDespacho: {
      region: obtenerTexto(direccionRegistro, "region"),
      comuna: obtenerTexto(direccionRegistro, "comuna"),
      calle: obtenerTexto(direccionRegistro, "calle"),
      numero: obtenerTexto(direccionRegistro, "numero"),
      departamento: obtenerTexto(direccionRegistro, "departamento"),
      referencias: obtenerTexto(direccionRegistro, "referencias"),
      codigoPostal: obtenerTexto(direccionRegistro, "codigoPostal"),
    },
    items,
  };
}

