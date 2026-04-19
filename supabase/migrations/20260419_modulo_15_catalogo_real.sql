-- ============================================================================
-- MÓDULO 15 - INTEGRACIÓN DE CATÁLOGO REAL REKÜN LAB
-- Fecha: 2026-04-19
-- Descripción: Agregar columnas a tabla producto para soportar catálogo real
--              con 35 productos (filamentos, impresoras, packs)
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. ALTER TABLE: Agregar columnas necesarias a tabla producto
-- ============================================================================

ALTER TABLE public.producto
ADD COLUMN tipo_producto text not null default 'Producto',
ADD COLUMN es_destacado boolean not null default false,
ADD COLUMN coleccion text null,
ADD COLUMN formato text null,
ADD COLUMN peso_kg numeric null,
ADD COLUMN subcategoria text null;

-- Crear índices para optimizar queries
CREATE INDEX producto_tipo_producto_idx ON public.producto(tipo_producto);
CREATE INDEX producto_es_destacado_idx ON public.producto(es_destacado);
CREATE INDEX producto_coleccion_idx ON public.producto(coleccion);

-- Agregar constraints
ALTER TABLE public.producto
ADD CONSTRAINT producto_tipo_producto_no_vacio
  CHECK (tipo_producto IS NOT NULL AND tipo_producto != ''),
ADD CONSTRAINT producto_peso_kg_no_negativo
  CHECK (peso_kg IS NULL OR peso_kg >= 0);

-- ============================================================================
-- 2. SEMILLAS: Marcas (marca_producto)
-- ============================================================================

INSERT INTO public.marca_producto (codigo, nombre, slug)
VALUES
  ('rekun-lab', 'Rekün LAB', 'rekun-lab'),
  ('creality', 'Creality', 'creality'),
  ('bambu-lab', 'Bambu Lab', 'bambu-lab'),
  ('anycubic', 'Anycubic', 'anycubic')
ON CONFLICT (codigo) DO NOTHING;

-- ============================================================================
-- 3. SEMILLAS: Niveles Comerciales (nivel_comercial_producto)
-- ============================================================================

INSERT INTO public.nivel_comercial_producto (codigo, nombre)
VALUES
  ('base', 'Base'),
  ('premium', 'Premium'),
  ('economica', 'Económica'),
  ('intermedia', 'Intermedia'),
  ('avanzada', 'Avanzada'),
  ('industrial', 'Industrial'),
  ('maker', 'Maker'),
  ('wow', 'Wow'),
  ('produccion', 'Producción')
ON CONFLICT (codigo) DO NOTHING;

-- ============================================================================
-- 4. SEMILLAS: Categorías (categoria_producto)
-- ============================================================================

-- Obtener estado_id para categorías (asumiendo "activo" existe)
WITH estado_activo AS (
  SELECT id FROM public.estado_entidad
  WHERE entidad_objetivo = 'categoria-producto' AND codigo = 'activo' LIMIT 1
)
INSERT INTO public.categoria_producto (slug, nombre, estado_id)
SELECT
  'filamentos-pla', 'Filamentos PLA', estado_activo.id
FROM estado_activo
UNION ALL
SELECT 'impresoras-3d', 'Impresoras 3D', estado_activo.id
FROM estado_activo
UNION ALL
SELECT 'packs', 'Packs', estado_activo.id
FROM estado_activo
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 5. SEMILLAS: Material PLA (material)
-- ============================================================================

INSERT INTO public.material (codigo, nombre)
VALUES ('pla', 'PLA Ecológico')
ON CONFLICT (codigo) DO NOTHING;

-- ============================================================================
-- 6. DATOS PRINCIPALES: Insertar 35 Productos
-- ============================================================================

