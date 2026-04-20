import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function parsearLineaEntorno(linea) {
  const texto = linea.trim();

  if (!texto || texto.startsWith("#")) {
    return null;
  }

  const indiceSeparador = texto.indexOf("=");

  if (indiceSeparador === -1) {
    return null;
  }

  const clave = texto.slice(0, indiceSeparador).trim();
  let valor = texto.slice(indiceSeparador + 1).trim();

  if (!clave.length) {
    return null;
  }

  if (
    (valor.startsWith('"') && valor.endsWith('"')) ||
    (valor.startsWith("'") && valor.endsWith("'"))
  ) {
    valor = valor.slice(1, -1);
  }

  return { clave, valor };
}

function cargarVariablesDesdeArchivo(rutaArchivo) {
  if (!existsSync(rutaArchivo)) {
    return [];
  }

  const contenido = readFileSync(rutaArchivo, "utf8");
  const clavesCargadas = [];

  for (const linea of contenido.split(/\r?\n/)) {
    const variable = parsearLineaEntorno(linea);

    if (!variable) {
      continue;
    }

    if (!(variable.clave in process.env)) {
      process.env[variable.clave] = variable.valor;
      clavesCargadas.push(variable.clave);
    }
  }

  return clavesCargadas;
}

export function cargarEntornoLocal({
  directorioBase = process.cwd(),
  incluirEnv = true,
  incluirEnvLocal = true,
} = {}) {
  const archivos = [];

  if (incluirEnv) {
    archivos.push(resolve(directorioBase, ".env"));
  }

  if (incluirEnvLocal) {
    archivos.push(resolve(directorioBase, ".env.local"));
  }

  const resultado = {
    archivosIntentados: archivos,
    variablesCargadas: [],
  };

  for (const archivo of archivos) {
    resultado.variablesCargadas.push(...cargarVariablesDesdeArchivo(archivo));
  }

  return resultado;
}
