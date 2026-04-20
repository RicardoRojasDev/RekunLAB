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

function obtenerBooleano(registro: RegistroDesconocido, clave: string) {
  const valor = registro[clave];
  return typeof valor === "boolean" ? valor : undefined;
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
  const idProducto = obtenerTexto(valor, "idProducto");
  const nombreCompleto = obtenerTexto(valor, "nombreCompleto");
  const subcategoria = obtenerTexto(valor, "subcategoria");
  const marca = obtenerTexto(valor, "marca");
  const nivel = obtenerTexto(valor, "nivel");
  const formato = obtenerTexto(valor, "formato");
  const acabado = obtenerTexto(valor, "acabado");
  const efecto = obtenerTexto(valor, "efecto");
  const colorHex = obtenerTexto(valor, "colorHex");
  const estado = obtenerTexto(valor, "estado");

  const pesoKg = obtenerNumero(valor, "pesoKg");
  const compatiblePLA = obtenerBooleano(valor, "compatiblePLA");
  const esDestacado = obtenerBooleano(valor, "esDestacado");

  return {
    slug: obtenerTexto(valor, "slug"),
    nombre: obtenerTexto(valor, "nombre"),
    nombreCompleto: nombreCompleto.length ? nombreCompleto : undefined,
    resumen: obtenerTexto(valor, "resumen"),
    categoria: obtenerTexto(valor, "categoria"),
    subcategoria: subcategoria.length ? subcategoria : undefined,
    marca: marca.length ? marca : undefined,
    tipoProducto: obtenerTexto(valor, "tipoProducto"),
    nivel: nivel.length ? nivel : undefined,
    coleccion: coleccion.length ? coleccion : undefined,
    precioUnitarioIvaIncluidoSnapshot: obtenerNumero(
      valor,
      "precioUnitarioIvaIncluidoSnapshot",
    ),
    cantidad: obtenerNumero(valor, "cantidad"),
    etiquetasComerciales: etiquetasComerciales.length ? etiquetasComerciales : undefined,
    idProducto: idProducto.length ? idProducto : undefined,
    formato: formato.length ? formato : undefined,
    pesoKg: Number.isFinite(pesoKg) ? pesoKg : undefined,
    acabado: acabado.length ? acabado : undefined,
    efecto: efecto.length ? efecto : undefined,
    colorHex: colorHex.length ? colorHex : undefined,
    compatiblePLA,
    esDestacado,
    estado: estado.length ? estado : undefined,
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
