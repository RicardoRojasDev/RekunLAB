import type {
  ConfiguracionVariantesProductoCatalogo,
  ImagenProductoCatalogo,
  ImagenGaleriaProductoCatalogo,
  RespuestaCatalogoProductos,
} from "../tipos/producto-catalogo";

function crearImagenProducto(
  src: string,
  alt: string,
): ImagenProductoCatalogo {
  return {
    src,
    alt,
    ancho: 800,
    alto: 960,
  };
}

function crearGaleriaProducto(
  src: string,
  nombreProducto: string,
): readonly ImagenGaleriaProductoCatalogo[] {
  return [
    {
      ...crearImagenProducto(
        src,
        `Vista principal mock de ${nombreProducto}`,
      ),
      etiqueta: "Vista principal",
      posicionObjeto: "center 46%",
    },
    {
      ...crearImagenProducto(
        src,
        `Detalle de materialidad mock de ${nombreProducto}`,
      ),
      etiqueta: "Detalle de material",
      posicionObjeto: "center 24%",
    },
    {
      ...crearImagenProducto(
        src,
        `Contexto visual mock de ${nombreProducto}`,
      ),
      etiqueta: "Contexto de uso",
      posicionObjeto: "center 74%",
    },
  ] as const;
}

function crearConfiguracionVariantesFilamentoSpectrum(): ConfiguracionVariantesProductoCatalogo {
  return {
    variantePorDefectoId: "var-filamento-spectrum-bosque-sur-750g",
    atributos: [
      {
        codigo: "color",
        etiqueta: "Color",
        tipoPresentacion: "color",
        opciones: [
          {
            id: "bosque-sur",
            etiqueta: "Bosque Sur",
            valor: "Bosque Sur",
            colorHex: "#0D7C66",
          },
          {
            id: "niebla-litoral",
            etiqueta: "Niebla Litoral",
            valor: "Niebla Litoral",
            colorHex: "#C6D5D8",
          },
          {
            id: "grafito-patagonia",
            etiqueta: "Grafito Patagonia",
            valor: "Grafito Patagonia",
            colorHex: "#2C3338",
          },
        ],
      },
      {
        codigo: "peso",
        etiqueta: "Peso",
        tipoPresentacion: "texto",
        opciones: [
          {
            id: "750g",
            etiqueta: "750 g",
            valor: "750 g",
          },
          {
            id: "1kg",
            etiqueta: "1 kg",
            valor: "1 kg",
          },
        ],
      },
    ],
    variantes: [
      {
        id: "var-filamento-spectrum-bosque-sur-750g",
        codigoReferencia: "RKL-PLA-SPC-BOS-750",
        etiqueta: "Bosque Sur / 750 g",
        precioIvaIncluido: 19990,
        selecciones: {
          color: "bosque-sur",
          peso: "750g",
        },
        imagen: crearImagenProducto(
          "/imagenes/mock/productos/filamento-bosque-sur.svg",
          "Vista mock de la variante Bosque Sur 750 g de Filamento PLA Rekun Spectrum",
        ),
        imagenesGaleria: crearGaleriaProducto(
          "/imagenes/mock/productos/filamento-bosque-sur.svg",
          "Filamento PLA Rekun Spectrum Bosque Sur",
        ),
        especificacionesComplementarias: [
          {
            etiqueta: "Color",
            valor: "Bosque Sur",
          },
          {
            etiqueta: "Formato",
            valor: "Bobina de 750 g",
          },
        ],
      },
      {
        id: "var-filamento-spectrum-bosque-sur-1kg",
        codigoReferencia: "RKL-PLA-SPC-BOS-1000",
        etiqueta: "Bosque Sur / 1 kg",
        precioIvaIncluido: 24990,
        selecciones: {
          color: "bosque-sur",
          peso: "1kg",
        },
        imagen: crearImagenProducto(
          "/imagenes/mock/productos/filamento-bosque-sur.svg",
          "Vista mock de la variante Bosque Sur 1 kg de Filamento PLA Rekun Spectrum",
        ),
        imagenesGaleria: crearGaleriaProducto(
          "/imagenes/mock/productos/filamento-bosque-sur.svg",
          "Filamento PLA Rekun Spectrum Bosque Sur",
        ),
        especificacionesComplementarias: [
          {
            etiqueta: "Color",
            valor: "Bosque Sur",
          },
          {
            etiqueta: "Formato",
            valor: "Bobina de 1 kg",
          },
        ],
      },
      {
        id: "var-filamento-spectrum-niebla-750g",
        codigoReferencia: "RKL-PLA-SPC-NIE-750",
        etiqueta: "Niebla Litoral / 750 g",
        precioIvaIncluido: 20990,
        selecciones: {
          color: "niebla-litoral",
          peso: "750g",
        },
        imagen: crearImagenProducto(
          "/imagenes/mock/productos/filamento-niebla-litoral.svg",
          "Vista mock de la variante Niebla Litoral 750 g de Filamento PLA Rekun Spectrum",
        ),
        imagenesGaleria: crearGaleriaProducto(
          "/imagenes/mock/productos/filamento-niebla-litoral.svg",
          "Filamento PLA Rekun Spectrum Niebla Litoral",
        ),
        especificacionesComplementarias: [
          {
            etiqueta: "Color",
            valor: "Niebla Litoral",
          },
          {
            etiqueta: "Formato",
            valor: "Bobina de 750 g",
          },
        ],
      },
      {
        id: "var-filamento-spectrum-niebla-1kg",
        codigoReferencia: "RKL-PLA-SPC-NIE-1000",
        etiqueta: "Niebla Litoral / 1 kg",
        precioIvaIncluido: 25990,
        selecciones: {
          color: "niebla-litoral",
          peso: "1kg",
        },
        imagen: crearImagenProducto(
          "/imagenes/mock/productos/filamento-niebla-litoral.svg",
          "Vista mock de la variante Niebla Litoral 1 kg de Filamento PLA Rekun Spectrum",
        ),
        imagenesGaleria: crearGaleriaProducto(
          "/imagenes/mock/productos/filamento-niebla-litoral.svg",
          "Filamento PLA Rekun Spectrum Niebla Litoral",
        ),
        especificacionesComplementarias: [
          {
            etiqueta: "Color",
            valor: "Niebla Litoral",
          },
          {
            etiqueta: "Formato",
            valor: "Bobina de 1 kg",
          },
        ],
      },
      {
        id: "var-filamento-spectrum-grafito-750g",
        codigoReferencia: "RKL-PLA-SPC-GRA-750",
        etiqueta: "Grafito Patagonia / 750 g",
        precioIvaIncluido: 21990,
        selecciones: {
          color: "grafito-patagonia",
          peso: "750g",
        },
        imagen: crearImagenProducto(
          "/imagenes/mock/productos/filamento-grafito-patagonia.svg",
          "Vista mock de la variante Grafito Patagonia 750 g de Filamento PLA Rekun Spectrum",
        ),
        imagenesGaleria: crearGaleriaProducto(
          "/imagenes/mock/productos/filamento-grafito-patagonia.svg",
          "Filamento PLA Rekun Spectrum Grafito Patagonia",
        ),
        especificacionesComplementarias: [
          {
            etiqueta: "Color",
            valor: "Grafito Patagonia",
          },
          {
            etiqueta: "Formato",
            valor: "Bobina de 750 g",
          },
        ],
      },
      {
        id: "var-filamento-spectrum-grafito-1kg",
        codigoReferencia: "RKL-PLA-SPC-GRA-1000",
        etiqueta: "Grafito Patagonia / 1 kg",
        precioIvaIncluido: 26990,
        selecciones: {
          color: "grafito-patagonia",
          peso: "1kg",
        },
        imagen: crearImagenProducto(
          "/imagenes/mock/productos/filamento-grafito-patagonia.svg",
          "Vista mock de la variante Grafito Patagonia 1 kg de Filamento PLA Rekun Spectrum",
        ),
        imagenesGaleria: crearGaleriaProducto(
          "/imagenes/mock/productos/filamento-grafito-patagonia.svg",
          "Filamento PLA Rekun Spectrum Grafito Patagonia",
        ),
        especificacionesComplementarias: [
          {
            etiqueta: "Color",
            valor: "Grafito Patagonia",
          },
          {
            etiqueta: "Formato",
            valor: "Bobina de 1 kg",
          },
        ],
      },
    ],
  };
}

