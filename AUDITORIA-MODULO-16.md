# AUDITORÍA DEL MÓDULO 16 - Sistema de Pedidos

**Fecha:** 2026-04-19  
**Hallazgo:** MÚLTIPLES PROBLEMAS CRÍTICOS DETECTADOS ⚠️  
**Estado:** NO APTO PARA PASAR A MÓDULO 17

---

## RESUMEN DE HALLAZGOS

```
CRITERIO REQUERIDO                    ESTADO ACTUAL              RESULTADO
─────────────────────────────────────────────────────────────────────────────
✅ Pedido usa productos reales        ❌ Solo mocks hardcodeados  FALLA
✅ Carrito no depende de mocks        ❌ Depende 100% de mocks    FALLA
✅ Checkout sin estructuras prov.     ✅ OK, valida bien          PASA
✅ Snapshot del pedido correcto       ❌ Incompleto (5/18+ campos) FALLA
✅ Soporta múltiples tipos producto   ⚠️ Parcial (no diferenciado) ADVERTENCIA
✅ Arquitectura flexible nuevos prod. ⚠️ Flexible pero sin datos    ADVERTENCIA
✅ No acoplado a impresoras 3D        ✅ Agnóstico a tipo          PASA
```

---

## 1️⃣ PEDIDO USA PRODUCTOS REALES

### Hallazgo: 🔴 CRÍTICO - USA SOLO MOCKS

**Evidencia:**

```typescript
// archivo: src/modulos/catalogo/servicios/obtener-productos-catalogo.ts
export async function obtenerProductosCatalogo(...) {
  return productosCatalogoMock;  // ← 6 productos ficticios
}

// archivo: src/modulos/catalogo/datos/productos-catalogo-mock.ts
const productos = [
  { id: "filamento-pla-rekun-spectrum", nombre: "Filamento PLA Rekun Spectrum", ... },
  { id: "filamento-pla-arena-atacama-1kg", nombre: "Filamento PLA Arena Atacama 1kg", ... },
  { id: "impresora-3d-estudio-r1", nombre: "Impresora 3D Estudio R1", ... },
  // ... 3 más productos hardcodeados
]
```

**Impacto:**
- ❌ El carrito muestra productos falsos
- ❌ El pedido se crea con datos ficticios
- ❌ Imposible escalar a catálogo real
- ❌ No usa BD productiva (Supabase)

**Flujo Actual:**
```
Catálogo Mock (6 items)
    ↓
    → Agregar al Carrito
    ↓
    → Checkout (desde carrito)
    ↓
    → POST /api/pedidos (envía datos del carrito)
    ↓
    → RPC crear_pedido_desde_checkout (llama a BD)
    ↓
    → item_pedido guardado con datos mock ❌
```

---

## 2️⃣ CARRITO NO DEPENDE DE MOCKS

### Hallazgo: 🔴 CRÍTICO - DEPENDE 100% DE MOCKS

**Cadena de Dependencia:**

```
Panel Compra Producto
    ↓
    agregarItem(EntradaAgregarItemCarrito)
    ↓
Provedor Carrito (contexto)
    ↓
Estado Local del Carrito
    ↓
localStorage (persiste)
```

**El Problema:**

La función `agregarItem` en `panel-compra-producto-detalle.tsx:101-126` construye `EntradaAgregarItemCarrito` desde `producto`, que viene de catálogo mock:

```typescript
// src/modulos/catalogo/componentes/detalle-producto/panel-compra-producto-detalle.tsx:101-126

agregarItem({
  productoId: producto.id,           // ← De mock
  slug: producto.slug,               // ← De mock
  nombre: producto.nombre,           // ← De mock
  resumen: producto.resumen,         // ← De mock
  categoria: producto.categoria,     // ← De mock
  tipoProducto: producto.tipoProducto,  // ← De mock
  coleccion: producto.coleccion,     // ← De mock
  imagen: vistaDetalle.imagen,       // ← De mock
  precioUnitarioIvaIncluido: vistaDetalle.precioIvaIncluido,  // ← De mock
  cantidad,
  etiquetasComerciales: producto.etiquetasComerciales,  // ← De mock
  variante: vistaDetalle.varianteSeleccionada
    ? { /* ... */ }
    : null,
});
```

