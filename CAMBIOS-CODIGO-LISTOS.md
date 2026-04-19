# Cambios de Código Específicos - Implementación Lista para Aplicar

## PARTE 1: TIPOS (Cambios Puntuales)

### Archivo: `src/modulos/catalogo/tipos/producto-catalogo.ts`

**AGREGR DESPUÉS DE línea 39:**

```typescript
// ============================================================================
// NUEVO: Snapshot de atributos para auditoría y análisis de pedidos
// ============================================================================

export type ProductoAtributosSnapshot = Readonly<{
  // Atributos de Filamentos PLA
  formato?: string;                    // ej: "Bobina de 750g"
  pesoKg?: number;                     // ej: 0.75
  acabado?: string;                    // ej: "Mate", "Brillante"
  colorHex?: string;                   // ej: "#0D7C66"
  compatiblePLA?: boolean;             // ej: true

  // Atributos de Impresoras
  tipoMaquina?: string;                // ej: "FDM"
  volumenImpresion?: string;           // ej: "300x300x300mm"
  tecnologia?: string;                 // ej: "FDM de escritorio"

  // Atributos de Objetos Impresos
  material?: string;                   // ej: "PLA ecológico"
  dimensiones?: string;                // ej: "100x50x100mm"
  pesoGramos?: number;                 // ej: 150

  // Atributos generales
  efecto?: string;                     // ej: "Metalizado", "Texturizado"
  coleccion?: string;                  // ej: "Spectrum Circular"
  esDestacado?: boolean;               // Producto destacado en catálogo
  estado?: string;                     // ej: "activo", "descatalogado"

  // Flexible para futuro
  [key: string]: unknown;
}>;
```

**REEMPLAZAR línea 58-69 (ResumenProductoCatalogo):**

```typescript
// ANTES:
export type ResumenProductoCatalogo = Readonly<{
  id: string;
  slug: string;
  nombre: string;
  resumen: string;
  categoria: string;
  tipoProducto: string;
  coleccion?: string;
  precioIvaIncluido: number;
  imagen: ImagenProductoCatalogo;
  etiquetasComerciales: readonly string[];
}>;

// DESPUÉS:
export type ResumenProductoCatalogo = Readonly<{
  id: string;
  slug: string;
  nombre: string;
  nombreCompleto?: string;              // ← NUEVO
  resumen: string;
  categoria: string;
  tipoProducto: string;
  marca?: string;                       // ← NUEVO: nombre de la marca
  nivel?: string;                       // ← NUEVO: nombre del nivel comercial
  coleccion?: string;
  precioIvaIncluido: number;
  imagen: ImagenProductoCatalogo;
  etiquetasComerciales: readonly string[];
  atributosSnapshot?: ProductoAtributosSnapshot;  // ← NUEVO
}>;
```

---

### Archivo: `src/modulos/carrito/tipos/carrito.ts`

**AGREGAR IMPORT en línea 1:**

```typescript
import type { ProductoAtributosSnapshot } from "@/modulos/catalogo/tipos/producto-catalogo";
```

**REEMPLAZAR línea 23-36 (EntradaAgregarItemCarrito):**

```typescript
// ANTES:
export type EntradaAgregarItemCarrito = Readonly<{
  productoId: string;
  slug: string;
  nombre: string;
  resumen: string;
  categoria: string;
  tipoProducto: string;
  coleccion?: string;
  imagen: ImagenItemCarrito;
  precioUnitarioIvaIncluido: number;
  cantidad: number;
  etiquetasComerciales?: readonly string[];
  variante?: VarianteItemCarrito | null;
}>;

// DESPUÉS:
export type EntradaAgregarItemCarrito = Readonly<{
  productoId: string;
  slug: string;
  nombre: string;
  nombreCompleto?: string;                         // ← NUEVO
  resumen: string;
  categoria: string;
  tipoProducto: string;
  marca?: string;                                  // ← NUEVO
  nivel?: string;                                  // ← NUEVO
  coleccion?: string;
  imagen: ImagenItemCarrito;
  precioUnitarioIvaIncluido: number;
  cantidad: number;
  etiquetasComerciales?: readonly string[];
  atributosSnapshot?: ProductoAtributosSnapshot;  // ← NUEVO
  variante?: VarianteItemCarrito | null;
}>;
```

