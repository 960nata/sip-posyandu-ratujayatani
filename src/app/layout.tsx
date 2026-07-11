import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import "./globals.css";
import { Providers } from "./providers";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const SITE_TITLE = "SIPANDU — Sistem Informasi Posyandu Kabupaten Lampung Timur";
const DESCRIPTION =
  "Platform digital terpadu untuk monitoring, pencatatan, dan pelaporan 6 Bidang Standar Pelayanan Minimal (SPM). Mengonsolidasikan data secara real-time dari 1.100+ Posyandu aktif dan 5.500+ kader kesehatan di 264 desa/kelurahan di wilayah Kabupaten Lampung Timur.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | SIPANDU Lampung Timur",
  },
  description: DESCRIPTION,
  keywords: [
    "SIPANDU",
    "Sistem Informasi Posyandu",
    "Posyandu Lampung Timur",
    "Posyandu",
    "Standar Pelayanan Minimal",
    "SPM Posyandu",
    "kader posyandu",
    "kesehatan desa",
    "Permendagri 13 2024",
    "Kabupaten Lampung Timur",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName: "SIPANDU",
    title: SITE_TITLE,
    description: DESCRIPTION,
    images: [{ url: "/images/logo/logo.png", width: 512, height: 512, alt: "Logo SIPANDU" }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: DESCRIPTION,
    images: ["/images/logo/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "GovernmentOrganization",
  name: "SIPANDU — Sistem Informasi Posyandu",
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo/logo.png`,
  description: DESCRIPTION,
  areaServed: {
    "@type": "AdministrativeArea",
    name: "Kabupaten Lampung Timur, Lampung, Indonesia",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased" suppressHydrationWarning>
      <body className={`${plusJakartaSans.className} min-h-full flex flex-col`} suppressHydrationWarning>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-MCW17M48DT`}
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-MCW17M48DT');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
