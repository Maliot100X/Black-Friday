import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MK Black Friday Radar",
  description: "AI-powered deal discovery platform for Black Friday shopping in Skopje",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
}