---

### Archivo: `src/modulos/pedidos/tipos/crear-pedido.ts`

**AGREGAR IMPORT en línea 1:**

```typescript
import type { ProductoAtributosSnapshot } from "@/modulos/catalogo/tipos/producto-catalogo";
```

**REEMPLAZAR línea 32-43 (ItemCrearPedido):**

```typescript
// ANTES:
export type ItemCrearPedido = Readonly<{
  slug: string;
  nombre: string;
  resumen: string;
  categoria: string;
  tipoProducto: string;
  coleccion?: string;
  precioUnitarioIvaIncluidoSnapshot: number;
  cantidad: number;
  etiquetasComerciales?: readonly string[];
  variante?: VariantePedido | null;
}>;

// DESPUÉS:
export type ItemCrearPedido = Readonly<{
  idProducto: string;                              // ← NUEVO: UUID del producto
  slug: string;
  nombre: string;
  nombreCompleto?: string;                         // ← NUEVO
  resumen: string;
  categoria: string;
  tipoProducto: string;
  marca?: string;                                  // ← NUEVO
  nivel?: string;                                  // ← NUEVO
  coleccion?: string;
  precioUnitarioIvaIncluidoSnapshot: number;
  cantidad: number;
  etiquetasComerciales?: readonly string[];
  atributosSnapshot?: ProductoAtributosSnapshot;  // ← NUEVO (JSONB en BD)
  variante?: VariantePedido | null;
}>;
```

---

## PARTE 2: SERVICIOS (Cambios en Lógica)

### Archivo: `src/modulos/catalogo/servicios/obtener-productos-catalogo.ts`

**REEMPLAZAR COMPLETAMENTE:**

```typescript
// ANTES: Importar mock
import { productosCatalogoMock } from "../datos/productos-catalogo-mock";
import type { RespuestaCatalogoProductos } from "../tipos/producto-catalogo";

export type OpcionesObtencionCatalogo = Readonly<{
  incluirEsperaSimulada?: boolean;
}>;

const demoraMockCatalogoMs = 650;

function esperar(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function obtenerProductosCatalogo(
  opciones: OpcionesObtencionCatalogo = {},
): Promise<RespuestaCatalogoProductos> {
  const { incluirEsperaSimulada = true } = opciones;

  if (incluirEsperaSimulada) {
    await esperar(demoraMockCatalogoMs);
  }

  return productosCatalogoMock;
}

// DESPUÉS: Conectar a BD
import { supabase } from "@/compartido/supabase/cliente";
import type { RespuestaCatalogoProductos, ProductoCatalogo } from "../tipos/producto-catalogo";

export type OpcionesObtencionCatalogo = Readonly<{
  incluirEsperaSimulada?: boolean;
  soloActivos?: boolean;
}>;

export async function obtenerProductosCatalogo(
  opciones: OpcionesObtencionCatalogo = {},
): Promise<RespuestaCatalogoProductos> {
  const { soloActivos = true } = opciones;

  try {
    // Query a Supabase: productos activos con relaciones
    const { data, error } = await supabase
      .from("producto")
      .select(
        `
        id,
        slug,
        nombre,
        resumen,
        descripcion,
        precio_base_iva_incluido,
        estado:estado_id(codigo, nombre),
        marca:marca_id(nombre),
        nivel:nivel_comercial_id(nombre)
      `
      )
      .eq("vende_directo", true)
      .eq("estado_id.esta_activo", soloActivos);

    if (error) {
      console.error("[catalogo] Error en obtenerProductosCatalogo:", error);
      throw error;
    }

    // Mapear resultados BD → tipos TypeScript
    const productos: ProductoCatalogo[] = (data || []).map((fila: any) => ({
      id: fila.id,
      slug: fila.slug,
      nombre: fila.nombre,
      resumen: fila.resumen,
      descripcion: fila.descripcion,
      categoria: "Productos Rekun LAB",
      tipoProducto: "Producto",
      marca: fila.marca?.nombre,
      nivel: fila.nivel?.nombre,
      precioIvaIncluido: fila.precio_base_iva_incluido ?? 0,
      imagen: {
        src: "/imagenes/placeholder-producto.svg",
        alt: fila.nombre,
        ancho: 800,
        alto: 960,
      },
      imagenesGaleria: [],
      especificaciones: [],
      etiquetasComerciales: [],
      atributosSnapshot: {},
    }));

    return productos;
  } catch (error) {
    console.error("[catalogo] Error cargando catálogo:", error);
    // Fallback temporal durante desarrollo
    return [];
  }
}
```

