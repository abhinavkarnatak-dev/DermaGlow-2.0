import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Apple touch icon rendered from the same dewdrop mark as the nav logo.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2f5d50",
        }}
      >
        <svg width="112" height="112" viewBox="0 0 24 24">
          <path
            d="M12 3.2c3.4 3.8 5.6 6.8 5.6 9.8a5.6 5.6 0 1 1-11.2 0c0-3 2.2-6 5.6-9.8Z"
            fill="#fbf6f0"
          />
          <circle cx="9.7" cy="13.4" r="1.5" fill="#2f5d50" opacity="0.5" />
        </svg>
      </div>
    ),
    size,
  );
}