-- Helper: obtener IDs necesarios
WITH ids AS (
  SELECT
    (SELECT id FROM public.marca_producto WHERE codigo = 'rekun-lab') as rekun_id,
    (SELECT id FROM public.marca_producto WHERE codigo = 'creality') as creality_id,
    (SELECT id FROM public.marca_producto WHERE codigo = 'bambu-lab') as bambu_id,
    (SELECT id FROM public.marca_producto WHERE codigo = 'anycubic') as anycubic_id,
    (SELECT id FROM public.nivel_comercial_producto WHERE codigo = 'base') as nivel_base,
    (SELECT id FROM public.nivel_comercial_producto WHERE codigo = 'premium') as nivel_premium,
    (SELECT id FROM public.nivel_comercial_producto WHERE codigo = 'economica') as nivel_economica,
    (SELECT id FROM public.nivel_comercial_producto WHERE codigo = 'intermedia') as nivel_intermedia,
    (SELECT id FROM public.nivel_comercial_producto WHERE codigo = 'avanzada') as nivel_avanzada,
    (SELECT id FROM public.nivel_comercial_producto WHERE codigo = 'industrial') as nivel_industrial,
    (SELECT id FROM public.estado_entidad WHERE entidad_objetivo = 'producto' AND codigo = 'activo') as estado_activo
)
INSERT INTO public.producto (
  slug, sku_base, nombre, resumen, descripcion,
  precio_base_iva_incluido, marca_id, nivel_comercial_id, estado_id,
  tipo_producto, es_destacado, coleccion, formato, peso_kg, subcategoria,
  metadatos
)
SELECT
  -- Filamentos Base (1-5)
  'filamento-negro', 'PROD-001', 'Negro',
  'Filamento PLA Negro de alta calidad',
  'Filamento PLA negro estándar. Acabado mate, ideal para prototipos y piezas de uso diario.',
  17990, ids.rekun_id, ids.nivel_base, ids.estado_activo,
  'Filamento', true, NULL, '1KG', 1, 'Normal',
  jsonb_build_object('nombre_completo', 'Rekün PLA Negro', 'acabado', 'Mate', 'efecto', 'Ninguno', 'color_hex', '#111111', 'compatible_pla', true)
FROM ids
UNION ALL
SELECT
  'filamento-blanco', 'PROD-002', 'Blanco',
  'Filamento PLA Blanco de alta calidad',
  'Filamento PLA blanco estándar. Acabado satinado, ideal para prototipos y piezas de uso diario.',
  17990, ids.rekun_id, ids.nivel_base, ids.estado_activo,
  'Filamento', true, NULL, '1KG', 1, 'Normal',
  jsonb_build_object('nombre_completo', 'Rekün PLA Blanco', 'acabado', 'Satinado', 'efecto', 'Ninguno', 'color_hex', '#F5F5F5', 'compatible_pla', true)
FROM ids
UNION ALL
SELECT
  'filamento-rojo', 'PROD-003', 'Rojo Primario',
  'Filamento PLA Rojo Primario',
  'Filamento PLA rojo primario. Acabado mate, ideal para prototipos visuales.',
  17990, ids.rekun_id, ids.nivel_base, ids.estado_activo,
  'Filamento', false, NULL, '1KG', 1, 'Normal',
  jsonb_build_object('nombre_completo', 'Rekün PLA Rojo Primario', 'acabado', 'Mate', 'efecto', 'Ninguno', 'color_hex', '#D32F2F', 'compatible_pla', true)
FROM ids
UNION ALL
SELECT
  'filamento-azul', 'PROD-004', 'Azul Primario',
  'Filamento PLA Azul Primario',
  'Filamento PLA azul primario. Acabado mate, ideal para prototipos visuales.',
  17990, ids.rekun_id, ids.nivel_base, ids.estado_activo,
  'Filamento', false, NULL, '1KG', 1, 'Normal',
  jsonb_build_object('nombre_completo', 'Rekün PLA Azul Primario', 'acabado', 'Mate', 'efecto', 'Ninguno', 'color_hex', '#1976D2', 'compatible_pla', true)
FROM ids
UNION ALL
SELECT
  'filamento-amarillo', 'PROD-005', 'Amarillo Primario',
  'Filamento PLA Amarillo Primario',
  'Filamento PLA amarillo primario. Acabado satinado, ideal para prototipos visuales.',
  17990, ids.rekun_id, ids.nivel_base, ids.estado_activo,
  'Filamento', false, NULL, '1KG', 1, 'Normal',
  jsonb_build_object('nombre_completo', 'Rekün PLA Amarillo Primario', 'acabado', 'Satinado', 'efecto', 'Ninguno', 'color_hex', '#FBC02D', 'compatible_pla', true)
FROM ids

