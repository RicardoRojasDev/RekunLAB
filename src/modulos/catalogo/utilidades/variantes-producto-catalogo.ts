import type {
  AtributoVarianteProductoCatalogo,
  EstadoValidacionVariantesProductoCatalogo,
  EspecificacionProductoCatalogo,
  MapaOpcionesDisponiblesVariantesProductoCatalogo,
  ProductoCatalogo,
  SeleccionVarianteProductoCatalogo,
  VarianteProductoCatalogo,
  VistaDetalleProductoCatalogo,
} from "../tipos/producto-catalogo";

function obtenerConfiguracionVariantesProducto(producto: ProductoCatalogo) {
  return producto.configuracionVariantes ?? null;
}

function crearImagenFallbackParaVista(producto: ProductoCatalogo) {
  return {
    ...producto.imagen,
    etiqueta: "Vista principal",
  };
}

function esSeleccionCompatibleConVariante(
  variante: VarianteProductoCatalogo,
  seleccion: SeleccionVarianteProductoCatalogo,
  codigoAtributoIgnorado?: string,
) {
  return Object.entries(seleccion).every(([codigo, valor]) => {
    if (!valor || codigo === codigoAtributoIgnorado) {
      return true;
    }

    return variante.selecciones[codigo] === valor;
  });
}

function resolverClavesAtributos(producto: ProductoCatalogo): readonly string[] {
  return (
    obtenerConfiguracionVariantesProducto(producto)?.atributos.map(
      (atributo) => atributo.codigo,
    ) ?? []
  );
}

function resolverEspecificacionesDetalleProducto(
  base: readonly EspecificacionProductoCatalogo[],
  complementarias?: readonly EspecificacionProductoCatalogo[],
) {
  if (!complementarias?.length) {
    return base;
  }

  const mapaEspecificaciones = new Map<string, EspecificacionProductoCatalogo>();

  base.forEach((especificacion) => {
    mapaEspecificaciones.set(
      especificacion.etiqueta.trim().toLowerCase(),
      especificacion,
    );
  });

  complementarias.forEach((especificacion) => {
    mapaEspecificaciones.set(
      especificacion.etiqueta.trim().toLowerCase(),
      especificacion,
    );
  });

  return Array.from(mapaEspecificaciones.values());
}

export function productoTieneVariantes(producto: ProductoCatalogo) {
  const configuracion = obtenerConfiguracionVariantesProducto(producto);

  return Boolean(configuracion?.atributos.length && configuracion.variantes.length);
}

export function obtenerSeleccionInicialVariantesProducto(
  producto: ProductoCatalogo,
): SeleccionVarianteProductoCatalogo {
  const configuracion = obtenerConfiguracionVariantesProducto(producto);

  if (!configuracion) {
    return {};
  }

  const varianteInicial =
    configuracion.variantes.find(
      (variante) => variante.id === configuracion.variantePorDefectoId,
    ) ?? configuracion.variantes[0];

  return varianteInicial ? { ...varianteInicial.selecciones } : {};
}

export function normalizarSeleccionVariantesProducto(
  producto: ProductoCatalogo,
  seleccionPreferida: SeleccionVarianteProductoCatalogo,
): SeleccionVarianteProductoCatalogo {
  const configuracion = obtenerConfiguracionVariantesProducto(producto);

  if (!configuracion) {
    return {};
  }

  const varianteExacta = configuracion.variantes.find((variante) =>
    resolverClavesAtributos(producto).every(
      (codigo) => variante.selecciones[codigo] === seleccionPreferida[codigo],
    ),
  );

  if (varianteExacta) {
    return { ...varianteExacta.selecciones };
  }

  const varianteCompatible = configuracion.variantes.find((variante) =>
    esSeleccionCompatibleConVariante(variante, seleccionPreferida),
  );

  const varianteFallback =
    varianteCompatible ??
    configuracion.variantes.find(
      (variante) => variante.id === configuracion.variantePorDefectoId,
    ) ??
    configuracion.variantes[0];

  return varianteFallback ? { ...varianteFallback.selecciones } : {};
}

export function resolverVarianteSeleccionadaProducto(
  producto: ProductoCatalogo,
  seleccion: SeleccionVarianteProductoCatalogo,
): VarianteProductoCatalogo | null {
  const configuracion = obtenerConfiguracionVariantesProducto(producto);

  if (!configuracion) {
    return null;
  }

  const atributos = resolverClavesAtributos(producto);
  const seleccionCompleta = atributos.every((codigo) => Boolean(seleccion[codigo]));

  if (!seleccionCompleta) {
    return null;
  }

  return (
    configuracion.variantes.find((variante) =>
      atributos.every((codigo) => variante.selecciones[codigo] === seleccion[codigo]),
    ) ?? null
  );
}

