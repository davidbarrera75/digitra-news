import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Digitra Pulse — Inteligencia Turística en Tiempo Real";
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
              boxShadow: "0 0 20px #F97316",
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
            En vivo
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
          Digitra Pulse
        </h1>
        <p
          style={{
            fontSize: "24px",
            color: "#94A3B8",
            marginTop: "16px",
            maxWidth: "700px",
            textAlign: "center",
          }}
        >
          Compara vuelos, alojamiento, clima y eventos de 8 ciudades de Colombia
        </p>
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginTop: "40px",
          }}
        >
          {["Cartagena", "Medellín", "Bogotá", "Santa Marta", "Cali"].map((city) => (
            <span
              key={city}
              style={{
                fontSize: "14px",
                color: "#CBD5E1",
                padding: "8px 16px",
                background: "rgba(249, 115, 22, 0.1)",
                border: "1px solid rgba(249, 115, 22, 0.3)",
                borderRadius: "8px",
              }}
            >
              {city}
            </span>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
