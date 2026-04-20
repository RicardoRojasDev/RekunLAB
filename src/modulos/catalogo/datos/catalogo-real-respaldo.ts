import "server-only";

import { readFileSync } from "fs";
import { join } from "path";
import type {
  EspecificacionProductoCatalogo,
  ImagenGaleriaProductoCatalogo,
  ImagenProductoCatalogo,
  ProductoCatalogo,
} from "../tipos/producto-catalogo";

type RegistroRespaldoCatalogo = Readonly<{
  slug: string;
  sku: string;
  nombre: string;
  nombreCompleto?: string;
  resumen: string;
  descripcion: string;
  precioIvaIncluido: number;
  marca?: string;
  tipoProducto: string;
  categoria: string;
  subcategoria?: string;
  nivel?: string;
  coleccion?: string;
  formato?: string;
  pesoKg?: number;
  acabado?: string;
  efecto?: string;
  colorHex?: string;
  compatiblePLA?: boolean;
  esDestacado?: boolean;
  estado: string;
}>;

const rutaMigracionCatalogoReal = join(
  process.cwd(),
  "supabase",
  "migrations",
  "20260419_modulo_15_catalogo_real.sql",
);

const imagenBaseRespaldo: ImagenProductoCatalogo = {
  src: "/imagenes/catalogo/producto-rekun-lab.svg",
  alt: "Producto oficial Rekun LAB",
  ancho: 1200,
  alto: 1440,
};

let catalogoRespaldoCache: readonly ProductoCatalogo[] | null = null;

const mapaMarcas: Record<string, string> = {
  "ids.rekun_id": "Rekun LAB",
  "ids.creality_id": "Creality",
  "ids.bambu_id": "Bambu Lab",
  "ids.anycubic_id": "Anycubic",
};

const mapaNiveles: Record<string, string> = {
  "ids.nivel_base": "Base",
  "ids.nivel_premium": "Premium",
  "ids.nivel_economica": "Economica",
  "ids.nivel_intermedia": "Intermedia",
  "ids.nivel_avanzada": "Avanzada",
  "ids.nivel_industrial": "Industrial",
};

function tokenizarValoresSql(texto: string) {
  const tokens: string[] = [];
  let buffer = "";
  let dentroDeComilla = false;
  let profundidadParentesis = 0;

  for (let indice = 0; indice < texto.length; indice += 1) {
    const caracter = texto[indice];

    if (caracter === "'") {
      dentroDeComilla = !dentroDeComilla;
      buffer += caracter;
      continue;
    }

    if (!dentroDeComilla) {
      if (caracter === "(") {
        profundidadParentesis += 1;
      } else if (caracter === ")") {
        profundidadParentesis = Math.max(0, profundidadParentesis - 1);
      } else if (caracter === "," && profundidadParentesis === 0) {
        const token = buffer.trim();

        if (token.length) {
          tokens.push(token);
        }

        buffer = "";
        continue;
      }
    }

    buffer += caracter;
  }

  const ultimoToken = buffer.trim();

  if (ultimoToken.length) {
    tokens.push(ultimoToken);
  }

  return tokens;
}

function limpiarTokenSql(token: string) {
  const valor = token.trim();

  if (valor === "NULL") {
    return undefined;
  }

  if (valor.startsWith("'") && valor.endsWith("'")) {
    return valor.slice(1, -1).replace(/''/g, "'");
  }

  return valor;
}

function parsearBooleanoSql(token: string) {
  if (token === "true") {
    return true;
  }

  if (token === "false") {
    return false;
  }

  return undefined;
}

function parsearNumeroSql(token: string) {
  const numero = Number(token);
  return Number.isFinite(numero) ? numero : undefined;
}

function resolverCategoriaPorTipo(tipoProducto: string) {
  if (tipoProducto === "Filamento") {
    return "Filamentos PLA";
  }

  if (tipoProducto === "Impresora") {
    return "Impresoras 3D";
  }

  return "Packs";
}

function construirEtiquetasComerciales(
  registro: RegistroRespaldoCatalogo,
): readonly string[] {
  const etiquetas: string[] = [];

  if (registro.esDestacado) {
    etiquetas.push("Destacado");
  }

  if (registro.compatiblePLA) {
    etiquetas.push("Compatible PLA");
  }

  if (registro.nivel) {
    etiquetas.push(`Nivel ${registro.nivel}`);
  }

  return etiquetas;
}

