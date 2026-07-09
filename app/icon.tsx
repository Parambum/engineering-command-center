import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#04060b",
          border: "2px solid #34f5a4",
          borderRadius: 6,
          color: "#34f5a4",
          fontSize: 18,
          fontWeight: 700,
          fontFamily: "monospace",
        }}
      >
        {">_"}
      </div>
    ),
    { ...size },
  );
}
