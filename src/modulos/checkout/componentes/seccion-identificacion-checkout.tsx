"use client";

import { Boton, Etiqueta, Tarjeta } from "@/compartido/componentes/ui";

export function SeccionIdentificacionCheckout() {
  return (
    <Tarjeta
      variante="elevada"
      etiqueta={<Etiqueta variante="primaria">Cuenta</Etiqueta>}
      titulo="Compra como invitado"
      descripcion="No necesitas iniciar sesion para completar este checkout. Mas adelante podrás conectarlo con Google para guardar tus datos."
      acciones={
        <Boton
          variante="secundario"
          tamanio="sm"
          disabled
          title="Login con Google se integrara en un modulo posterior"
        >
          Login con Google
        </Boton>
      }
    >
      <p className="texto-soporte">
        Seguimos una estrategia frontend-first: el flujo ya es claro y confiable,
        pero en esta etapa no se crea un pedido definitivo ni se solicita pago.
      </p>
    </Tarjeta>
  );
}

