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
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192x192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Socai Mini",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
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
      <body className={`${inter.variable} font-sans antialiased`}>
        <PWAWrapper>
          {children}
        </PWAWrapper>
      </body>
    </html>
  );
}