**No hay validación que confirme:**
- ❌ Que el producto exista en BD
- ❌ Que el precio sea el actual de BD
- ❌ Que el producto esté activo
- ❌ Que tenga stock disponible (no implementado aún)

**Impacto:**
- ❌ Carrito puede tener productos que no existen en BD
- ❌ Precios pueden estar desactualizados
- ❌ Productos descatalogados pueden aparecer en pedido

---

## 3️⃣ CHECKOUT SIN ESTRUCTURAS PROVISIONALES

### Hallazgo: ✅ CORRECTO

**Validación:**

En `src/modulos/checkout/componentes/pagina-checkout-visual.tsx:118-151`, el mapeo es correcto:

```typescript
const solicitud: SolicitudCrearPedido = {
  datosCliente: { /* validado */ },
  direccionDespacho: { /* validado */ },
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
    variante: item.variante ? { /* ... */ } : null,
  })),
};
```

✅ El mapping es **limpio y tipado**. Los datos se envían sin hardcoding adicional.

---

## 4️⃣ SNAPSHOT DEL PEDIDO INCOMPLETO

### Hallazgo: 🔴 CRÍTICO - SOLO 5 CAMPOS DE 18+ REQUERIDOS

**Función que construye snapshot:**

```typescript
// src/modulos/pedidos/repositorios/crear-pedido-supabase.ts:26-40

function construirAtributosSnapshotItem(item: ItemCrearPedido): Record<string, unknown> {
  return {
    categoria: item.categoria,           // ✅
    tipoProducto: item.tipoProducto,     // ✅
    coleccion: item.coleccion ?? null,   // ✅
    etiquetasComerciales: item.etiquetasComerciales ?? [],  // ✅
    variante: item.variante ? { /* ... */ } : null,  // ✅
    // ❌ FALTAN:
    // - idProducto
    // - nombreCompleto
    // - marca
    // - nivel
    // - formato, pesoKg, acabado, efecto, colorHex, compatiblePLA
    // - esDestacado, estado
  };
}
```

**Lo que se guarda en BD (tabla item_pedido):**

```sql
INSERT INTO item_pedido (
  pedido_id,
  producto_id,           -- ← NULL (no se resuelve)
  variante_id,           -- ← NULL (no se resuelve)
  sku_snapshot,          -- ← Incompleto
  nombre_producto_snapshot,  -- ← Solo nombre
  descripcion_producto_snapshot,  -- ← Solo resumen
  atributos_snapshot,    -- ← JSONB con solo 5 campos
  precio_unitario_iva_incluido,
  cantidad,
  subtotal_linea_iva_incluido
)
```

**Impacto:**
- ❌ Imposible auditoría: no se guarda idProducto real
- ❌ Imposible inteligencia de datos: sin marca, nivel, atributos específicos
- ❌ Imposible trazabilidad: sin estado del producto al momento de compra
- ❌ Atributos incompletos: no diferencia entre tipos de producto

**Ejemplo de lo que DEBERÍA guardarse:**

Para un **Filamento PLA**:
```json
{
  "idProducto": "uuid-real-de-bd",
  "nombreCompleto": "Filamento PLA Rekun Spectrum Bosque Sur 750g",
  "marca": "Rekun",
  "nivel": "Consumer",
  "categoria": "Filamentos PLA",
  "tipoProducto": "Consumible",
  "coleccion": "Spectrum Circular",
  "formato": "Bobina de 750g",
  "pesoKg": 0.75,
  "acabado": "Mate",
  "colorHex": "#0D7C66",
  "compatiblePLA": true,
  "esDestacado": true,
  "estado": "activo",
  "etiquetasComerciales": ["Reciclado", "Baja deformacion"]
}
```

