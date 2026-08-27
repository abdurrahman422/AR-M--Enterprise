import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0e1012",
          color: "#f3f1ec",
          padding: 80,
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#b8956a",
          }}
        >
          {siteConfig.descriptor}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 72, fontWeight: 500, letterSpacing: -1 }}>{siteConfig.name}</div>
          <div style={{ marginTop: 18, fontSize: 32, color: "#9aa3ad" }}>{siteConfig.tagline}</div>
        </div>
      </div>
    ),
    size,
  );
}