---

## PARTE 3: COMPONENTES (Cambios en UI)

### Archivo: `src/modulos/catalogo/componentes/detalle-producto/panel-compra-producto-detalle.tsx`

**REEMPLAZAR línea 101-122 (función agregarSeleccionLocal):**

```typescript
// ANTES:
agregarItem(
  {
    productoId: producto.id,
    slug: producto.slug,
    nombre: producto.nombre,
    resumen: producto.resumen,
    categoria: producto.categoria,
    tipoProducto: producto.tipoProducto,
    coleccion: producto.coleccion,
    imagen: vistaDetalle.imagen,
    precioUnitarioIvaIncluido: vistaDetalle.precioIvaIncluido,
    cantidad,
    etiquetasComerciales: producto.etiquetasComerciales,
    variante: vistaDetalle.varianteSeleccionada
      ? {
          id: vistaDetalle.varianteSeleccionada.id,
          etiqueta: vistaDetalle.varianteSeleccionada.etiqueta,
          codigoReferencia: vistaDetalle.varianteSeleccionada.codigoReferencia,
          selecciones: seleccionesVariante,
        }
      : null,
  },
  {
    abrirDrawer: true,
  },
);

// DESPUÉS:
agregarItem(
  {
    productoId: producto.id,
    slug: producto.slug,
    nombre: producto.nombre,
    nombreCompleto: producto.nombreCompleto,
    resumen: producto.resumen,
    categoria: producto.categoria,
    tipoProducto: producto.tipoProducto,
    marca: producto.marca,
    nivel: producto.nivel,
    coleccion: producto.coleccion,
    imagen: vistaDetalle.imagen,
    precioUnitarioIvaIncluido: vistaDetalle.precioIvaIncluido,
    cantidad,
    etiquetasComerciales: producto.etiquetasComerciales,
    atributosSnapshot: producto.atributosSnapshot,
    variante: vistaDetalle.varianteSeleccionada
      ? {
          id: vistaDetalle.varianteSeleccionada.id,
          etiqueta: vistaDetalle.varianteSeleccionada.etiqueta,
          codigoReferencia: vistaDetalle.varianteSeleccionada.codigoReferencia,
          selecciones: seleccionesVariante,
        }
      : null,
  },
  {
    abrirDrawer: true,
  },
);
```

---

### Archivo: `src/modulos/checkout/componentes/pagina-checkout-visual.tsx`

**REEMPLAZAR línea 118-151 (en función manejarEnvio):**

