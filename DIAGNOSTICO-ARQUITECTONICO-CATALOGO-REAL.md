# DIAGNÓSTICO ARQUITECTÓNICO - Integración de Catálogo Real

**Fecha:** 2026-04-19
**Rol:** Arquitecto de Software especialista en PostgreSQL/Supabase
**Status:** PRE-IMPLEMENTACIÓN

---

## 1️⃣ ANÁLISIS COMPARATIVO: ESTRUCTURA ACTUAL vs. CATÁLOGO REAL

### Estructura Actual (Módulo 14)

```sql
TABLE producto
├─ id (uuid)                          [PK]
├─ slug (text)                        [UNIQUE]
├─ sku_base (text)                    [UNIQUE]
├─ nombre (text)
├─ modelo_comercial (text)            [NULLABLE]
├─ resumen (text)
├─ descripcion (text)
├─ precio_base_iva_incluido (integer)
├─ marca_id (uuid)                    [FK → marca_producto]
├─ nivel_comercial_id (uuid)          [FK → nivel_comercial_producto]
├─ tecnologia_impresion_id (uuid)     [FK → tecnologia_impresion]
├─ estado_id (uuid)                   [FK → estado_entidad]
├─ vende_directo (boolean)
├─ permite_cotizacion (boolean)
└─ metadatos (jsonb)
   
RELATED TABLES:
├─ asignacion_categoria_producto      [M-to-M con categoria_producto]
├─ variante_producto                  [Para variantes (color, peso, etc)]
├─ valor_atributo_producto            [Atributos dinámicos]
├─ imagen_producto                    [Galería de imágenes]
└─ compatibilidad_producto_material   [PLA, PETG, etc.]
```

### Catálogo Real (CSV Provided)

```
CAMPOS EN CSV:
├─ id (integer)
├─ slug (text)
├─ categoria (text)                   ← MAPEADO a asignacion_categoria_producto
├─ subcategoria (text)                ← FALTA EN TABLA
├─ nivel (text)                       ← MAPEADO a nivel_comercial_producto.nombre
├─ nombre (text)
├─ nombreCompleto (text)              ← FALTA EN TABLA (ir en descripcion o field nuevo)
├─ marca (text)                       ← MAPEADO a marca_producto.nombre
├─ tipoProducto (text)                ← CRÍTICO: FALTA (Filamento, Impresora, Pack)
├─ precioCLP (integer)                ← MAPEADO a precio_base_iva_incluido
├─ formato (text)                     ← FALTA (1KG, N/A, etc.)
├─ pesoKg (numeric)                   ← FALTA (1, 0, etc.)
├─ acabado (text)                     ← FALTA (Mate, Satinado, Brillante, etc.)
├─ efecto (text)                      ← FALTA (UV, Partículas, Cambio Angular, etc.)
├─ colorHex (text)                    ← FALTA (#111111, #40E0D0, etc.)
├─ compatiblePLA (text)               ← MAPEADO a compatibilidad_producto_material
├─ coleccion (text)                   ← FALTA (Herencia Ancestral, Tecnología, N/A)
├─ esDestacado (boolean)              ← FALTA (true/false)
└─ estado (text)                      ← MAPEADO a estado_entidad.nombre
```

---

## 2️⃣ GAP ANALYSIS: CAMPOS FALTANTES

| Campo CSV | Mapeado a | Ubicación Actual | Acción Necesaria |
|-----------|-----------|------------------|------------------|
| id | id | producto.id ✅ | Usar como sku_base |
| slug | slug | producto.slug ✅ | Directo |
| categoria | asignacion_categoria_producto | ✅ Existe | INSERT en tabla M-to-M |
| **subcategoria** | ❌ **FALTA** | — | ➊ Agregar a metadatos |
| nivel | nivel_comercial_id | ✅ Existe | JOIN con nivel_comercial_producto |
| nombre | nombre | producto.nombre ✅ | Directo |
| **nombreCompleto** | ❌ **FALTA** | — | ➊ Agregar a descripcion O columna nueva |
| marca | marca_id | ✅ Existe | JOIN con marca_producto |
| **tipoProducto** | ❌ **CRÍTICO** | — | ➊ **Agregar columna** (queryable) |
| precioCLP | precio_base_iva_incluido | ✅ Existe | Directo |
| **formato** | ❌ **FALTA** | — | ➋ Agregar columna (queryable) |
| **pesoKg** | ❌ **FALTA** | — | ➋ Agregar columna (queryable) |
| **acabado** | ❌ **FALTA** | — | ➊ Metadatos (específico por tipo) |
| **efecto** | ❌ **FALTA** | — | ➊ Metadatos (específico por tipo) |
| **colorHex** | ❌ **FALTA** | — | ➊ Metadatos (específico por tipo) |
| compatiblePLA | compatibilidad_producto_material | ✅ Existe | INSERT en tabla material |
| **coleccion** | ❌ **FALTA** | — | ➊ Agregar columna (queryable) |
| **esDestacado** | ❌ **FALTA** | — | ➋ Agregar columna (queryable) |
| estado | estado_id | ✅ Existe | JOIN con estado_entidad |

