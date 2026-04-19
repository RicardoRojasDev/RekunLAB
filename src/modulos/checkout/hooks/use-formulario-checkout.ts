"use client";

import { useCallback, useMemo, useState } from "react";
import type {
  DatosClienteCheckout,
  DireccionEnvioCheckout,
  ErroresFormularioCheckout,
  ValoresFormularioCheckout,
} from "../tipos/checkout";
import { validarFormularioCheckout } from "../utilidades/validaciones-checkout";

function crearErroresIniciales(): ErroresFormularioCheckout {
  return {
    datosCliente: {
      nombre: null,
      apellido: null,
      correo: null,
      telefono: null,
    },
    direccionEnvio: {
      region: null,
      comuna: null,
      calle: null,
      numero: null,
      departamento: null,
      referencias: null,
      codigoPostal: null,
    },
  };
}

function crearValoresIniciales(): ValoresFormularioCheckout {
  return {
    datosCliente: {
      modo: "invitado",
      nombre: "",
      apellido: "",
      correo: "",
      telefono: "",
    },
    direccionEnvio: {
      region: "",
      comuna: "",
      calle: "",
      numero: "",
      departamento: "",
      referencias: "",
      codigoPostal: "",
    },
  };
}

type EstadoEnvioCheckout = "inactivo" | "enviando" | "exitoso";

export function useFormularioCheckout() {
  const [valores, setValores] = useState<ValoresFormularioCheckout>(() =>
    crearValoresIniciales(),
  );
  const [errores, setErrores] = useState<ErroresFormularioCheckout>(() =>
    crearErroresIniciales(),
  );
  const [intentoEnvio, setIntentoEnvio] = useState(false);
  const [estadoEnvio, setEstadoEnvio] = useState<EstadoEnvioCheckout>("inactivo");

  const validar = useCallback(
    (siguienteValores: ValoresFormularioCheckout) => {
      const resultado = validarFormularioCheckout(siguienteValores);
      setErrores(resultado.errores);
      return resultado.esValido;
    },
    [],
  );

  const actualizarDatosCliente = useCallback(
    <K extends keyof DatosClienteCheckout>(campo: K, valor: DatosClienteCheckout[K]) => {
      setValores((previo) => {
        const siguiente: ValoresFormularioCheckout = {
          ...previo,
          datosCliente: {
            ...previo.datosCliente,
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

  const actualizarDireccionEnvio = useCallback(
    <K extends keyof DireccionEnvioCheckout>(campo: K, valor: DireccionEnvioCheckout[K]) => {
      setValores((previo) => {
        const siguiente: ValoresFormularioCheckout = {
          ...previo,
          direccionEnvio: {
            ...previo.direccionEnvio,
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

  const prepararEnvio = useCallback(() => {
    setIntentoEnvio(true);
    return validar(valores);
  }, [validar, valores]);

  const marcarEnvioExitoso = useCallback(() => {
    setEstadoEnvio("exitoso");
  }, []);

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

    return validarFormularioCheckout(valores).esValido;
  }, [estadoEnvio, intentoEnvio, valores]);

  return {
    valores,
    errores,
    intentoEnvio,
    estadoEnvio,
    puedeEnviar,
    setEstadoEnvio,
    actualizarDatosCliente,
    actualizarDireccionEnvio,
    prepararEnvio,
    marcarEnvioExitoso,
    reiniciarEstadoEnvio,
  };
}

