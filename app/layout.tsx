import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { StructuredData } from "@/components/StructuredData";
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
  },
};

const faqSchema = {
  "@type": "FAQPage",
  "@id": `${SITE_URL}/#faq`,
  mainEntity: [
    {
      "@type": "Question",
      name: "Ab wann gilt das neue MieWeG?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Das Mieten-Wertsicherungsgesetz (MieWeG) gilt ab 1. Jänner 2026 und betrifft sowohl neu abgeschlossene Mietverträge als auch bestehende Altverträge. Die erste mögliche Anpassung nach MieWeG erfolgt zum 1. April 2026.",
      },
    },
    {
      "@type": "Question",
      name: "Was ist die maximale Mietzinserhöhung?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Liegt die Inflation unter 3 %, gilt die volle VPI-Änderung. Bei Inflation über 3 % wird der darüberliegende Teil nur zur Hälfte berücksichtigt (z.B. bei 6 % Inflation ≈ 4,5 % zulässige Erhöhung). Für preisgeschützte Wohnungen gelten niedrigere Obergrenzen: 2026 maximal 1 %, 2027 maximal 2 %.",
      },
    },
    {
      "@type": "Question",
      name: "Gilt das MieWeG auch für meinen Altvertrag?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja. Das MieWeG gilt für alle Wohnungsmietverträge – unabhängig vom Abschlussdatum. Bei Altverträgen mit Wertsicherungsklausel wird die Parallelrechnung angewendet: Maßgeblich ist der niedrigere Wert aus Vertragsklausel und MieWeG-Begrenzung.",
      },
    },
    {
      "@type": "Question",
      name: "Wann darf die Miete angepasst werden?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Wertsicherungen sind nur einmal jährlich zum 1. April zulässig – unabhängig von abweichenden Klauseln in Ihrem Vertrag. Dies gilt ab 2026 für alle von MieWeG erfassten Mietverträge.",
      },
    },
    {
      "@type": "Question",
      name: "Wie prüfe ich meine Mietzinserhöhung?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Geben Sie Ihre aktuelle Miete, Vertragsdaten und ggf. die letzte Indexierung in den Rechner ein. Er zeigt die maximal zulässige Miete. Ist die vom Vermieter geforderte Erhöhung höher, können Sie sie anfechten oder rechtliche Beratung einholen.",
      },
    },
  ],
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
    faqSchema,
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
      </head>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
