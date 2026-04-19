export type ModoCheckout = "invitado";

export type DatosClienteCheckout = Readonly<{
  modo: ModoCheckout;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
}>;

export type DireccionEnvioCheckout = Readonly<{
  region: string;
  comuna: string;
  calle: string;
  numero: string;
  departamento: string;
  referencias: string;
  codigoPostal: string;
}>;

export type ValoresFormularioCheckout = Readonly<{
  datosCliente: DatosClienteCheckout;
  direccionEnvio: DireccionEnvioCheckout;
}>;

export type ErroresDatosClienteCheckout = Readonly<{
  nombre: string | null;
  apellido: string | null;
  correo: string | null;
  telefono: string | null;
}>;

export type ErroresDireccionEnvioCheckout = Readonly<{
  region: string | null;
  comuna: string | null;
  calle: string | null;
  numero: string | null;
  departamento: string | null;
  referencias: string | null;
  codigoPostal: string | null;
}>;

export type ErroresFormularioCheckout = Readonly<{
  datosCliente: ErroresDatosClienteCheckout;
  direccionEnvio: ErroresDireccionEnvioCheckout;
}>;

export type ResultadoValidacionCheckout = Readonly<{
  esValido: boolean;
  errores: ErroresFormularioCheckout;
}>;

