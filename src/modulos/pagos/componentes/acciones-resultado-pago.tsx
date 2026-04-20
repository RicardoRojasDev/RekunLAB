"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Boton, MensajeError } from "@/compartido/componentes/ui";
import { useCarrito } from "@/modulos/carrito";
import type { RespuestaApiCrearIntencionPago } from "../tipos/pagos";
import { redireccionarAWebpayPlus } from "../utilidades/redireccionar-webpay-plus";

type PropiedadesAccionesResultadoPago = Readonly<{
  pedidoId: string;
  estadoPago: "pendiente" | "pagado" | "fallido" | "sin-pago";
  permiteReintento: boolean;
}>;

export function AccionesResultadoPago({
  pedidoId,
  estadoPago,
  permiteReintento,
}: PropiedadesAccionesResultadoPago) {
  const { vaciarCarrito } = useCarrito();
  const [isPending, startTransition] = useTransition();
  const [errorPago, setErrorPago] = useState<string | null>(null);

  useEffect(() => {
    if (estadoPago === "pagado") {
      vaciarCarrito();
    }
  }, [estadoPago, vaciarCarrito]);

  function reintentarPago() {
    setErrorPago(null);

    startTransition(() => {
      fetch("/api/pagos/intencion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pedidoId }),
      })
        .then(async (respuesta) => {
          const payload =
            (await respuesta.json()) as RespuestaApiCrearIntencionPago;

          if (!respuesta.ok || !payload.ok) {
            throw new Error(
              payload.ok ? "No pudimos recrear la intencion de pago." : payload.mensaje,
            );
          }

          redireccionarAWebpayPlus(
            payload.urlRedireccion,
            payload.tokenRedireccion,
          );
        })
        .catch((error: unknown) => {
          setErrorPago(
            error instanceof Error
              ? error.message
              : "No pudimos reintentar el pago en este momento.",
          );
        });
    });
  }

  return (
    <div className="space-y-4">
      {errorPago ? (
        <MensajeError
          mensaje={errorPago}
          detalle="Tu pedido sigue registrado. Puedes intentar nuevamente sin crear un nuevo pedido."
        />
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Link
          href="/catalogo"
          className="boton-base boton-secundario min-h-12 px-5 text-sm"
        >
          Volver al catalogo
        </Link>

        {permiteReintento ? (
          <Boton onClick={reintentarPago} disabled={isPending}>
            {isPending ? "Preparando pago..." : "Reintentar pago"}
          </Boton>
        ) : null}
      </div>
    </div>
  );
}
