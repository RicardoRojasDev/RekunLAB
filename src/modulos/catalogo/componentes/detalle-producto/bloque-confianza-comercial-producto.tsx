import { Contenedor, Etiqueta } from "@/compartido/componentes/ui";

const itemsConfianzaComercial = [
  {
    titulo: "IVA incluido",
    descripcion: "Todos los precios publicados consideran IVA desde el inicio.",
  },
  {
    titulo: "Despacho en Chile",
    descripcion: "La venta actual contempla envios dentro de Chile, sin retiro fisico.",
  },
  {
    titulo: "Compra flexible",
    descripcion: "La compra como invitado esta contemplada para la experiencia comercial.",
  },
  {
    titulo: "Cotizacion especial",
    descripcion: "Si el requerimiento cambia, la via correcta sigue siendo el formulario de cotizacion.",
  },
] as const;

export function BloqueConfianzaComercialProducto() {
  return (
    <Contenedor etiquetaHtml="section" variante="base">
      <div className="space-y-4">
        <div className="space-y-2">
          <Etiqueta variante="suave">Confianza comercial</Etiqueta>
          <h2 className="text-xl font-semibold text-slate-950">
            Senales claras para reducir friccion antes del checkout
          </h2>
        </div>

        <div className="grid gap-3">
          {itemsConfianzaComercial.map((item) => (
            <div
              key={item.titulo}
              className="rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/72 px-4 py-4"
            >
              <p className="text-sm font-semibold text-slate-900">{item.titulo}</p>
              <p className="mt-1 text-sm leading-7 text-slate-600">
                {item.descripcion}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Contenedor>
  );
}
