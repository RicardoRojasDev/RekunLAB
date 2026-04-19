import type {
  DatosClientePedido,
  DireccionDespachoPedido,
  ItemCrearPedido,
  SolicitudCrearPedido,
} from "../tipos/crear-pedido";

function normalizarTexto(valor: string) {
  return valor.trim();
}

function validarRequerido(valor: string, etiqueta: string) {
  return normalizarTexto(valor).length ? null : `Ingresa ${etiqueta}.`;
}

function esCorreoValido(correo: string) {
  const valor = normalizarTexto(correo);

  if (!valor.length) {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
}

function validarCorreo(correo: string) {
  if (!normalizarTexto(correo).length) {
    return "Ingresa correo.";
  }

  return esCorreoValido(correo)
    ? null
    : "Ingresa un correo valido (ej: nombre@dominio.cl).";
}

function obtenerSoloDigitos(valor: string) {
  return valor.replace(/\D/g, "");
}

function validarTelefono(telefono: string) {
  const valor = normalizarTexto(telefono);

  if (!valor.length) {
    return null;
  }

  const digitos = obtenerSoloDigitos(valor);

  if (digitos.length < 8) {
    return "El telefono debe tener al menos 8 digitos.";
  }

  if (digitos.length > 15) {
    return "El telefono parece demasiado largo.";
  }

  return null;
}

function validarEnteroPositivo(valor: unknown, etiqueta: string) {
  if (typeof valor !== "number" || !Number.isFinite(valor)) {
    return `El campo ${etiqueta} no es valido.`;
  }

  if (!Number.isInteger(valor)) {
    return `El campo ${etiqueta} debe ser un numero entero.`;
  }

  if (valor < 1) {
    return `El campo ${etiqueta} debe ser mayor o igual a 1.`;
  }

  return null;
}

function validarMontoNoNegativo(valor: unknown, etiqueta: string) {
  if (typeof valor !== "number" || !Number.isFinite(valor)) {
    return `El campo ${etiqueta} no es valido.`;
  }

  if (!Number.isInteger(valor)) {
    return `El campo ${etiqueta} debe ser un numero entero.`;
  }

  if (valor < 0) {
    return `El campo ${etiqueta} no puede ser negativo.`;
  }

  return null;
}

export type ErroresCrearPedido = Readonly<{
  datosCliente: Readonly<{
    nombre: string | null;
    apellido: string | null;
    correo: string | null;
    telefono: string | null;
  }>;
  direccionDespacho: Readonly<{
    region: string | null;
    comuna: string | null;
    calle: string | null;
    numero: string | null;
    departamento: string | null;
    referencias: string | null;
    codigoPostal: string | null;
  }>;
  items: string | null;
}>;

export type ResultadoValidacionCrearPedido = Readonly<{
  esValido: boolean;
  errores: ErroresCrearPedido;
}>;

export function validarDatosClientePedido(
  datosCliente: DatosClientePedido,
): ErroresCrearPedido["datosCliente"] {
  return {
    nombre: validarRequerido(datosCliente.nombre, "nombre"),
    apellido: validarRequerido(datosCliente.apellido, "apellido"),
    correo: validarCorreo(datosCliente.correo),
    telefono: validarTelefono(datosCliente.telefono),
  };
}

export function validarDireccionDespachoPedido(
  direccion: DireccionDespachoPedido,
): ErroresCrearPedido["direccionDespacho"] {
  return {
    region: validarRequerido(direccion.region, "region"),
    comuna: validarRequerido(direccion.comuna, "comuna"),
    calle: validarRequerido(direccion.calle, "calle"),
    numero: validarRequerido(direccion.numero, "numero"),
    departamento: null,
    referencias: null,
    codigoPostal: null,
  };
}

function algunErrorPresente(errores: Record<string, string | null>) {
  return Object.values(errores).some(Boolean);
}

function validarItemCrearPedido(item: ItemCrearPedido) {
  const errores: string[] = [];

  // Campos requeridos
  if (!normalizarTexto(item.slug).length) {
    errores.push("Falta slug del producto.");
  }

  if (!normalizarTexto(item.nombre).length) {
    errores.push("Falta nombre del producto.");
  }

  const errorCantidad = validarEnteroPositivo(item.cantidad, "cantidad");
  if (errorCantidad) {
    errores.push(errorCantidad);
  }

  const errorPrecio = validarMontoNoNegativo(
    item.precioUnitarioIvaIncluidoSnapshot,
    "precio unitario",
  );
  if (errorPrecio) {
    errores.push(errorPrecio);
  }

  // Validaciones opcionales para snapshot (no bloquean)
  // Los campos NUEVOS son opcionales (?) y no causan error
  // Solo se validan si están presentes:

  if (item.pesoKg !== undefined && (typeof item.pesoKg !== "number" || item.pesoKg < 0)) {
    errores.push("Peso debe ser un numero positivo.");
  }

  // El resto de campos se validan a nivel de tipo TypeScript
  // (eslint + tsc verifican que sean string | number | boolean | undefined)

  return errores.length ? errores.join(" ") : null;
}

export function validarSolicitudCrearPedido(
  solicitud: SolicitudCrearPedido,
): ResultadoValidacionCrearPedido {
  const erroresDatosCliente = validarDatosClientePedido(solicitud.datosCliente);
  const erroresDireccion = validarDireccionDespachoPedido(
    solicitud.direccionDespacho,
  );

  let errorItems: string | null = null;

  if (!Array.isArray(solicitud.items) || solicitud.items.length === 0) {
    errorItems = "El pedido debe incluir al menos un item.";
  } else {
    const erroresLineas = solicitud.items
      .map((item) => validarItemCrearPedido(item))
      .filter(Boolean);

    if (erroresLineas.length) {
      errorItems = erroresLineas.join(" ");
    }
  }

  const esValido =
    !algunErrorPresente(erroresDatosCliente) &&
    !algunErrorPresente(erroresDireccion) &&
    !Boolean(errorItems);

  return {
    esValido,
    errores: {
      datosCliente: erroresDatosCliente,
      direccionDespacho: erroresDireccion,
      items: errorItems,
    },
  };
}