function construirEspecificaciones(
  registro: RegistroRespaldoCatalogo,
): readonly EspecificacionProductoCatalogo[] {
  const especificaciones: EspecificacionProductoCatalogo[] = [];

  const candidatos: readonly Readonly<{
    etiqueta: string;
    valor: string | undefined;
  }>[] = [
    { etiqueta: "Nombre completo", valor: registro.nombreCompleto },
    { etiqueta: "Marca", valor: registro.marca },
    { etiqueta: "Categoria", valor: registro.categoria },
    { etiqueta: "Subcategoria", valor: registro.subcategoria },
    { etiqueta: "Tipo", valor: registro.tipoProducto },
    { etiqueta: "Nivel", valor: registro.nivel },
    { etiqueta: "Coleccion", valor: registro.coleccion },
    { etiqueta: "Formato", valor: registro.formato },
    {
      etiqueta: "Peso",
      valor:
        typeof registro.pesoKg === "number" && registro.pesoKg > 0
          ? `${registro.pesoKg} kg`
          : undefined,
    },
    { etiqueta: "Acabado", valor: registro.acabado },
    { etiqueta: "Efecto", valor: registro.efecto },
    {
      etiqueta: "Compatible con PLA",
      valor:
        registro.compatiblePLA === undefined
          ? undefined
          : registro.compatiblePLA
            ? "Si"
            : "No",
    },
  ];

  for (const candidato of candidatos) {
    if (!candidato.valor) {
      continue;
    }

    especificaciones.push({
      etiqueta: candidato.etiqueta,
      valor: candidato.valor,
    });
  }

  return especificaciones;
}

function construirImagenes(nombreVisible: string) {
  const principal: ImagenProductoCatalogo = {
    ...imagenBaseRespaldo,
    alt: `Referencia visual de ${nombreVisible}`,
  };

  const galeria: readonly ImagenGaleriaProductoCatalogo[] = [
    {
      ...principal,
      etiqueta: "Referencia de catalogo",
      posicionObjeto: "center",
    },
  ];

  return {
    principal,
    galeria,
  };
}

function construirProductoCatalogo(
  registro: RegistroRespaldoCatalogo,
  indice: number,
): ProductoCatalogo {
  const nombreVisible = registro.nombreCompleto ?? registro.nombre;
  const imagenes = construirImagenes(nombreVisible);

  return {
    id: `respaldo-${indice + 1}-${registro.slug}`,
    slug: registro.slug,
    nombre: registro.nombre,
    nombreCompleto: registro.nombreCompleto,
    resumen: registro.resumen,
    categoria: registro.categoria,
    subcategoria: registro.subcategoria,
    marca: registro.marca,
    tipoProducto: registro.tipoProducto,
    nivel: registro.nivel,
    coleccion: registro.coleccion,
    formato: registro.formato,
    pesoKg: registro.pesoKg,
    acabado: registro.acabado,
    efecto: registro.efecto,
    colorHex: registro.colorHex,
    compatiblePLA: registro.compatiblePLA,
    esDestacado: registro.esDestacado,
    estado: registro.estado,
    precioIvaIncluido: registro.precioIvaIncluido,
    imagen: imagenes.principal,
    descripcion: registro.descripcion,
    imagenesGaleria: imagenes.galeria,
    especificaciones: construirEspecificaciones(registro),
    configuracionVariantes: undefined,
    etiquetasComerciales: construirEtiquetasComerciales(registro),
  };
}

function parsearMetadatosDesdeJsonb(texto: string) {
  const metadatos: Record<string, string | boolean> = {};
  const expresion =
    /'([^']+)'\s*,\s*(true|false|NULL|'(?:''|[^'])*')/g;

  for (const coincidencia of texto.matchAll(expresion)) {
    const clave = coincidencia[1];
    const valorCrudo = coincidencia[2];

    if (!clave || !valorCrudo || valorCrudo === "NULL") {
      continue;
    }

    const valorBooleano = parsearBooleanoSql(valorCrudo);

    if (valorBooleano !== undefined) {
      metadatos[clave] = valorBooleano;
      continue;
    }

    metadatos[clave] = limpiarTokenSql(valorCrudo) ?? "";
  }

  return metadatos;
}

function extraerBloquesProducto(contenido: string) {
  const inicio = contenido.indexOf("INSERT INTO public.producto");
  const fin = contenido.indexOf("-- ============================================================================", inicio + 1);

  if (inicio === -1 || fin === -1) {
    return [] as const;
  }

  const seccion = contenido.slice(inicio, fin);
  const bloques = seccion.match(
    /(?:SELECT|UNION ALL\s+SELECT)\s+[\s\S]*?FROM ids/g,
  );

  return bloques ?? [];
}

