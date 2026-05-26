import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Axorynth AI Trading Agent",
  description: "Hackathon MVP dashboard for an AI trading agent demo."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-axo-black text-white antialiased">{children}</body>
    </html>
  );
}