**Leyenda:**
- ✅ = Campo soportado en estructura actual
- ❌ = Campo falta en estructura actual
- ➊ = Guardar en metadatos JSONB
- ➋ = Agregar columna a tabla (para queryability)

---

## 3️⃣ DECISIÓN ARQUITECTÓNICA: NORMALIZACIÓN vs. DESNORMALIZACIÓN

### Análisis del Catálogo Real

**Patrones Observados:**

#### Filamentos (18 productos):
```
Campos comunes:       SIEMPRE se usan
  - tipoProducto:    "Filamento" (100%)
  - formato:         "1KG" (100%)
  - pesoKg:          1 (100%)
  - compatiblePLA:   "Si" (100%)

Campos específicos:   Varían mucho
  - acabado:         Mate, Satinado, Brillante, Silk, Semi Mate, Variable
  - efecto:          Ninguno, UV, Partículas, Cambio Angular, Temperatura, etc.
  - colorHex:        Múltiples valores
  - coleccion:       Herencia Ancestral, Tecnología, N/A

Queryability:        ⭐⭐⭐ (frecuente filtrado por tipoProducto, colección, destacado)
```

#### Impresoras (12 productos):
```
Campos comunes:       SIEMPRE iguales
  - tipoProducto:    "Impresora" (100%)
  - formato:         "N/A" (100%)
  - pesoKg:          0 (100%)
  - colorHex:        "#000000" (100%)
  - acabado:         "N/A" (100%)
  - efecto:          "N/A" (100%)

Campos específicos:   Variable
  - subcategoria:    Económica, Intermedia, Avanzada, Industrial
  - coleccion:       "N/A" (100%)

Queryability:        ⭐⭐ (filtrado por tipoProducto, nivel, subcategoria, destacado)
```

#### Packs (5 productos):
```
Campos comunes:       SIEMPRE iguales
  - tipoProducto:    "Pack" (100%)
  - formato:         "N/A" (100%)
  - pesoKg:          0 (100%)
  - colorHex:        "#000000" (100%)
  - acabado:         "N/A" (100%)
  - efecto:          "N/A" (100%)
  - coleccion:       "N/A" (100%)

Campos específicos:   Variable
  - subcategoria:    Entrada, Intermedio, Avanzado, Premium, Industrial
  - nombre:          Custom

Queryability:        ⭐ (filtrado por tipoProducto, nivel, destacado)
```

### Recomendación: OPCIÓN 3 (Híbrida - Recomendada)

**Principio:** "Normalizar lo que se queryea, desnormalizar lo que es específico"

```
COLUMNAS A AGREGAR (directamente en tabla producto):
├─ tipo_producto TEXT NOT NULL                [Filamento, Impresora, Pack]
├─ es_destacado BOOLEAN DEFAULT false         [true/false - filtrable]
├─ coleccion TEXT NULLABLE                    [Herencia Ancestral, Tecnología, etc.]
├─ formato TEXT NULLABLE                      [1KG, N/A - queryable]
├─ peso_kg NUMERIC NULLABLE                   [1, 0 - queryable, útil para logística]
└─ subcategoria TEXT NULLABLE                 [Normal, Premium, Económica, etc.]

DATOS EN METADATOS JSONB (específicos por tipo):
├─ "acabado": "Mate"                          [Filamentos]
├─ "efecto": "UV"                             [Filamentos]
├─ "color_hex": "#111111"                     [Filamentos, Impresoras (defaultnegro)]
├─ "nombre_completo": "Rekün PLA Negro"       [Todos]
├─ "compatible_pla": true                     [Redundante pero útil]
└─ [Flexible para futuros campos por tipo]

TABLAS EXISTENTES A USAR:
├─ asignacion_categoria_producto              [M-to-M para categoría]
├─ marca_id                                   [FK a marca_producto]
├─ nivel_comercial_id                         [FK a nivel_comercial_producto]
├─ estado_id                                  [FK a estado_entidad]
└─ compatibilidad_producto_material           [M-to-M para PLA/PETG/etc.]
```

