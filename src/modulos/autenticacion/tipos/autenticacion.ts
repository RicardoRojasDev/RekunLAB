export type EstadoSesionAutenticacion =
  | "cargando"
  | "invitado"
  | "autenticado";

export type DisponibilidadAutenticacion = "configurada" | "no-configurada";

export type UsuarioAutenticadoFrontend = Readonly<{
  id: string;
  correo: string | null;
  nombre: string;
  apellido: string;
  nombreCompleto: string;
  avatarUrl: string | null;
  proveedor: string | null;
}>;
