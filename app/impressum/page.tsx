import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum – MietCheck-AT",
  description: "Angaben gemäß § 5 E-Commerce-Gesetz (ECG).",
  alternates: { canonical: "/impressum" },
};

const company = {
  name: "GDG Grossmann Development GmbH",
  addressLine1: "Im Gereute 25",
  postalCode: "1230",
  city: "Wien",
  country: "Österreich",
};

export default function ImpressumPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-zinc-50 font-sans">
      <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <header className="mb-6 flex flex-col gap-3 border-b border-zinc-200 pb-6 sm:mb-8 sm:gap-4 sm:pb-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-2xl lg:text-3xl">
            Impressum
          </h1>
          <p className="text-base text-zinc-600 sm:text-lg">
            Angaben gemäß § 5 E-Commerce-Gesetz (ECG).
          </p>
        </header>

        <section className="space-y-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl">
            Unternehmenskennzeichnung
          </h2>
          <div className="space-y-2 text-sm text-zinc-700 sm:text-base">
            <p>
              <strong>{company.name}</strong>
            </p>
            <p>
              {company.addressLine1}
              <br />
              {company.postalCode} {company.city}
              <br />
              {company.country}
            </p>
          </div>
        </section>

        <section className="mt-6 space-y-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl">
            Haftungshinweis
          </h2>
          <p className="text-sm leading-relaxed text-zinc-700 sm:text-base">
            Die Inhalte dienen der allgemeinen Information und
            Rechenorientierung zu MieWeG/MRG; ausführliche Hinweise und Quellen
            finden Sie im Seitenfuß jeder Seite. Trotz sorgfältiger Bearbeitung
            wird keine Gewähr für Richtigkeit, Vollständigkeit und Aktualität
            übernommen.
          </p>
        </section>
      </main>
    </div>
  );
}