-- Filamentos Premium Ancestral (6-11)
UNION ALL
SELECT
  'mapu-ocre', 'PROD-006', 'Mapu',
  'Mapu — Ocre Tierra. Filamento premium de colección ancestral.',
  'Filamento PLA premium de la colección Herencia Ancestral. Mapu representa la tierra. Acabado satinado.',
  19990, ids.rekun_id, ids.nivel_premium, ids.estado_activo,
  'Filamento', true, 'Herencia Ancestral', '1KG', 1, 'Premium Ancestral',
  jsonb_build_object('nombre_completo', 'Mapu — Ocre Tierra', 'acabado', 'Satinado', 'efecto', 'Ninguno', 'color_hex', '#C68642', 'compatible_pla', true)
FROM ids
UNION ALL
SELECT
  'leufu-turquesa', 'PROD-007', 'Leufu',
  'Leufu — Turquesa Cristal. Filamento premium de colección ancestral.',
  'Filamento PLA premium de la colección Herencia Ancestral. Leufu representa el río. Acabado brillante con efecto profundidad.',
  19990, ids.rekun_id, ids.nivel_premium, ids.estado_activo,
  'Filamento', true, 'Herencia Ancestral', '1KG', 1, 'Premium Ancestral',
  jsonb_build_object('nombre_completo', 'Leufu — Turquesa Cristal', 'acabado', 'Brillante', 'efecto', 'Profundidad', 'color_hex', '#40E0D0', 'compatible_pla', true)
FROM ids
UNION ALL
SELECT
  'kuyen-blanco', 'PROD-008', 'Kuyen',
  'Kuyen — Blanco Lunar. Filamento premium de colección ancestral.',
  'Filamento PLA premium de la colección Herencia Ancestral. Kuyen representa la luna. Acabado silk con efecto nacarado.',
  19990, ids.rekun_id, ids.nivel_premium, ids.estado_activo,
  'Filamento', false, 'Herencia Ancestral', '1KG', 1, 'Premium Ancestral',
  jsonb_build_object('nombre_completo', 'Kuyen — Blanco Lunar', 'acabado', 'Silk', 'efecto', 'Nacarado', 'color_hex', '#EAEAEA', 'compatible_pla', true)
FROM ids
UNION ALL
SELECT
  'karu-verde', 'PROD-009', 'Karü',
  'Karü — Verde Bosque. Filamento premium de colección ancestral.',
  'Filamento PLA premium de la colección Herencia Ancestral. Karü representa el bosque. Acabado mate.',
  19990, ids.rekun_id, ids.nivel_premium, ids.estado_activo,
  'Filamento', true, 'Herencia Ancestral', '1KG', 1, 'Premium Ancestral',
  jsonb_build_object('nombre_completo', 'Karü — Verde Bosque', 'acabado', 'Mate', 'efecto', 'Ninguno', 'color_hex', '#2E7D32', 'compatible_pla', true)
FROM ids
UNION ALL
SELECT
  'antu-naranjo', 'PROD-010', 'Antü',
  'Antü — Naranjo Solar. Filamento premium de colección ancestral.',
  'Filamento PLA premium de la colección Herencia Ancestral. Antü representa el sol. Acabado brillante.',
  19990, ids.rekun_id, ids.nivel_premium, ids.estado_activo,
  'Filamento', false, 'Herencia Ancestral', '1KG', 1, 'Premium Ancestral',
  jsonb_build_object('nombre_completo', 'Antü — Naranjo Solar', 'acabado', 'Brillante', 'efecto', 'Ninguno', 'color_hex', '#FB8C00', 'compatible_pla', true)
FROM ids
UNION ALL
SELECT
  'kutral-gris', 'PROD-011', 'Kutral',
  'Kutral — Gris Volcánico. Filamento premium de colección ancestral.',
  'Filamento PLA premium de la colección Herencia Ancestral. Kutral representa el volcán. Acabado mate.',
  19990, ids.rekun_id, ids.nivel_premium, ids.estado_activo,
  'Filamento', false, 'Herencia Ancestral', '1KG', 1, 'Premium Ancestral',
  jsonb_build_object('nombre_completo', 'Kutral — Gris Volcánico', 'acabado', 'Mate', 'efecto', 'Ninguno', 'color_hex', '#616161', 'compatible_pla', true)
FROM ids

