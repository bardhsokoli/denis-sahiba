import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://denis-sahiba.com"),
  title: "Denis & Sahiba — 28 Gusht 2026",
  description: "Ftesa e dasmës së Denis dhe Sahiba. 28 Gusht 2026, Grand Events, Prishtinë.",
};

export const viewport: Viewport = {
  themeColor: "#17261f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sq">
      <body>{children}</body>
    </html>
  );
}
