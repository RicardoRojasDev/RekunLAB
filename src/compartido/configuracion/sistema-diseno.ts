export const narrativaSistemaDiseno = {
  identidad:
    "La identidad visual de Rekun LAB combina tecnologia aplicada, manufactura precisa y una lectura sustentable sin caer en recursos genericos de color verde brillante o interfaces de laboratorio esteril.",
  direccion:
    "La base premium se apoya en verdes minerales profundos, grafitos tecnicos, neutros piedra y acentos metalicos calidos que aportan sofisticacion y memoria visual.",
} as const;

export const gruposPaletaSistemaDiseno = [
  {
    nombre: "Primario",
    descripcion:
      "Verdes minerales para marca, acciones principales y senales de confianza.",
    muestras: [
      {
        nombre: "Primario 900",
        token: "--color-primario-900",
        valor: "#0b322e",
        uso: "Bloques oscuros, fondos de alto contraste y presencia de marca.",
      },
      {
        nombre: "Primario 500",
        token: "--color-primario-500",
        valor: "#0d7c66",
        uso: "Accion principal, enlaces destacados y foco de navegacion.",
      },
      {
        nombre: "Primario 100",
        token: "--color-primario-100",
        valor: "#d5f3ea",
        uso: "Fondos suaves, resaltados y capas de apoyo.",
      },
    ],
  },
  {
    nombre: "Secundario",
    descripcion:
      "Grafitos tecnicos para balancear la interfaz y reforzar sobriedad.",
    muestras: [
      {
        nombre: "Secundario 900",
        token: "--color-secundario-900",
        valor: "#131b1f",
        uso: "Titulares sobre fondos claros y bloques de contraste medio.",
      },
      {
        nombre: "Secundario 500",
        token: "--color-secundario-500",
        valor: "#50606a",
        uso: "Texto estructural, iconografia y estados neutrales.",
      },
      {
        nombre: "Secundario 100",
        token: "--color-secundario-100",
        valor: "#e1e6e8",
        uso: "Divisores, fondos secundarios y superficies tecnicas claras.",
      },
    ],
  },
  {
    nombre: "Neutro",
    descripcion:
      "Base piedra para fondos, superficies y respiracion visual del sistema.",
    muestras: [
      {
        nombre: "Neutro 0",
        token: "--color-neutral-0",
        valor: "#ffffff",
        uso: "Superficies elevadas, paneles y capas de maxima legibilidad.",
      },
      {
        nombre: "Neutro 100",
        token: "--color-neutral-100",
        valor: "#eef3ef",
        uso: "Canvas general del ecommerce y fondos extendidos.",
      },
      {
        nombre: "Neutro 700",
        token: "--color-neutral-700",
        valor: "#4e5a56",
        uso: "Texto de apoyo, microcopy y contrastes suaves.",
      },
    ],
  },
  {
    nombre: "Acento",
    descripcion:
      "Acentos metalicos y organicos para remarcar precision, valor y energia.",
    muestras: [
      {
        nombre: "Acento 500",
        token: "--color-acento-500",
        valor: "#b38631",
        uso: "Highlights premium, badges y detalles de valor agregado.",
      },
      {
        nombre: "Acento vivo",
        token: "--color-acento-vivo",
        valor: "#c9f36a",
        uso: "Microdestellos de tecnologia limpia y estados puntuales.",
      },
      {
        nombre: "Acento 100",
        token: "--color-acento-100",
        valor: "#f4edd3",
        uso: "Fondos suaves de apoyo y bloques secundarios destacados.",
      },
    ],
  },
] as const;

