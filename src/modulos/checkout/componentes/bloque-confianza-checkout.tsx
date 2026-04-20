import { Etiqueta, Tarjeta } from "@/compartido/componentes/ui";

const mensajesConfianza = [
  {
    etiqueta: "IVA incluido",
    descripcion: "Todos los precios se muestran con IVA incluido.",
  },
  {
    etiqueta: "Solo Chile",
    descripcion: "Ventas y envios dentro de Chile segun reglas actuales.",
  },
  {
    etiqueta: "Sin retiro",
    descripcion: "Por ahora trabajamos solo con envios, sin retiro fisico.",
  },
  {
    etiqueta: "Invitado",
    descripcion: "Puedes comprar como invitado sin crear cuenta.",
  },
] as const;

export function BloqueConfianzaCheckout() {
  return (
    <Tarjeta
      variante="base"
      etiqueta={<Etiqueta variante="premium">Confianza comercial</Etiqueta>}
      titulo="Compra clara, sin sorpresas"
      descripcion="Condiciones visibles antes de confirmar el pago."
    >
      <ul className="grid gap-3">
        {mensajesConfianza.map((mensaje) => (
          <li
            key={mensaje.etiqueta}
            className="rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/76 px-4 py-4"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              {mensaje.etiqueta}
            </p>
            <p className="text-sm leading-7 text-slate-700">{mensaje.descripcion}</p>
          </li>
        ))}
      </ul>
    </Tarjeta>
  );
}