export function validarSeleccionVariantesProducto(
  producto: ProductoCatalogo,
  seleccion: SeleccionVarianteProductoCatalogo,
): EstadoValidacionVariantesProductoCatalogo {
  const configuracion = obtenerConfiguracionVariantesProducto(producto);

  if (!configuracion) {
    return {
      esValida: true,
      mensaje: null,
      atributosFaltantes: [],
      varianteSeleccionada: null,
    };
  }

  const atributosFaltantes = configuracion.atributos
    .filter((atributo) => !seleccion[atributo.codigo])
    .map((atributo) => atributo.etiqueta);

  if (atributosFaltantes.length) {
    return {
      esValida: false,
      mensaje: `Selecciona ${atributosFaltantes.join(" y ")} para continuar.`,
      atributosFaltantes,
      varianteSeleccionada: null,
    };
  }

  const varianteSeleccionada = resolverVarianteSeleccionadaProducto(
    producto,
    seleccion,
  );

  if (!varianteSeleccionada) {
    return {
      esValida: false,
      mensaje: "La combinacion elegida no esta disponible en esta etapa.",
      atributosFaltantes: [],
      varianteSeleccionada: null,
    };
  }

  return {
    esValida: true,
    mensaje: null,
    atributosFaltantes: [],
    varianteSeleccionada,
  };
}

export function resolverOpcionesDisponiblesVariantesProducto(
  producto: ProductoCatalogo,
  seleccion: SeleccionVarianteProductoCatalogo,
): MapaOpcionesDisponiblesVariantesProductoCatalogo {
  const configuracion = obtenerConfiguracionVariantesProducto(producto);

  if (!configuracion) {
    return {};
  }

  return configuracion.atributos.reduce<
    Record<string, readonly ReturnType<typeof mapearOpcionDisponible>[]>
  >((acumulador, atributo) => {
    acumulador[atributo.codigo] = atributo.opciones.map((opcion) =>
      mapearOpcionDisponible(producto, atributo, opcion.id, seleccion),
    );

    return acumulador;
  }, {});
}

function mapearOpcionDisponible(
  producto: ProductoCatalogo,
  atributo: AtributoVarianteProductoCatalogo,
  opcionId: string,
  seleccion: SeleccionVarianteProductoCatalogo,
) {
  const configuracion = obtenerConfiguracionVariantesProducto(producto);
  const opcion = atributo.opciones.find((item) => item.id === opcionId);

  if (!configuracion || !opcion) {
    return {
      id: opcionId,
      etiqueta: opcionId,
      valor: opcionId,
      disponible: false,
      seleccionada: false,
    };
  }

  const disponible = configuracion.variantes.some((variante) => {
    if (variante.selecciones[atributo.codigo] !== opcionId) {
      return false;
    }

    return esSeleccionCompatibleConVariante(
      variante,
      seleccion,
      atributo.codigo,
    );
  });

  return {
    ...opcion,
    disponible,
    seleccionada: seleccion[atributo.codigo] === opcionId,
  };
}

export function resolverVistaDetalleProducto(
  producto: ProductoCatalogo,
  seleccion: SeleccionVarianteProductoCatalogo,
): VistaDetalleProductoCatalogo {
  const varianteSeleccionada = resolverVarianteSeleccionadaProducto(
    producto,
    seleccion,
  );
  const imagenBase = varianteSeleccionada?.imagen ?? producto.imagen;
  const imagenesGaleriaBase =
    varianteSeleccionada?.imagenesGaleria?.length
      ? varianteSeleccionada.imagenesGaleria
      : producto.imagenesGaleria.length
        ? producto.imagenesGaleria
        : [crearImagenFallbackParaVista(producto)];

  return {
    productoBase: producto,
    varianteSeleccionada,
    precioIvaIncluido:
      varianteSeleccionada?.precioIvaIncluido ?? producto.precioIvaIncluido,
    imagen: imagenBase,
    imagenesGaleria: imagenesGaleriaBase,
    especificaciones: resolverEspecificacionesDetalleProducto(
      producto.especificaciones,
      varianteSeleccionada?.especificacionesComplementarias,
    ),
  };
}
