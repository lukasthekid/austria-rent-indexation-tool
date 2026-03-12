import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mietcheck-at.vercel.app";

export const metadata: Metadata = {
  title: "Mietpreisbremse Österreich 2026 – MieWeG einfach erklärt",
  description:
    "Wie funktioniert die Mietpreisbremse in Österreich 2026? Erklärung zu MieWeG, 3%-Regel, Sonderdeckel für preisgeschützte Wohnungen und Aliquotierung – verständlich erklärt.",
  openGraph: {
    title: "Mietpreisbremse Österreich 2026 – MieWeG einfach erklärt | MietCheck-AT",
    description:
      "Wie funktioniert die Mietpreisbremse in Österreich 2026? MieWeG, 3%-Regel, Sonderdeckel und Aliquotierung verständlich erklärt.",
    url: `${SITE_URL}/wissen`,
  },
  alternates: { canonical: "/wissen" },
};

const sections = [
  { id: "mieweg", label: "Was ist das MieWeG?" },
  { id: "3-prozent-regel", label: "Die 3-Prozent-Regel" },
  { id: "spezialdeckel", label: "Spezialdeckel 2026/2027" },
  { id: "aliquotierung", label: "Die Aliquotierungsregel" },
] as const;

function RechnerLink() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
    >
      Zum Rechner
    </Link>
  );
}

