import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import path from "path";

export const alt =
  "MietCheck-AT – Rechner für Mietpreisbremse & MieWeG 2026 Österreich";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const logoBuffer = readFileSync(
    path.join(process.cwd(), "public/MietCheck-logo.png")
  );
  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0f172a",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Red stripe – Austrian flag accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "#ed1c24",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "#ed1c24",
            display: "flex",
          }}
        />

        {/* Subtle radial glow */}
        <div
          style={{
            position: "absolute",
            top: "-200px",
            right: "-100px",
            width: "700px",
            height: "700px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(37,99,235,0.25) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "64px 80px",
            gap: "0px",
            flex: 1,
          }}
        >
          {/* Logo + brand name row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              marginBottom: "36px",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc}
              width={88}
              height={88}
              style={{ borderRadius: "16px" }}
              alt=""
            />
            <span
              style={{
                color: "#f1f5f9",
                fontSize: "40px",
                fontWeight: "700",
                letterSpacing: "-0.5px",
              }}
            >
              MietCheck-AT
            </span>
          </div>

          {/* Headline */}
          <div
            style={{
              color: "#ffffff",
              fontSize: "52px",
              fontWeight: "800",
              lineHeight: 1.15,
              letterSpacing: "-1px",
              maxWidth: "860px",
            }}
          >
            Mieterhöhung 2026 prüfen
          </div>

          {/* Sub-headline */}
          <div
            style={{
              color: "#94a3b8",
              fontSize: "26px",
              marginTop: "20px",
              maxWidth: "780px",
              lineHeight: 1.4,
            }}
          >
            Mietpreisbremse & MieWeG – kostenlos, ohne Anmeldung.
          </div>

          {/* Pills */}
          <div
            style={{
              display: "flex",
              gap: "14px",
              marginTop: "40px",
            }}
          >
            {["3 %-Kappung", "Altvertrag & Neuvertrag", "Parallelrechnung"].map(
              (label) => (
                <div
                  key={label}
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    borderRadius: "100px",
                    padding: "10px 22px",
                    color: "#cbd5e1",
                    fontSize: "20px",
                    display: "flex",
                  }}
                >
                  {label}
                </div>
              )
            )}
          </div>
        </div>

        {/* Right side – URL badge */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "flex-end",
            padding: "40px 56px",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              color: "#475569",
              fontSize: "20px",
              letterSpacing: "0.5px",
            }}
          >
            mietcheck-at.vercel.app
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
