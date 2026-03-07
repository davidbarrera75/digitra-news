import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Digitra News — Turismo basado en datos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              background: "#F97316",
            }}
          />
          <span
            style={{
              fontSize: "18px",
              color: "#F97316",
              letterSpacing: "4px",
              textTransform: "uppercase",
            }}
          >
            Turismo basado en datos
          </span>
        </div>
        <h1
          style={{
            fontSize: "72px",
            fontWeight: 900,
            color: "white",
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          Digitra News
        </h1>
        <p
          style={{
            fontSize: "24px",
            color: "#94A3B8",
            marginTop: "16px",
            maxWidth: "600px",
            textAlign: "center",
          }}
        >
          Vuelos, alojamiento, clima y eventos de Colombia actualizado diariamente
        </p>
        <div
          style={{
            display: "flex",
            gap: "32px",
            marginTop: "40px",
          }}
        >
          {["Pulse", "Data", "Destinos", "Tendencias"].map((item) => (
            <span
              key={item}
              style={{
                fontSize: "14px",
                color: "#64748B",
                padding: "8px 16px",
                border: "1px solid #334155",
                borderRadius: "8px",
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