function crearConfiguracionVariantesOrganizadorGrid(): ConfiguracionVariantesProductoCatalogo {
  return {
    variantePorDefectoId: "var-organizador-grid-grafito-simple",
    atributos: [
      {
        codigo: "color",
        etiqueta: "Color",
        tipoPresentacion: "color",
        opciones: [
          {
            id: "grafito-mineral",
            etiqueta: "Grafito Mineral",
            valor: "Grafito Mineral",
            colorHex: "#26312E",
          },
          {
            id: "arena-reciclada",
            etiqueta: "Arena Reciclada",
            valor: "Arena Reciclada",
            colorHex: "#CFA66A",
          },
        ],
      },
      {
        codigo: "formato",
        etiqueta: "Formato",
        tipoPresentacion: "texto",
        opciones: [
          {
            id: "modulo-simple",
            etiqueta: "Modulo simple",
            valor: "Modulo simple",
            descripcion: "Una unidad modular",
          },
          {
            id: "set-x3",
            etiqueta: "Set x3",
            valor: "Set x3",
            descripcion: "Trio listo para escritorio",
          },
        ],
      },
    ],
    variantes: [
      {
        id: "var-organizador-grid-grafito-simple",
        codigoReferencia: "RKL-GRD-GRA-UNI",
        etiqueta: "Grafito Mineral / Modulo simple",
        precioIvaIncluido: 31990,
        selecciones: {
          color: "grafito-mineral",
          formato: "modulo-simple",
        },
        imagen: crearImagenProducto(
          "/imagenes/mock/productos/organizador-rekun-grid.svg",
          "Vista mock de la variante Grafito Mineral del Organizador modular Rekun Grid",
        ),
        imagenesGaleria: crearGaleriaProducto(
          "/imagenes/mock/productos/organizador-rekun-grid.svg",
          "Organizador modular Rekun Grid Grafito Mineral",
        ),
        especificacionesComplementarias: [
          {
            etiqueta: "Color",
            valor: "Grafito Mineral",
          },
          {
            etiqueta: "Formato",
            valor: "Modulo simple",
          },
        ],
      },
      {
        id: "var-organizador-grid-grafito-setx3",
        codigoReferencia: "RKL-GRD-GRA-SET3",
        etiqueta: "Grafito Mineral / Set x3",
        precioIvaIncluido: 82990,
        selecciones: {
          color: "grafito-mineral",
          formato: "set-x3",
        },
        imagen: crearImagenProducto(
          "/imagenes/mock/productos/organizador-rekun-grid.svg",
          "Vista mock de la variante Grafito Mineral Set x3 del Organizador modular Rekun Grid",
        ),
        imagenesGaleria: crearGaleriaProducto(
          "/imagenes/mock/productos/organizador-rekun-grid.svg",
          "Organizador modular Rekun Grid Grafito Mineral",
        ),
        especificacionesComplementarias: [
          {
            etiqueta: "Color",
            valor: "Grafito Mineral",
          },
          {
            etiqueta: "Formato",
            valor: "Set x3",
          },
        ],
      },
      {
        id: "var-organizador-grid-arena-simple",
        codigoReferencia: "RKL-GRD-ARE-UNI",
        etiqueta: "Arena Reciclada / Modulo simple",
        precioIvaIncluido: 33990,
        selecciones: {
          color: "arena-reciclada",
          formato: "modulo-simple",
        },
        imagen: crearImagenProducto(
          "/imagenes/mock/productos/organizador-rekun-grid-arena.svg",
          "Vista mock de la variante Arena Reciclada del Organizador modular Rekun Grid",
        ),
        imagenesGaleria: crearGaleriaProducto(
          "/imagenes/mock/productos/organizador-rekun-grid-arena.svg",
          "Organizador modular Rekun Grid Arena Reciclada",
        ),
        especificacionesComplementarias: [
          {
            etiqueta: "Color",
            valor: "Arena Reciclada",
          },
          {
            etiqueta: "Formato",
            valor: "Modulo simple",
          },
        ],
      },
    ],
  };
}

