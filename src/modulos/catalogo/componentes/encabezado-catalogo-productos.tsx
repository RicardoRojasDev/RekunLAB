import { Contenedor } from "@/compartido/componentes/ui/contenedor";
import { Etiqueta } from "@/compartido/componentes/ui/etiqueta";

type PropiedadesEncabezadoCatalogoProductos = Readonly<{
  cantidadProductos: number;
  cantidadCategorias: number;
  cantidadColecciones: number;
}>;

const pilaresCatalogo = [
  "Solo Chile",
  "Precios con IVA incluido",
  "Datos mock desacoplados",
] as const;

export function EncabezadoCatalogoProductos({
  cantidadProductos,
  cantidadCategorias,
  cantidadColecciones,
}: PropiedadesEncabezadoCatalogoProductos) {
  const resumenCatalogo = [
    {
      etiqueta: "Productos",
      valor: cantidadProductos.toString().padStart(2, "0"),
    },
    {
      etiqueta: "Categorias",
      valor: cantidadCategorias.toString().padStart(2, "0"),
    },
    {
      etiqueta: "Colecciones",
      valor: cantidadColecciones.toString().padStart(2, "0"),
    },
    {
      etiqueta: "Cobertura",
      valor: "Chile",
    },
  ] as const;

  return (
    <header className="grid gap-4 xl:grid-cols-[1.12fr_0.88fr]">
      <Contenedor variante="oscuro" relleno="lg">
        <div className="flex h-full flex-col gap-6">
          <div className="flex flex-wrap gap-2">
            <Etiqueta variante="oscura">Catalogo visual</Etiqueta>
            <Etiqueta variante="premium">Frontend listo para datos reales</Etiqueta>
          </div>

          <div className="space-y-4">
            <h1
              id="titulo-catalogo-productos"
              className="titulo-display max-w-4xl text-white"
            >
              Productos con presencia premium, estructura limpia y base lista
              para integracion real
            </h1>

            <p className="max-w-3xl text-base leading-8 text-white/70 sm:text-[1.05rem]">
              El catalogo nace con una grilla comercial flexible, imagenes mock
              bien modeladas y una capa de servicio separada para reemplazar la
              fuente sin rehacer la experiencia.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {pilaresCatalogo.map((pilar) => (
              <Etiqueta key={pilar} variante="oscura" tamanio="sm">
                {pilar}
              </Etiqueta>
            ))}
          </div>
        </div>
      </Contenedor>

      <Contenedor variante="elevado" relleno="lg">
        <div className="space-y-6">
          <div className="space-y-3">
            <Etiqueta variante="primaria">Resumen comercial</Etiqueta>
            <h2 className="titulo-seccion text-slate-950">
              Base visual pensada para crecer sin rehacer tarjetas ni fuentes
              de datos
            </h2>
            <p className="texto-soporte">
              La pagina ya diferencia dominio, mocks y componentes para que
              filtros, detalle, carrito o integracion real entren despues sobre
              una base estable.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {resumenCatalogo.map((item) => (
              <div
                key={item.etiqueta}
                className="rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/76 px-4 py-4"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {item.etiqueta}
                </p>
                <p className="mt-2 font-[var(--fuente-titulos)] text-3xl font-semibold tracking-[-0.04em] text-slate-950">
                  {item.valor}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Contenedor>
    </header>
  );
}
