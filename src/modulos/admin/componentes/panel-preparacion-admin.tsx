import { Etiqueta, Tarjeta } from "@/compartido/componentes/ui";

type ItemPreparacionAdmin = Readonly<{
  titulo: string;
  descripcion: string;
}>;

type PropiedadesPanelPreparacionAdmin = Readonly<{
  etiqueta: string;
  titulo: string;
  descripcion: string;
  items: readonly ItemPreparacionAdmin[];
  variante?: "base" | "elevada" | "oscura";
}>;

export function PanelPreparacionAdmin({
  etiqueta,
  titulo,
  descripcion,
  items,
  variante = "elevada",
}: PropiedadesPanelPreparacionAdmin) {
  return (
    <Tarjeta
      variante={variante}
      etiqueta={
        <Etiqueta variante={variante === "oscura" ? "premium" : "primaria"}>
          {etiqueta}
        </Etiqueta>
      }
      titulo={titulo}
      descripcion={descripcion}
    >
      <ul className="grid gap-3">
        {items.map((item) => (
          <li
            key={item.titulo}
            className="rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/78 px-4 py-4"
          >
            <p className="text-sm font-semibold text-slate-950">{item.titulo}</p>
            <p className="mt-1 text-sm leading-7 text-slate-600">
              {item.descripcion}
            </p>
          </li>
        ))}
      </ul>
    </Tarjeta>
  );
}
