export type GrupoEntidadDominioNegocio =
  | "catalogo"
  | "clientes"
  | "operacion-comercial"
  | "configuracion";

export type DescriptorEntidadDominioNegocio = Readonly<{
  codigo: string;
  nombre: string;
  grupo: GrupoEntidadDominioNegocio;
  finalidad: string;
}>;

export const entidadesPrincipalesDominioNegocio: readonly DescriptorEntidadDominioNegocio[] =
  [
    {
      codigo: "categoria-producto",
      nombre: "Categoria de producto",
      grupo: "catalogo",
      finalidad:
        "Organizar el catalogo en una jerarquia flexible, administrable y no amarrada a una sola linea comercial.",
    },
    {
      codigo: "producto",
      nombre: "Producto",
      grupo: "catalogo",
      finalidad:
        "Representar la unidad comercial base del catalogo con identidad, precio base y reglas de venta o cotizacion.",
    },
    {
      codigo: "variante-producto",
      nombre: "Variante de producto",
      grupo: "catalogo",
      finalidad:
        "Resolver combinaciones comerciales como color, peso o formato sin duplicar la entidad producto.",
    },
    {
      codigo: "asignacion-categoria-producto",
      nombre: "Asignacion de categoria",
      grupo: "catalogo",
      finalidad:
        "Permitir que un mismo producto pertenezca a varias categorias y marque una principal cuando corresponda.",
    },
    {
      codigo: "definicion-atributo-producto",
      nombre: "Definicion de atributo de producto",
      grupo: "catalogo",
      finalidad:
        "Definir atributos reutilizables y tipados para distintas lineas del catalogo, sin crear columnas fijas por cada caso.",
    },
    {
      codigo: "opcion-atributo-producto",
      nombre: "Opcion de atributo de producto",
      grupo: "catalogo",
      finalidad:
        "Mantener vocabularios controlados para atributos con opciones predefinidas, como colores o formatos.",
    },
    {
      codigo: "valor-atributo-producto",
      nombre: "Valor de atributo de producto",
      grupo: "catalogo",
      finalidad:
        "Guardar valores concretos de atributos a nivel producto o variante con soporte para informacion tecnica y comercial.",
    },
    {
      codigo: "imagen-producto",
      nombre: "Imagen de producto",
      grupo: "catalogo",
      finalidad:
        "Modelar la galeria visual del catalogo con orden, imagen principal y relacion opcional a variantes.",
    },
    {
      codigo: "compatibilidad-producto-material",
      nombre: "Compatibilidad producto-material",
      grupo: "catalogo",
      finalidad:
        "Expresar compatibilidades tecnicas con materiales como PLA sin reducir el dominio a un booleano aislado.",
    },
    {
      codigo: "cliente",
      nombre: "Cliente",
      grupo: "clientes",
      finalidad:
        "Representar tanto cuentas autenticadas como compras invitadas sin obligar registro para operar el ecommerce.",
    },
    {
      codigo: "direccion-cliente",
      nombre: "Direccion de cliente",
      grupo: "clientes",
      finalidad:
        "Guardar una libreta reutilizable de direcciones del cliente para futuras compras.",
    },
    {
      codigo: "direccion-pedido",
      nombre: "Direccion de pedido",
      grupo: "operacion-comercial",
      finalidad:
        "Persistir la direccion efectiva usada en un pedido como snapshot historico independiente de la libreta del cliente.",
    },
    {
      codigo: "pedido",
      nombre: "Pedido",
      grupo: "operacion-comercial",
      finalidad:
        "Representar la transaccion comercial confirmada con snapshots del cliente, totales y contexto comercial vigente.",
    },
    {
      codigo: "item-pedido",
      nombre: "Item de pedido",
      grupo: "operacion-comercial",
      finalidad:
        "Guardar cada linea del pedido con su precio, atributos y descripcion historica sin depender del catalogo actual.",
    },
    {
      codigo: "cotizacion",
      nombre: "Cotizacion",
      grupo: "operacion-comercial",
      finalidad:
        "Modelar solicitudes comerciales que no pasan por compra directa, alineadas a la regla actual de Rekun LAB.",
    },
    {
      codigo: "item-cotizacion",
      nombre: "Item de cotizacion",
      grupo: "operacion-comercial",
      finalidad:
        "Describir productos o referencias solicitadas dentro de una cotizacion con cantidades y observaciones.",
    },
    {
      codigo: "configuracion-comercial",
      nombre: "Configuracion comercial",
      grupo: "configuracion",
      finalidad:
        "Versionar las reglas de operacion del ecommerce para trazabilidad de pedidos y cotizaciones.",
    },
    {
      codigo: "marca-producto",
      nombre: "Marca de producto",
      grupo: "configuracion",
      finalidad:
        "Normalizar marcas comerciales como catalogo auxiliar administrable y reusable en filtros o formularios.",
    },
    {
      codigo: "nivel-comercial-producto",
      nombre: "Nivel comercial de producto",
      grupo: "configuracion",
      finalidad:
        "Clasificar productos por nivel de uso o mercado sin amarrar el sistema a una sola categoria de producto.",
    },
    {
      codigo: "tecnologia-impresion",
      nombre: "Tecnologia de impresion",
      grupo: "configuracion",
      finalidad:
        "Controlar un vocabulario comun para tecnologias tecnicas de maquinas y futuras lineas del catalogo.",
    },
    {
      codigo: "material",
      nombre: "Material",
      grupo: "configuracion",
      finalidad:
        "Definir materiales compatibles o comercializados por la empresa como catalogo reusable.",
    },
    {
      codigo: "estado-entidad",
      nombre: "Estado por entidad",
      grupo: "configuracion",
      finalidad:
        "Separar estados operativos y comerciales de la informacion principal para no hardcodear flujos en cada entidad.",
    },
  ] as const;