-- Filamentos Premium Tecnología (12-18)
UNION ALL
SELECT
  'tornasol', 'PROD-012', 'Tornasol',
  'Tornasol — Aurora Multicolor. Filamento premium tecnológico.',
  'Filamento PLA premium de la colección Tecnología. Cambio de color angular. Acabado silk.',
  24990, ids.rekun_id, ids.nivel_premium, ids.estado_activo,
  'Filamento', true, 'Tecnología', '1KG', 1, 'Premium Tecnología',
  jsonb_build_object('nombre_completo', 'Tornasol — Aurora Multicolor', 'acabado', 'Silk', 'efecto', 'Cambio Angular', 'color_hex', '#9C27B0', 'compatible_pla', true)
FROM ids
UNION ALL
SELECT
  'galaxia', 'PROD-013', 'Galaxia',
  'Galaxia — Negro Estelar. Filamento premium tecnológico.',
  'Filamento PLA premium de la colección Tecnología. Efecto partículas. Acabado brillante.',
  23990, ids.rekun_id, ids.nivel_premium, ids.estado_activo,
  'Filamento', true, 'Tecnología', '1KG', 1, 'Premium Tecnología',
  jsonb_build_object('nombre_completo', 'Galaxia — Negro Estelar', 'acabado', 'Brillante', 'efecto', 'Partículas', 'color_hex', '#000000', 'compatible_pla', true)
FROM ids
UNION ALL
SELECT
  'fluor', 'PROD-014', 'Flúor',
  'Flúor — Alta Visibilidad. Filamento premium tecnológico.',
  'Filamento PLA premium de la colección Tecnología. Efecto UV. Acabado brillante. Alta visibilidad.',
  22990, ids.rekun_id, ids.nivel_premium, ids.estado_activo,
  'Filamento', false, 'Tecnología', '1KG', 1, 'Premium Tecnología',
  jsonb_build_object('nombre_completo', 'Flúor — Alta Visibilidad', 'acabado', 'Brillante', 'efecto', 'UV', 'color_hex', '#76FF03', 'compatible_pla', true)
FROM ids
UNION ALL
SELECT
  'termocromico', 'PROD-015', 'Termocrómico',
  'Termocrómico — Cambio Térmico. Filamento premium tecnológico.',
  'Filamento PLA premium de la colección Tecnología. Cambia de color con la temperatura. Acabado variable.',
  26990, ids.rekun_id, ids.nivel_premium, ids.estado_activo,
  'Filamento', false, 'Tecnología', '1KG', 1, 'Premium Tecnología',
  jsonb_build_object('nombre_completo', 'Termocrómico — Cambio Térmico', 'acabado', 'Variable', 'efecto', 'Temperatura', 'color_hex', '#FF5722', 'compatible_pla', true)
FROM ids
UNION ALL
SELECT
  'bicolor', 'PROD-016', 'Bi-Color',
  'Bi-Color — Dual Flow. Filamento premium tecnológico.',
  'Filamento PLA premium de la colección Tecnología. Doble color con dual flow. Acabado silk.',
  24990, ids.rekun_id, ids.nivel_premium, ids.estado_activo,
  'Filamento', false, 'Tecnología', '1KG', 1, 'Premium Tecnología',
  jsonb_build_object('nombre_completo', 'Bi-Color — Dual Flow', 'acabado', 'Silk', 'efecto', 'Doble Color', 'color_hex', '#3F51B5', 'compatible_pla', true)
FROM ids
UNION ALL
SELECT
  'tricolor', 'PROD-017', 'Tri-Color',
  'Tri-Color — Spectrum Shift. Filamento premium tecnológico.',
  'Filamento PLA premium de la colección Tecnología. Triple color con spectrum shift. Acabado silk.',
  25990, ids.rekun_id, ids.nivel_premium, ids.estado_activo,
  'Filamento', false, 'Tecnología', '1KG', 1, 'Premium Tecnología',
  jsonb_build_object('nombre_completo', 'Tri-Color — Spectrum Shift', 'acabado', 'Silk', 'efecto', 'Triple Color', 'color_hex', '#673AB7', 'compatible_pla', true)
