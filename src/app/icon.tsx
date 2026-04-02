import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 7,
          background: "linear-gradient(135deg, #0D1B2A, #0A1628)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1.5px solid #C9A54E",
        }}
      >
        <span
          style={{
            fontSize: 20,
            fontFamily: "Georgia, serif",
            fontWeight: 700,
            color: "#D4AF5C",
            marginTop: -1,
          }}
        >
          α
        </span>
      </div>
    ),
    { ...size }
  );
}