Para una **Impresora 3D**:
```json
{
  "idProducto": "uuid-real-de-bd",
  "nombreCompleto": "Impresora 3D Estudio R1 - FDM de escritorio",
  "marca": "Rekun",
  "nivel": "Professional",
  "categoria": "Máquinas 3D",
  "tipoProducto": "Máquina",
  "coleccion": null,
  "tipoMaquina": "FDM",
  "volumenImpresion": "300x300x300mm",
  "tecnologia": "FDM de escritorio",
  "estado": "activo",
  "etiquetasComerciales": ["Nueva", "Calibración asistida"]
}
```

---

## 5️⃣ SOPORTA MÚLTIPLES TIPOS DE PRODUCTO

### Hallazgo: ⚠️ PARCIALMENTE - SIN DIFERENCIACIÓN LÓGICA

**Tipos detectados en mock:**

```typescript
// Del archivo productos-catalogo-mock.ts

productos con tipoProducto:
├─ "Consumible"          (Filamentos PLA)
├─ "Maquina"             (Impresoras 3D)
├─ "Accesorio"           (Secador AirLoop)
└─ "Objeto impreso"      (Organizador, Soporte)
```

✅ **El sistema SOPORTA múltiples tipos** (string flexible en tipos)

❌ **PERO NO DIFERENCIA LÓGICAMENTE:**

- No hay validación específica por tipo
- No hay atributos específicos guardados por tipo
- No hay lógica de cálculo/reglas por tipo
- El snapshot es igual para todos (solo categoria, tipoProducto, coleccion, etiquetas, variante)

**Ejemplo del Problema:**

Un Filamento y una Impresora generan el mismo snapshot:

```json
// FILAMENTO
{
  "categoria": "Filamento PLA ecologico",
  "tipoProducto": "Consumible",
  "coleccion": "Spectrum Circular",
  "etiquetasComerciales": ["Reciclado", "Baja deformacion", "Uso diario"],
  "variante": { /* ... */ }
}

// IMPRESORA (IGUAL ESTRUCTURA, FALTAN CAMPOS)
{
  "categoria": "Maquinas 3D",
  "tipoProducto": "Maquina",
  "coleccion": null,
  "etiquetasComerciales": ["Nueva", "Calibracion asistida", "Volumen medio"],
  "variante": null  // ← Las impresoras no tienen variantes en el mock
}
```

**Lo que DEBERÍA pasar:**

```typescript
// Interface específica por tipo
if (tipoProducto === "Consumible") {
  snapshot.formato = item.formato;      // ← Específico
  snapshot.pesoKg = item.pesoKg;
  snapshot.acabado = item.acabado;
  snapshot.colorHex = item.colorHex;
  snapshot.compatiblePLA = item.compatiblePLA;
}

if (tipoProducto === "Maquina") {
  snapshot.tipoMaquina = item.tipoMaquina;
  snapshot.volumenImpresion = item.volumenImpresion;
  snapshot.tecnologia = item.tecnologia;
}

if (tipoProducto === "Pack") {
  snapshot.contenido = item.contenido;   // Array de items
  snapshot.descuentoPorcentaje = item.descuento;
}
```

---

## 6️⃣ ARQUITECTURA FLEXIBLE PARA NUEVOS PRODUCTOS

### Hallazgo: ⚠️ DISEÑO FLEXIBLE PERO SIN DATOS REALES

**Puntos Positivos:**

✅ Tipos genéricos (string, number, undefined)  
✅ JSONB en BD (permite expansión)  
✅ Sistema de filtros dinámico  
✅ No hay enums hardcodeados  

**Puntos Negativos:**

❌ Sin datos reales en BD, la flexibilidad es teórica  
❌ Sin mapeo BD → TypeScript  
❌ Sin validación de esquema flexible  
❌ Código asume estructura actual de mock  