FROM ids
UNION ALL
SELECT
  'glow', 'PROD-018', 'Fosforescente',
  'Lumen — Glow. Filamento premium tecnológico.',
  'Filamento PLA premium de la colección Tecnología. Fosforescente. Acabado semi mate. Efecto luminiscente.',
  23990, ids.rekun_id, ids.nivel_premium, ids.estado_activo,
  'Filamento', false, 'Tecnología', '1KG', 1, 'Premium Tecnología',
  jsonb_build_object('nombre_completo', 'Lumen — Glow', 'acabado', 'Semi Mate', 'efecto', 'Luminiscente', 'color_hex', '#CCFF90', 'compatible_pla', true)
FROM ids

-- Impresoras Económicas (19-21)
UNION ALL
SELECT
  'ender3-v3-se', 'PROD-019', 'Ender 3 V3 SE',
  'Impresora 3D Ender 3 V3 SE',
  'Impresora FDM de escritorio de nivel económico. Perfecta para iniciarse en impresión 3D. Marca Creality.',
  299990, ids.creality_id, ids.nivel_economica, ids.estado_activo,
  'Impresora', true, NULL, 'N/A', 0, 'Económica',
  jsonb_build_object('nombre_completo', 'Impresora 3D Ender 3 V3 SE', 'compatible_pla', true)
FROM ids
UNION ALL
SELECT
  'a1-mini', 'PROD-020', 'A1 Mini',
  'Impresora 3D Bambu A1 Mini',
  'Impresora FDM de escritorio de nivel económico. Marca Bambu Lab. Excelente relación precio-rendimiento.',
  379990, ids.bambu_id, ids.nivel_economica, ids.estado_activo,
  'Impresora', true, NULL, 'N/A', 0, 'Económica',
  jsonb_build_object('nombre_completo', 'Impresora 3D Bambu A1 Mini', 'compatible_pla', true)
FROM ids
UNION ALL
SELECT
  'kobra-2-neo', 'PROD-021', 'Kobra 2 Neo',
  'Impresora 3D Kobra 2 Neo',
  'Impresora FDM de escritorio de nivel económico. Marca Anycubic. Buena velocidad de impresión.',
  289990, ids.anycubic_id, ids.nivel_economica, ids.estado_activo,
  'Impresora', false, NULL, 'N/A', 0, 'Económica',
  jsonb_build_object('nombre_completo', 'Impresora 3D Kobra 2 Neo', 'compatible_pla', true)
FROM ids

-- Impresoras Intermedia (22-24)
UNION ALL
SELECT
  'a1-combo', 'PROD-022', 'A1 Combo',
  'Impresora 3D A1 Combo',
  'Impresora FDM de escritorio de nivel intermedio. Marca Bambu Lab. Con sistema de purga de colores.',
  479990, ids.bambu_id, ids.nivel_intermedia, ids.estado_activo,
  'Impresora', true, NULL, 'N/A', 0, 'Intermedia',
  jsonb_build_object('nombre_completo', 'Impresora 3D A1 Combo', 'compatible_pla', true)
FROM ids
UNION ALL
SELECT
  'kobra-s1', 'PROD-023', 'Kobra S1',
  'Impresora 3D Kobra S1',
  'Impresora FDM de escritorio de nivel intermedio. Marca Anycubic. Alto volumen de impresión.',
  848990, ids.anycubic_id, ids.nivel_intermedia, ids.estado_activo,
  'Impresora', false, NULL, 'N/A', 0, 'Intermedia',
  jsonb_build_object('nombre_completo', 'Impresora 3D Kobra S1', 'compatible_pla', true)
FROM ids
UNION ALL
SELECT
  'ender-s1-pro', 'PROD-024', 'Ender S1 Pro',
  'Impresora 3D Ender S1 Pro',
  'Impresora FDM de escritorio de nivel intermedio. Marca Creality. Nivelación automática mejorada.',
  499990, ids.creality_id, ids.nivel_intermedia, ids.estado_activo,
  'Impresora', false, NULL, 'N/A', 0, 'Intermedia',
  jsonb_build_object('nombre_completo', 'Impresora 3D Ender S1 Pro', 'compatible_pla', true)
FROM ids