**Ventajas:**

✅ **Queryability:** Se puede filtrar rápidamente por tipo_producto, colección, destacado, nivel, formato  
✅ **Flexibilidad:** JSONB permite agregar campos futuros sin alterar esquema  
✅ **Performance:** Índices en columnas de uso frecuente (tipo_producto, es_destacado)  
✅ **Normalización Moderada:** No rigidiza la tabla  
✅ **Admin-friendly:** Puede editar cualquier campo sin limitaciones  
✅ **Agnóstico:** Soporta nuevos tipos de producto sin cambios de schema  

**Desventajas:**

- Algunos campos específicos (acabado) no son queryables directamente (pero usado rara vez en búsquedas)
- Requiere parsear JSONB para algunos atributos en frontend

**Alternativas Rechazadas:**

❌ **Opción 1 (Solo JSONB):** Todo en metadatos
   - Problema: tipo_producto, colección, destacado NO queryables. Ineficiente.

❌ **Opción 2 (Solo Columnas):** Todas en tabla
   - Problema: Tabla muy ancha, rigidiza para nuevos tipos, no escalable

---

## 4️⃣ NECESIDAD DE ALTERACIÓN DE SCHEMA

### SQL de Alteración (Nueva Migración)

```sql
-- Nuevo archivo: supabase/migrations/20260419_modulo_15_catalogo_real.sql

-- Agregar columnas a tabla producto para soportar catálogo real
ALTER TABLE public.producto
ADD COLUMN tipo_producto text not null default 'Producto',
ADD COLUMN es_destacado boolean not null default false,
ADD COLUMN coleccion text null,
ADD COLUMN formato text null,
ADD COLUMN peso_kg numeric null,
ADD COLUMN subcategoria text null;

-- Crear índices para mejor performance en queries
CREATE INDEX producto_tipo_producto_idx ON public.producto(tipo_producto);
CREATE INDEX producto_es_destacado_idx ON public.producto(es_destacado);
CREATE INDEX producto_coleccion_idx ON public.producto(coleccion);

-- Validaciones
ALTER TABLE public.producto
ADD CONSTRAINT producto_tipo_producto_no_vacio check (tipo_producto is not null and tipo_producto != ''),
ADD CONSTRAINT producto_peso_kg_no_negativo check (peso_kg is null or peso_kg >= 0);
```

### Campos en METADATOS (JSONB)

Los siguientes campos se guardan en columna `metadatos` como JSON:

```json
{
  "nombre_completo": "Rekün PLA Negro",
  "acabado": "Mate",
  "efecto": "Ninguno",
  "color_hex": "#111111",
  "compatible_pla": true
}
```

**Por qué JSONB y no columnas:**
1. **Acabado, Efecto:** Valores no binarios, raramente filtrados
2. **nombreCompleto:** Ya existe en descripcion, duplicar innecesario
3. **color_hex:** Para Impresoras siempre "#000000", poco útil
4. **compatible_pla:** Redundante con compatibilidad_producto_material, pero útil en snapshot

---

## 5️⃣ MAPEO DE DATOS: CSV → BASE DE DATOS

### Estrategia de Carga

