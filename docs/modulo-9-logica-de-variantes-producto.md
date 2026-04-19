# Modulo 9 - Logica de variantes de producto

## Objetivo

Gestionar variantes de producto de forma escalable para color, peso, formato y futuras extensiones sin convertir cada combinacion en un producto independiente.

## Modelo recomendado

La estructura actual queda pensada para mapear bien a Supabase despues:

- `producto`: entidad padre con informacion comercial base
- `atributo_variante`: define ejes como `color`, `peso`, `formato`
- `opcion_atributo_variante`: opciones posibles por atributo
- `variante_producto`: combinacion concreta con `codigoReferencia`, `precioIvaIncluido` e overrides visuales
- `seleccion_variante`: mapa `atributo -> opcion` usado para resolver la combinacion activa

## Estructura del modulo

```text
src/
  modulos/
    catalogo/
      hooks/
        use-variantes-producto.ts
      utilidades/
        variantes-producto-catalogo.ts
      tipos/
        producto-catalogo.ts
      componentes/
        detalle-producto/
          experiencia-detalle-producto.tsx
          selector-variantes-producto.tsx
          panel-compra-producto-detalle.tsx
```

## Criterios de arquitectura

- El dominio soporta productos con y sin variantes.
- La logica vive en utilidades puras, no dentro del componente visual.
- La ficha de producto consume una `vistaDetalle` resuelta, para que precio, galeria y especificaciones cambien con la misma fuente de verdad.
- La seleccion valida una combinacion concreta, pero no expone stock al usuario.
- La accion de carrito sigue siendo local y no toca pedidos ni checkout.
