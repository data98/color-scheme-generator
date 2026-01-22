import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chroma Fun - Modern Color Scheme Generator",
  description: "Create beautiful, modern, and playful color palettes effortlessly using The Color API.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
