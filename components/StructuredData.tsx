const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://mietcheck-at.vercel.app";

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "MietCheck-AT",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  description:
    "Rechner zur Ermittlung der gesetzlichen Mietzinserhöhung in Österreich nach dem 5. Mietrechtlichen Inflationslinderungsgesetz.",
  url: SITE_URL,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
  },
};

export function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(softwareApplicationSchema),
      }}
    />
  );
}
