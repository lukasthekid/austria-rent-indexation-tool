import type { Metadata } from "next";
import Link from "next/link";
import RentCalculator from "@/components/RentCalculator";
import {
  SITE_DISCLAIMER_ADVICE,
  SITE_SOURCES_DATA,
  SITE_SOURCES_LEGAL,
  SITE_TRUST_TAGLINE,
} from "@/lib/site-trust-copy";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://mietcheck-at.vercel.app";

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Mieterhöhung nach MieWeG berechnen und prüfen",
  description:
    "In drei Schritten eine Orientierung, ob Ihre Mieterhöhung in Österreich nach dem Mieten-Wertsicherungsgesetz (MieWeG) voraussichtlich im Rahmen der eingegebenen Daten liegt.",
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
      text: "Tragen Sie Ihre aktuelle monatliche Nettomiete, das Vertragsdatum und den Wohnungstyp (freier Mietzins oder preisgeschützt im Sinne der MRG-Vollanwendung) ein.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Ergebnis einordnen",
      text: "Der Rechner zeigt eine nach MieWeG begrenzte Orientierungsrechnung. Im Streitfall oder bei unklarer Vertragssituation ist eine individuelle Beratung sinnvoll.",
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

const linkClass =
  "text-red-600 underline underline-offset-2 hover:text-red-700";

const asideLinkClass =
  "text-sm text-zinc-700 underline decoration-zinc-300 underline-offset-2 transition-colors hover:text-red-600";

export const metadata: Metadata = {
  title: "Mieterhöhung berechnen Österreich – Kostenloser Rechner 2026",
  description:
    "Mieterhöhung in Österreich nach MieWeG (5. MILG) rechnerisch einordnen – kostenlos, in drei Schritten. Für Altvertrag und Neuvertrag; ersetzt keine Rechtsberatung.",
  openGraph: {
    title:
      "Mieterhöhung berechnen Österreich – Kostenloser Rechner 2026 | MietCheck-AT",
    description:
      "Mieterhöhung nach MieWeG einordnen: kostenloser Rechner für Österreich, Alt- und Neuvertrag. Orientierung an offiziellen VPI-Daten.",
    url: `${SITE_URL}/mieterhoeung-berechnen`,
  },
  alternates: { canonical: "/mieterhoeung-berechnen" },
};

