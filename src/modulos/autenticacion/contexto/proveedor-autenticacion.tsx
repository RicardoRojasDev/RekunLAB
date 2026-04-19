"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { PropiedadesConHijos } from "@/compartido/tipos/comunes";
import {
  autenticacionSupabaseEstaDisponible,
  mapearSesionAUsuarioAutenticado,
  obtenerClienteSupabaseAutenticacion,
  resolverUrlRetornoAutenticacion,
} from "../servicios/cliente-supabase-autenticacion";
import type {
  DisponibilidadAutenticacion,
  EstadoSesionAutenticacion,
  UsuarioAutenticadoFrontend,
} from "../tipos/autenticacion";

type AccionAutenticacion = "login-google" | "cerrar-sesion" | null;

type ValorContextoAutenticacion = Readonly<{
  disponibilidad: DisponibilidadAutenticacion;
  estadoSesion: EstadoSesionAutenticacion;
  usuario: UsuarioAutenticadoFrontend | null;
  esAutenticado: boolean;
  accionActual: AccionAutenticacion;
  mensajeError: string | null;
  iniciarSesionConGoogle: () => Promise<void>;
  cerrarSesion: () => Promise<void>;
  limpiarMensajeError: () => void;
}>;

const ContextoAutenticacion = createContext<ValorContextoAutenticacion | null>(
  null,
);

export function ProveedorAutenticacion({ children }: PropiedadesConHijos) {
  const [disponibilidad, setDisponibilidad] = useState<DisponibilidadAutenticacion>(
    autenticacionSupabaseEstaDisponible() ? "configurada" : "no-configurada",
  );
  const [estadoSesion, setEstadoSesion] =
    useState<EstadoSesionAutenticacion>(
      autenticacionSupabaseEstaDisponible() ? "cargando" : "invitado",
    );
  const [usuario, setUsuario] = useState<UsuarioAutenticadoFrontend | null>(null);
  const [accionActual, setAccionActual] = useState<AccionAutenticacion>(null);
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  useEffect(() => {
    const cliente = obtenerClienteSupabaseAutenticacion();

    if (!cliente) {
      return;
    }

    let activo = true;

    cliente.auth
      .getSession()
      .then(({ data, error }) => {
        if (!activo) {
          return;
        }

        if (error) {
          setMensajeError(
            "No pudimos recuperar tu sesion actual. Puedes seguir como invitado.",
          );
          setEstadoSesion("invitado");
          setUsuario(null);
          return;
        }

        const usuarioSesion = mapearSesionAUsuarioAutenticado(data.session);
        setUsuario(usuarioSesion);
        setEstadoSesion(usuarioSesion ? "autenticado" : "invitado");
      })
      .catch(() => {
        if (!activo) {
          return;
        }

        setMensajeError(
          "No pudimos validar tu sesion actual. Puedes seguir como invitado.",
        );
        setEstadoSesion("invitado");
        setUsuario(null);
      });

    const {
      data: { subscription },
    } = cliente.auth.onAuthStateChange((_evento, sesion) => {
      if (!activo) {
        return;
      }

      const usuarioSesion = mapearSesionAUsuarioAutenticado(sesion);
      setUsuario(usuarioSesion);
      setEstadoSesion(usuarioSesion ? "autenticado" : "invitado");
      setAccionActual(null);
      setMensajeError(null);
    });

    return () => {
      activo = false;
      subscription.unsubscribe();
    };
  }, []);

  const limpiarMensajeError = useCallback(() => {
    setMensajeError(null);
  }, []);

  const iniciarSesionConGoogle = useCallback(async () => {
    setMensajeError(null);
    const cliente = obtenerClienteSupabaseAutenticacion();

    if (!cliente) {
      setDisponibilidad("no-configurada");
      setEstadoSesion("invitado");
      setMensajeError(
        "Supabase Auth aun no esta configurado. Puedes seguir comprando como invitado.",
      );
      return;
    }

    setAccionActual("login-google");

    const { error } = await cliente.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: resolverUrlRetornoAutenticacion(),
        queryParams: {
          access_type: "offline",
          prompt: "select_account",
        },
      },
    });

    if (error) {
      setAccionActual(null);
      setMensajeError(
        "No pudimos iniciar sesion con Google. Intenta nuevamente.",
      );
    }
  }, []);

  const cerrarSesion = useCallback(async () => {
    setMensajeError(null);
    const cliente = obtenerClienteSupabaseAutenticacion();

    if (!cliente) {
      setDisponibilidad("no-configurada");
      setEstadoSesion("invitado");
      setUsuario(null);
      return;
    }

    setAccionActual("cerrar-sesion");

    const { error } = await cliente.auth.signOut();

    if (error) {
      setMensajeError("No pudimos cerrar sesion. Intenta nuevamente.");
      setAccionActual(null);
      return;
    }

    setUsuario(null);
    setEstadoSesion("invitado");
    setAccionActual(null);
  }, []);

  const valor = useMemo<ValorContextoAutenticacion>(
    () => ({
      disponibilidad,
      estadoSesion,
      usuario,
      esAutenticado: estadoSesion === "autenticado" && Boolean(usuario),
      accionActual,
      mensajeError,
      iniciarSesionConGoogle,
      cerrarSesion,
      limpiarMensajeError,
    }),
    [
      accionActual,
      cerrarSesion,
      disponibilidad,
      estadoSesion,
      iniciarSesionConGoogle,
      limpiarMensajeError,
      mensajeError,
      usuario,
    ],
  );

  return (
    <ContextoAutenticacion.Provider value={valor}>
      {children}
    </ContextoAutenticacion.Provider>
  );
}

export { ContextoAutenticacion };