export const escalaTipograficaSistemaDiseno = [
  {
    nombre: "Display",
    claseVista: "titulo-display",
    muestra: "Tecnologia circular con presencia premium",
    uso: "Hero principal, titulares de campana y mensajes de alto impacto.",
  },
  {
    nombre: "Titulo de seccion",
    claseVista: "titulo-seccion",
    muestra: "Sistema de diseno para escalar el ecommerce",
    uso: "Bloques editoriales, secciones destacadas y encabezados principales.",
  },
  {
    nombre: "Texto destacado",
    claseVista: "texto-destacado",
    muestra: "Base visual premium, tecnica y sustentable.",
    uso: "Parrafos introductorios, mensajes comerciales y resaltes narrativos.",
  },
  {
    nombre: "Texto soporte",
    claseVista: "texto-soporte",
    muestra: "Los textos de apoyo priorizan claridad, aire y lectura sostenida.",
    uso: "Explicaciones, ayudas contextuales y contenido secundario.",
  },
  {
    nombre: "Etiqueta tecnica",
    claseVista: "etiqueta-tecnica",
    muestra: "Token reusable",
    uso: "Badges, categorias, microestados y etiquetas de contexto.",
  },
] as const;

export const escalaEspaciadosSistemaDiseno = [
  { nombre: "2XS", token: "--espacio-2xs", valor: "0.5rem", uso: "Iconos y separaciones minimas." },
  { nombre: "XS", token: "--espacio-xs", valor: "0.75rem", uso: "Badges, chips y microcomponentes." },
  { nombre: "SM", token: "--espacio-sm", valor: "1rem", uso: "Paddings compactos y stacks cortos." },
  { nombre: "MD", token: "--espacio-md", valor: "1.5rem", uso: "Tarjetas, bloques de contenido y modulos base." },
  { nombre: "LG", token: "--espacio-lg", valor: "2rem", uso: "Separacion entre secciones de densidad media." },
  { nombre: "XL", token: "--espacio-xl", valor: "3rem", uso: "Heroes, cortes visuales y respiracion principal." },
] as const;

export const escalaRadiosSistemaDiseno = [
  { nombre: "SM", token: "--radio-sm", valor: "1rem", uso: "Chips, campos y microcontenedores." },
  { nombre: "MD", token: "--radio-md", valor: "1.5rem", uso: "Tarjetas compactas y controles principales." },
  { nombre: "LG", token: "--radio-lg", valor: "2rem", uso: "Paneles amplios y bloques destacados." },
  { nombre: "Pill", token: "--radio-pill", valor: "999px", uso: "Botones, insignias y estados compactos." },
] as const;

export const escalaSombrasSistemaDiseno = [
  {
    nombre: "Suave",
    token: "--sombra-suave",
    valor: "0 10px 24px rgba(10, 22, 20, 0.05)",
    uso: "Capas ligeras y microelevacion.",
  },
  {
    nombre: "Panel",
    token: "--sombra-panel",
    valor: "0 20px 48px rgba(10, 22, 20, 0.08)",
    uso: "Tarjetas principales y superficies de contenido.",
  },
  {
    nombre: "Elevada",
    token: "--sombra-elevada",
    valor: "0 32px 88px rgba(10, 22, 20, 0.12)",
    uso: "Hero cards, overlays y bloques de protagonismo alto.",
  },
] as const;

export const estadosInteractivosSistemaDiseno = [
  {
    nombre: "Hover",
    criterio:
      "La interaccion debe sentirse viva pero contenida: leve elevacion, mayor contraste y capa sutil de color.",
  },
  {
    nombre: "Focus",
    criterio:
      "Todos los controles interactivos requieren anillo visible con tono primario y lectura limpia sobre fondo claro.",
  },
  {
    nombre: "Active",
    criterio:
      "El estado activo reduce elevacion y aumenta densidad visual para comunicar presion real.",
  },
  {
    nombre: "Disabled",
    criterio:
      "Los estados deshabilitados pierden saturacion, sombra y capacidad de hover para evitar ambiguedad.",
  },
] as const;

export const lineamientosComponentesFuturos = [
  "Todo componente debe priorizar contraste legible, aire interno y una silueta clara antes que ornamento.",
  "Los componentes principales usan superficies claras elevadas; los bloques oscuros quedan reservados para contraste estrategico.",
  "No usar mas de una familia cromatica protagonista por componente: primario, secundario o acento, nunca todas al mismo tiempo.",
  "Los botones, inputs, cards y banners deben compartir radios, alturas y sombras del sistema, no valores aislados.",
  "Las variaciones premium se resuelven con materialidad, tipografia y profundidad, no con exceso de color o efectos brillantes.",
] as const;
