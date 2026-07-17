import type { Metadata, Viewport } from "next";

import { Providers } from "@/components/providers";
import { InstallPrompt, ServiceWorkerRegister } from "@/components/pwa";
import { SkipLink } from "@/components/layout";
import { fontVariables } from "@/lib/fonts";
import { SITE_CONFIG } from "@/lib/constants";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    template: `%s — ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    "ЕНТ география",
    "подготовка к ЕНТ",
    "карта Казахстана",
    "интерактивное обучение",
    "география Казахстана",
  ],
  authors: [{ name: SITE_CONFIG.name }],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: SITE_CONFIG.name,
  },
  icons: {
    apple: "/icons/apple-touch-icon.png",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#05070c",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={fontVariables} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground">
        <SkipLink />
        <Providers>{children}</Providers>
        <InstallPrompt />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
