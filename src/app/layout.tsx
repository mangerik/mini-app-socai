import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PWAWrapper from '@/components/PWAWrapper';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Socai Mini - AI Video Generator",
  description: "Generate AI videos from photos in minutes. Get 50 free tokens!",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Socai Mini",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Socai Mini",
    title: "Socai Mini - AI Video Generator",
    description: "Generate AI videos from photos in minutes. Get 50 free tokens!",
  },
  twitter: {
    card: "summary",
    title: "Socai Mini - AI Video Generator",
    description: "Generate AI videos from photos in minutes. Get 50 free tokens!",
  },
};

export const viewport: Viewport = {
  themeColor: "#023801",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <PWAWrapper>
          {children}
        </PWAWrapper>
      </body>
    </html>
  );
}