export const productosCatalogoMock: RespuestaCatalogoProductos = [
  {
    id: "filamento-pla-rekun-spectrum",
    slug: "filamento-pla-rekun-spectrum",
    nombre: "Filamento PLA Rekun Spectrum",
    resumen:
      "Familia de filamentos PLA con variantes de color y peso pensadas para prototipos, piezas de uso diario y produccion visual cuidada.",
    categoria: "Filamento PLA ecologico",
    tipoProducto: "Consumible",
    coleccion: "Spectrum Circular",
    precioIvaIncluido: 19990,
    imagen: crearImagenProducto(
      "/imagenes/mock/productos/filamento-bosque-sur.svg",
      "Vista mock del producto Filamento PLA Rekun Spectrum",
    ),
    descripcion:
      "Linea de filamento PLA creada para dar libertad de eleccion en color y formato sin separar cada combinacion en un producto distinto. La estructura esta pensada para crecer a futuro con nuevas formulaciones, pesos y acabados, manteniendo una experiencia comercial clara y un modelo de datos listo para integracion real.",
    imagenesGaleria: crearGaleriaProducto(
      "/imagenes/mock/productos/filamento-bosque-sur.svg",
      "Filamento PLA Rekun Spectrum",
    ),
    especificaciones: [
      {
        etiqueta: "Formato",
        valor: "Variable segun variante",
      },
      {
        etiqueta: "Material",
        valor: "PLA ecologico",
      },
      {
        etiqueta: "Color",
        valor: "Variable segun variante",
      },
      {
        etiqueta: "Uso recomendado",
        valor: "Prototipos y piezas de uso diario",
      },
      {
        etiqueta: "Compatibilidad",
        valor: "Impresoras FDM configuradas para PLA",
      },
    ],
    configuracionVariantes: crearConfiguracionVariantesFilamentoSpectrum(),
    etiquetasComerciales: ["Reciclado", "Baja deformacion", "Uso diario"],
  },
  {
    id: "filamento-pla-arena-atacama-1kg",
    slug: "filamento-pla-arena-atacama-1kg",
    nombre: "Filamento PLA Arena Atacama 1kg",
    resumen:
      "Formula PLA con acabado mate y lectura cromatica calida para piezas visuales, maquetas y objetos editoriales.",
    categoria: "Filamento PLA ecologico",
    tipoProducto: "Consumible",
    coleccion: "Materia Circular",
    precioIvaIncluido: 25990,
    imagen: crearImagenProducto(
      "/imagenes/mock/productos/filamento-arena-atacama.svg",
      "Vista mock del producto Filamento PLA Arena Atacama 1kg",
    ),
    descripcion:
      "Esta variante de PLA privilegia una textura mate y una temperatura visual mas calida para piezas que necesitan verse editoriales, pulcras y controladas. Funciona especialmente bien en maquetas, objetos para showroom, prototipos de presentacion y pequenas series donde la narrativa material acompana el producto final.",
    imagenesGaleria: crearGaleriaProducto(
      "/imagenes/mock/productos/filamento-arena-atacama.svg",
      "Filamento PLA Arena Atacama 1kg",
    ),
    especificaciones: [
      {
        etiqueta: "Formato",
        valor: "Bobina de 1 kg",
      },
      {
        etiqueta: "Material",
        valor: "PLA ecologico",
      },
      {
        etiqueta: "Acabado visual",
        valor: "Mate calido",
      },
      {
        etiqueta: "Aplicacion ideal",
        valor: "Maquetas y objetos editoriales",
      },
      {
        etiqueta: "Compatibilidad",
        valor: "Impresoras FDM configuradas para PLA",
      },
    ],
    etiquetasComerciales: ["Acabado mate", "Precision", "Edicion color"],
  },
  {
    id: "impresora-3d-estudio-r1",
    slug: "impresora-3d-estudio-r1",
    nombre: "Impresora 3D Estudio R1",
    resumen:
      "Equipo FDM de escritorio con lectura visual sobria, pensado para talleres pequenos, estudio y validacion de producto.",
    categoria: "Maquinas 3D",
    tipoProducto: "Maquina",
    coleccion: "Linea Estudio",
    precioIvaIncluido: 649990,
    imagen: crearImagenProducto(
      "/imagenes/mock/productos/impresora-estudio-r1.svg",
      "Vista mock de la Impresora 3D Estudio R1",
    ),
    descripcion:
      "Impresora 3D de escritorio enfocada en estudio, taller pequeno y validacion temprana de producto. La propuesta prioriza una presencia limpia, una lectura tecnica amigable y una posicion comercial clara para quienes necesitan fabricar prototipos funcionales sin saltar de inmediato a una plataforma industrial.",
    imagenesGaleria: crearGaleriaProducto(
      "/imagenes/mock/productos/impresora-estudio-r1.svg",
      "Impresora 3D Estudio R1",
    ),
    especificaciones: [
      {
        etiqueta: "Tecnologia",
        valor: "Impresion FDM de escritorio",
      },
      {
        etiqueta: "Escenario de uso",
        valor: "Estudio, taller pequeno y validacion visual",
      },
      {
        etiqueta: "Perfil de usuario",
        valor: "Equipos creativos y makers en crecimiento",
      },
      {
        etiqueta: "Posicionamiento",
        valor: "Prototipado y series cortas",
      },
      {
        etiqueta: "Cobertura comercial",
        valor: "Venta solo en Chile",
      },
    ],
    etiquetasComerciales: ["Nueva", "Calibracion asistida", "Volumen medio"],
  },
  {
    id: "secador-filamento-airloop",
    slug: "secador-filamento-airloop",
    nombre: "Secador de filamento AirLoop",
    resumen:
      "Accesorio de soporte para estabilizar humedad del material y proteger consistencia en jornadas largas de impresion.",
    categoria: "Accesorios de impresion",
    tipoProducto: "Accesorio",
    precioIvaIncluido: 89990,
    imagen: crearImagenProducto(
      "/imagenes/mock/productos/secador-airloop.svg",
      "Vista mock del secador de filamento AirLoop",
    ),
    descripcion:
      "Accesorio pensado para mantener el material en mejores condiciones de trabajo durante sesiones largas o contextos con humedad variable. Aporta orden operativo y reduce fricciones del flujo diario, especialmente cuando el filamento es parte critica de la consistencia visual y dimensional del resultado.",
    imagenesGaleria: crearGaleriaProducto(
      "/imagenes/mock/productos/secador-airloop.svg",
      "Secador de filamento AirLoop",
    ),
    especificaciones: [
      {
        etiqueta: "Funcion principal",
        valor: "Apoyo para control de humedad del filamento",
      },
      {
        etiqueta: "Categoria",
        valor: "Accesorio de impresion",
      },
      {
        etiqueta: "Uso recomendado",
        valor: "Jornadas largas y materiales sensibles",
      },
      {
        etiqueta: "Compatibilidad",
        valor: "Bobinas de filamento de uso comun",
      },
      {
        etiqueta: "Enfoque",
        valor: "Continuidad operativa y cuidado del material",
      },
    ],
    etiquetasComerciales: ["Produccion", "Cuidado de material", "Compatibilidad amplia"],
  },
  {
    id: "organizador-modular-rekun-grid",
    slug: "organizador-modular-rekun-grid",
    nombre: "Organizador modular Rekun Grid",
    resumen:
      "Sistema modular impreso para escritorio, empaque interno o almacenaje ligero con lenguaje tecnico y tacto premium.",
    categoria: "Objetos impresos",
    tipoProducto: "Objeto impreso",
    coleccion: "Circular Living",
    precioIvaIncluido: 31990,
    imagen: crearImagenProducto(
      "/imagenes/mock/productos/organizador-rekun-grid.svg",
      "Vista mock del organizador modular Rekun Grid",
    ),
    descripcion:
      "Objeto impreso modular pensado para ordenar superficies, exhibicion ligera o apoyo logistico de escritorio. La geometria busca una lectura premium y util, con posibilidad de convivir tanto en contextos creativos como en ambientes de marca, estudio o empaque interno.",
    imagenesGaleria: crearGaleriaProducto(
      "/imagenes/mock/productos/organizador-rekun-grid.svg",
      "Organizador modular Rekun Grid",
    ),
    especificaciones: [
      {
        etiqueta: "Formato",
        valor: "Variable segun variante",
      },
      {
        etiqueta: "Material",
        valor: "PLA ecologico",
      },
      {
        etiqueta: "Color",
        valor: "Variable segun variante",
      },
      {
        etiqueta: "Uso recomendado",
        valor: "Orden, exhibicion y almacenaje ligero",
      },
      {
        etiqueta: "Lenguaje visual",
        valor: "Tecnico, limpio y premium",
      },
    ],
    configuracionVariantes: crearConfiguracionVariantesOrganizadorGrid(),
    etiquetasComerciales: ["Material reciclado", "Modular", "Edicion taller"],
  },
  {
    id: "soporte-vertical-nativa-dock",
    slug: "soporte-vertical-nativa-dock",
    nombre: "Soporte vertical Nativa Dock",
    resumen:
      "Soporte impreso para escritorio con presencia escultorica, pensado para orden visual y aprovecho eficiente de superficie.",
    categoria: "Objetos impresos",
    tipoProducto: "Objeto impreso",
    coleccion: "Circular Living",
    precioIvaIncluido: 28990,
    imagen: crearImagenProducto(
      "/imagenes/mock/productos/soporte-vertical-nativa.svg",
      "Vista mock del soporte vertical Nativa Dock",
    ),
    descripcion:
      "Soporte de escritorio con gesto escultorico, pensado para despejar superficie y aportar una lectura de orden intencional. Su valor esta tanto en la utilidad como en la presencia visual, por eso funciona bien en escritorios de trabajo, recepciones creativas y espacios donde el objeto tambien comunica criterio.",
    imagenesGaleria: crearGaleriaProducto(
      "/imagenes/mock/productos/soporte-vertical-nativa.svg",
      "Soporte vertical Nativa Dock",
    ),
    especificaciones: [
      {
        etiqueta: "Formato",
        valor: "Soporte vertical para escritorio",
      },
      {
        etiqueta: "Material",
        valor: "PLA ecologico",
      },
      {
        etiqueta: "Coleccion",
        valor: "Circular Living",
      },
      {
        etiqueta: "Aplicacion",
        valor: "Orden visual y uso eficiente de superficie",
      },
      {
        etiqueta: "Expresion formal",
        valor: "Escultorica y sobria",
      },
    ],
    etiquetasComerciales: ["Textura premium", "Escritorio", "Serie corta"],
  },
] as const;
