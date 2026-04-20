"use client";

export function redireccionarAWebpayPlus(
  urlRedireccion: string,
  tokenRedireccion: string,
) {
  const formulario = document.createElement("form");
  formulario.method = "POST";
  formulario.action = urlRedireccion;

  const campoToken = document.createElement("input");
  campoToken.type = "hidden";
  campoToken.name = "token_ws";
  campoToken.value = tokenRedireccion;

  formulario.appendChild(campoToken);
  document.body.appendChild(formulario);
  formulario.submit();
}