/** Langer Einordnungstext unter dem Rechner (in &lt;details&gt;). */
function RechnerIntroDetailed() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <h2 className="text-lg font-bold text-zinc-900 sm:text-xl">
        Zum MieWeG und zu diesem Rechner
      </h2>
      <p className="mt-4 text-base leading-relaxed text-zinc-600 sm:text-lg">
        Dieser Rechner hilft Mieterinnen und Mietern, eine{" "}
        <strong>vertragliche Wertsicherung</strong> unter dem{" "}
        <strong>Mieten-Wertsicherungsgesetz (MieWeG)</strong>, Teil des{" "}
        <strong>5. Mietrechtlichen Inflationslinderungsgesetzes (5. MILG)</strong>
        , rechnerisch einzuordnen. Das MieWeG gilt ab{" "}
        <strong>1. Jänner 2026</strong> und begrenzt bestehende vertragliche
        Anpassungen – es schafft keine neue Wertsicherung und heilt unwirksame
        Klauseln nicht.
      </p>
      <p className="mt-4 text-base leading-relaxed text-zinc-600 sm:text-lg">
        Der Fokus liegt auf <strong>Wohnungsmiete</strong> im Rahmen des{" "}
        <strong>Mietrechtsgesetzes (MRG)</strong>, insbesondere{" "}
        <strong>Vollanwendung</strong> und <strong>Teilanwendung</strong>.
        Gewerbemiete, Objekte ohne MRG oder Sonderfälle können hier nicht
        vollständig abgebildet werden – dann ist eine Einzelfallprüfung nötig.
      </p>

      <h3 className="mt-8 text-base font-semibold text-zinc-900 sm:text-lg">
        Was der Rechner leistet
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-zinc-700 sm:text-base">
        Sie geben Vertragsart (Altvertrag vor 2026 oder Neuvertrag ab 2026),
        Miete, Datum und – bei Altverträgen – die vertragliche Index- oder
        Staffellogik ein. Das Tool berechnet daraus eine{" "}
        <strong>Orientierung</strong> zur maximalen Anpassung nach den
        MieWeG-Kappungsregeln, inklusive{" "}
        <strong>Parallelrechnung</strong>, wenn Vertrag und Gesetz
        unterschiedliche Pfade vorsehen. Ergebnis und Zwischenschritte sollen
        nachvollziehbar sein; sie sind keine gerichtliche oder behördliche
        Feststellung.
      </p>

      <h3 className="mt-8 text-base font-semibold text-zinc-900 sm:text-lg">
        Methodik und Datengrundlage
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-zinc-700 sm:text-base">
        {SITE_SOURCES_DATA} Je nach Vertrag können unterschiedliche
        VPI-Basisjahre (z. B. VPI 2020) relevant sein; der Rechner nutzt, wo
        möglich, die von Ihnen gewählte Basis. Die endgültige Miete wird in der
        Regel auf Cent gerundet; Details zeigt das Ergebnis im Tool.
      </p>

      <h3 className="mt-8 text-base font-semibold text-zinc-900 sm:text-lg">
        Zentrale Regeln in Kurzform
      </h3>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-700 sm:text-base">
        <li>
          <strong>Zeitpunkt:</strong> Anpassungen im MieWeG-Rahmen erfolgen
          grundsätzlich zum <strong>1. April</strong> eines Jahres, sofern nicht
          ausnahmsweise eine andere gesetzliche Logik greift.
        </li>
        <li>
          <strong>Allgemeine Kappung:</strong> Liegt die Vorjahresinflation über{" "}
          <strong>3&nbsp;%</strong>, wird der darüber liegende Anteil nur zur{" "}
          <strong>Hälfte</strong> angerechnet (oft als „Mietpreisbremse“
          bezeichnet).
        </li>
        <li>
          <strong>Preisgeschützte Wohnungen (MRG-Vollanwendung):</strong> Für die
          Anpassungen <strong>2026</strong> und <strong>2027</strong> gelten
          zusätzliche <strong>Obergrenzen</strong> (1&nbsp;% bzw. 2&nbsp;%); ab
          2028 greift wieder die allgemeine 3&nbsp;%-Logik mit Halbierung des
          Überhangs.
        </li>
        <li>
          <strong>Erste Anpassung nach Vertragsabschluss:</strong> Es kann eine{" "}
          <strong>Aliquotierung</strong> nach vollen Monaten im Jahr des
          Vertragsabschlusses erforderlich sein.
        </li>
        <li>
          <strong>Altverträge:</strong> Wo Vertrag und MieWeG auseinanderlaufen,
          ist der <strong>günstigere</strong> Weg für die Mieterhöhung maßgeblich
          (Parallelrechnung).
        </li>
      </ul>

      <h3 className="mt-8 text-base font-semibold text-zinc-900 sm:text-lg">
        Grenzen und kein Ersatz für Rechtsberatung
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-zinc-700 sm:text-base">
        {SITE_DISCLAIMER_ADVICE} Unklare Vertragsauslegung, Befristung,
        Unternehmereigenschaft des Vermieters oder Rückforderungen sind
        zusätzliche Themen für die Fachberatung.
      </p>

      <h3 className="mt-8 text-base font-semibold text-zinc-900 sm:text-lg">
        Ausführlicher auf MietCheck-AT
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-zinc-700 sm:text-base">
        Erklärungen, Beispiele und FAQs:
      </p>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-700 sm:text-base">
        <li>
          <Link href="/mietpreisbremse" className={linkClass}>
            Mietpreisbremse und Ablauf
          </Link>
        </li>
        <li>
          <Link href="/wissen" className={linkClass}>
            MieWeG erklärt (3&nbsp;%-Regel, Deckel, Aliquotierung)
          </Link>
        </li>
        <li>
          <Link href="/faq" className={linkClass}>
            Häufige Fragen (Altvertrag, Neuvertrag, VPI, Parallelrechnung)
          </Link>
        </li>
      </ul>
    </div>
  );
}

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

      <div className="bg-zinc-50">
        <div className="mx-auto max-w-6xl lg:flex lg:items-start lg:justify-center lg:gap-10 lg:px-8 xl:gap-12">
          <div className="min-w-0 flex-1 lg:max-w-2xl">
            <nav
              className="flex flex-wrap gap-x-4 gap-y-2 border-b border-zinc-200 px-4 py-3 sm:px-6 lg:hidden"
              aria-label="Kurzlinks zum MieWeG"
            >
              <Link href="/wissen" className={`text-xs font-medium ${linkClass}`}>
                MieWeG erklärt
              </Link>
              <Link href="/faq" className={`text-xs font-medium ${linkClass}`}>
                FAQ
              </Link>
              <Link
                href="/mietpreisbremse"
                className={`text-xs font-medium ${linkClass}`}
              >
                Mietpreisbremse
              </Link>
            </nav>

            <div className="px-4 pt-3 sm:px-6 lg:px-0 lg:pt-4">
              <h1 className="text-lg font-bold tracking-tight text-zinc-900 sm:text-xl lg:text-2xl">
                Mieterhöhung berechnen – MieWeG (Österreich)
              </h1>
            </div>

            <RentCalculator />
          </div>

          <aside
            className="hidden shrink-0 lg:block lg:w-52 xl:w-56"
            aria-label="Vertiefung und weiterführende Seiten"
          >
            <div className="sticky top-24 space-y-4 border-l border-zinc-200 py-6 pl-8 xl:pl-10">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Weiterlesen
              </p>
              <nav className="flex flex-col gap-3">
                <Link href="/mietpreisbremse" className={asideLinkClass}>
                  Mietpreisbremse
                </Link>
                <Link href="/wissen" className={asideLinkClass}>
                  MieWeG erklärt
                </Link>
                <Link href="/faq" className={asideLinkClass}>
                  Häufige Fragen
                </Link>
              </nav>
              <p className="border-t border-zinc-200 pt-4 text-xs leading-relaxed text-zinc-500">
                {SITE_TRUST_TAGLINE}
              </p>
              <p className="text-xs leading-relaxed text-zinc-500">
                {SITE_SOURCES_LEGAL}
              </p>
            </div>
          </aside>
        </div>
      </div>

      <details className="group border-t border-zinc-200 bg-white">
        <summary className="mx-auto flex max-w-2xl cursor-pointer list-none items-center justify-between gap-3 px-4 py-4 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-50 sm:px-6 lg:px-8 [&::-webkit-details-marker]:hidden">
          <span>Hintergrund, Methodik &amp; weiterführende Infos</span>
          <span
            className="shrink-0 text-zinc-400 transition-transform group-open:rotate-180"
            aria-hidden
          >
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
        <div className="border-t border-zinc-100 bg-zinc-50 font-sans">
          <RechnerIntroDetailed />
        </div>
      </details>
    </>
  );
}