**Ejemplo de Falta de Flexibilidad Real:**

Si mañana quieres agregar un tipo "Pack" (combo de productos), necesitarías:

```typescript
// Hoy: imposible sin tocar código
{
  tipo: "Pack",
  nombre: "Pack Iniciación 3D",
  contenido: [
    { productoId: "filamento-...", cantidad: 2 },
    { productoId: "impresora-...", cantidad: 1 }
  ]
}

// El código actual NO lo soportaría:
// - No hay tabla pack_producto en BD
// - No hay tipo ProductoPack en TypeScript
// - Snapshot no está preparado para arrays
```

---

## 7️⃣ NO ACOPLADO A IMPRESORAS 3D

### Hallazgo: ✅ CORRECTO - AGNÓSTICO

**Validación:**

El código NO hace suposiciones sobre tipos de producto específicos:

```typescript
// ✅ Código genérico - acepta cualquier tipoProducto
item.categoria        // string genérico
item.tipoProducto     // string genérico
item.coleccion?       // optional
item.etiquetasComerciales?  // genérico

// ✅ Ninguna lógica especial para impresoras
// ✅ Ningún hardcoding de "3D", "FDM", etc.
// ✅ Filtros dinámicos extraen tipoProducto de datos
```

**Ejemplo:**

```typescript
// src/modulos/catalogo/componentes/pagina-catalogo-productos.tsx:32-34
const cantidadTiposProducto = new Set(
  productos.map((producto) => producto.tipoProducto)  // ← Dinámico, no "impresora"
).size;
```

---

## RESUMEN DE PROBLEMAS

| # | Problema | Severidad | Archivo | Solución |
|---|----------|-----------|---------|----------|
| 1 | Pedido usa solo mocks | 🔴 CRÍTICA | obtener-productos-catalogo.ts | Conectar a BD |
| 2 | Carrito depende de mocks | 🔴 CRÍTICA | panel-compra-producto-detalle.tsx | Validar en BD |
| 3 | Checkout bien estructura | ✅ OK | pagina-checkout-visual.tsx | Mantener |
| 4 | Snapshot incompleto | 🔴 CRÍTICA | crear-pedido-supabase.ts | Agregar 13 campos |
| 5 | Sin diferenciación por tipo | 🟠 MAYOR | crear-pedido-supabase.ts | Mapeo condicional |
| 6 | Arquitectura flexible pero sin datos | ⚠️ ADVERTENCIA | servicios/catalogo | Implementar BD |
| 7 | No acoplado a impresoras | ✅ OK | (general) | Mantener |

---

## RECOMENDACIÓN

### ❌ NO CONTINUAR A MÓDULO 17 HASTA QUE:

1. ✅ Se conecte catálogo a BD (reemplazar mocks)
2. ✅ Se amplíe snapshot a 18+ campos
3. ✅ Se agregue validación de productos en BD
4. ✅ Se implemente mapeo específico por tipo de producto
5. ✅ Se valide end-to-end: BD → Catálogo → Carrito → Checkout → Pedido

### Orden de Correcciones (por dependencia):

```
Fase 1: Tipos
  → Extender ProductoCatalogo, EntradaAgregarItemCarrito, ItemCrearPedido
  
Fase 2: Conectar BD
  → obtener-productos-catalogo.ts con query real
  
Fase 3: Validación
  → Confirmar producto existe en BD antes de agregar a carrito
  
Fase 4: Snapshot
  → Expandir construirAtributosSnapshotItem con 13 campos faltantes
  
Fase 5: Test E2E
  → Agregar → Carrito → Checkout → Pedido → Verificar BD
```

**Tiempo estimado:** 2-3 horas (máximo)

---

## PRÓXIMAS ACCIONES

1. Revisar este reporte
2. Aplicar correcciones desde CAMBIOS-CODIGO-LISTOS.md
3. Validar que paso cada criterio
4. **ENTONCES SÍ** proceder a Módulo 17

