import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { SITE_TRUST_TAGLINE } from "@/lib/site-trust-copy";

export const metadata = {
  title: "MietCheck-AT | Mieterhöhung nach MieWeG prüfen – kostenlos",
  description:
    "Mieterhöhung in Österreich rechnerisch einordnen – kostenlos, ohne Anmeldung. MieWeG / 5. MILG ab 1.1.2026, VPI Statistik Austria. Orientierung, keine Rechtsberatung.",
};

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-landing-display",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-landing-body",
  display: "swap",
});

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
      "Orientierung zur MieWeG-Obergrenze und Vergleich mit dem Vermieter-Angebot.",
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
  "VPI-Durchschnitte von Statistik Austria (Quelle im Rechner)",
  "Parallelrechnung für Altverträge",
  "Spot-Check: Vermieter-Angebot direkt prüfen",
];

/** Mobile-first: full width on small screens, comfortable touch target */
const ctaClassName =
  "inline-flex w-full min-h-12 max-w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-3.5 text-base font-semibold text-white shadow-lg shadow-[var(--accent)]/25 transition-[transform,box-shadow,background-color] [word-break:break-word] active:scale-[0.98] sm:w-auto sm:min-h-[3rem] sm:px-8 sm:py-4 sm:text-lg hover:bg-[var(--accent-hover)] hover:shadow-xl hover:shadow-[var(--accent)]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2";

