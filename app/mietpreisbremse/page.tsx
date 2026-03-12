import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://mietcheck-at.vercel.app";

export const metadata: Metadata = {
  title: "Mietpreisbremse Österreich 2026 – Erklärung & kostenloser Rechner",
  description:
    "Was ist die Mietpreisbremse in Österreich? So funktioniert die MieWeG-Deckelung 2026: Wer ist betroffen, wie wird berechnet und was tun bei illegaler Mieterhöhung.",
  openGraph: {
    title:
      "Mietpreisbremse Österreich 2026 – Erklärung & kostenloser Rechner | MietCheck-AT",
    description:
      "Mietpreisbremse Österreich 2026: Wer ist betroffen, wie funktioniert die 3%-Regel und was tun bei unzulässiger Mieterhöhung.",
    url: `${SITE_URL}/mietpreisbremse`,
  },
  alternates: { canonical: "/mietpreisbremse" },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Start", item: SITE_URL },
    {
      "@type": "ListItem",
      position: 2,
      name: "Mietpreisbremse",
      item: `${SITE_URL}/mietpreisbremse`,
    },
  ],
};

const sections = [
  { id: "was-ist", label: "Was ist die Mietpreisbremse?" },
  { id: "wer-betroffen", label: "Wer ist betroffen?" },
  { id: "wie-berechnet", label: "Wie wird die Erhöhung berechnet?" },
  { id: "sonderdeckel", label: "Sonderdeckel für preisgeschützte Wohnungen" },
  { id: "illegale-erhoehung", label: "Was tun bei unzulässiger Mieterhöhung?" },
] as const;

