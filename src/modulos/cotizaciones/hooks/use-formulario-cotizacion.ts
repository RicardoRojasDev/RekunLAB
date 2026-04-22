"use client";

import { useCallback, useMemo, useState } from "react";
import type { DatosSolicitanteCotizacion, SolicitudCrearCotizacionPublica } from "../tipos/crear-cotizacion";
import { validarSolicitudCrearCotizacion, type ErroresCrearCotizacion } from "../validaciones/crear-cotizacion";

function crearErroresIniciales(): ErroresCrearCotizacion {
  return {
    solicitante: {
      nombre: null,
      apellido: null,
      correo: null,
      telefono: null,
    },
    mensaje: null,
  };
}

function crearValoresIniciales(): SolicitudCrearCotizacionPublica {
  return {
    solicitante: {
      nombre: "",
      apellido: "",
      correo: "",
      telefono: "",
    },
    mensaje: "",
  };
}

type EstadoEnvioCotizacion = "inactivo" | "enviando" | "exitoso";

export function useFormularioCotizacion() {
  const [valores, setValores] = useState<SolicitudCrearCotizacionPublica>(() =>
    crearValoresIniciales(),
  );
  const [errores, setErrores] = useState<ErroresCrearCotizacion>(() =>
    crearErroresIniciales(),
  );
  const [intentoEnvio, setIntentoEnvio] = useState(false);
  const [estadoEnvio, setEstadoEnvio] = useState<EstadoEnvioCotizacion>("inactivo");

  const validar = useCallback((siguienteValores: SolicitudCrearCotizacionPublica) => {
    const resultado = validarSolicitudCrearCotizacion(siguienteValores);
    setErrores(resultado.errores);
    return resultado.esValido;
  }, []);

  const actualizarSolicitante = useCallback(
    <K extends keyof DatosSolicitanteCotizacion>(
      campo: K,
      valor: DatosSolicitanteCotizacion[K],
    ) => {
      setValores((previo) => {
        const siguiente: SolicitudCrearCotizacionPublica = {
          ...previo,
          solicitante: {
            ...previo.solicitante,
            [campo]: valor,
          },
        };

        if (intentoEnvio) {
          validar(siguiente);
        }

        return siguiente;
      });
    },
    [intentoEnvio, validar],
  );

  const actualizarMensaje = useCallback(
    (mensaje: string) => {
      setValores((previo) => {
        const siguiente: SolicitudCrearCotizacionPublica = {
          ...previo,
          mensaje,
        };

        if (intentoEnvio) {
          validar(siguiente);
        }

        return siguiente;
      });
    },
    [intentoEnvio, validar],
  );

  const prepararEnvio = useCallback(() => {
    setIntentoEnvio(true);
    return validar(valores);
  }, [validar, valores]);

  const reiniciarEstadoEnvio = useCallback(() => {
    setEstadoEnvio("inactivo");
  }, []);

  const puedeEnviar = useMemo(() => {
    if (estadoEnvio === "enviando") {
      return false;
    }

    if (!intentoEnvio) {
      return true;
    }

    return validarSolicitudCrearCotizacion(valores).esValido;
  }, [estadoEnvio, intentoEnvio, valores]);

  return {
    valores,
    errores,
    intentoEnvio,
    estadoEnvio,
    puedeEnviar,
    setEstadoEnvio,
    actualizarSolicitante,
    actualizarMensaje,
    prepararEnvio,
    reiniciarEstadoEnvio,
  };
}