-- Impresoras Avanzada (25-26)
UNION ALL
SELECT
  'p1s', 'PROD-025', 'P1S',
  'Impresora 3D P1S',
  'Impresora FDM de escritorio de nivel avanzado. Marca Bambu Lab. Impresión rápida y multicolor.',
  934990, ids.bambu_id, ids.nivel_avanzada, ids.estado_activo,
  'Impresora', true, NULL, 'N/A', 0, 'Avanzada',
  jsonb_build_object('nombre_completo', 'Impresora 3D P1S', 'compatible_pla', true)
FROM ids
UNION ALL
SELECT
  'k2-pro', 'PROD-026', 'K2 Pro Combo',
  'Impresora 3D K2 Pro Combo',
  'Impresora FDM de escritorio de nivel avanzado. Marca Creality. Gran volumen y velocidad.',
  999990, ids.creality_id, ids.nivel_avanzada, ids.estado_activo,
  'Impresora', false, NULL, 'N/A', 0, 'Avanzada',
  jsonb_build_object('nombre_completo', 'Impresora 3D K2 Pro Combo', 'compatible_pla', true)
FROM ids
UNION ALL
SELECT
  'x1c', 'PROD-027', 'X1C Combo',
  'Impresora 3D X1C Combo',
  'Impresora FDM de escritorio de nivel avanzado. Marca Bambu Lab. Máxima velocidad y calidad.',
  1459990, ids.bambu_id, ids.nivel_avanzada, ids.estado_activo,
  'Impresora', true, NULL, 'N/A', 0, 'Avanzada',
  jsonb_build_object('nombre_completo', 'Impresora 3D X1C Combo', 'compatible_pla', true)
FROM ids

-- Impresoras Industrial (28-30)
UNION ALL
SELECT
  'k2-plus', 'PROD-028', 'K2 Plus',
  'Impresora 3D K2 Plus Combo',
  'Impresora FDM industrial de nivel producción. Marca Creality. Volumen extra grande.',
  1359990, ids.creality_id, ids.nivel_industrial, ids.estado_activo,
  'Impresora', false, NULL, 'N/A', 0, 'Industrial',
  jsonb_build_object('nombre_completo', 'Impresora 3D K2 Plus Combo', 'compatible_pla', true)
FROM ids
UNION ALL
SELECT
  'sermoon-d3', 'PROD-029', 'Sermoon D3',
  'Impresora 3D Sermoon D3',
  'Impresora FDM industrial de nivel producción. Marca Creality. Sistema de cámara caliente integrada.',
  1469990, ids.creality_id, ids.nivel_industrial, ids.estado_activo,
  'Impresora', false, NULL, 'N/A', 0, 'Industrial',
  jsonb_build_object('nombre_completo', 'Impresora 3D Sermoon D3', 'compatible_pla', true)
FROM ids
UNION ALL
SELECT
  'h2d', 'PROD-030', 'H2D',
  'Impresora 3D H2D',
  'Impresora FDM industrial de nivel producción. Marca Bambu Lab. Solución de fabricación de lotes grandes.',
  2549990, ids.bambu_id, ids.nivel_industrial, ids.estado_activo,
  'Impresora', false, NULL, 'N/A', 0, 'Industrial',
  jsonb_build_object('nombre_completo', 'Impresora 3D H2D', 'compatible_pla', true)
FROM ids

-- Packs (31-35)
UNION ALL
SELECT
  'starter-rekun', 'PROD-031', 'Starter Rekün',
  'Pack Starter Rekün',
  'Pack de iniciación a la impresión 3D. Incluye todo lo necesario para comenzar. Nivel starter.',
  259990, ids.rekun_id, ids.nivel_base, ids.estado_activo,
  'Pack', true, NULL, 'N/A', 0, 'Entrada',
  jsonb_build_object('nombre_completo', 'Pack Starter Rekün', 'compatible_pla', true)
FROM ids
UNION ALL
SELECT
  'maker-lab', 'PROD-032', 'Maker Lab',
  'Pack Maker Lab',
  'Pack para makers y pequeños talleres. Solución integrada de impresión 3D. Nivel maker.',
  559990, ids.rekun_id, ids.nivel_premium, ids.estado_activo,
  'Pack', true, NULL, 'N/A', 0, 'Intermedio',
  jsonb_build_object('nombre_completo', 'Pack Maker Lab', 'compatible_pla', true)