function parsearBloqueProducto(bloque: string): RegistroRespaldoCatalogo | null {
  const lineas = bloque
    .split(/\r?\n/)
    .map((linea) => linea.trim())
    .filter(Boolean);

  const indiceSelect = lineas.findIndex(
    (linea) => linea === "SELECT" || linea === "UNION ALL" || linea === "UNION ALL SELECT",
  );

  const lineasDatos =
    indiceSelect >= 0 ? lineas.slice(indiceSelect + 1) : lineas;

  const lineasSinFrom = lineasDatos.filter((linea) => linea !== "FROM ids");

  if (lineasSinFrom.length < 6) {
    return null;
  }

  const lineaBase = lineasSinFrom[0];
  const lineaResumen = lineasSinFrom[1];
  const lineaDescripcion = lineasSinFrom[2];
  const lineaPrecio = lineasSinFrom[3];
  const lineaTipo = lineasSinFrom[4];
  const lineaMetadatos = lineasSinFrom[5];

  if (
    !lineaBase ||
    !lineaResumen ||
    !lineaDescripcion ||
    !lineaPrecio ||
    !lineaTipo ||
    !lineaMetadatos
  ) {
    return null;
  }

  const valoresBase = tokenizarValoresSql(lineaBase.replace(/,$/, ""));
  const valoresPrecio = tokenizarValoresSql(lineaPrecio.replace(/,$/, ""));
  const valoresTipo = tokenizarValoresSql(lineaTipo.replace(/,$/, ""));

  if (valoresBase.length < 3 || valoresPrecio.length < 4 || valoresTipo.length < 6) {
    return null;
  }

  const valorSlug = valoresBase[0];
  const valorSku = valoresBase[1];
  const valorNombre = valoresBase[2];
  const valorPrecio = valoresPrecio[0];
  const valorTipoProducto = valoresTipo[0];
  const valorEsDestacado = valoresTipo[1];
  const valorColeccion = valoresTipo[2];
  const valorFormato = valoresTipo[3];
  const valorPesoKg = valoresTipo[4];
  const valorSubcategoria = valoresTipo[5];

  if (
    !valorSlug ||
    !valorSku ||
    !valorNombre ||
    !valorPrecio ||
    !valorTipoProducto ||
    !valorEsDestacado ||
    !valorColeccion ||
    !valorFormato ||
    !valorPesoKg ||
    !valorSubcategoria
  ) {
    return null;
  }

  const slug = limpiarTokenSql(valorSlug);
  const sku = limpiarTokenSql(valorSku);
  const nombre = limpiarTokenSql(valorNombre);
  const resumen = limpiarTokenSql(lineaResumen.replace(/,$/, ""));
  const descripcion = limpiarTokenSql(lineaDescripcion.replace(/,$/, ""));
  const precioIvaIncluido = parsearNumeroSql(valorPrecio);
  const marca = mapaMarcas[valoresPrecio[1] ?? ""] ?? undefined;
  const nivel = mapaNiveles[valoresPrecio[2] ?? ""] ?? undefined;
  const tipoProducto = limpiarTokenSql(valorTipoProducto);
  const esDestacado = parsearBooleanoSql(valorEsDestacado);
  const coleccion = limpiarTokenSql(valorColeccion);
  const formato = limpiarTokenSql(valorFormato);
  const pesoKg = parsearNumeroSql(valorPesoKg);
  const subcategoria = limpiarTokenSql(valorSubcategoria);
  const metadatos = parsearMetadatosDesdeJsonb(lineaMetadatos);

  if (
    !slug ||
    !sku ||
    !nombre ||
    !resumen ||
    !descripcion ||
    precioIvaIncluido === undefined ||
    !tipoProducto
  ) {
    return null;
  }

  return {
    slug,
    sku,
    nombre,
    nombreCompleto:
      typeof metadatos.nombre_completo === "string"
        ? metadatos.nombre_completo
        : undefined,
    resumen,
    descripcion,
    precioIvaIncluido,
    marca,
    tipoProducto,
    categoria: resolverCategoriaPorTipo(tipoProducto),
    subcategoria,
    nivel,
    coleccion,
    formato: formato && formato !== "N/A" ? formato : undefined,
    pesoKg: pesoKg && pesoKg > 0 ? pesoKg : undefined,
    acabado:
      typeof metadatos.acabado === "string" ? metadatos.acabado : undefined,
    efecto: typeof metadatos.efecto === "string" ? metadatos.efecto : undefined,
    colorHex:
      typeof metadatos.color_hex === "string" ? metadatos.color_hex : undefined,
    compatiblePLA:
      typeof metadatos.compatible_pla === "boolean"
        ? metadatos.compatible_pla
        : undefined,
    esDestacado,
    estado: "activo",
  };
}

function cargarCatalogoRealRespaldo() {
  const contenido = readFileSync(rutaMigracionCatalogoReal, "utf8");
  const bloques = extraerBloquesProducto(contenido);

  return bloques
    .map(parsearBloqueProducto)
    .filter((registro): registro is RegistroRespaldoCatalogo => Boolean(registro))
    .map((registro, indice) => construirProductoCatalogo(registro, indice));
}

export function obtenerCatalogoRealRespaldo() {
  if (!catalogoRespaldoCache) {
    catalogoRespaldoCache = cargarCatalogoRealRespaldo();
  }

  return catalogoRespaldoCache;
}
