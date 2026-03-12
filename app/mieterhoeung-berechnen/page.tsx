import type { Metadata } from "next";
import RentCalculator from "@/components/RentCalculator";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://mietcheck-at.vercel.app";

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Mieterhöhung nach MieWeG berechnen und prüfen",
  description:
    "In 3 Schritten prüfen, ob Ihre Mieterhöhung in Österreich nach dem Mieten-Wertsicherungsgesetz (MieWeG) zulässig ist.",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Vertragstyp auswählen",
      text: "Wählen Sie, ob Sie einen Altvertrag (vor 2026) oder einen Neuvertrag (ab 2026) haben. Bei Altverträgen geben Sie die Art der Indexklausel an.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Aktuelle Miete & Vertragsdaten eingeben",
      text: "Tragen Sie Ihre aktuelle monatliche Nettomiete, das Vertragsdatum und den Wohnungstyp (frei oder preisgeschützt) ein.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Ergebnis ablesen",
      text: "Der Rechner zeigt sofort die maximal zulässige Mieterhöhung nach MieWeG. Sie sehen, ob die geforderte Erhöhung Ihres Vermieters legal ist.",
    },
  ],
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Start", item: SITE_URL },
    {
      "@type": "ListItem",
      position: 2,
      name: "Mieterhöhung berechnen",
      item: `${SITE_URL}/mieterhoeung-berechnen`,
    },
  ],
};

export const metadata: Metadata = {
  title: "Mieterhöhung berechnen Österreich – Kostenloser Rechner 2026",
  description:
    "Mieterhöhung berechnen in Österreich – kostenlos & rechtssicher. Prüfe in 3 Schritten, ob deine Mieterhöhung nach MieWeG 2026 zulässig ist. Für Altvertrag & Neuvertrag.",
  openGraph: {
    title:
      "Mieterhöhung berechnen Österreich – Kostenloser Rechner 2026 | MietCheck-AT",
    description:
      "Mieterhöhung in Österreich berechnen und auf Rechtmäßigkeit prüfen – kostenlos, in 3 Schritten, nach MieWeG 2026.",
    url: `${SITE_URL}/mieterhoeung-berechnen`,
  },
  alternates: { canonical: "/mieterhoeung-berechnen" },
};

export default function MieterhoeungBerechnenPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <RentCalculator />
    </>
  );
}
