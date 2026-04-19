# Modulo 12 - Autenticacion frontend

## Objetivo

Implementar la experiencia de autenticacion frontend de Rekun LAB sin bloquear la compra como invitado, dejando una base clara para conectar despues Supabase Auth real con Google.

## Alcance

- Modulo de acceso en `/acceso`.
- Boton de login con Google.
- Deteccion de sesion autenticada en frontend.
- Cierre de sesion.
- Integracion visual en header y checkout.
- Convivencia entre usuario autenticado e invitado.

## Estructura del modulo

```text
src/
  app/
    acceso/
      page.tsx
  modulos/
    autenticacion/
      componentes/
        acciones-autenticacion-cabecera.tsx
        boton-google-autenticacion.tsx
        pagina-acceso-usuario.tsx
      contexto/
        proveedor-autenticacion.tsx
      hooks/
        use-autenticacion.ts
      servicios/
        cliente-supabase-autenticacion.ts
      tipos/
        autenticacion.ts
      index.ts
```

## Criterios de arquitectura

- `modulos/autenticacion` no contiene logica de compra ni depende del carrito.
- El checkout solo consume el estado autenticado para reflejar la experiencia y precargar datos de forma segura.
- Si `Supabase Auth` no esta configurado, la aplicacion no se rompe: mantiene modo invitado y comunica el estado.
- La sesion vive en un provider global y el resto de la app accede solo mediante `useAutenticacion()`.

