# Modulo 13 - Modelado de datos del negocio

## Objetivo

Definir el dominio del ecommerce de Rekun LAB antes de la base de datos fisica para que productos, clientes, pedidos, cotizaciones y configuracion comercial crezcan sin quedar amarrados al catalogo inicial de impresoras 3D.

## Alcance

- Modelado del dominio como contratos TypeScript y configuraciones declarativas.
- Definicion de entidades principales, relaciones, catalogos auxiliares y criterios de modelado.
- Evaluacion explicita del catalogo real inicial para decidir que va como columna propia, relacion separada, metadato extensible o catalogo auxiliar.
- Sin SQL, sin migraciones, sin UI y sin panel admin.

## Estructura del modulo

```text
src/
  modulos/
    dominio-negocio/
      configuracion/
        catalogos-auxiliares-dominio-negocio.ts
        decisiones-modelado-dominio-negocio.ts
        entidades-principales-dominio-negocio.ts
        relaciones-dominio-negocio.ts
      tipos/
        entidades-dominio-negocio.ts
      index.ts
```

## Entidades principales del dominio

### Catalogo

- `categoria-producto`: jerarquia flexible y administrable.
- `producto`: entidad comercial base del catalogo.
- `variante-producto`: color, peso, formato u otras extensiones futuras.
- `asignacion-categoria-producto`: relacion producto-categoria con soporte para categoria principal.
- `definicion-atributo-producto`: contrato reusable de atributos tecnicos, comerciales o de variante.
- `opcion-atributo-producto`: vocabularios controlados para atributos seleccionables.
- `valor-atributo-producto`: almacenamiento de valores concretos por producto o variante.
- `imagen-producto`: galeria visual con orden y soporte para variante.
- `compatibilidad-producto-material`: relacion flexible para materiales compatibles.

### Clientes y direccion

- `cliente`: soporta cuenta autenticada e invitado.
- `direccion-cliente`: libreta de direcciones reusable.
- `direccion-pedido`: snapshot historico de envio para cada pedido.

### Operacion comercial

- `pedido`: transaccion comercial confirmada.
- `item-pedido`: snapshot por linea del pedido.
- `cotizacion`: solicitud comercial no comprable directamente.
- `item-cotizacion`: referencias y cantidades de la cotizacion.

### Configuracion y catalogos auxiliares

- `configuracion-comercial`: versiona reglas del ecommerce.
- `marca-producto`
- `nivel-comercial-producto`
- `tecnologia-impresion`
- `material`
- `estado-entidad`

## Relaciones clave

- `producto -> variante-producto` (`1:n`)
- `producto -> asignacion-categoria-producto` (`1:n`)
- `producto -> imagen-producto` (`1:n`)
- `producto -> valor-atributo-producto` (`1:n`)
- `producto -> compatibilidad-producto-material` (`n:n`)
- `definicion-atributo-producto -> opcion-atributo-producto` (`1:n`)
- `cliente -> direccion-cliente` (`1:n`)
- `cliente -> pedido` (`1:n`, opcional por compra invitado)
- `pedido -> item-pedido` (`1:n`)
- `pedido -> direccion-pedido` (`1:1`)
- `cliente -> cotizacion` (`1:n`, opcional)
- `cotizacion -> item-cotizacion` (`1:n`)

## Criterios de modelado

### Columna propia

Para datos nucleares, atomicos y de consulta frecuente.

Ejemplos:

- `producto.nombre`
- `producto.slug`
- `producto.skuBase`
- `producto.modeloComercial`
- `producto.precioBaseIvaIncluido`

### Relacion separada

Para datos con cardinalidad multiple, ciclo de vida propio o necesidad de trazabilidad historica.

Ejemplos:

- categorias
- imagenes
- direcciones
- items de pedido
- compatibilidades con materiales

### Metadato extensible

Para datos muy especificos de ciertas lineas que aun no justifican una columna fija.

Ejemplos:

- area de impresion
- consumo energetico
- certificaciones
- notas tecnicas del proveedor

### Catalogo auxiliar

Para vocabularios controlados y administrables que se reutilizan en filtros, formularios y badges.

Ejemplos:

- marca
- nivel comercial
- tecnologia de impresion
- material
- estado por entidad

## Decisiones sobre el catalogo real inicial

- `categoria`: relacion separada (`asignacion-categoria-producto`)
- `nivel`: catalogo auxiliar (`nivel-comercial-producto`)
- `nombreProducto`: columna propia (`producto.nombre`)
- `marca`: catalogo auxiliar (`marca-producto`)
- `modelo`: columna propia (`producto.modeloComercial`)
- `precioCLP`: columna propia (`producto.precioBaseIvaIncluido`)
- `tipoImpresion`: catalogo auxiliar (`tecnologia-impresion`)
- `compatiblePLA`: relacion separada (`compatibilidad-producto-material`)
- `estado`: catalogo auxiliar (`estado-entidad`)

## Decisiones de arquitectura

- El producto no absorbe todo en columnas para no rigidizar el sistema a impresoras 3D.
- Las variantes viven como entidad propia porque el ecommerce ya maneja color, peso y formato, y eso debe escalar.
- Los pedidos y cotizaciones guardan snapshots para evitar que cambios futuros en catalogo o clientes rompan historicos.
- `configuracion-comercial` existe como entidad versionable para trazar reglas vigentes de IVA, envio, compra invitado y cotizaciones.
- Los atributos de producto se resuelven con definicion + opcion + valor para soportar catalogo dinamico y futuras lineas.

## Resultado esperado para Supabase

Este modulo deja una base clara para pasar luego a SQL y migraciones en Supabase sin improvisar tablas rigidas ni perder flexibilidad para nuevas categorias, materiales, maquinas, insumos o servicios.
