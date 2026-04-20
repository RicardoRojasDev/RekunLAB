import "server-only";

import {
  Environment,
  IntegrationApiKeys,
  IntegrationCommerceCodes,
  Options,
  WebpayPlus,
} from "transbank-sdk";
import {
  obtenerVariableEntorno,
  obtenerVariableEntornoOpcional,
} from "@/compartido/configuracion/entorno";
import type { ProveedorPago } from "../tipos/pagos";

type AmbienteWebpay = "integracion" | "produccion";

type ConfiguracionWebpayPlus = Readonly<{
  proveedor: ProveedorPago;
  ambiente: AmbienteWebpay;
  codigoComercio: string;
  apiKey: string;
  urlRetorno: string;
}>;

export type RespuestaCrearTransaccionWebpayPlus = Readonly<{
  token: string;
  url: string;
  raw: Record<string, unknown>;
}>;

export type RespuestaConfirmarTransaccionWebpayPlus = Readonly<{
  vci: string | null;
  amount: number | null;
  status: string | null;
  buyOrder: string | null;
  sessionId: string | null;
  cardDetail: Readonly<{ cardNumber: string | null }> | null;
  accountingDate: string | null;
  transactionDate: string | null;
  authorizationCode: string | null;
  paymentTypeCode: string | null;
  responseCode: number | null;
  installmentsAmount: number | null;
  installmentsNumber: number | null;
  balance: number | null;
  raw: Record<string, unknown>;
}>;

function normalizarUrlBase(urlBase: string) {
  return urlBase.endsWith("/") ? urlBase.slice(0, -1) : urlBase;
}

function obtenerConfiguracionWebpayPlus(): ConfiguracionWebpayPlus {
  const ambiente =
    (obtenerVariableEntornoOpcional("TRANSBANK_WEBPAY_AMBIENTE") as AmbienteWebpay | null) ??
    "integracion";
  const urlBase = normalizarUrlBase(obtenerVariableEntorno("NEXT_PUBLIC_URL_BASE"));

  if (ambiente !== "integracion" && ambiente !== "produccion") {
    throw new Error(
      "TRANSBANK_WEBPAY_AMBIENTE debe ser 'integracion' o 'produccion'.",
    );
  }

  const codigoComercio =
    ambiente === "produccion"
      ? obtenerVariableEntorno("TRANSBANK_WEBPAY_COMMERCE_CODE")
      : obtenerVariableEntornoOpcional("TRANSBANK_WEBPAY_COMMERCE_CODE") ??
        IntegrationCommerceCodes.WEBPAY_PLUS;

  const apiKey =
    ambiente === "produccion"
      ? obtenerVariableEntorno("TRANSBANK_WEBPAY_API_KEY")
      : obtenerVariableEntornoOpcional("TRANSBANK_WEBPAY_API_KEY") ??
        IntegrationApiKeys.WEBPAY;

  return {
    proveedor: "webpay-plus",
    ambiente,
    codigoComercio,
    apiKey,
    urlRetorno: `${urlBase}/api/pagos/webpay-plus/retorno`,
  };
}

function crearClienteWebpayPlus() {
  const configuracion = obtenerConfiguracionWebpayPlus();
  const environment =
    configuracion.ambiente === "produccion"
      ? Environment.Production
      : Environment.Integration;

  return {
    configuracion,
    transaccion: new WebpayPlus.Transaction(
      new Options(configuracion.codigoComercio, configuracion.apiKey, environment),
    ),
  };
}

function obtenerNumeroSeguro(valor: unknown) {
  return typeof valor === "number" && Number.isFinite(valor) ? valor : null;
}

function obtenerTextoSeguro(valor: unknown) {
  return typeof valor === "string" && valor.trim().length ? valor : null;
}

function normalizarRespuestaConfirmacion(
  respuesta: Record<string, unknown>,
): RespuestaConfirmarTransaccionWebpayPlus {
  const detalleTarjeta =
    typeof respuesta.card_detail === "object" && respuesta.card_detail !== null
      ? (respuesta.card_detail as Record<string, unknown>)
      : null;

  return {
    vci: obtenerTextoSeguro(respuesta.vci),
    amount: obtenerNumeroSeguro(respuesta.amount),
    status: obtenerTextoSeguro(respuesta.status),
    buyOrder: obtenerTextoSeguro(respuesta.buy_order),
    sessionId: obtenerTextoSeguro(respuesta.session_id),
    cardDetail: detalleTarjeta
      ? {
          cardNumber: obtenerTextoSeguro(detalleTarjeta.card_number),
        }
      : null,
    accountingDate: obtenerTextoSeguro(respuesta.accounting_date),
    transactionDate: obtenerTextoSeguro(respuesta.transaction_date),
    authorizationCode: obtenerTextoSeguro(respuesta.authorization_code),
    paymentTypeCode: obtenerTextoSeguro(respuesta.payment_type_code),
    responseCode: obtenerNumeroSeguro(respuesta.response_code),
    installmentsAmount: obtenerNumeroSeguro(respuesta.installments_amount),
    installmentsNumber: obtenerNumeroSeguro(respuesta.installments_number),
    balance: obtenerNumeroSeguro(respuesta.balance),
    raw: respuesta,
  };
}

export function obtenerConfiguracionPagoWebpayPlus() {
  return obtenerConfiguracionWebpayPlus();
}

export async function crearTransaccionWebpayPlus(params: Readonly<{
  ordenCompra: string;
  sessionId: string;
  monto: number;
}>): Promise<RespuestaCrearTransaccionWebpayPlus> {
  const { configuracion, transaccion } = crearClienteWebpayPlus();

  const respuesta = (await transaccion.create(
    params.ordenCompra,
    params.sessionId,
    params.monto,
    configuracion.urlRetorno,
  )) as Record<string, unknown>;

  const token = obtenerTextoSeguro(respuesta.token);
  const url = obtenerTextoSeguro(respuesta.url);

  if (!token || !url) {
    throw new Error(
      "Transbank no devolvio token y url validos al crear la transaccion.",
    );
  }

  return {
    token,
    url,
    raw: respuesta,
  };
}

export async function confirmarTransaccionWebpayPlus(
  token: string,
): Promise<RespuestaConfirmarTransaccionWebpayPlus> {
  const { transaccion } = crearClienteWebpayPlus();
  const respuesta = (await transaccion.commit(token)) as Record<string, unknown>;
  return normalizarRespuestaConfirmacion(respuesta);
}

export async function obtenerEstadoTransaccionWebpayPlus(
  token: string,
): Promise<RespuestaConfirmarTransaccionWebpayPlus> {
  const { transaccion } = crearClienteWebpayPlus();
  const respuesta = (await transaccion.status(token)) as Record<string, unknown>;
  return normalizarRespuestaConfirmacion(respuesta);
}