```typescript
// ANTES:
const solicitud: SolicitudCrearPedido = {
  datosCliente: {
    nombre: checkout.valores.datosCliente.nombre,
    apellido: checkout.valores.datosCliente.apellido,
    correo: checkout.valores.datosCliente.correo,
    telefono: checkout.valores.datosCliente.telefono,
  },
  direccionDespacho: {
    region: checkout.valores.direccionEnvio.region,
    comuna: checkout.valores.direccionEnvio.comuna,
    calle: checkout.valores.direccionEnvio.calle,
    numero: checkout.valores.direccionEnvio.numero,
    departamento: checkout.valores.direccionEnvio.departamento,
    referencias: checkout.valores.direccionEnvio.referencias,
    codigoPostal: checkout.valores.direccionEnvio.codigoPostal,
  },
  items: items.map((item) => ({
    slug: item.slug,
    nombre: item.nombre,
    resumen: item.resumen,
    categoria: item.categoria,
    tipoProducto: item.tipoProducto,
    coleccion: item.coleccion,
    precioUnitarioIvaIncluidoSnapshot: item.precioUnitarioIvaIncluido,
    cantidad: item.cantidad,
    etiquetasComerciales: item.etiquetasComerciales,
    variante: item.variante
      ? {
          etiqueta: item.variante.etiqueta,
          codigoReferencia: item.variante.codigoReferencia,
          selecciones: item.variante.selecciones,
        }
      : null,
  })),
};

// DESPUÉS:
const solicitud: SolicitudCrearPedido = {
  datosCliente: {
    nombre: checkout.valores.datosCliente.nombre,
    apellido: checkout.valores.datosCliente.apellido,
    correo: checkout.valores.datosCliente.correo,
    telefono: checkout.valores.datosCliente.telefono,
  },
  direccionDespacho: {
    region: checkout.valores.direccionEnvio.region,
    comuna: checkout.valores.direccionEnvio.comuna,
    calle: checkout.valores.direccionEnvio.calle,
    numero: checkout.valores.direccionEnvio.numero,
    departamento: checkout.valores.direccionEnvio.departamento,
    referencias: checkout.valores.direccionEnvio.referencias,
    codigoPostal: checkout.valores.direccionEnvio.codigoPostal,
  },
  items: items.map((item) => ({
    idProducto: item.productoId,
    slug: item.slug,
    nombre: item.nombre,
    nombreCompleto: item.nombreCompleto,
    resumen: item.resumen,
    categoria: item.categoria,
    tipoProducto: item.tipoProducto,
    marca: item.marca,
    nivel: item.nivel,
    coleccion: item.coleccion,
    precioUnitarioIvaIncluidoSnapshot: item.precioUnitarioIvaIncluido,
    cantidad: item.cantidad,
    etiquetasComerciales: item.etiquetasComerciales,
    atributosSnapshot: item.atributosSnapshot,
    variante: item.variante
      ? {
          etiqueta: item.variante.etiqueta,
          codigoReferencia: item.variante.codigoReferencia,
          selecciones: item.variante.selecciones,
        }
      : null,
  })),
};
```

---

## PARTE 4: LIMPIAR

### Eliminar archivo:
```bash
rm src/modulos/catalogo/datos/productos-catalogo-mock.ts
```

### Buscar y eliminar imports remanentes:
```bash
grep -r "productosCatalogoMock" src/
```

Si hay resultados, eliminar esas líneas de import.

---

## VALIDACIÓN RÁPIDA

### 1. Compilar tipos
```bash
npm run tsc --noEmit
```
Debe pasar sin errores.

### 2. Verificar imports
```bash
grep -r "productos-catalogo-mock" src/
```
Debe devolver 0 resultados (salvo este documento).

### 3. Prueba local
```bash
npm run dev
# Navegar a /catalogo
# Abrir DevTools → Network → ver si falla query a BD
# Debería mostrar array vacío [] si BD está vacía
```

### 4. Prueba carrito
```bash
# En /catalogo, agregar producto al carrito
# DevTools → Application → localStorage → carrito
# Verificar que ItemCarrito tenga campos nuevos:
# {
#   productoId: "...",
#   nombre: "...",
#   nombreCompleto: "...",   ← NUEVO
#   marca: "...",            ← NUEVO
#   nivel: "...",            ← NUEVO
#   atributosSnapshot: {...} ← NUEVO
#   ...
# }
```

### 5. Prueba pedido
```bash
# Ir a checkout → crear pedido
# DevTools → Network → POST /api/pedidos
# Verificar payload:
# {
#   items: [
#     {
#       idProducto: "...",      ← NUEVO
#       nombreCompleto: "...",  ← NUEVO
#       marca: "...",           ← NUEVO
#       nivel: "...",           ← NUEVO
#       atributosSnapshot: {...} ← NUEVO
#       ...
#     }
#   ]
# }
```

---

## Resumen de Cambios

| Archivo | Líneas Cambiadas | Tipo | Complejidad |
|---------|------------------|------|-------------|
| producto-catalogo.ts | +15 | Tipo nuevo + Extensión | ✅ Bajo |
| carrito.ts | +8 | Extensión | ✅ Bajo |
| crear-pedido.ts | +8 | Extensión | ✅ Bajo |
| obtener-productos-catalogo.ts | ±60 | Reescritura lógica | ✅ Bajo |
| panel-compra-producto-detalle.tsx | +6 | Mapeo de campos | ✅ Bajo |
| pagina-checkout-visual.tsx | +6 | Mapeo de campos | ✅ Bajo |
| productos-catalogo-mock.ts | -670 | Eliminación | ✅ Bajo |

**TOTAL: ~100 líneas de cambio efectivo, 0 líneas de complejidad funcional**

