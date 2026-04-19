# Modulo 7 - Sistema de filtros del catalogo

## Objetivo

Permitir explorar el catalogo por categoria, coleccion, tipo de producto y ordenamiento sin acoplar la interfaz a una fuente fija de datos.

## Estructura del modulo

```text
src/
  app/
    catalogo/
      page.tsx
  modulos/
    catalogo/
      componentes/
        experiencia-catalogo-productos.tsx
        panel-filtros-catalogo.tsx
        resumen-filtros-activos-catalogo.tsx
      hooks/
        use-filtros-catalogo.ts
      tipos/
        filtros-catalogo.ts
      utilidades/
        aplicar-filtros-catalogo.ts
        extraer-opciones-filtros-catalogo.ts
        query-params-catalogo.ts
```

## Decisiones de arquitectura

- `page.tsx` sigue siendo entrada del modulo y solo obtiene datos + query params iniciales.
- El filtrado y el ordenamiento viven en utilidades puras, no dentro de los componentes.
- La sincronizacion de URL vive en `use-filtros-catalogo.ts`, separada del algoritmo de filtrado.
- Las opciones del panel se construyen desde los productos para facilitar el cambio futuro a datos reales.

## Contrato actual de query params

- `categoria`
- `coleccion`
- `tipo`
- `orden`

## Criterio de escalabilidad

Mientras el catalogo siga siendo pequeno o mediano, el filtrado en cliente es suficiente y deja una UX rapida. Cuando el volumen crezca, la interfaz puede conservar este contrato y mover el filtrado al backend o a una capa de repositorio sin rehacer los componentes.
