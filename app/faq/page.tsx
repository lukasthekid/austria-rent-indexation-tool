import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://mietcheck-at.vercel.app";

export const metadata: Metadata = {
  title: "FAQ: Mieterhöhung 2026 Österreich – Häufige Fragen",
  description:
    "Häufige Fragen zur Mieterhöhung in Österreich 2026: MieWeG, 3%-Regel, Altvertrag, Neuvertrag, April-Valorisierung und Aliquotierung – alle Antworten auf einen Blick.",
  openGraph: {
    title: "FAQ: Mieterhöhung 2026 Österreich – Häufige Fragen | MietCheck-AT",
    description:
      "Alle häufigen Fragen zur Mieterhöhung in Österreich 2026: MieWeG, 3%-Regel, Altvertrag, Neuvertrag, April-Valorisierung und Aliquotierung.",
    url: `${SITE_URL}/faq`,
  },
  alternates: { canonical: "/faq" },
};

const faqItems = [
  {
    category: "Allgemein – MieWeG & Gültigkeitsbereich",
    questions: [
      {
        q: "Was ist das Mieten-Wertsicherungsgesetz (MieWeG)?",
        a: "Das Mieten-Wertsicherungsgesetz (MieWeG) ist ein österreichisches Bundesgesetz, das ab 1. Jänner 2026 in Kraft getreten ist. Es begrenzt jährliche Mieterhöhungen durch eine Kappungsregel: Liegt die Inflation über 3 %, wird nur die Hälfte des über 3 % liegenden Anteils auf die Miete aufgeschlagen. Das MieWeG ist Teil des 5. Mietrechtlichen Inflationslinderungsgesetzes (5. MILG).",
      },
      {
        q: "Für welche Mietverträge gilt das MieWeG?",
        a: "Das MieWeG gilt für alle Wohnungsmietverträge in Österreich – unabhängig davon, wann der Vertrag abgeschlossen wurde. Sowohl Altverträge (vor 2026) als auch Neuverträge (ab 2026) fallen unter die Regelung, sofern das Mietrechtsgesetz (MRG) Anwendung findet.",
      },
      {
        q: "Ab wann gilt das neue MieWeG?",
        a: "Das MieWeG gilt ab 1. Jänner 2026. Die erste mögliche Mietanpassung nach dem neuen Gesetz erfolgt zum 1. April 2026.",
      },
      {
        q: "Gilt das MieWeG auch für Gewerbemieten?",
        a: "Nein. Das MieWeG betrifft ausschließlich Wohnungsmietverträge im Anwendungsbereich des Mietrechtsgesetzes (MRG). Gewerbemieten und Mietverträge außerhalb des MRG (z. B. Einfamilienhäuser, Neubauten ohne MRG-Vollgeltung) fallen nicht darunter.",
      },
      {
        q: "Was ist der Unterschied zwischen Altvertrag und Neuvertrag?",
        a: "Altverträge wurden vor dem 1. Jänner 2026 abgeschlossen. Bei ihnen kommt es zur sogenannten Parallelrechnung: Die zulässige Mieterhöhung ist der niedrigere Wert aus der vertraglich vereinbarten Indexklausel und der MieWeG-Begrenzung. Neuverträge (ab 1.1.2026) unterliegen direkt und ausschließlich dem MieWeG, mit erster Valorisierung frühestens zum 1. April 2027.",
      },
    ],
  },
  {
    category: "Berechnung – 3%-Regel, VPI & Formel",
    questions: [
      {
        q: "Wie funktioniert die 3%-Regel bei der Mieterhöhung?",
        a: "Liegt die jährliche Inflation (gemessen am Verbraucherpreisindex, VPI) bei oder unter 3 %, darf die Miete um den vollen Prozentsatz angehoben werden. Liegt die Inflation über 3 %, wird nur die Hälfte des über 3 % liegenden Anteils zur Erhöhung herangezogen. Beispiel: Bei 5 % Inflation = 3 % + (2 % × 0,5) = 4 % zulässige Erhöhung.",
      },
      {
        q: "Was ist der VPI und wie beeinflusst er meine Miete?",
        a: "Der Verbraucherpreisindex (VPI) ist die offizielle Messgröße für die Inflation in Österreich, herausgegeben von Statistik Austria. Das MieWeG koppelt die maximal zulässige Mieterhöhung an die VPI-Veränderung des Vorjahres. Je nach Basisjahr (z. B. VPI 2020) wird der Indexwert für das jeweilige Jahr herangezogen.",
      },
      {
        q: "Wie berechne ich, ob meine Mieterhöhung zulässig ist?",
        a: "Geben Sie im MietCheck-AT-Rechner Ihre aktuelle Miete, den Vertragstyp (Alt- oder Neuvertrag), das Vertragsdatum und – für Altverträge – die Indexklausel ein. Der Rechner ermittelt auf Basis der offiziellen VPI-Daten die maximal zulässige Mieterhöhung und vergleicht sie mit Ihrem aktuellen Mietbetrag.",
      },
      {
        q: "Was passiert, wenn die Inflation negativ ist?",
        a: "Fällt der VPI im Vergleichszeitraum unter den Ausgangswert (negative Inflation/Deflation), ist keine Mieterhöhung zulässig. Es gibt keine automatische Mietsenkung aufgrund des MieWeG – die bestehende Miete bleibt unverändert.",
      },
      {
        q: "Welchen VPI-Basiswert muss ich verwenden?",
        a: "Das hängt von Ihrem Mietvertrag ab. Ältere Verträge verweisen oft auf VPI 2000, VPI 2005 oder VPI 2010, neuere auf VPI 2015 oder VPI 2020. Wenn Sie den Basiswert nicht kennen, nutzt der MietCheck-AT-Rechner den aktuellen Standardwert (VPI 2020) als Grundlage.",
      },
    ],
  },
  {
    category: "Altverträge – Parallelrechnung & Wertsicherungsklausel",
    questions: [
      {
        q: "Was ist die Parallelrechnung bei Altverträgen?",
        a: "Bei Altverträgen mit einer Wertsicherungsklausel (Indexklausel) wird die Mieterhöhung doppelt berechnet: einmal nach der vertraglichen Klausel und einmal nach dem MieWeG. Maßgeblich ist der niedrigere der beiden Werte. So stellt das Gesetz sicher, dass keine Mieter durch das neue Recht schlechtergestellt werden.",
      },
      {
        q: "Was ist eine Wertsicherungsklausel im Mietvertrag?",
        a: "Eine Wertsicherungsklausel (Indexklausel) im Mietvertrag erlaubt dem Vermieter, die Miete automatisch an die Inflation anzupassen, ohne gesonderte Kündigung oder Klage. Typische Klauseln koppeln die Miete an den VPI und legen einen Anpassungszeitraum sowie oft eine Schwelle (z. B. 5 %-Trigger) fest.",
      },
      {
        q: "Muss mein Vermieter mich über eine Mieterhöhung informieren?",
        a: "Ja. Nach dem MieWeG muss die Valorisierung dem Mieter schriftlich mitgeteilt werden. Eine einseitige automatische Erhöhung ohne Ankündigung ist nicht zulässig. Der Vermieter muss die Berechnung transparent machen.",
      },
      {
        q: "Was passiert bei Altverträgen ohne Wertsicherungsklausel?",
        a: "Fehlt im Altvertrag eine gültige Indexklausel, ist keine automatische Mieterhöhung nach MieWeG möglich. Der Vermieter kann eine Erhöhung nur auf anderen gesetzlichen Wegen (z. B. Richtwertmiete nach MRG) anstreben.",
      },
      {
        q: "Gilt die Mietpreisbremse auch für Staffelmieten (Staffelmiete)?",
        a: "Ja. Auch vertraglich vereinbarte Staffelmieten (feste, vorab definierte Mieterhöhungen) werden durch das MieWeG begrenzt. Übersteigt eine Staffel die MieWeG-Grenze, ist nur der zulässige niedrigere Betrag wirksam.",
      },
    ],
  },
  {
    category: "Neuverträge – Valorisierung, April-Termin & Aliquotierung",
    questions: [
      {
        q: "Ab wann darf die Miete bei Neuverträgen erhöht werden?",
        a: "Bei Neuverträgen (Abschluss ab 1. Jänner 2026) ist die erste Valorisierung frühestens zum 1. April 2027 zulässig. Die Erhöhung basiert auf der VPI-Veränderung des Jahres 2026.",
      },
      {
        q: "Wann darf die Miete jährlich angepasst werden?",
        a: "Wertsicherungen nach MieWeG sind nur einmal jährlich zum 1. April zulässig – unabhängig davon, was im Mietvertrag steht. Abweichende Klauseln (z. B. halbjährliche oder Oktober-Anpassungen) sind durch das Gesetz außer Kraft gesetzt.",
      },
      {
        q: "Was bedeutet Aliquotierung bei der ersten Mieterhöhung?",
        a: "Bei der ersten Valorisierung nach Vertragsabschluss wird die Erhöhung nicht für das volle Jahr berechnet, sondern nur anteilig (aliquot) ab dem Monat des Vertragsbeginns. Wurde der Vertrag z. B. im Juli abgeschlossen, zählen nur die vollen Monate bis zum Jahresende als Basis.",
      },
      {
        q: "Was sind die Sonderdeckel 2026 und 2027 für preisgeschützte Wohnungen?",
        a: "Für Wohnungen mit vollem MRG-Schutz (sogenannte preisgeschützte oder gemeinnützige Wohnungen) gelten besondere Obergrenzen: Im Jahr 2026 ist die Mieterhöhung auf maximal 1 % begrenzt, im Jahr 2027 auf maximal 2 %. Ab 2028 gilt die allgemeine 3%-Kappungsregel.",
      },
      {
        q: "Kann ich eine zu hohe Mieterhöhung anfechten?",
        a: "Ja. Wenn der Vermieter eine höhere Mieterhöhung verlangt als nach MieWeG zulässig, können Sie widersprechen. Bei unrechtmäßigen Erhöhungen besteht ein Rückforderungsanspruch. Im Streitfall empfiehlt sich die Beratung durch die Mietervereinigung Österreich oder einen Anwalt für Mietrecht.",
      },
      {
        q: "Wie lange im Voraus muss eine Mieterhöhung angekündigt werden?",
        a: "Das MieWeG schreibt keine gesetzliche Voranmeldefrist vor, empfiehlt jedoch eine rechtzeitige schriftliche Mitteilung. In der Praxis sollten Vermieter die Erhöhung spätestens im Februar oder März mitteilen, wenn sie ab 1. April gilt.",
      },
    ],
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${SITE_URL}/faq#faqpage`,
  mainEntity: faqItems.flatMap((cat) =>
    cat.questions.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    }))
  ),
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Start", item: SITE_URL },
    {
      "@type": "ListItem",
      position: 2,
      name: "FAQ",
      item: `${SITE_URL}/faq`,
    },
  ],
};

