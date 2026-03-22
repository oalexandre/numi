import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Ilumi — A Smart Calculator",
  description:
    "Notepad-style calculator with variables, unit conversions, percentages, date math, and more. Available for macOS, Windows, and Linux.",
  openGraph: {
    title: "Ilumi — A Smart Calculator",
    description:
      "Notepad-style calculator with variables, unit conversions, percentages, and more.",
    type: "website",
    url: "https://ilumi.oalexandre.com.br",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-[family-name:var(--font-inter)] min-h-screen">
        {children}
      </body>
    </html>
  );
}
