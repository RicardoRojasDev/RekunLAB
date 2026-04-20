export type UsuarioAdministrador = Readonly<{
  id: string;
  correo: string;
  nombreCompleto: string;
  proveedor: string | null;
}>;

export type ResultadoAccesoAdministrador = Readonly<{
  configuracionCompleta: boolean;
  sesionActiva: boolean;
  esAdministrador: boolean;
  usuario: UsuarioAdministrador | null;
}>;

export type EnlaceNavegacionAdmin = Readonly<{
  href: string;
  etiqueta: string;
  descripcion: string;
  claveVisual: string;
}>;