export default function FaqPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-zinc-50 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
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
                FAQ: Mieterhöhung 2026 Österreich
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
            Häufige Fragen zur Mieterhöhung in Österreich – MieWeG,
            3%-Deckelung, Altvertrag, Neuvertrag, April-Valorisierung und
            Aliquotierung verständlich erklärt.
          </p>
        </header>

        <div className="space-y-8">
          {faqItems.map((cat) => (
            <section key={cat.category}>
              <h2 className="mb-4 text-base font-semibold text-zinc-900 sm:text-lg">
                {cat.category}
              </h2>
              <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                <div className="divide-y divide-zinc-200">
                  {cat.questions.map((item) => (
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
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-zinc-200 bg-white p-6 text-center shadow-sm sm:mt-12">
          <p className="mb-4 text-base font-medium text-zinc-900">
            Mieterhöhung jetzt konkret prüfen
          </p>
          <p className="mb-5 text-sm text-zinc-600">
            Geben Sie Ihre Vertragsdaten in den kostenlosen Rechner ein und
            sehen Sie sofort, ob Ihre Mieterhöhung nach MieWeG zulässig ist.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Jetzt Mieterhöhung berechnen →
          </Link>
        </div>

        <nav
          className="mt-8 flex flex-wrap gap-3 border-t border-zinc-200 pt-6 text-sm"
          aria-label="Weitere Seiten"
        >
          <Link href="/wissen" className="text-red-600 hover:text-red-700 hover:underline">
            Mietpreisbremse erklärt
          </Link>
          <span className="text-zinc-300">·</span>
          <Link href="/mietpreisbremse" className="text-red-600 hover:text-red-700 hover:underline">
            Was ist die Mietpreisbremse?
          </Link>
          <span className="text-zinc-300">·</span>
          <Link href="/mieterhoeung-berechnen" className="text-red-600 hover:text-red-700 hover:underline">
            Mieterhöhung berechnen
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
