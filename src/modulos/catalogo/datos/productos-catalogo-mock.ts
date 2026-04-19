import type {
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

export const productosCatalogoMock: RespuestaCatalogoProductos = [
  {
    id: "filamento-pla-bosque-sur-1kg",
    slug: "filamento-pla-bosque-sur-1kg",
    nombre: "Filamento PLA Bosque Sur 1kg",
    resumen:
      "PLA ecologico con tono mineral profundo, pensado para piezas de uso diario y prototipos de terminacion limpia.",
    categoria: "Filamento PLA ecologico",
    tipoProducto: "Consumible",
    coleccion: "Bosque Sur",
    precioIvaIncluido: 24990,
    imagen: crearImagenProducto(
      "/imagenes/mock/productos/filamento-bosque-sur.svg",
      "Vista mock del producto Filamento PLA Bosque Sur 1kg",
    ),
    descripcion:
      "Filamento PLA con expresion visual mineral y enfoque sustentable, pensado para prototipos, piezas decorativas y componentes de uso diario donde importa tanto la lectura del color como la estabilidad del resultado. Su presencia sobria dialoga bien con piezas tecnicas, objetos editoriales y series cortas con identidad de marca.",
    imagenesGaleria: crearGaleriaProducto(
      "/imagenes/mock/productos/filamento-bosque-sur.svg",
      "Filamento PLA Bosque Sur 1kg",
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
        valor: "Mate mineral",
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
        valor: "Sistema modular para escritorio",
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
        etiqueta: "Uso recomendado",
        valor: "Orden, exhibicion y almacenaje ligero",
      },
      {
        etiqueta: "Lenguaje visual",
        valor: "Tecnico, limpio y premium",
      },
    ],
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
