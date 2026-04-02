import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: "linear-gradient(135deg, #0D1B2A, #0A1628)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "3px solid #C9A54E",
        }}
      >
        <span
          style={{
            fontSize: 110,
            fontFamily: "Georgia, serif",
            fontWeight: 700,
            color: "#D4AF5C",
            marginTop: -6,
          }}
        >
          α
        </span>
      </div>
    ),
    { ...size }
  );
}
