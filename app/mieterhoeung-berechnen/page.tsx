import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://mietcheck-at.vercel.app";

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

const steps = [
  {
    number: "1",
    title: "Vertragstyp auswählen",
    description:
      "Wählen Sie, ob Sie einen Altvertrag (vor 2026) oder einen Neuvertrag (ab 1.1.2026) haben. Bei Altverträgen geben Sie zusätzlich an, welche Art von Indexklausel vereinbart wurde (VPI-Jahresklausel, Schwellenklausel, Staffelmiete oder unbekannt).",
  },
  {
    number: "2",
    title: "Aktuelle Miete & Vertragsdaten eingeben",
    description:
      "Tragen Sie Ihre aktuelle monatliche Nettomiete (ohne Betriebskosten), das Datum des Vertragsabschlusses und den Wohnungstyp ein. Für preisgeschützte Wohnungen gelten die strengeren Sonderdeckel von 1 % (2026) bzw. 2 % (2027).",
  },
  {
    number: "3",
    title: "Ergebnis sofort ablesen",
    description:
      "Der Rechner zeigt Ihnen die maximal zulässige Miete nach MieWeG, einen Jahresvergleich und – bei Altverträgen – die Parallelrechnung (Vertragsklausel vs. MieWeG). Sie sehen auf einen Blick, ob die geforderte Erhöhung legal ist.",
  },
];

export default function MieterhoeungBerechnenPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-zinc-50 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="flex h-1.5 w-full shrink-0">
        <div className="flex-1 bg-red-600" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-red-600" />
      </div>

      <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <header className="mb-6 flex flex-col gap-3 border-b border-zinc-200 pb-6 sm:mb-8 sm:gap-4 sm:pb-8">
          <div className="flex min-w-0 items-start justify-between gap-3 sm:items-center">
            <div className="flex min-w-0 items-start gap-3 sm:items-center">
              <Link href="/" className="shrink-0">
                <Image
                  src="/MietCheck-logo.png"
                  alt="MietCheck-AT Logo"
                  width={48}
                  height={48}
                  className="h-10 w-10 sm:h-12 sm:w-12"
                />
              </Link>
              <h1 className="min-w-0 text-xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-2xl lg:text-3xl">
                Mieterhöhung berechnen – kostenlos & rechtssicher (Österreich
                2026)
              </h1>
            </div>
            <Link
              href="/"
              className="shrink-0 text-sm font-medium text-red-600 hover:text-red-700"
            >
              Rechner
            </Link>
          </div>
          <p className="text-base text-zinc-600 sm:text-lg">
            Prüfen Sie in 3 Schritten, ob Ihre Mieterhöhung in Österreich nach
            dem neuen Mieten-Wertsicherungsgesetz (MieWeG) zulässig ist –
            kostenlos und ohne Anmeldung.
          </p>
        </header>

        <section className="mb-10 sm:mb-12">
          <h2 className="mb-6 text-lg font-semibold text-zinc-900 sm:text-xl">
            So berechnen Sie Ihre Mieterhöhung in 3 Schritten
          </h2>
          <ol className="space-y-4">
            {steps.map((step) => (
              <li
                key={step.number}
                className="flex gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white">
                  {step.number}
                </span>
                <div>
                  <p className="mb-1 font-semibold text-zinc-900">
                    {step.title}
                  </p>
                  <p className="text-sm leading-relaxed text-zinc-600">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Jetzt Mieterhöhung berechnen →
            </Link>
          </div>
        </section>

        <section className="mb-10 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm sm:mb-12 sm:p-6">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 sm:text-xl">
            Was der Rechner berechnet
          </h2>
          <ul className="space-y-2.5 text-sm leading-relaxed text-zinc-700 sm:text-base">
            <li className="flex items-start gap-2.5">
              <span className="mt-0.5 shrink-0 text-red-600">✓</span>
              <span>
                <strong>Maximal zulässige Mieterhöhung</strong> nach MieWeG –
                basierend auf den offiziellen VPI-Daten von Statistik Austria
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-0.5 shrink-0 text-red-600">✓</span>
              <span>
                <strong>Parallelrechnung für Altverträge</strong> – Vergleich
                von vertraglicher Indexklausel und MieWeG-Grenze
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-0.5 shrink-0 text-red-600">✓</span>
              <span>
                <strong>Aliquotierung</strong> – anteilige Berechnung für das
                erste Valorisierungsjahr
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-0.5 shrink-0 text-red-600">✓</span>
              <span>
                <strong>Jahresvergleich</strong> – grafische Darstellung der
                Mietentwicklung über mehrere Jahre
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-0.5 shrink-0 text-red-600">✓</span>
              <span>
                <strong>Spot-Check</strong> – Eingabe eines konkreten
                Vermieter-Angebots zum direkten Vergleich
              </span>
            </li>
          </ul>
        </section>

        <section className="mb-10 sm:mb-12">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 sm:text-xl">
            Häufige Fragen beim Berechnen der Mieterhöhung
          </h2>
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
            <div className="divide-y divide-zinc-200">
              {[
                {
                  q: "Welche Unterlagen brauche ich für die Berechnung?",
                  a: "Sie benötigen Ihren aktuellen Mietvertrag (für Vertragstyp und eventuelle Indexklausel), Ihre aktuelle monatliche Nettomiete (ohne Betriebskosten) und das Datum des Vertragsabschlusses.",
                },
                {
                  q: "Gilt die Berechnung für ganz Österreich?",
                  a: "Ja. Das MieWeG ist ein Bundesgesetz und gilt österreichweit für alle Wohnungsmietverträge im Anwendungsbereich des MRG – unabhängig vom Bundesland.",
                },
                {
                  q: "Was ist, wenn ich meinen Indexwert nicht kenne?",
                  a: "Der Rechner bietet eine automatische Vorauswahl des aktuellen Standard-VPI (VPI 2020). Wenn Sie den genauen Basisindex aus Ihrem Vertrag nicht kennen, wählen Sie einfach 'Unbekannt' – der Rechner erklärt dann, welche Auswirkungen das hat.",
                },
                {
                  q: "Ist der Rechner kostenlos?",
                  a: "Ja, MietCheck-AT ist vollständig kostenlos und erfordert keine Anmeldung oder Registrierung.",
                },
              ].map((item) => (
                <details key={item.q} className="group">
                  <summary className="flex min-h-[48px] cursor-pointer list-none items-center justify-between px-4 py-3 font-medium text-zinc-900 transition-colors hover:bg-zinc-50 active:bg-zinc-100 sm:min-h-0 sm:px-6 sm:py-4 [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span className="shrink-0 pl-2 text-zinc-400 transition-transform group-open:rotate-180">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </span>
                  </summary>
                  <div className="border-t border-zinc-100 bg-zinc-50/50 px-4 py-3 text-sm leading-relaxed text-zinc-600 sm:px-6 sm:py-4">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 text-center shadow-sm">
          <p className="mb-3 text-base font-semibold text-zinc-900">
            Bereit? Mieterhöhung jetzt berechnen.
          </p>
          <p className="mb-5 text-sm text-zinc-600">
            Kostenlos, ohne Anmeldung, direkt im Browser.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Zum Rechner →
          </Link>
        </div>

        <nav
          className="mt-10 flex flex-wrap gap-3 border-t border-zinc-200 pt-6 text-sm sm:mt-12"
          aria-label="Weitere Seiten"
        >
          <Link
            href="/mietpreisbremse"
            className="text-red-600 hover:text-red-700 hover:underline"
          >
            Was ist die Mietpreisbremse?
          </Link>
          <span className="text-zinc-300">·</span>
          <Link
            href="/wissen"
            className="text-red-600 hover:text-red-700 hover:underline"
          >
            MieWeG erklärt
          </Link>
          <span className="text-zinc-300">·</span>
          <Link
            href="/faq"
            className="text-red-600 hover:text-red-700 hover:underline"
          >
            Häufige Fragen
          </Link>
        </nav>

        <footer className="mt-8 border-t border-zinc-200 pt-6 text-center text-xs text-zinc-400">
          Diese Seite dient der allgemeinen Information und ersetzt keine
          Rechtsberatung. Im Einzelfall empfiehlt sich die Beratung durch die
          Mietervereinigung Österreich oder einen Fachanwalt für Mietrecht.
        </footer>
      </main>
    </div>
  );
}
