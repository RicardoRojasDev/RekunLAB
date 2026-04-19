export type DestinoModeladoCampoDominioNegocio =
  | "columna-propia"
  | "relacion-separada"
  | "metadato-extensible"
  | "catalogo-auxiliar";

export type DecisionCampoCatalogoInicialDominioNegocio = Readonly<{
  campoOrigen: string;
  destinoModelado: DestinoModeladoCampoDominioNegocio;
  destinoEntidad: string;
  justificacion: string;
}>;

export const criteriosModeladoDominioNegocio = [
  {
    destinoModelado: "columna-propia" as const,
    criterio:
      "Se usa para datos nucleares, atomicos y de consulta frecuente que definen identidad o precio del producto.",
    ejemplos: ["nombre", "slug", "skuBase", "modeloComercial", "precioBaseIvaIncluido"],
  },
  {
    destinoModelado: "relacion-separada" as const,
    criterio:
      "Se usa cuando el dato tiene cardinalidad multiple, ciclo de vida propio o debe conservarse historicamente sin duplicacion.",
    ejemplos: ["categorias", "imagenes", "itemsPedido", "direcciones", "compatibilidadesMateriales"],
  },
  {
    destinoModelado: "metadato-extensible" as const,
    criterio:
      "Se usa para datos especificos de una linea de producto que no justifican una columna fija mientras no se estabilicen.",
    ejemplos: ["certificaciones", "areaImpresion", "consumoEnergetico", "notasTecnicasProveedor"],
  },
  {
    destinoModelado: "catalogo-auxiliar" as const,
    criterio:
      "Se usa para vocabularios controlados que deben ser administrables y reutilizables en filtros, badges y formularios.",
    ejemplos: ["marca", "nivelComercial", "tecnologiaImpresion", "estadoEntidad"],
  },
] as const;

export const decisionesCatalogoInicialRealDominioNegocio: readonly DecisionCampoCatalogoInicialDominioNegocio[] =
  [
    {
      campoOrigen: "categoria",
      destinoModelado: "relacion-separada",
      destinoEntidad: "asignacion-categoria-producto",
      justificacion:
        "Un producto puede vivir en mas de una categoria y la categoria debe administrarse libremente desde panel.",
    },
    {
      campoOrigen: "nivel",
      destinoModelado: "catalogo-auxiliar",
      destinoEntidad: "nivel-comercial-producto",
      justificacion:
        "Es un vocabulario controlado reusable en filtros y merchandising, pero no debe rigidizar todas las lineas futuras.",
    },
    {
      campoOrigen: "nombreProducto",
      destinoModelado: "columna-propia",
      destinoEntidad: "producto.nombre",
      justificacion:
        "Es parte central de la identidad comercial del producto y debe estar disponible para busqueda, SEO y UI.",
    },
    {
      campoOrigen: "marca",
      destinoModelado: "catalogo-auxiliar",
      destinoEntidad: "marca-producto",
      justificacion:
        "La marca se repite entre multiples productos y conviene normalizarla para filtros, consistencia y administracion.",
    },
    {
      campoOrigen: "modelo",
      destinoModelado: "columna-propia",
      destinoEntidad: "producto.modeloComercial",
      justificacion:
        "El modelo identifica una referencia concreta del producto y suele ser un dato singular por SKU.",
    },
    {
      campoOrigen: "precioCLP",
      destinoModelado: "columna-propia",
      destinoEntidad: "producto.precioBaseIvaIncluido",
      justificacion:
        "Es un dato comercial critico de lectura frecuente y debe quedar listo para ordenamiento, resumen y snapshots.",
    },
    {
      campoOrigen: "tipoImpresion",
      destinoModelado: "catalogo-auxiliar",
      destinoEntidad: "tecnologia-impresion",
      justificacion:
        "Representa una clasificacion controlada que puede reutilizarse en otras maquinas o futuras lineas tecnicas.",
    },
    {
      campoOrigen: "compatiblePLA",
      destinoModelado: "relacion-separada",
      destinoEntidad: "compatibilidad-producto-material",
      justificacion:
        "No debe quedar como booleano fijo porque en el futuro un producto puede soportar multiples materiales.",
    },
    {
      campoOrigen: "estado",
      destinoModelado: "catalogo-auxiliar",
      destinoEntidad: "estado-entidad",
      justificacion:
        "Los estados cambian por entidad y por flujo; separarlos evita hardcodear reglas en la tabla principal.",
    },
  ] as const;
