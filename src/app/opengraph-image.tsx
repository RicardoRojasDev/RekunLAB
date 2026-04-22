import { ImageResponse } from "next/og";
import { configuracionSitio } from "@/compartido/configuracion/sitio";
import { capacidadesMarca } from "@/compartido/configuracion/layout-global";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

function construirLineaCapacidades() {
  return capacidadesMarca.slice(0, 3).join(" · ");
}

export default function ImagenOpenGraph() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background:
            "linear-gradient(135deg, #0b322e 0%, #0d1715 58%, #131b1f 100%)",
          color: "#ffffff",
          padding: 72,
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
          letterSpacing: "-0.02em",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 12% 18%, rgba(201, 243, 106, 0.12), rgba(0,0,0,0) 42%), radial-gradient(circle at 88% 30%, rgba(179, 134, 49, 0.16), rgba(0,0,0,0) 40%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            opacity: 0.22,
            maskImage:
              "radial-gradient(circle at 30% 18%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.1) 56%, rgba(0,0,0,0) 78%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 42,
            left: 72,
            right: 72,
            height: 1,
            background:
              "linear-gradient(90deg, rgba(201,243,106,0.65) 0%, rgba(179,134,49,0.5) 42%, rgba(255,255,255,0.12) 100%)",
            opacity: 0.6,
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                fontSize: 14,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.78)",
                fontWeight: 700,
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  width: 12,
                  height: 12,
                  borderRadius: 999,
                  background: "#c9f36a",
                  boxShadow: "0 0 0 6px rgba(201,243,106,0.14)",
                }}
              />
              {configuracionSitio.nombre}
            </div>

            <div
              style={{
                fontSize: 58,
                lineHeight: 1.05,
                fontWeight: 800,
                letterSpacing: "-0.04em",
                maxWidth: 860,
              }}
            >
              Ecommerce premium para impresion 3D sustentable
            </div>

            <div
              style={{
                fontSize: 20,
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.78)",
                maxWidth: 820,
              }}
            >
              {configuracionSitio.descripcionCorta}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div
              style={{
                display: "inline-flex",
                gap: 12,
                alignItems: "center",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.16)",
                background: "rgba(255,255,255,0.06)",
                padding: "12px 18px",
                maxWidth: 960,
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.76)",
                  fontWeight: 700,
                }}
              >
                Chile
              </span>
              <span style={{ color: "rgba(255,255,255,0.32)" }}>•</span>
              <span
                style={{
                  fontSize: 16,
                  color: "rgba(255,255,255,0.8)",
                  fontWeight: 600,
                }}
              >
                {construirLineaCapacidades()}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                fontSize: 14,
                color: "rgba(255,255,255,0.62)",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: "rgba(179, 134, 49, 0.9)",
                }}
              />
              Precios con IVA incluido
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}

