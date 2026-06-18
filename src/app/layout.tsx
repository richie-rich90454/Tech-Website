import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'BIBS·C Tech Tools',
  description: 'Tech tools and resources for BASIS International and Bilingual Schools·China',
  icons: {
    icon: '/images/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <html lang="en" className={inter.variable}>
      {/* crafted by richie-rich90454 · 2026/06 · TypeScript era */}
      <body>{children}</body>
    </html>
  );
}