FROM ids
UNION ALL
SELECT
  'rekun-pro', 'PROD-033', 'Rekün Pro',
  'Pack Emprendedor Rekün',
  'Pack para emprendedores y pequeñas empresas. Solución completa de fabricación. Nivel pro.',
  979990, ids.rekun_id, ids.nivel_premium, ids.estado_activo,
  'Pack', true, NULL, 'N/A', 0, 'Avanzado',
  jsonb_build_object('nombre_completo', 'Pack Emprendedor Rekün', 'compatible_pla', true)
FROM ids
UNION ALL
SELECT
  'wow-pack', 'PROD-034', 'Wow Pack',
  'Pack Premium Visual',
  'Pack premium para creativos y diseñadores. Máxima calidad y acabado. Nivel wow.',
  1099990, ids.rekun_id, ids.nivel_premium, ids.estado_activo,
  'Pack', false, NULL, 'N/A', 0, 'Premium',
  jsonb_build_object('nombre_completo', 'Pack Premium Visual', 'compatible_pla', true)
FROM ids
UNION ALL
SELECT
  'production-pack', 'PROD-035', 'Production Pack',
  'Pack Producción Rekün',
  'Pack industrial para producción en lotes. Máxima capacidad y automatización. Nivel producción.',
  1390000, ids.rekun_id, ids.nivel_industrial, ids.estado_activo,
  'Pack', false, NULL, 'N/A', 0, 'Industrial',
  jsonb_build_object('nombre_completo', 'Pack Producción Rekün', 'compatible_pla', true)
FROM ids;

-- ============================================================================
-- 7. ASIGNAR CATEGORÍAS A PRODUCTOS
-- ============================================================================

-- Obtener IDs necesarios
WITH ids AS (
  SELECT
    (SELECT id FROM public.categoria_producto WHERE slug = 'filamentos-pla') as cat_filamentos,
    (SELECT id FROM public.categoria_producto WHERE slug = 'impresoras-3d') as cat_impresoras,
    (SELECT id FROM public.categoria_producto WHERE slug = 'packs') as cat_packs
),
productos_filamentos AS (
  SELECT id FROM public.producto WHERE tipo_producto = 'Filamento'
),
productos_impresoras AS (
  SELECT id FROM public.producto WHERE tipo_producto = 'Impresora'
),
productos_packs AS (
  SELECT id FROM public.producto WHERE tipo_producto = 'Pack'
)
INSERT INTO public.asignacion_categoria_producto (producto_id, categoria_id, es_principal, orden_visual)
SELECT pf.id, ids.cat_filamentos, true, 0 FROM productos_filamentos pf, ids
UNION ALL
SELECT pi.id, ids.cat_impresoras, true, 0 FROM productos_impresoras pi, ids
UNION ALL
SELECT pp.id, ids.cat_packs, true, 0 FROM productos_packs pp, ids
ON CONFLICT (producto_id, categoria_id) DO NOTHING;

-- ============================================================================
-- 8. CREAR COMPATIBILIDADES PLA
-- ============================================================================

WITH material_pla AS (
  SELECT id FROM public.material WHERE codigo = 'pla'
),
productos_compatibles AS (
  SELECT id FROM public.producto WHERE metadatos->>'compatible_pla' = 'true'
)
INSERT INTO public.compatibilidad_producto_material (producto_id, material_id, observacion)
SELECT pc.id, mp.id, 'Filamento compatible con PLA'
FROM productos_compatibles pc, material_pla mp
ON CONFLICT (producto_id, material_id) DO NOTHING;

-- ============================================================================
-- 9. VALIDACIÓN FINAL
-- ============================================================================

-- Verificar conteos
SELECT
  (SELECT COUNT(*) FROM public.producto) as total_productos,
  (SELECT COUNT(*) FROM public.producto WHERE tipo_producto = 'Filamento') as count_filamentos,
  (SELECT COUNT(*) FROM public.producto WHERE tipo_producto = 'Impresora') as count_impresoras,
  (SELECT COUNT(*) FROM public.producto WHERE tipo_producto = 'Pack') as count_packs,
  (SELECT COUNT(*) FROM public.asignacion_categoria_producto) as categorias_asignadas,
  (SELECT COUNT(*) FROM public.compatibilidad_producto_material) as compatibilidades_pla;

COMMIT;