export default function WissenPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-zinc-50 font-sans">
      {/* Rot-Weiß-Rot Akzent-Banner */}
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
                Mietpreisbremse Österreich 2026 – MieWeG einfach erklärt
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
            Wie funktioniert die Mietpreisbremse in Österreich? Alle zentralen
            Begriffe des MieWeG – 3%-Regel, Sonderdeckel und Aliquotierung –
            verständlich erklärt.
          </p>
        </header>

        <nav
          className="mb-8 rounded-lg border border-zinc-200 bg-white p-4"
          aria-label="Inhalt dieser Seite"
        >
          <h2 className="sr-only">Sprunglinks</h2>
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

        <article
          id="mieweg"
          className="mb-10 rounded-xl border border-zinc-100 bg-white p-4 shadow sm:p-6"
        >
          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl">
            Was ist das Mieten-Wertsicherungsgesetz (MieWeG)?
          </h2>
          <h3 className="mt-3 text-base font-medium text-zinc-800">
            Begrenzung der Wertsicherung
          </h3>
          <div className="mt-3 space-y-3 text-sm text-zinc-600 sm:text-base">
            <p>
              Das Mieten-Wertsicherungsgesetz (MieWeG) ist Teil des 5. Mietrechtlichen
              Inflationslinderungsgesetzes (5. MILG) und gilt ab 1. Jänner 2026. Es
              begrenzt die <strong>vertragliche Wertsicherung</strong> von
              Wohnungsmietverträgen in der Voll- und in der Teilanwendung des MRG.
            </p>
            <p>
              Das MieWeG stellt keine gesetzliche Wertsicherung bereit und sanierte
              auch keine unwirksamen Wertsicherungsklauseln. Es beschränkt lediglich
              bestehende vertragliche Wertsicherungen durch eine{" "}
              <strong>zweifache Begrenzung</strong>: zeitlich (Valorisierungen nur
              zum 1. April eines jeden Jahres) und betraglich (3%-Regel). Damit
              wirkt es als „Mietpreisbremse“ – künftige Inflationsspitzen treffen
              Wohnungsmieten nicht ungebremst.
            </p>
          </div>
          <div className="mt-4">
            <RechnerLink />
          </div>
        </article>

        <article
          id="3-prozent-regel"
          className="mb-10 rounded-xl border border-zinc-100 bg-white p-4 shadow sm:p-6"
        >
          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl">
            Die 3-Prozent-Regel
          </h2>
          <h3 className="mt-3 text-base font-medium text-zinc-800">
            Wie die Inflation über 3&nbsp;% nur zur Hälfte angerechnet wird
          </h3>
          <div className="mt-3 space-y-3 text-sm text-zinc-600 sm:text-base">
            <p>
              Bei einer durchschnittlichen Veränderung des VPI 2020 (oder des an
              seine Stelle tretenden Index) im vorangegangenen Kalenderjahr von
              <strong> mehr als 3&nbsp;%</strong> wird jener Teil, der 3&nbsp;
              Prozentpunkte übersteigt, nur zur Hälfte berücksichtigt.
            </p>
            <p>
              <strong>Formel:</strong> Zulässige Erhöhung = 3&nbsp;% + (Übersteigung
              ÷ 2). Ab einer Inflation von 3&nbsp;% teilen sich Vermieter:innen und
              Mieter:innen die durch die Teuerung bedingte Belastung.
            </p>
            <p>
              <strong>Beispiel:</strong> Beträgt die durchschnittliche
              VPI-Veränderung im Jahr 2028 etwa 3,824&nbsp;%, so ist die
              Mietzinsänderung am 1. April 2029 mit 3 + (0,824 ÷ 2)&nbsp;% =
              3,412&nbsp;% beschränkt.
            </p>
          </div>
          <div className="mt-4">
            <RechnerLink />
          </div>
        </article>

        <article
          id="spezialdeckel"
          className="mb-10 rounded-xl border border-zinc-100 bg-white p-4 shadow sm:p-6"
        >
          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl">
            Spezialdeckel 2026 und 2027
          </h2>
          <h3 className="mt-3 text-base font-medium text-zinc-800">
            Die 1&nbsp;% und 2&nbsp;% Grenzen für Vollanwendungs-Wohnungen
          </h3>
          <div className="mt-3 space-y-3 text-sm text-zinc-600 sm:text-base">
            <p>
              Bei Wohnungsmietverträgen, auf die die Mietzinsbeschränkungsvorschriften
              des MRG zur Anwendung kommen (angemessener Mietzins, Richtwertmietzins,
              Kategoriemietzins, §&nbsp;45-Mietzins), gelten zusätzliche
              Anhebungsgrenzen:
            </p>
            <ul className="list-inside list-disc space-y-1">
              <li>
                <strong>1. April 2026:</strong> Die VPI-Veränderung des Jahres 2025
                darf mit höchstens <strong>1&nbsp;%</strong> berücksichtigt werden.
              </li>
              <li>
                <strong>1. April 2027:</strong> Die VPI-Veränderung des Jahres 2026
                darf mit höchstens <strong>2&nbsp;%</strong> berücksichtigt werden.
              </li>
              <li>
                <strong>Ab 1. April 2028:</strong> Es gilt die normale Regel (3&nbsp;%
                + Hälfte der darüber hinausgehenden Vorjahresinflation).
              </li>
            </ul>
            <p>
              Diese Spezialdeckel betreffen den gesamten preisgeschützten Bereich
              der MRG-Vollanwendung.
            </p>
          </div>
          <div className="mt-4">
            <RechnerLink />
          </div>
        </article>

        <article
          id="aliquotierung"
          className="mb-10 rounded-xl border border-zinc-100 bg-white p-4 shadow sm:p-6"
        >
          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl">
            Die Aliquotierungsregel
          </h2>
          <h3 className="mt-3 text-base font-medium text-zinc-800">
            Warum im ersten Jahr nur anteilig erhöht wird
          </h3>
          <div className="mt-3 space-y-3 text-sm text-zinc-600 sm:text-base">
            <p>
              Bei der <strong>ersten Valorisierung</strong> nach Vertragsabschluss
              wird die durchschnittliche VPI-Veränderung des vorangegangenen
              Kalenderjahres nur in dem Ausmaß berücksichtigt, das dem Verhältnis
              der Anzahl der <strong>vollen Monate nach Vertragsabschluss</strong> im
              jeweiligen Jahr zu zwölf Monaten entspricht.
            </p>
            <p>
              <strong>Beispiel:</strong> Vertragsabschluss im Mai 2027. Für die
              Änderung am 1. April 2028 dürfen nur 7/12 der VPI-Veränderung 2027
              herangezogen werden (sieben volle Monate nach Mai). Bei einer
              VPI-Veränderung 2027 von 2,613&nbsp;% ergibt sich am 1. April 2028
              eine Erhöhung von 2,613 ÷ 12 × 7 ≈ 1,52&nbsp;%.
            </p>
            <p>
              <strong>Besonderheit:</strong> Bei Vertragsabschluss im Dezember eines
              Jahres liegen keine vollen Monate mehr im Kalenderjahr. Die erste
              Anpassung erfolgt daher erst zum 1. April des{" "}
              <strong>zweitfolgenden</strong> Kalenderjahres.
            </p>
            <p>
              Die Aliquotierung wird nur einmal angewendet – bei der ersten
              Valorisierung nach Vertragsabschluss.
            </p>
          </div>
          <div className="mt-4">
            <RechnerLink />
          </div>
        </article>

        <footer className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-4 text-sm text-zinc-600">
          <p className="font-medium text-zinc-700">Rechtlicher Hinweis</p>
          <p className="mt-2">
            Die Inhalte dienen der allgemeinen Information. Basis: MieWeG (BGBl.
            I 2025), 5. MILG, in Kraft ab 1.1.2026. Für individuelle
            rechtliche Fragen konsultieren Sie bitte eine sachkundige Person.
          </p>
          <p className="mt-4">
            <Link href="/" className="font-medium text-red-600 hover:text-red-700">
              Zurück zum Rechner
            </Link>
          </p>
        </footer>
      </main>
    </div>
  );
}
