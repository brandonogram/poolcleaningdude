import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Pool Cleaning Dude - No-Contract Pool Service";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0c4a6e 0%, #0284c7 40%, #0ea5e9 70%, #38bdf8 100%)",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background wave decoration */}
        <svg
          width="1200"
          height="630"
          viewBox="0 0 1200 630"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <path
            d="M0 500 Q150 460, 300 500 T600 500 T900 500 T1200 500 L1200 630 L0 630 Z"
            fill="rgba(255,255,255,0.08)"
          />
          <path
            d="M0 530 Q150 490, 300 530 T600 530 T900 530 T1200 530 L1200 630 L0 630 Z"
            fill="rgba(255,255,255,0.05)"
          />
          {/* Bubbles */}
          <circle cx="100" cy="150" r="40" fill="rgba(255,255,255,0.06)" />
          <circle cx="1050" cy="200" r="60" fill="rgba(255,255,255,0.05)" />
          <circle cx="900" cy="100" r="25" fill="rgba(255,255,255,0.07)" />
          <circle cx="200" cy="400" r="35" fill="rgba(255,255,255,0.04)" />
        </svg>

        {/* Water drop icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <svg width="80" height="80" viewBox="0 0 40 44">
            <path
              d="M20 2 C20 2 4 20 4 30 C4 38.284 11.163 45 20 45 C28.837 45 36 38.284 36 30 C36 20 20 2 20 2Z"
              fill="rgba(255,255,255,0.25)"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        {/* Main text */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: "white",
              letterSpacing: "-2px",
              textShadow: "0 4px 12px rgba(0,0,0,0.2)",
              lineHeight: 1,
            }}
          >
            Pool Cleaning Dude
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 500,
              color: "rgba(255,255,255,0.85)",
              marginTop: 12,
              letterSpacing: "0.5px",
            }}
          >
            Your Pool Guy. No Contracts. Just Clean Water.
          </div>
        </div>

        {/* Phone number bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 40,
            background: "rgba(255,255,255,0.15)",
            borderRadius: 50,
            padding: "14px 40px",
            border: "1px solid rgba(255,255,255,0.25)",
          }}
        >
          <div
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: "white",
              letterSpacing: "1px",
            }}
          >
            (302) 496-6367
          </div>
        </div>

        {/* Service areas */}
        <div
          style={{
            fontSize: 18,
            color: "rgba(255,255,255,0.6)",
            marginTop: 24,
            fontWeight: 500,
          }}
        >
          Main Line PA &bull; Chester County &bull; Northern Delaware
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
