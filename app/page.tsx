"use client";

import { useState, useMemo } from "react";
import {
  calculateMieWeGRent,
  getFirstIndexationDate,
  type ApartmentType,
} from "@/lib/mieweg";
import { getVpiChangeForYear } from "@/lib/vpi-data";

const VALORISATION_YEARS = [2026, 2027, 2028, 2029, 2030];

function formatEur(cents: number): string {
  return new Intl.NumberFormat("de-AT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export default function Home() {
  const [currentRent, setCurrentRent] = useState<string>("800");
  const [contractDate, setContractDate] = useState<string>("2025-01-01");
  const [apartmentType, setApartmentType] = useState<ApartmentType>("free");
  const [valorisationYear, setValorisationYear] = useState<number>(2027);
  const [customVpi, setCustomVpi] = useState<string>("");
  const [proposedRent, setProposedRent] = useState<string>("");

  const inflationYear = valorisationYear - 1;
  const defaultVpi = getVpiChangeForYear(inflationYear);
  const vpiPercent = customVpi !== "" ? parseFloat(customVpi) : (defaultVpi ?? 0);

  const result = useMemo(() => {
    const rentCents = Math.round(parseFloat(currentRent || "0") * 100);
    if (rentCents <= 0 || isNaN(rentCents)) return null;

    const [y, m, d] = contractDate.split("-").map(Number);
    const contractConclusionDate = new Date(y, (m ?? 1) - 1, d ?? 1);
    if (isNaN(contractConclusionDate.getTime())) return null;

    return calculateMieWeGRent({
      currentRentCents: rentCents,
      contractConclusionDate,
      apartmentType,
      vpiChangePercent: vpiPercent,
      valorisationYear,
    });
  }, [currentRent, contractDate, apartmentType, vpiPercent, valorisationYear]);

  const firstIndexationDate = useMemo(() => {
    const [y, m, d] = contractDate.split("-").map(Number);
    const d2 = new Date(y ?? 2025, (m ?? 1) - 1, d ?? 1);
    return isNaN(d2.getTime()) ? null : getFirstIndexationDate(d2);
  }, [contractDate]);

  const proposedValid =
    proposedRent !== "" &&
    result &&
    Math.round(parseFloat(proposedRent) * 100) <= result.newRentCents;

  const proposedInvalid =
    proposedRent !== "" &&
    result &&
    Math.round(parseFloat(proposedRent) * 100) > result.newRentCents;

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-zinc-950">
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            MietCheck-AT
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Prüfen Sie, ob Ihre Mietzinserhöhung dem Mieten-Wertsicherungsgesetz
            (MieWeG) entspricht. Diese Berechnung hilft Mietern, die maximal
            zulässige Miete nach Valorisierung zu ermitteln.
          </p>
        </header>

        <form className="space-y-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div>
            <label
              htmlFor="rent"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Aktuelle Miete (€)
            </label>
            <input
              id="rent"
              type="number"
              step="0.01"
              min="0"
              value={currentRent}
              onChange={(e) => setCurrentRent(e.target.value)}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div>
            <label
              htmlFor="contractDate"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Vertragsabschluss
            </label>
            <input
              id="contractDate"
              type="date"
              value={contractDate}
              onChange={(e) => setContractDate(e.target.value)}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            />
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Datum der Unterzeichnung des Mietvertrags (nicht Vertragsbeginn).
              Maßgeblich für die Aliquotierung gemäß § 1 Abs 2 Z 2 MieWeG.
            </p>
          </div>

          <div>
            <label
              htmlFor="apartmentType"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Wohnungstyp
            </label>
            <select
              id="apartmentType"
              value={apartmentType}
              onChange={(e) =>
                setApartmentType(e.target.value as ApartmentType)
              }
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            >
              <option value="free">
                Freier Mietzins (z.B. Teilanwendung MRG, RBG 1971)
              </option>
              <option value="preisgeschützt">
                Preisgeschützt (Vollanwendung MRG – Richtwert, Kategoriemietzins,
                angemessener Mietzins)
              </option>
            </select>
          </div>

          <div>
            <label
              htmlFor="valorisationYear"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Valorisierung zum 1. April
            </label>
            <select
              id="valorisationYear"
              value={valorisationYear}
              onChange={(e) =>
                setValorisationYear(Number(e.target.value))
              }
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            >
              {VALORISATION_YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            {firstIndexationDate && (
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Erste Valorisierung laut Vertrag: 1.4.
                {firstIndexationDate.getFullYear()}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="customVpi"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              VPI-Änderung {inflationYear} (optional, %)
            </label>
            <input
              id="customVpi"
              type="number"
              step="0.1"
              placeholder={defaultVpi != null ? `${defaultVpi} (Standard)` : "—"}
              value={customVpi}
              onChange={(e) => setCustomVpi(e.target.value)}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            />
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Leer lassen für Schätzwert von Statistik Austria. Quelle:{" "}
              <a
                href="https://data.statistik.gv.at"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                data.statistik.gv.at
              </a>
            </p>
          </div>
        </form>

        {result && (
          <section className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Ergebnis
            </h2>
            <div className="mt-4 space-y-2">
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                Maximal zulässige Miete ab{" "}
                {apartmentType === "preisgeschützt" ? "1.5" : "1.4"}
                .{valorisationYear}: {formatEur(result.newRentCents)}
              </p>
              {apartmentType === "preisgeschützt" && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Zinstermin preisgeschützt (§ 16 Abs 9 MRG)
                </p>
              )}
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Angewendeter Satz: {result.appliedRatePercent.toFixed(2)}%
              </p>
            </div>
            {apartmentType === "preisgeschützt" && (
              <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                Bei preisgeschützten Wohnungen gilt zusätzlich die Obergrenze
                nach § 16 Abs 9 MRG (Richtwert, Kategoriebeträge). Die
                tatsächlich zulässige Miete darf diese Zinsgrenze nicht
                überschreiten und kann daher niedriger sein als der hier
                berechnete Betrag.
              </div>
            )}
            <ul className="mt-4 list-inside list-disc space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
              {result.breakdown.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>

            <div className="mt-6 border-t border-zinc-200 pt-6 dark:border-zinc-700">
              <label
                htmlFor="proposedRent"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Prüfen: Vorgeschlagene neue Miete (€)
              </label>
              <input
                id="proposedRent"
                type="number"
                step="0.01"
                min="0"
                placeholder="z.B. 830"
                value={proposedRent}
                onChange={(e) => setProposedRent(e.target.value)}
                className="mt-1 block w-full max-w-xs rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
              />
              {proposedValid && (
                <p className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                  ✓ Die vorgeschlagene Miete ist zulässig (nicht höher als{" "}
                  {formatEur(result.newRentCents)}).
                </p>
              )}
              {proposedInvalid && (
                <p className="mt-2 text-sm font-medium text-red-600 dark:text-red-400">
                  ✗ Die vorgeschlagene Miete überschreitet den maximal zulässigen
                  Betrag von {formatEur(result.newRentCents)}.
                </p>
              )}
            </div>
          </section>
        )}

        <footer className="mt-12 space-y-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
          <p>
            Dieses Tool dient der Information. Es ersetzt keine rechtliche
            Beratung. Basis: MieWeG (BGBl. I 2025), in Kraft ab 1.1.2026.
          </p>
          {contractDate && Number(contractDate.split("-")[0]) < 2026 && (
            <p className="rounded-md border border-zinc-200 bg-zinc-100 px-4 py-3 text-left dark:border-zinc-700 dark:bg-zinc-800/50">
              <strong>Altvertrag (vor 1.1.2026):</strong> Bei abweichenden
              Wertsicherungsklauseln (z.B. Valorisierung zum 1. Jänner,
              Schwellenwertvereinbarung) ist eine Parallelrechnung
              erforderlich. Der Vermieter darf nur den niedrigeren von
              „Vertragskurve“ und MieWeG-Begrenzung verlangen. Dieses Tool
              berechnet ausschließlich die MieWeG-Begrenzung.
            </p>
          )}
        </footer>
      </main>
    </div>
  );
}
