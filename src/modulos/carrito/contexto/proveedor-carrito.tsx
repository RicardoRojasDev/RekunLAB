"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import type { PropiedadesConHijos } from "@/compartido/tipos/comunes";
import { cargarItemsCarritoLocal, guardarItemsCarritoLocal } from "../servicios/persistencia-carrito-local";
import type {
  EntradaAgregarItemCarrito,
  EstadoCarrito,
  ItemCarrito,
  OpcionesAgregarItemCarrito,
  ResumenCarrito,
} from "../tipos/carrito";
import {
  actualizarCantidadItemCarrito,
  agregarItemCarrito,
  calcularResumenCarrito,
  eliminarItemCarrito,
} from "../utilidades/operaciones-carrito";

type AccionCarrito =
  | {
      tipo: "hidratar";
      items: readonly ItemCarrito[];
    }
  | {
      tipo: "agregar-item";
      entrada: EntradaAgregarItemCarrito;
    }
  | {
      tipo: "actualizar-cantidad";
      idLinea: string;
      cantidad: number;
    }
  | {
      tipo: "eliminar-item";
      idLinea: string;
    }
  | {
      tipo: "abrir-drawer";
    }
  | {
      tipo: "cerrar-drawer";
    };

type ValorContextoCarrito = Readonly<{
  items: readonly ItemCarrito[];
  resumen: ResumenCarrito;
  estaVacio: boolean;
  hidratado: boolean;
  drawerAbierto: boolean;
  agregarItem: (
    entrada: EntradaAgregarItemCarrito,
    opciones?: OpcionesAgregarItemCarrito,
  ) => void;
  actualizarCantidadItem: (idLinea: string, cantidad: number) => void;
  eliminarItem: (idLinea: string) => void;
  abrirDrawer: () => void;
  cerrarDrawer: () => void;
}>;

const estadoInicialCarrito: EstadoCarrito = {
  items: [],
  hidratado: false,
  drawerAbierto: false,
};

export const ContextoCarrito = createContext<ValorContextoCarrito | null>(null);

function reductorCarrito(
  estado: EstadoCarrito,
  accion: AccionCarrito,
): EstadoCarrito {
  switch (accion.tipo) {
    case "hidratar":
      return {
        ...estado,
        items: accion.items,
        hidratado: true,
      };

    case "agregar-item":
      return {
        ...estado,
        items: agregarItemCarrito(estado.items, accion.entrada),
      };

    case "actualizar-cantidad":
      return {
        ...estado,
        items: actualizarCantidadItemCarrito(
          estado.items,
          accion.idLinea,
          accion.cantidad,
        ),
      };

    case "eliminar-item":
      return {
        ...estado,
        items: eliminarItemCarrito(estado.items, accion.idLinea),
      };

    case "abrir-drawer":
      return {
        ...estado,
        drawerAbierto: true,
      };

    case "cerrar-drawer":
      return {
        ...estado,
        drawerAbierto: false,
      };

    default:
      return estado;
  }
}

export function ProveedorCarrito({ children }: PropiedadesConHijos) {
  const [estado, dispatch] = useReducer(reductorCarrito, estadoInicialCarrito);

  useEffect(() => {
    const itemsPersistidos = cargarItemsCarritoLocal();

    dispatch({
      tipo: "hidratar",
      items: itemsPersistidos,
    });
  }, []);

  useEffect(() => {
    if (!estado.hidratado) {
      return;
    }

    guardarItemsCarritoLocal(estado.items);
  }, [estado.hidratado, estado.items]);

  const agregarItem = useCallback(
    (
      entrada: EntradaAgregarItemCarrito,
      opciones?: OpcionesAgregarItemCarrito,
    ) => {
      dispatch({
        tipo: "agregar-item",
        entrada,
      });

      if (opciones?.abrirDrawer ?? true) {
        dispatch({
          tipo: "abrir-drawer",
        });
      }
    },
    [],
  );

  const actualizarCantidadItem = useCallback((idLinea: string, cantidad: number) => {
    dispatch({
      tipo: "actualizar-cantidad",
      idLinea,
      cantidad,
    });
  }, []);

  const eliminarItem = useCallback((idLinea: string) => {
    dispatch({
      tipo: "eliminar-item",
      idLinea,
    });
  }, []);

  const abrirDrawer = useCallback(() => {
    dispatch({
      tipo: "abrir-drawer",
    });
  }, []);

  const cerrarDrawer = useCallback(() => {
    dispatch({
      tipo: "cerrar-drawer",
    });
  }, []);

  const resumen = useMemo(
    () => calcularResumenCarrito(estado.items),
    [estado.items],
  );

  const valor = useMemo<ValorContextoCarrito>(
    () => ({
      items: estado.items,
      resumen,
      estaVacio: estado.items.length === 0,
      hidratado: estado.hidratado,
      drawerAbierto: estado.drawerAbierto,
      agregarItem,
      actualizarCantidadItem,
      eliminarItem,
      abrirDrawer,
      cerrarDrawer,
    }),
    [
      agregarItem,
      actualizarCantidadItem,
      cerrarDrawer,
      abrirDrawer,
      eliminarItem,
      estado.drawerAbierto,
      estado.hidratado,
      estado.items,
      resumen,
    ],
  );

  return (
    <ContextoCarrito.Provider value={valor}>{children}</ContextoCarrito.Provider>
  );
}
