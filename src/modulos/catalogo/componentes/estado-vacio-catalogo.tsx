import { EstadoVacio } from "@/compartido/componentes/ui";

export function EstadoVacioCatalogo() {
  return (
    <EstadoVacio
      titulo="No hay productos para mostrar todavia"
      descripcion="La estructura del catalogo ya esta preparada. Cuando la fuente real o los mocks queden vacios, este estado mantiene la experiencia controlada y consistente."
      icono={
        <span aria-hidden="true" className="text-lg tracking-[0.18em]">
          []
        </span>
      }
      claseName="min-h-[18rem]"
    />
  );
}