export default function HomePage() {
  return (
    <div
      className={`landing-page overflow-x-hidden ${fraunces.variable} ${plusJakarta.variable}`}
    >
      {/* Hero: column → side-by-side from md (tablet), refined at lg */}
      <header className="relative isolate min-h-0 overflow-hidden bg-white md:min-h-0 lg:min-h-[min(100dvh,52rem)] lg:max-h-[min(920px,100dvh)]">
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#fff_0%,#fafafa_55%,#fff5f5_100%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-1/3 top-0 hidden h-full w-[85%] skew-x-[-14deg] bg-[linear-gradient(200deg,rgba(200,16,46,0.06)_0%,transparent_55%)] sm:-right-1/4 sm:block"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 flex h-1.5 w-full sm:h-2"
          aria-hidden
        >
          <div className="flex-1 bg-[var(--accent)]" />
          <div className="w-10 max-w-[20%] shrink-0 bg-white sm:w-20" />
          <div className="flex-1 bg-[var(--accent)]" />
        </div>
        <div className="landing-grain" aria-hidden />

        <div className="landing-px relative mx-auto flex w-full max-w-6xl flex-col gap-8 pb-14 pt-6 sm:gap-10 sm:pb-16 sm:pt-10 md:flex-row md:items-start md:gap-8 md:pb-20 md:pt-12 lg:items-center lg:gap-12 lg:pb-24 lg:pt-16 xl:max-w-7xl 2xl:gap-16">
          <div className="min-w-0 flex-1 md:min-w-0 lg:max-w-xl xl:max-w-2xl 2xl:max-w-none">
            <Link
              href="/"
              className="landing-reveal inline-flex max-w-full items-center gap-3 rounded-2xl border border-zinc-200/90 bg-white/90 px-3 py-2.5 shadow-sm backdrop-blur-sm transition hover:border-[var(--accent)]/25 active:scale-[0.99]"
            >
              <Image
                src="/MietCheck-logo.png"
                alt="MietCheck-AT Logo"
                width={56}
                height={56}
                className="h-10 w-10 shrink-0 sm:h-12 sm:w-12"
              />
              <span className="landing-display truncate text-sm font-semibold tracking-tight text-zinc-800 sm:text-base">
                MietCheck-AT
              </span>
            </Link>

            <p className="landing-reveal landing-reveal-delay-1 mt-6 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-[var(--accent)] sm:mt-8 sm:text-xs sm:tracking-[0.24em]">
              Ab 1.1.2026 · MieWeG / 5. MILG
            </p>
            <h1 className="landing-display landing-reveal landing-reveal-delay-2 mt-3 text-balance text-[1.5rem] font-semibold leading-[1.15] tracking-tight text-zinc-950 min-[400px]:text-[1.625rem] sm:mt-4 sm:text-4xl sm:leading-[1.1] md:text-[2.25rem] md:leading-[1.08] lg:text-[2.65rem] xl:text-[2.85rem] 2xl:text-[3rem]">
              Mieterhöhung bekommen? In wenigen Minuten nach MieWeG einordnen.
            </h1>
            <p className="landing-reveal landing-reveal-delay-3 mt-4 text-base leading-relaxed text-zinc-600 [overflow-wrap:anywhere] sm:mt-6 sm:text-lg">
              Der Rechner hilft bei der Orientierung zur MieWeG-Obergrenze – anhand
              offizieller VPI-Daten. 100 % kostenlos, keine Anmeldung.
            </p>
            <p className="landing-reveal landing-reveal-delay-3 mt-3 text-sm leading-relaxed text-zinc-500 sm:mt-4 sm:text-base">
              {SITE_TRUST_TAGLINE}
            </p>

            <div className="landing-reveal landing-reveal-delay-4 mt-6 flex flex-wrap gap-2 sm:mt-8 sm:gap-2.5">
              {["Kostenlos", "Keine Anmeldung", "Am MieWeG orientiert"].map(
                (label) => (
                  <span
                    key={label}
                    className="rounded-full bg-red-50 px-3 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-wide text-[var(--accent)] ring-1 ring-[var(--accent)]/10 sm:px-3.5 sm:text-xs"
                  >
                    {label}
                  </span>
                ),
              )}
            </div>

            <div className="landing-reveal landing-reveal-delay-5 mt-8 sm:mt-10">
              <Link href="/mieterhoeung-berechnen" className={ctaClassName}>
                Jetzt kostenlos prüfen
                <span aria-hidden className="text-lg leading-none sm:text-xl">
                  →
                </span>
              </Link>
            </div>
          </div>

          <div className="landing-reveal landing-reveal-delay-2 w-full shrink-0 md:max-w-[min(100%,20rem)] md:pt-1 lg:max-w-md lg:pt-0 xl:max-w-lg">
            <div className="relative overflow-hidden rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-xl shadow-zinc-900/[0.06] sm:p-6 lg:p-8">
              <div
                className="absolute left-0 top-0 h-full w-1 bg-[var(--accent)] sm:w-1.5"
                aria-hidden
              />
              <p className="landing-display pl-3 text-xs font-semibold text-zinc-500 sm:pl-4 sm:text-sm">
                Kurz erklärt
              </p>
              <p className="landing-display mt-3 pl-3 text-xl font-medium leading-snug text-zinc-900 sm:mt-4 sm:pl-4 sm:text-2xl">
                Neues Gesetz, neue Deckelung – Ihre Zahlen, unsere Orientierung.
              </p>
              <ul className="mt-6 space-y-3 border-t border-zinc-100 pt-5 pl-3 text-sm leading-relaxed text-zinc-600 sm:mt-8 sm:space-y-3.5 sm:pt-6 sm:pl-4 sm:text-[0.9375rem]">
                <li className="flex gap-3">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]"
                    aria-hidden
                  />
                  VPI-Logik und Termine so abgebildet, wie sie im Rechner
                  verwendet werden.
                </li>
                <li className="flex gap-3">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]"
                    aria-hidden
                  />
                  Altvertrag mit Indexklausel: Parallelrechnung einbeziehen.
                </li>
                <li className="flex gap-3">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]"
                    aria-hidden
                  />
                  Keine Rechtsberatung – bei Unsicherheit Fachperson konsultieren.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      <section className="border-t border-zinc-100 bg-zinc-50/80 py-12 sm:py-16 lg:py-20">
        <div className="landing-px mx-auto w-full max-w-6xl xl:max-w-7xl">
          <h2 className="landing-display text-center text-balance text-[1.3125rem] font-semibold leading-snug tracking-tight text-zinc-950 min-[400px]:text-[1.375rem] sm:text-2xl md:text-3xl">
            Neues Gesetz = neue Regeln.
            <span className="mt-1 block text-[var(--accent)] sm:mt-0 sm:inline sm:before:content-['_']">
              Unser Rechner hilft.
            </span>
          </h2>
          <div className="mt-8 grid gap-5 sm:mt-10 sm:gap-6 md:grid-cols-2 md:gap-6 lg:gap-8">
            <div className="relative overflow-hidden rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6 md:p-7">
              <div
                className="absolute inset-y-3 left-0 w-1 rounded-full bg-[var(--accent)] sm:inset-y-4"
                aria-hidden
              />
              <h3 className="landing-display pl-4 text-base font-semibold text-zinc-900 sm:pl-5 sm:text-lg">
                Was das 5. MILG / MieWeG ändert
              </h3>
              <ul className="mt-4 space-y-2.5 pl-4 text-sm leading-relaxed text-zinc-700 sm:mt-5 sm:space-y-3 sm:pl-5 sm:text-[0.9375rem]">
                {problemPoints.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="font-semibold text-[var(--accent)]">·</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-md shadow-zinc-900/[0.04] sm:p-6 md:p-7">
              <div
                className="absolute inset-x-0 top-0 flex h-1 w-full"
                aria-hidden
              >
                <div className="flex-1 bg-[var(--accent)]" />
                <div className="w-8 bg-white sm:w-12" />
                <div className="flex-1 bg-[var(--accent)]" />
              </div>
              <h3 className="landing-display pt-1 text-base font-semibold text-zinc-900 sm:pt-2 sm:text-lg">
                Unser Rechner berechnet für Sie
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-zinc-700 sm:mt-5 sm:space-y-3 sm:text-[0.9375rem]">
                {solutionPoints.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="shrink-0 text-[var(--accent)]" aria-hidden>
                      ✓
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 sm:mt-8">
                <Link href="/mieterhoeung-berechnen" className={ctaClassName}>
                  Jetzt prüfen
                  <span aria-hidden className="text-lg leading-none sm:text-xl">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps: one list, column on small screens, row from lg */}
      <section className="relative border-t border-zinc-100 bg-white py-12 sm:py-16 lg:py-20">
        <div className="landing-px relative mx-auto w-full max-w-6xl xl:max-w-7xl">
          <h2 className="landing-display text-center text-balance text-[1.3125rem] font-semibold tracking-tight text-zinc-950 min-[400px]:text-[1.375rem] sm:text-2xl md:text-3xl">
            So funktioniert der Rechner
          </h2>
          <p className="mx-auto mt-3 max-w-md text-center text-sm text-zinc-500 sm:mt-4 sm:max-w-xl sm:text-base">
            In drei klaren Schritten zur Orientierung nach MieWeG
          </p>

          <div className="relative mt-10 sm:mt-12 lg:mt-14">
            <div
              className="pointer-events-none absolute left-[1.375rem] top-11 bottom-8 w-px bg-zinc-200 md:hidden lg:left-[8%] lg:right-[8%] lg:top-6 lg:bottom-auto lg:block lg:h-px lg:w-auto lg:bg-gradient-to-r lg:from-transparent lg:via-zinc-200 lg:to-transparent"
              aria-hidden
            />
            <ol className="flex flex-col gap-6 sm:gap-7 md:grid md:grid-cols-3 md:gap-5 md:gap-y-8 lg:flex lg:flex-row lg:items-start lg:justify-between lg:gap-6 xl:gap-8">
              {steps.map((step) => (
                <li
                  key={step.number}
                  className="relative flex min-w-0 flex-1 flex-row gap-4 sm:gap-5 md:flex-col md:items-center md:gap-0 md:text-center lg:flex-col lg:items-center lg:gap-0 lg:text-center"
                >
                  <div className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-bold text-white shadow-md ring-4 ring-white sm:h-12 sm:w-12 sm:text-base md:mt-0">
                    {step.number}
                  </div>
                  <div className="min-w-0 flex-1 rounded-2xl border border-zinc-200/90 bg-zinc-50/60 p-4 shadow-sm sm:p-5 md:mt-5 md:w-full lg:mt-6">
                    <p className="text-[0.625rem] font-bold uppercase tracking-[0.18em] text-[var(--accent)] sm:text-[0.65rem] sm:tracking-[0.2em]">
                      Schritt {step.number}
                    </p>
                    <h3 className="landing-display mt-1.5 text-base font-semibold text-zinc-900 sm:mt-2 sm:text-lg">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-600 [overflow-wrap:anywhere] sm:text-[0.9375rem]">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-10 text-center sm:mt-14">
            <Link href="/mieterhoeung-berechnen" className={ctaClassName}>
              Jetzt Mieterhöhung berechnen
              <span aria-hidden className="text-lg leading-none sm:text-xl">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-100 bg-gradient-to-b from-white via-red-50/30 to-white py-12 sm:py-16 lg:py-20">
        <div className="landing-px mx-auto w-full max-w-lg sm:max-w-xl lg:max-w-2xl">
          <div className="overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-xl shadow-zinc-900/[0.06]">
            <div className="flex h-1.5 w-full sm:h-2">
              <div className="flex-1 bg-[var(--accent)]" />
              <div className="w-12 shrink-0 bg-white sm:w-16" />
              <div className="flex-1 bg-[var(--accent)]" />
            </div>
            <div className="px-5 py-10 text-center sm:px-8 sm:py-12 md:px-12 md:py-14">
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-[var(--accent)] sm:text-xs sm:tracking-[0.25em]">
                Für Mieterinnen und Mieter in Österreich
              </p>
              <h2 className="landing-display mt-4 text-balance text-xl font-semibold text-zinc-950 min-[400px]:text-2xl sm:mt-5 sm:text-3xl">
                Bereit? Mieterhöhung jetzt prüfen.
              </h2>
              <p className="mx-auto mt-3 max-w-sm text-sm text-zinc-600 sm:mt-4 sm:max-w-md sm:text-base">
                100 % kostenlos. Keine Anmeldung. Direkt im Browser.
              </p>
              <Link
                href="/mieterhoeung-berechnen"
                className={`mt-6 inline-flex sm:mt-8 ${ctaClassName}`}
              >
                Zum Rechner
                <span aria-hidden className="text-lg leading-none sm:text-xl">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-200/80 bg-white/90 shadow-[0_-4px_24px_-4px_rgba(0,0,0,0.08)] backdrop-blur-md lg:hidden">
        <div className="mx-auto w-full max-w-lg px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:max-w-xl sm:px-4 sm:pb-[max(1rem,env(safe-area-inset-bottom))] sm:pt-4">
          <Link
            href="/mieterhoeung-berechnen"
            className="flex w-full min-h-12 max-w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-3.5 text-base font-semibold text-white shadow-lg shadow-[var(--accent)]/30 transition-[transform,background-color] [word-break:break-word] active:scale-[0.98] hover:bg-[var(--accent-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
          >
            Jetzt kostenlos prüfen
            <span aria-hidden className="text-lg leading-none">
              →
            </span>
          </Link>
        </div>
      </div>

      <div
        className="h-[calc(5.25rem+env(safe-area-inset-bottom,0px))] sm:h-[calc(5.75rem+env(safe-area-inset-bottom,0px))] lg:hidden"
        aria-hidden
      />
    </div>
  );
}
