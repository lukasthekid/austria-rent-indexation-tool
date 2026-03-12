import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "MietCheck-AT | Mieterhöhung prüfen – kostenlos & rechtssicher",
  description:
    "Prüfen Sie Ihre Mieterhöhung in Österreich – 100 % kostenlos. Das neue 5. MILG und MieWeG gilt ab 1.1.2026. Unser Rechner berechnet die maximal zulässige Miete für Alt- und Neuverträge.",
};

const steps = [
  {
    number: "1",
    title: "Vertragstyp auswählen",
    description:
      "Altvertrag (vor 2026) oder Neuvertrag (ab 2026). Bei Altverträgen die Indexklausel angeben.",
  },
  {
    number: "2",
    title: "Daten eingeben",
    description:
      "Aktuelle Miete, Vertragsdatum und Wohnungstyp – ohne Anmeldung.",
  },
  {
    number: "3",
    title: "Ergebnis ablesen",
    description:
      "Maximal zulässige Miete nach MieWeG und direkter Vergleich mit dem Vermieter-Angebot.",
  },
];

const problemPoints = [
  "Mietpreisbremse: Bei Inflation über 3 % nur Hälfte angerechnet",
  "Valorisierung nur am 1. April pro Jahr",
  "Preisgeschützt: max. 1 % (2026), max. 2 % (2027)",
  "Gilt für Alt- und Neuverträge",
];

const solutionPoints = [
  "Maximal zulässige Mieterhöhung nach MieWeG",
  "Offizielle VPI-Daten von Statistik Austria",
  "Parallelrechnung für Altverträge",
  "Spot-Check: Vermieter-Angebot direkt prüfen",
];

const ctaClassName =
  "inline-flex items-center gap-2 rounded-xl bg-red-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-red-700 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2";

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden font-sans">
      {/* Hero – Above the Fold */}
      <header className="relative min-h-[60vh] overflow-hidden bg-gradient-to-br from-red-50 via-white to-amber-50/30 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          <Link href="/" className="inline-block">
            <Image
              src="/MietCheck-logo.png"
              alt="MietCheck-AT Logo"
              width={64}
              height={64}
              className="h-12 w-12 sm:h-16 sm:w-16"
            />
          </Link>
          <h1 className="mt-8 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
            Mieterhöhung bekommen? Prüfen Sie in 2 Minuten, ob sie legal ist.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-zinc-600 sm:text-xl">
            Neues Gesetz ab 1.1.2026. Unser Rechner zeigt die maximal zulässige
            Miete. 100 % kostenlos, keine Anmeldung.
          </p>
          <p className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm font-medium sm:gap-4">
            <span className="rounded-full bg-emerald-100 px-4 py-1.5 text-emerald-800">
              Kostenlos
            </span>
            <span className="rounded-full bg-sky-100 px-4 py-1.5 text-sky-800">
              Keine Anmeldung
            </span>
            <span className="rounded-full bg-amber-100 px-4 py-1.5 text-amber-800">
              Rechtssicher
            </span>
          </p>
          <Link href="/mieterhoeung-berechnen" className={`mt-8 ${ctaClassName}`}>
            Jetzt kostenlos prüfen →
          </Link>
        </div>
      </header>

      {/* Problem-Solution – 2-Spalten */}
      <section className="border-t border-zinc-200 bg-slate-50/50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-8 text-center text-xl font-bold text-zinc-900 sm:text-2xl">
            Neues Gesetz = neue Regeln. Unser Rechner hilft.
          </h2>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-xl border-l-4 border-l-amber-500 border-zinc-200 bg-white p-6 shadow-md">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-zinc-900">
                <span className="flex h-2 w-2 rounded-full bg-amber-500" aria-hidden />
                Was das 5. MILG / MieWeG ändert
              </h3>
              <ul className="space-y-2.5 text-sm text-zinc-700">
                {problemPoints.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <span className="mt-1 shrink-0 text-amber-600">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border-l-4 border-l-emerald-500 border-zinc-200 bg-white p-6 shadow-md">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-zinc-900">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
                Unser Rechner berechnet für Sie
              </h3>
              <ul className="space-y-2.5 text-sm text-zinc-700">
                {solutionPoints.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <span className="mt-0.5 shrink-0 text-emerald-600">✓</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Link href="/mieterhoeung-berechnen" className={ctaClassName}>
                  Jetzt prüfen →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* So funktioniert es – 3 Schritte */}
      <section className="border-t border-zinc-200 bg-zinc-50/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl">
            So funktioniert der Rechner
          </h2>
          <p className="mb-12 text-center text-sm text-zinc-500 sm:text-base">
            In drei klaren Schritten zur rechtssicheren Prüfung
          </p>
          {/* Horizontale Timeline – Desktop */}
          <div className="relative hidden lg:block">
            {/* Zeitachse: horizontale Linie */}
            <div
              className="absolute left-[16%] right-[16%] top-5 h-px bg-zinc-300"
              aria-hidden
            />
            <div className="flex justify-between gap-4">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="relative flex w-[calc(33.333%-1rem)] flex-col items-center"
                >
                  {/* Node auf der Linie */}
                  <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white ring-4 ring-white">
                    {step.number}
                  </div>
                  {/* Karteninhalt */}
                  <div className="mt-8 w-full rounded-lg border border-zinc-200 bg-zinc-50/50 px-4 py-5">
                    <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                      Schritt {step.number}
                    </p>
                    <h3 className="mt-1 text-base font-semibold text-zinc-900">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Vertikale Timeline – Mobile/Tablet */}
          <div className="lg:hidden">
            <div className="relative pl-8">
              <div
                className="absolute left-3 top-2 bottom-2 w-px bg-zinc-200"
                aria-hidden
              />
              {steps.map((step) => (
                <div key={step.number} className="relative pb-10 last:pb-0">
                  <div className="absolute -left-8 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white ring-2 ring-white">
                    {step.number}
                  </div>
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50/50 px-4 py-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                      Schritt {step.number}
                    </p>
                    <h3 className="mt-1 font-semibold text-zinc-900">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-14 text-center">
            <Link href="/mieterhoeung-berechnen" className={ctaClassName}>
              Jetzt Mieterhöhung berechnen →
            </Link>
          </div>
        </div>
      </section>

      {/* Trust & Final CTA */}
      <section className="border-t border-zinc-200 bg-gradient-to-b from-white to-red-50/40 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-2xl border-2 border-red-100 bg-white px-6 py-10 text-center shadow-lg sm:px-10 sm:py-12">
          <p className="text-sm font-medium uppercase tracking-wider text-red-700/80">
            Vertraut von Mietern in ganz Österreich
          </p>
          <h2 className="mt-4 text-2xl font-bold text-zinc-900 sm:text-3xl">
            Bereit? Mieterhöhung jetzt prüfen.
          </h2>
          <p className="mt-3 text-base text-zinc-600">
            100 % kostenlos. Keine Anmeldung. Direkt im Browser.
          </p>
          <Link
            href="/mieterhoeung-berechnen"
            className={`mt-6 inline-block ${ctaClassName}`}
          >
            Zum Rechner →
          </Link>
        </div>
      </section>

      {/* Sticky CTA auf Mobile */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-200 bg-white/95 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] backdrop-blur-sm lg:hidden">
        <Link
          href="/mieterhoeung-berechnen"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-4 text-base font-bold text-white shadow-lg transition-colors hover:bg-red-700"
        >
          Jetzt kostenlos prüfen →
        </Link>
      </div>

      {/* Spacer für Sticky CTA */}
      <div className="h-20 lg:hidden" aria-hidden />
    </div>
  );
}
