import type { RespuestaCatalogoProductos } from "../tipos/producto-catalogo";

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
    imagen: {
      src: "/imagenes/mock/productos/filamento-bosque-sur.svg",
      alt: "Vista mock del producto Filamento PLA Bosque Sur 1kg",
      ancho: 800,
      alto: 960,
    },
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
    imagen: {
      src: "/imagenes/mock/productos/filamento-arena-atacama.svg",
      alt: "Vista mock del producto Filamento PLA Arena Atacama 1kg",
      ancho: 800,
      alto: 960,
    },
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
    imagen: {
      src: "/imagenes/mock/productos/impresora-estudio-r1.svg",
      alt: "Vista mock de la Impresora 3D Estudio R1",
      ancho: 800,
      alto: 960,
    },
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
    imagen: {
      src: "/imagenes/mock/productos/secador-airloop.svg",
      alt: "Vista mock del secador de filamento AirLoop",
      ancho: 800,
      alto: 960,
    },
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
    imagen: {
      src: "/imagenes/mock/productos/organizador-rekun-grid.svg",
      alt: "Vista mock del organizador modular Rekun Grid",
      ancho: 800,
      alto: 960,
    },
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
    imagen: {
      src: "/imagenes/mock/productos/soporte-vertical-nativa.svg",
      alt: "Vista mock del soporte vertical Nativa Dock",
      ancho: 800,
      alto: 960,
    },
    etiquetasComerciales: ["Textura premium", "Escritorio", "Serie corta"],
  },
] as const;