```
PASO 1: Crear/Verificar Marcas (marca_producto)
        Input: marca
        Output: marca_id (UUID)
        Marcas necesarias: Rekün LAB, Creality, Bambu Lab, Anycubic

PASO 2: Crear/Verificar Niveles (nivel_comercial_producto)
        Input: nivel
        Output: nivel_comercial_id (UUID)
        Niveles necesarios: Base, Premium, Económica, Intermedia, Avanzada, Industrial

PASO 3: Crear/Verificar Categorías (categoria_producto)
        Input: categoria
        Output: categoria_id (UUID)
        Categorías necesarias: Filamentos PLA, Impresoras 3D, Packs

PASO 4: Crear/Verificar Estados (estado_entidad)
        Input: estado
        Output: estado_id (UUID)
        Estados necesarios: Activo, Inactivo (ya deben existir)

PASO 5: Insertar Productos (producto)
        Mapeo:
          id CSV → sku_base (ej: "1" → "PROD-001")
          slug → slug
          nombre → nombre
          tipoProducto → tipo_producto
          precioCLP → precio_base_iva_incluido
          nivel → nivel_comercial_id (via JOIN)
          marca → marca_id (via JOIN)
          categoría → para asignacion_categoria_producto (paso 7)
          nombreCompleto, acabado, efecto, colorHex, compatible_pla → metadatos
          formato → formato
          pesoKg → peso_kg
          coleccion → coleccion
          esDestacado → es_destacado
          estado → estado_id (via JOIN)

PASO 6: Asignar Categorías (asignacion_categoria_producto)
        Para cada producto:
          INSERT asignacion_categoria_producto
          (producto_id, categoria_id, es_principal=true, orden_visual=0)

PASO 7: Crear Compatibilidades PLA (compatibilidad_producto_material)
        Para productos con compatiblePLA='Si':
          INSERT compatibilidad_producto_material
          (producto_id, material_id, observacion='Compatible con PLA')
        (Requiere identificar material_id para PLA)

PASO 8: Insertar Resumen/Descripción
        Generar resumen corto y descripción para cada tipo:
        Filamentos: "Filamento PLA de alta calidad para impresión 3D"
        Impresoras: "Impresora 3D [modelo] - [nivel de sofisticación]"
        Packs: "Pack [nombre] - Solución completa para [uso]"
```

---

## 6️⃣ CONSIDERACIONES ARQUITECTÓNICAS FINALES

### Escalabilidad

✅ **Nuevos tipos de producto:** Solo agregar valor a tipo_producto, JSONB permite atributos nuevos
✅ **Nuevas categorías/niveles:** Sistema de tablas auxiliares lo soporta
✅ **Nuevas marcas:** Agregar a marca_producto dinámicamente
✅ **Nuevos atributos:** Guardar en metadatos sin cambiar esquema

### Admin Panel

✅ Puede editar cualquier campo de producto
✅ Puede agregar nuevas categorías, marcas, niveles
✅ Puede activar/desactivar productos (estado_id)
✅ Puede cambiar precios, destacados, colecciones
✅ Metadatos JSONB permite custom fields por tipo

### Frontend Integration

✅ Módulo 15 (Catálogo): Query por tipo_producto, colección, destacado
✅ Módulo 16 (Pedidos): Snapshot incluye metadatos completos
✅ Carrito: Puede acceder a todos los campos necesarios
✅ Checkout: Datos completos para auditoría

### Performance

- Índices en: tipo_producto, es_destacado, coleccion, marca_id, nivel_comercial_id, estado_id
- JSONB no indexado (búsquedas raras en esos campos)
- M-to-M tablas optimizadas con índices

---

## 7️⃣ RIESGOS Y MITIGACIONES

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|--------|-----------|
| Datos incompletos | 🔴 | 🟠 | Validar CSV antes de insert |
| SKU duplicados | 🟢 | 🔴 | Constraint UNIQUE en sku_base |
| Slug incorrecto | 🔴 | 🔴 | Validar formato slug antes |
| FK no encontrada | 🟢 | 🔴 | Crear todas las referencias antes de insert |
| Performance baja | 🟢 | 🟠 | Índices en lugar |

---

## 8️⃣ RECOMENDACIÓN FINAL

**Implementar OPCIÓN 3 (Híbrida):**

1. ✅ Crear migración SQL para agregar 6 columnas a producto
2. ✅ Generar SQL INSERT para 35 productos (incluido metadatos)
3. ✅ Poblar marcas, niveles, categorías, estados
4. ✅ Asignar categorías a productos (M-to-M)
5. ✅ Crear compatibilidades PLA
6. ✅ Validar integridad referencial
7. ✅ Deploy a Supabase
8. ✅ Actualizar frontend para usar nuevas columnas

**Tiempo estimado:** 2-3 horas (SQL + testing)

---

## PRÓXIMOS DOCUMENTOS

1. **SQL COMPLETO** para migración y carga
2. **GUÍA DE INTEGRACIÓN** con Módulos 15 y 16
3. **VALIDACIÓN FINAL** de datos

