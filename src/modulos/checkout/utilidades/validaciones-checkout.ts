import type {
  DatosClienteCheckout,
  DireccionEnvioCheckout,
  ErroresDatosClienteCheckout,
  ErroresDireccionEnvioCheckout,
  ErroresFormularioCheckout,
  ResultadoValidacionCheckout,
  ValoresFormularioCheckout,
} from "../tipos/checkout";

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

export function validarDatosClienteCheckout(
  datosCliente: DatosClienteCheckout,
): ErroresDatosClienteCheckout {
  return {
    nombre: validarRequerido(datosCliente.nombre, "nombre"),
    apellido: validarRequerido(datosCliente.apellido, "apellido"),
    correo: validarCorreo(datosCliente.correo),
    telefono: validarTelefono(datosCliente.telefono),
  };
}

export function validarDireccionEnvioCheckout(
  direccion: DireccionEnvioCheckout,
): ErroresDireccionEnvioCheckout {
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

export function validarFormularioCheckout(
  valores: ValoresFormularioCheckout,
): ResultadoValidacionCheckout {
  const erroresDatosCliente = validarDatosClienteCheckout(valores.datosCliente);
  const erroresDireccionEnvio = validarDireccionEnvioCheckout(
    valores.direccionEnvio,
  );

  const errores: ErroresFormularioCheckout = {
    datosCliente: erroresDatosCliente,
    direccionEnvio: erroresDireccionEnvio,
  };

  const esValido =
    !algunErrorPresente(erroresDatosCliente) &&
    !algunErrorPresente(erroresDireccionEnvio);

  return {
    esValido,
    errores,
  };
}

