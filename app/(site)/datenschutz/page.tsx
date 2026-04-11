import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutz – MietCheck-AT",
  description:
    "Datenschutzerklärung für MietCheck-AT: Informationen zur Verarbeitung von Nutzungsdaten, Analytics und Speicherdauer.",
  alternates: { canonical: "/datenschutz" },
};

const company = {
  name: "GDG Grossmann Development GmbH",
  addressLine1: "Im Gereute 25",
  postalCode: "1230",
  city: "Wien",
  country: "Österreich",
};

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-zinc-50 font-sans">
      <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <header className="mb-6 flex flex-col gap-3 border-b border-zinc-200 pb-6 sm:mb-8 sm:gap-4 sm:pb-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-2xl lg:text-3xl">
            Datenschutz
          </h1>
          <p className="text-base text-zinc-600 sm:text-lg">
            Datenschutzerklärung gemäß DSGVO für diese Website.
          </p>
        </header>

        <div className="space-y-6">
          <section className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl">
              1. Verantwortlicher
            </h2>
            <p className="text-sm leading-relaxed text-zinc-700 sm:text-base">
              Verantwortlich für die Datenverarbeitung auf dieser Website ist:
              <br />
              <strong>{company.name}</strong>
              <br />
              {company.addressLine1}
              <br />
              {company.postalCode} {company.city}
              <br />
              {company.country}
            </p>
          </section>

          <section className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl">
              2. Welche Daten wir verarbeiten
            </h2>
            <p className="text-sm leading-relaxed text-zinc-700 sm:text-base">
              Wir verarbeiten insbesondere:
            </p>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-700 sm:text-base">
              <li>
                <strong>Nutzungs- und Telemetriedaten:</strong> technische und
                statistische Informationen zu Website-Besuchen (z.B.
                Seitenaufrufe, Zeitpunkte, Browser-/Geräteinformationen).
              </li>
              <li>
                <strong>Analysedaten:</strong> Daten, die im Rahmen von
                Analytics-/Performance-Diensten erhoben werden.
              </li>
            </ul>
          </section>

          <section className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl">
              3. Zwecke der Verarbeitung
            </h2>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-700 sm:text-base">
              <li>
                Bereitstellung und Betrieb der Website sowie Verbesserung der
                Nutzerfreundlichkeit.
              </li>
              <li>
                Sicherheit (z.B. Missbrauchserkennung) und Fehlerdiagnose.
              </li>
              <li>
                Analyse und Performance-Optimierung mithilfe von
                Analytics-/Speed-Insights-Diensten.
              </li>
            </ul>
          </section>

          <section className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl">
              4. Analytics- und Performance-Dienste (Vercel)
            </h2>
            <p className="text-sm leading-relaxed text-zinc-700 sm:text-base">
              Diese Website nutzt im Hintergrund Dienste von{" "}
              <strong>Vercel</strong> (u.a. für Analytics und Performance). Dabei
              können Informationen über die Nutzung der Website an Vercel
              übertragen werden.
            </p>
            <p className="text-sm leading-relaxed text-zinc-700 sm:text-base">
              Details finden Sie in den Datenschutzrichtlinien von Vercel:
              {" "}
              <a
                href="https://vercel.com/privacy"
                className="text-red-600 underline underline-offset-2 hover:text-red-700"
                target="_blank"
                rel="noreferrer"
              >
                https://vercel.com/privacy
              </a>
              .
            </p>
          </section>

          <section className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl">
              5. Rechtsgrundlage
            </h2>
            <p className="text-sm leading-relaxed text-zinc-700 sm:text-base">
              Soweit die Verarbeitung nicht zur Vertragserfüllung erforderlich ist,
              stützen wir sie typischerweise auf{" "}
              <strong>Art. 6 Abs. 1 lit. f DSGVO</strong> (berechtigtes
              Interesse), z.B. für den sicheren Betrieb und die Verbesserung der
              Website.
            </p>
          </section>

          <section className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl">
              6. Empfänger und Auftragsverarbeiter
            </h2>
            <p className="text-sm leading-relaxed text-zinc-700 sm:text-base">
              Empfänger der Daten können Hosting- und Technikdienstleister sein,
              insbesondere Vercel im Rahmen der oben beschriebenen Dienste
              (Auftragsverarbeiter).
            </p>
          </section>

          <section className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl">
              7. Speicherdauer
            </h2>
            <p className="text-sm leading-relaxed text-zinc-700 sm:text-base">
              Die Speicherdauer richtet sich nach dem Zweck der Verarbeitung
              sowie den Vorgaben der eingesetzten Dienste. Für konkrete
              Speicherdauern verweisen wir auf die Informationen der jeweiligen
              Anbieter.
            </p>
          </section>

          <section className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl">
              8. Ihre Rechte
            </h2>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-700 sm:text-base">
              <li>Auskunft (Art. 15 DSGVO)</li>
              <li>Berichtigung (Art. 16 DSGVO)</li>
              <li>Löschung (Art. 17 DSGVO)</li>
              <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
              <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
              <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
              <li>Beschwerde bei einer Aufsichtsbehörde (Art. 77 DSGVO)</li>
            </ul>
          </section>

          <section className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl">
              9. Kontakt
            </h2>
            <p className="text-sm leading-relaxed text-zinc-700 sm:text-base">
              Für Datenschutzanfragen wenden Sie sich bitte an den
              Verantwortlichen unter der oben genannten Adresse.{" "}
              <strong>E-Mail-Adresse ergänzen</strong> (optional).
            </p>
          </section>

          <section className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl">
              Hinweis zur Vorlage
            </h2>
            <p className="text-sm leading-relaxed text-zinc-700 sm:text-base">
              Diese Datenschutzerklärung ist eine Vorlage und sollte vor Einsatz
              rechtlich geprüft und an eure konkreten Datenverarbeitungen
              (z.B. Cookies, Consent-Mechanismen, eingesetzte Tools) angepasst
              werden.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

