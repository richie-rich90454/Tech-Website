import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BIBS·C Tech Tools",
  icons: {
    icon: "/images/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}