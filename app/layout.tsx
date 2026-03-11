import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mietcheck.at";
const title = "Mietzinserhöhung prüfen – MieWeG Rechner | MietCheck-AT";
const description =
  "Prüfen Sie kostenlos, ob Ihre Mietzinserhöhung rechtskonform ist. MieWeG-Rechner für Neuverträge & Altverträge ab 2026. Maximal zulässige Miete berechnen – nur für Österreich.";

export const metadata: Metadata = {
  title: {
    default: title,
    template: "%s | MietCheck-AT",
  },
  description,
  keywords: [
    "Mietzinserhöhung prüfen",
    "MieWeG Rechner",
    "Mietzins Österreich",
    "Wertsicherung berechnen",
    "Miete erhöht rechtmäßig",
    "Indexmiete 2026",
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
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    faqSchema,
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
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