export default function MietpreisbremPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-zinc-50 font-sans">
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
                Mietpreisbremse Österreich 2026: So funktioniert die
                MieWeG-Deckelung
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
            Die neue Mietpreisbremse begrenzt Mieterhöhungen in Österreich ab
            2026. Hier erfahren Sie, wer betroffen ist, wie die 3%-Regel
            funktioniert und was Sie bei einer unzulässigen Erhöhung tun können.
          </p>
        </header>

        <nav
          className="mb-8 rounded-lg border border-zinc-200 bg-white p-4"
          aria-label="Inhalt dieser Seite"
        >
          <h2 className="sr-only">Inhalt</h2>
          <ul className="space-y-2">
            {sections.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="text-red-600 underline underline-offset-2 hover:text-red-700"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-10 sm:space-y-12">
          <section id="was-ist">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900 sm:text-xl">
              Was ist die Mietpreisbremse?
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-zinc-700 sm:text-base">
              <p>
                Die <strong>Mietpreisbremse</strong> ist ein umgangssprachlicher
                Begriff für die Kappungsregelung im{" "}
                <strong>Mieten-Wertsicherungsgesetz (MieWeG)</strong>, das am
                1. Jänner 2026 in Kraft getreten ist. Das Gesetz ist Teil des{" "}
                <em>5. Mietrechtlichen Inflationslinderungsgesetzes (5. MILG)</em>
                .
              </p>
              <p>
                Vor dem MieWeG konnten Vermieter Mieterhöhungen direkt an die
                Inflation koppeln – bei hoher Inflation bedeutete das zweistellige
                Mietsteigerungen. Die neue Mietpreisbremse setzt dieser
                Automatik eine Grenze: Bei Inflation über 3 % wird nur die Hälfte
                des darüber liegenden Teils weitergegeben.
              </p>
              <p>
                Das Gesetz schützt Mieter in Österreich und gilt sowohl für
                bestehende <strong>Altverträge</strong> als auch für ab 2026 neu
                abgeschlossene <strong>Neuverträge</strong>.
              </p>
            </div>
            <div className="mt-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Mieterhöhung jetzt prüfen →
              </Link>
            </div>
          </section>

          <section id="wer-betroffen">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900 sm:text-xl">
              Wer ist von der Mietpreisbremse betroffen?
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-zinc-700 sm:text-base">
              <p>
                Die Mietpreisbremse gilt für alle <strong>Wohnungsmietverträge</strong>{" "}
                im Geltungsbereich des österreichischen{" "}
                <strong>Mietrechtsgesetzes (MRG)</strong>. Betroffen sind:
              </p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>
                  Mieter in <strong>Altbauwohnungen</strong> (MRG-Vollanwendung)
                </li>
                <li>
                  Mieter in <strong>gemeinnützigen Wohnungen</strong> (WGG)
                </li>
                <li>
                  Mieter in <strong>Neuverträgen ab 2026</strong> mit
                  Valorisierungsklausel
                </li>
                <li>
                  Alle Wohnungen mit bestehender{" "}
                  <strong>Wertsicherungsklausel (Indexklausel)</strong> im Vertrag
                </li>
              </ul>
              <p>
                <strong>Nicht betroffen</strong> sind: Gewerbemieten, frei
                finanzierte Neubauten ohne MRG-Geltung sowie Einfamilienhäuser,
                die vollständig vom Mietrechtsgesetz ausgenommen sind.
              </p>
            </div>
          </section>

          <section id="wie-berechnet">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900 sm:text-xl">
              Wie wird die maximal zulässige Mieterhöhung berechnet?
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-zinc-700 sm:text-base">
              <p>
                Die Berechnung basiert auf dem{" "}
                <strong>Verbraucherpreisindex (VPI)</strong> von Statistik
                Austria. Die Formel der MieWeG-Kappung lautet:
              </p>
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 font-mono text-sm">
                <p className="mb-1 font-semibold text-zinc-800">VPI ≤ 3 %:</p>
                <p className="mb-3 text-zinc-600">
                  Erhöhung = voller VPI-Wert
                </p>
                <p className="mb-1 font-semibold text-zinc-800">VPI &gt; 3 %:</p>
                <p className="text-zinc-600">
                  Erhöhung = 3 % + (VPI − 3 %) × 0,5
                </p>
              </div>
              <p>
                <strong>Beispiel:</strong> Bei 6 % VPI-Inflation ergibt sich eine
                zulässige Erhöhung von 3 % + (6 % − 3 %) × 0,5 ={" "}
                <strong>4,5 %</strong>. Ohne MieWeG wäre die volle Weitergabe von
                6 % möglich gewesen.
              </p>
              <p>
                Die erste zulässige Valorisierung erfolgte für{" "}
                <strong>Altverträge zum 1. April 2026</strong>. Für Neuverträge
                (Abschluss ab 1.1.2026) ist die erste Anpassung frühestens zum{" "}
                <strong>1. April 2027</strong> möglich.
              </p>
            </div>
            <div className="mt-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Kostenlos berechnen →
              </Link>
            </div>
          </section>

          <section id="sonderdeckel">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900 sm:text-xl">
              Sonderdeckel für preisgeschützte Wohnungen 2026/2027
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-zinc-700 sm:text-base">
              <p>
                Für <strong>preisgeschützte Wohnungen</strong> (MRG-Vollanwendung,
                z. B. Gemeindewohnungen, geförderte Wohnungen) gelten in den
                ersten Jahren nach Inkrafttreten des MieWeG besonders strenge
                Obergrenzen:
              </p>
              <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
                <table className="w-full text-sm">
                  <thead className="bg-zinc-50">
                    <tr>
                      <th className="px-4 py-2.5 text-left font-semibold text-zinc-900">
                        Jahr
                      </th>
                      <th className="px-4 py-2.5 text-left font-semibold text-zinc-900">
                        Max. Erhöhung
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    <tr>
                      <td className="px-4 py-2.5 text-zinc-700">2026</td>
                      <td className="px-4 py-2.5 font-medium text-zinc-900">
                        1 %
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 text-zinc-700">2027</td>
                      <td className="px-4 py-2.5 font-medium text-zinc-900">
                        2 %
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 text-zinc-700">ab 2028</td>
                      <td className="px-4 py-2.5 font-medium text-zinc-900">
                        allgemeine 3%-Kappungsregel
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                Diese Sonderdeckel sollen Mieter in leistbaren Wohnungen
                besonders schützen, da viele von ihnen in den Jahren davor
                überdurchschnittliche Erhöhungen hinnehmen mussten.
              </p>
            </div>
          </section>

          <section id="illegale-erhoehung">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900 sm:text-xl">
              Was tun bei unzulässiger Mieterhöhung?
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-zinc-700 sm:text-base">
              <p>
                Wenn Ihr Vermieter eine Mieterhöhung verlangt, die über dem
                MieWeG-Limit liegt, haben Sie folgende Möglichkeiten:
              </p>
              <ol className="list-decimal space-y-2 pl-5">
                <li>
                  <strong>Rechner nutzen:</strong> Prüfen Sie mit dem
                  MietCheck-AT-Rechner, ob die Erhöhung zulässig ist.
                </li>
                <li>
                  <strong>Schriftlich widersprechen:</strong> Informieren Sie den
                  Vermieter schriftlich, dass die Erhöhung das MieWeG-Limit
                  überschreitet.
                </li>
                <li>
                  <strong>Mietervereinigung kontaktieren:</strong> Die{" "}
                  <strong>Mietervereinigung Österreich</strong> und der{" "}
                  <strong>Mieterschutzverband</strong> bieten kostenlose
                  Erstberatungen an.
                </li>
                <li>
                  <strong>Schlichtungsstelle:</strong> In vielen Bundesländern
                  gibt es kostenlose Schlichtungsstellen für Mietstreitigkeiten,
                  bevor ein Gericht angerufen werden muss.
                </li>
                <li>
                  <strong>Rückforderung:</strong> Zu viel bezahlte Miete kann
                  rückgefordert werden – in der Regel bis zu 3 Jahre rückwirkend.
                </li>
              </ol>
            </div>
            <div className="mt-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Mieterhöhung jetzt prüfen →
              </Link>
            </div>
          </section>
        </div>

        <nav
          className="mt-10 flex flex-wrap gap-3 border-t border-zinc-200 pt-6 text-sm sm:mt-12"
          aria-label="Weitere Seiten"
        >
          <Link
            href="/wissen"
            className="text-red-600 hover:text-red-700 hover:underline"
          >
            MieWeG im Detail
          </Link>
          <span className="text-zinc-300">·</span>
          <Link
            href="/faq"
            className="text-red-600 hover:text-red-700 hover:underline"
          >
            Häufige Fragen
          </Link>
          <span className="text-zinc-300">·</span>
          <Link
            href="/mieterhoeung-berechnen"
            className="text-red-600 hover:text-red-700 hover:underline"
          >
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
