import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { StructuredData } from "@/components/StructuredData";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mietcheck-at.vercel.app";
const title = "MietCheck-AT | Rechner für Mietpreisbremse & MieWeG 2026 Österreich";
const description =
  "Kostenloser Rechner: Prüfe, ob deine Mieterhöhung 2026 nach dem neuen MieWeG legal ist. Für Altvertrag & Neuvertrag – 3%-Deckelung, April-Valorisierung, Parallelrechnung.";

export const metadata: Metadata = {
  title: {
    default: title,
    template: "%s | MietCheck-AT",
  },
  description,
  keywords: [
    "Mieterhöhung Österreich",
    "Mieterhöhung 2026 Österreich",
    "Mieterhöhung berechnen",
    "Mieterhöhung berechnen Österreich",
    "Mieterhöhung legal prüfen",
    "Mietpreisbremse Österreich",
    "Mietpreisbremse 2026",
    "MieWeG 2026",
    "Mieten-Wertsicherungsgesetz",
    "Mietrechner Österreich",
    "Mietzinsrechner",
    "Mietzins Österreich",
    "VPI Miete berechnen",
    "Valorisierung Miete April 2026",
    "Indexanpassung Miete 2026",
    "Indexklausel Mietvertrag",
    "Altvertrag Mieterhöhung",
    "Neuvertrag Valorisierung",
    "3 Prozent Deckelung Miete",
    "Aliquotierung Miete",
    "Parallelrechnung Altvertrag",
    "5. MILG",
  ],
  authors: [{ name: "MietCheck-AT" }],
  creator: "MietCheck-AT",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title,
    description,
    locale: "de_AT",
    type: "website",
    siteName: "MietCheck-AT",
    url: SITE_URL,
    images: [
      {
        url: "/MietCheck-logo.png",
        width: 512,
        height: 512,
        alt: "MietCheck-AT – Rechner für Mietpreisbremse & MieWeG 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/MietCheck-logo.png"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  icons: {
    icon: "/MietCheck-logo.png",
    apple: "/MietCheck-logo.png",
  },
  other: {
    "google-adsense-account": "ca-pub-9500199606572767",
    "google-site-verification":
      "IjfaTuXY0-E8k1JhpyOAo0kGjc_413Tne6gSdRqKEtg",
  },
};

const howToSchema = {
  "@type": "HowTo",
  "@id": `${SITE_URL}/#howto`,
  name: "Mieterhöhung nach MieWeG berechnen und prüfen",
  description:
    "In 3 Schritten prüfen, ob Ihre Mieterhöhung in Österreich nach dem Mieten-Wertsicherungsgesetz (MieWeG) zulässig ist.",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Vertragstyp auswählen",
      text: "Wählen Sie Altvertrag (vor 2026) oder Neuvertrag (ab 2026). Bei Altverträgen geben Sie die Art der Indexklausel an.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Aktuelle Miete & Vertragsdaten eingeben",
      text: "Tragen Sie Ihre aktuelle monatliche Nettomiete, das Vertragsdatum und den Wohnungstyp ein.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Ergebnis ablesen",
      text: "Der Rechner zeigt die maximal zulässige Mieterhöhung nach MieWeG und einen direkten Vergleich mit dem Vermieter-Angebot.",
    },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    howToSchema,
    {
      "@type": "WebApplication",
      "@id": `${SITE_URL}/#webapp`,
      name: "MietCheck-AT MieWeG Rechner",
      description:
        "Kostenloser Online-Rechner zur Prüfung von Mietzinserhöhungen nach dem österreichischen Mieten-Wertsicherungsgesetz (MieWeG).",
      url: SITE_URL,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
      },
      inLanguage: "de-AT",
      publisher: {
        "@type": "Organization",
        name: "MietCheck-AT",
        url: SITE_URL,
        addressCountry: "AT",
      },
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#org`,
      name: "MietCheck-AT",
      url: SITE_URL,
      address: {
        "@type": "PostalAddress",
        addressCountry: "AT",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de-AT" className="light">
      <head>
        <StructuredData />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9500199606572767"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className="antialiased flex min-h-screen flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
