"use client";

import { useState, useMemo } from "react";
import {
  calculateMieWeGRent,
  getFirstIndexationDate,
  type ApartmentType,
} from "@/lib/mieweg";
import {
  getVpiChangeForYear,
  getVpiAverageForYear,
  getDefaultVpiBase,
  VPI_BASE_NAMES,
  type VpiBaseName,
} from "@/lib/vpi-data";
import {
  calculateParallelrechnung,
  type ParallelrechnungStep,
} from "@/lib/parallelrechnung";
import type { ClauseType, ClauseParams } from "@/lib/vertragskurve";

const VALORISATION_YEARS = [2026, 2027, 2028, 2029, 2030];

function formatEur(cents: number): string {
  return new Intl.NumberFormat("de-AT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

type WizardStep = "grunddaten" | "vertragsart" | "details" | "ergebnis";
type ContractMode = "neuvertrag" | "altvertrag";
type AltvertragClause = ClauseType | "unknown";

export default function Home() {
  const [step, setStep] = useState<WizardStep>("grunddaten");

  // Step 1: Grunddaten
  const [currentRent, setCurrentRent] = useState<string>("800");
  const [contractDate, setContractDate] = useState<string>("2024-06-01");
  const [apartmentType, setApartmentType] = useState<ApartmentType>("free");

  // Step 2: Vertragsart
  const [contractMode, setContractMode] = useState<ContractMode | null>(null);
  const [altvertragClause, setAltvertragClause] =
    useState<AltvertragClause>("vpiAnnual");

  // Step 3a: Neuvertrag fields
  const [valorisationYear, setValorisationYear] = useState<number>(2027);
  const [customVpi, setCustomVpi] = useState<string>("");
  const [lastValorisationDate, setLastValorisationDate] = useState<string>("");
  const [alreadyInMieWeG, setAlreadyInMieWeG] = useState<boolean>(false);

  // Step 3b: Altvertrag clause details
  const [adjustmentMonth, setAdjustmentMonth] = useState<number>(0);
  const [vpiBase, setVpiBase] = useState<VpiBaseName>("VPI 2020");
  const [thresholdPercent, setThresholdPercent] = useState<string>("5");
  const [baseIndexValue, setBaseIndexValue] = useState<string>("");
  const [staffelType, setStaffelType] = useState<"percent" | "amount">(
    "percent"
  );
  const [staffelValue, setStaffelValue] = useState<string>("3");
  const [staffelMonth, setStaffelMonth] = useState<number>(0);
  const [altTargetYear, setAltTargetYear] = useState<number>(2028);
  const [proposedRent, setProposedRent] = useState<string>("");

  const isAltvertrag = useMemo(() => {
    const year = Number(contractDate.split("-")[0]);
    return year < 2026;
  }, [contractDate]);

  const autoContractMode: ContractMode = isAltvertrag
    ? "altvertrag"
    : "neuvertrag";

  const effectiveMode = contractMode ?? autoContractMode;

  // Neuvertrag result
  const inflationYear = valorisationYear - 1;
  const defaultVpi = getVpiChangeForYear(inflationYear);
  const vpiPercent =
    customVpi !== "" ? parseFloat(customVpi) : (defaultVpi ?? 0);

  const neuvertragResult = useMemo(() => {
    if (effectiveMode !== "neuvertrag" && altvertragClause !== "unknown")
      return null;
    const rentCents = Math.round(parseFloat(currentRent || "0") * 100);
    if (rentCents <= 0 || isNaN(rentCents)) return null;
    const [y, m, d] = contractDate.split("-").map(Number);
    const contractConclusionDate = new Date(y, (m ?? 1) - 1, d ?? 1);
    if (isNaN(contractConclusionDate.getTime())) return null;
    let lastValorisationMonth: Date | undefined;
    if (lastValorisationDate.trim()) {
      const [ly, lm, ld] = lastValorisationDate.split("-").map(Number);
      lastValorisationMonth = new Date(ly, (lm ?? 1) - 1, ld ?? 1);
      if (isNaN(lastValorisationMonth.getTime()))
        lastValorisationMonth = undefined;
    }
    return calculateMieWeGRent({
      currentRentCents: rentCents,
      contractConclusionDate,
      apartmentType,
      vpiChangePercent: vpiPercent,
      valorisationYear,
      lastValorisationMonth,
      alreadyInMieWeG: lastValorisationMonth ? alreadyInMieWeG : undefined,
    });
  }, [
    effectiveMode,
    altvertragClause,
    currentRent,
    contractDate,
    apartmentType,
    vpiPercent,
    valorisationYear,
    lastValorisationDate,
    alreadyInMieWeG,
  ]);

  // Altvertrag Parallelrechnung result
  const parallelResult = useMemo(() => {
    if (effectiveMode !== "altvertrag" || altvertragClause === "unknown")
      return null;
    const rentCents = Math.round(parseFloat(currentRent || "0") * 100);
    if (rentCents <= 0 || isNaN(rentCents)) return null;
    const [y, m, d] = contractDate.split("-").map(Number);
    const cDate = new Date(y, (m ?? 1) - 1, d ?? 1);
    if (isNaN(cDate.getTime())) return null;

    let clauseParams: ClauseParams;
    if (altvertragClause === "vpiAnnual") {
      clauseParams = { adjustmentMonth, vpiBase };
    } else if (altvertragClause === "vpiThreshold") {
      const baseIdx = parseFloat(baseIndexValue);
      if (isNaN(baseIdx) || baseIdx <= 0) return null;
      clauseParams = {
        thresholdPercent: parseFloat(thresholdPercent) || 5,
        baseIndexValue: baseIdx,
        vpiBase,
      };
    } else {
      clauseParams = {
        increaseType: staffelType,
        increaseValue:
          staffelType === "amount"
            ? Math.round((parseFloat(staffelValue) || 0) * 100)
            : parseFloat(staffelValue) || 0,
        increaseMonth: staffelMonth,
      };
    }

    return calculateParallelrechnung({
      baseRentCents: rentCents,
      contractDate: cDate,
      apartmentType,
      clauseType: altvertragClause as ClauseType,
      clauseParams,
      targetYear: altTargetYear,
    });
  }, [
    effectiveMode,
    altvertragClause,
    currentRent,
    contractDate,
    apartmentType,
    adjustmentMonth,
    vpiBase,
    thresholdPercent,
    baseIndexValue,
    staffelType,
    staffelValue,
    staffelMonth,
    altTargetYear,
  ]);

  const firstIndexationDate = useMemo(() => {
    const [y, m, d] = contractDate.split("-").map(Number);
    const d2 = new Date(y ?? 2025, (m ?? 1) - 1, d ?? 1);
    return isNaN(d2.getTime()) ? null : getFirstIndexationDate(d2);
  }, [contractDate]);

  const canGoToStep2 =
    currentRent !== "" &&
    parseFloat(currentRent) > 0 &&
    contractDate.trim() !== "";

  const showResult =
    effectiveMode === "neuvertrag" || altvertragClause === "unknown"
      ? neuvertragResult
      : null;
  const showParallel =
    effectiveMode === "altvertrag" && altvertragClause !== "unknown"
      ? parallelResult
      : null;

  const finalRent = showResult?.newRentCents ?? showParallel?.finalRentCents;
  const proposedValid =
    proposedRent !== "" &&
    finalRent != null &&
    Math.round(parseFloat(proposedRent) * 100) <= finalRent;
  const proposedInvalid =
    proposedRent !== "" &&
    finalRent != null &&
    Math.round(parseFloat(proposedRent) * 100) > finalRent;

  const months = [
    "Jänner",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ];

  const contractYear = Number(contractDate.split("-")[0]);
  const suggestedVpiBase =
    !isNaN(contractYear) && contractYear > 0
      ? getDefaultVpiBase(contractYear)
      : "VPI 2020";
  const defaultBaseIndex =
    !isNaN(contractYear) && contractYear > 0
      ? getVpiAverageForYear(contractYear, vpiBase)
      : null;

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-zinc-950">
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            MietCheck-AT
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Prüfen Sie, ob Ihre Mietzinserhöhung dem
            Mieten-Wertsicherungsgesetz (MieWeG) entspricht.
          </p>
        </header>

        {/* Progress indicator */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          {(
            [
              ["grunddaten", "Grunddaten"],
              ["vertragsart", "Vertragsart"],
              ["details", "Details"],
              ["ergebnis", "Ergebnis"],
            ] as const
          ).map(([s, label], i) => (
            <span key={s} className="flex items-center gap-2">
              {i > 0 && <span className="text-zinc-300 dark:text-zinc-600">/</span>}
              <button
                onClick={() => setStep(s)}
                className={
                  step === s
                    ? "font-semibold text-blue-600 dark:text-blue-400"
                    : "hover:text-zinc-700 dark:hover:text-zinc-300"
                }
              >
                {label}
              </button>
            </span>
          ))}
        </nav>

        {/* Step 1: Grunddaten */}
        {step === "grunddaten" && (
          <section className="space-y-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Schritt 1: Grunddaten
            </h2>
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
                onChange={(e) => {
                  setContractDate(e.target.value);
                  setContractMode(null);
                }}
                className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
              />
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Datum der Unterzeichnung (nicht Vertragsbeginn). Maßgeblich für
                Aliquotierung (§ 1 Abs 2 Z 2 MieWeG).
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
                  Freier Mietzins (Teilanwendung MRG, RBG 1971)
                </option>
                <option value="preisgeschützt">
                  Preisgeschützt (Vollanwendung MRG)
                </option>
              </select>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Nicht erfasst vom MieWeG: Vollausnahmen vom MRG (z.B.
                Freizeit-Zweitwohnungen, Ein-/Zweiobjekthäuser),
                Geschäftsräume, sowie WGG-Verträge (außer § 13 Abs 4 WGG).
              </p>
            </div>
            <button
              onClick={() => setStep("vertragsart")}
              disabled={!canGoToStep2}
              className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Weiter
            </button>
          </section>
        )}

        {/* Step 2: Vertragsart */}
        {step === "vertragsart" && (
          <section className="space-y-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Schritt 2: Vertragsart
            </h2>

            {isAltvertrag && (
              <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                Ihr Vertrag wurde vor dem 1.1.2026 abgeschlossen (Altvertrag).
                Bei abweichenden Wertsicherungsklauseln ist eine
                Parallelrechnung erforderlich.
              </div>
            )}

            <fieldset className="space-y-3">
              <legend className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Vertragstyp
              </legend>
              {(
                [
                  [
                    "neuvertrag",
                    "Neuvertrag / Wertsicherung gemäß MieWeG",
                    "Ab 1.1.2026 oder Vertrag verweist auf MieWeG § 1 Abs 2",
                  ],
                  [
                    "altvertrag",
                    "Altvertrag mit eigener Wertsicherungsklausel",
                    "Vor 1.1.2026 mit VPI-Klausel, Schwellenwert oder Staffelmiete",
                  ],
                ] as const
              ).map(([val, title, desc]) => (
                <label
                  key={val}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
                    effectiveMode === val
                      ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/20"
                      : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
                  }`}
                >
                  <input
                    type="radio"
                    name="contractMode"
                    value={val}
                    checked={effectiveMode === val}
                    onChange={() => setContractMode(val)}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {title}
                    </span>
                    <span className="block text-xs text-zinc-500 dark:text-zinc-400">
                      {desc}
                    </span>
                  </div>
                </label>
              ))}
            </fieldset>

            {effectiveMode === "altvertrag" && (
              <fieldset className="space-y-3">
                <legend className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Art der Wertsicherungsklausel
                </legend>
                {(
                  [
                    [
                      "vpiAnnual",
                      "VPI-basiert mit jährlicher Anpassung",
                      "Miete wird jährlich an einem festen Datum anhand des VPI angepasst",
                    ],
                    [
                      "vpiThreshold",
                      "VPI-basiert mit Schwellenwert",
                      "Anpassung erst wenn VPI um z.B. 5% gestiegen ist",
                    ],
                    [
                      "staffel",
                      "Staffelmiete",
                      "Fixe prozentuale oder betragsmäßige Erhöhung pro Jahr",
                    ],
                    [
                      "unknown",
                      "Ich weiß es nicht / Nur MieWeG-Grenze",
                      "Berechnet nur die MieWeG-Begrenzungskurve",
                    ],
                  ] as const
                ).map(([val, title, desc]) => (
                  <label
                    key={val}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                      altvertragClause === val
                        ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/20"
                        : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name="altvertragClause"
                      value={val}
                      checked={altvertragClause === val}
                      onChange={() => setAltvertragClause(val)}
                      className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {title}
                      </span>
                      <span className="block text-xs text-zinc-500 dark:text-zinc-400">
                        {desc}
                      </span>
                    </div>
                  </label>
                ))}
              </fieldset>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep("grunddaten")}
                className="rounded-md border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                Zurück
              </button>
              <button
                onClick={() => setStep("details")}
                className="flex-1 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Weiter
              </button>
            </div>
          </section>
        )}

        {/* Step 3: Details */}
        {step === "details" && (
          <section className="space-y-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Schritt 3: Details
            </h2>

            {/* Neuvertrag or "unknown" clause → simple MieWeG */}
            {(effectiveMode === "neuvertrag" ||
              altvertragClause === "unknown") && (
              <div className="space-y-5">
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
                      Erste Valorisierung: 1.4.
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
                    placeholder={
                      defaultVpi != null ? `${defaultVpi.toFixed(1)} (Standard)` : "—"
                    }
                    value={customVpi}
                    onChange={(e) => setCustomVpi(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastVal"
                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Letzte Valorisierung (optional)
                  </label>
                  <input
                    id="lastVal"
                    type="date"
                    value={lastValorisationDate}
                    onChange={(e) => setLastValorisationDate(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                  />
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    Monat der Indexzahl, die die letzte Mietanpassung ausgelöst
                    hat.
                  </p>
                  {lastValorisationDate.trim() && (
                    <label className="mt-3 flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                      <input
                        type="checkbox"
                        checked={alreadyInMieWeG}
                        onChange={(e) => setAlreadyInMieWeG(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800"
                      />
                      <span>
                        Letzte Anpassung war bereits nach MieWeG (ab 1.4.2026)
                      </span>
                    </label>
                  )}
                </div>
              </div>
            )}

            {/* Altvertrag clause-specific fields */}
            {effectiveMode === "altvertrag" &&
              altvertragClause !== "unknown" && (
                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="altTargetYear"
                      className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                    >
                      Berechnung bis 1. April
                    </label>
                    <select
                      id="altTargetYear"
                      value={altTargetYear}
                      onChange={(e) =>
                        setAltTargetYear(Number(e.target.value))
                      }
                      className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                    >
                      {VALORISATION_YEARS.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>

                  {(altvertragClause === "vpiAnnual" ||
                    altvertragClause === "vpiThreshold") && (
                    <div>
                      <label
                        htmlFor="vpiBase"
                        className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                      >
                        VPI-Basis im Vertrag
                      </label>
                      <select
                        id="vpiBase"
                        value={vpiBase}
                        onChange={(e) =>
                          setVpiBase(e.target.value as VpiBaseName)
                        }
                        className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                      >
                        {VPI_BASE_NAMES.map((name) => (
                          <option key={name} value={name}>
                            {name}
                            {name === suggestedVpiBase
                              ? ` (empfohlen für ${contractYear})`
                              : ""}
                          </option>
                        ))}
                      </select>
                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        Welcher Verbraucherpreisindex ist in Ihrem Mietvertrag
                        angegeben? Die %-Änderungen sind über Basisjahre hinweg
                        nahezu identisch.
                      </p>
                    </div>
                  )}

                  {altvertragClause === "vpiAnnual" && (
                    <div>
                      <label
                        htmlFor="adjustmentMonth"
                        className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                      >
                        Vertraglicher Anpassungstermin
                      </label>
                      <select
                        id="adjustmentMonth"
                        value={adjustmentMonth}
                        onChange={(e) =>
                          setAdjustmentMonth(Number(e.target.value))
                        }
                        className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                      >
                        {months.map((m, i) => (
                          <option key={i} value={i}>
                            1. {m}
                          </option>
                        ))}
                      </select>
                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        Der Monat, zu dem laut Vertrag die jährliche
                        VPI-Anpassung erfolgt.
                      </p>
                    </div>
                  )}

                  {altvertragClause === "vpiThreshold" && (
                    <>
                      <div>
                        <label
                          htmlFor="thresholdPercent"
                          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                        >
                          Schwellenwert (%)
                        </label>
                        <input
                          id="thresholdPercent"
                          type="number"
                          step="0.1"
                          min="0"
                          value={thresholdPercent}
                          onChange={(e) => setThresholdPercent(e.target.value)}
                          className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                        />
                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                          Ab welcher kumulativen VPI-Änderung wird die Miete
                          angepasst?
                        </p>
                      </div>
                      <div>
                        <label
                          htmlFor="baseIndexValue"
                          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                        >
                          Basis-Indexwert ({vpiBase})
                        </label>
                        <input
                          id="baseIndexValue"
                          type="number"
                          step="0.1"
                          min="0"
                          placeholder={
                            defaultBaseIndex != null
                              ? `${defaultBaseIndex.toFixed(1)} (Ø ${contractYear}, ${vpiBase})`
                              : "z.B. 111.6"
                          }
                          value={baseIndexValue}
                          onChange={(e) => setBaseIndexValue(e.target.value)}
                          className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                        />
                        {defaultBaseIndex != null && !baseIndexValue && (
                          <button
                            type="button"
                            onClick={() =>
                              setBaseIndexValue(defaultBaseIndex.toFixed(1))
                            }
                            className="mt-1.5 text-xs text-blue-600 hover:underline dark:text-blue-400"
                          >
                            Ø {contractYear} übernehmen:{" "}
                            {defaultBaseIndex.toFixed(1)}
                          </button>
                        )}
                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                          {vpiBase} Jahresdurchschnittswert bei letzter
                          Anpassung. Quelle:{" "}
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
                    </>
                  )}

                  {altvertragClause === "staffel" && (
                    <>
                      <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-200">
                        Hinweis: Staffelerhöhungen, die einen von der
                        Wertsicherung verschiedenen Grund haben (z.B.
                        vereinbarte Erhöhung nach Abschluss von Bauarbeiten),
                        sind vom MieWeG ausgenommen (§ 1 Abs 4 Satz 4 MieWeG).
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          Art der Staffelung
                        </label>
                        <div className="mt-1 flex gap-4">
                          <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                            <input
                              type="radio"
                              name="staffelType"
                              value="percent"
                              checked={staffelType === "percent"}
                              onChange={() => setStaffelType("percent")}
                              className="h-4 w-4 text-blue-600"
                            />
                            Prozent (%)
                          </label>
                          <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                            <input
                              type="radio"
                              name="staffelType"
                              value="amount"
                              checked={staffelType === "amount"}
                              onChange={() => setStaffelType("amount")}
                              className="h-4 w-4 text-blue-600"
                            />
                            Betrag (€)
                          </label>
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="staffelValue"
                          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                        >
                          {staffelType === "percent"
                            ? "Jährliche Erhöhung (%)"
                            : "Jährliche Erhöhung (€)"}
                        </label>
                        <input
                          id="staffelValue"
                          type="number"
                          step={staffelType === "percent" ? "0.1" : "1"}
                          min="0"
                          value={staffelValue}
                          onChange={(e) => setStaffelValue(e.target.value)}
                          className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="staffelMonth"
                          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                        >
                          Erhöhungstermin
                        </label>
                        <select
                          id="staffelMonth"
                          value={staffelMonth}
                          onChange={(e) =>
                            setStaffelMonth(Number(e.target.value))
                          }
                          className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                        >
                          {months.map((m, i) => (
                            <option key={i} value={i}>
                              1. {m}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
                </div>
              )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep("vertragsart")}
                className="rounded-md border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                Zurück
              </button>
              <button
                onClick={() => setStep("ergebnis")}
                className="flex-1 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Berechnen
              </button>
            </div>
          </section>
        )}

        {/* Step 4: Ergebnis */}
        {step === "ergebnis" && (
          <section className="space-y-6">
            {/* Neuvertrag / Unknown result */}
            {showResult && (
              <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  Ergebnis – MieWeG-Begrenzung
                </h2>
                <div className="mt-4 space-y-2">
                  <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    Max. zulässige Miete ab{" "}
                    {apartmentType === "preisgeschützt" ? "1.5" : "1.4"}.
                    {valorisationYear}: {formatEur(showResult.newRentCents)}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {showResult.multiYearSteps
                      ? `Kumulierte Änderung: ${showResult.appliedRatePercent.toFixed(2)}%`
                      : `Angewendeter Satz: ${showResult.appliedRatePercent.toFixed(2)}%`}
                  </p>
                </div>
                {apartmentType === "preisgeschützt" && (
                  <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                    Zusätzlich gilt die Obergrenze nach § 16 Abs 9 MRG
                    (Richtwert, Kategoriebeträge). Die tatsächliche Miete kann
                    daher niedriger sein.
                  </div>
                )}
                <ul className="mt-4 list-inside list-disc space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {showResult.breakdown.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Parallelrechnung result */}
            {showParallel && showParallel.steps.length > 0 && (
              <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  Ergebnis – Parallelrechnung
                </h2>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Vergleich der Vertragskurve mit der
                  MieWeG-Begrenzungskurve. Maßgeblich ist der niedrigere Wert.
                </p>

                <div className="mt-4 space-y-2">
                  <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    Max. zulässige Miete ab{" "}
                    {apartmentType === "preisgeschützt" ? "1.5" : "1.4"}.
                    {altTargetYear}:{" "}
                    {formatEur(showParallel.finalRentCents)}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Gesamtänderung:{" "}
                    {showParallel.totalChangePercent.toFixed(2)}%
                  </p>
                </div>

                {/* Comparison table */}
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-zinc-200 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                        <th className="pb-2 pr-4">1. April</th>
                        <th className="pb-2 pr-4">Vertrag</th>
                        <th className="pb-2 pr-4">MieWeG</th>
                        <th className="pb-2 pr-4">Miete</th>
                        <th className="pb-2">Bindend</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {showParallel.steps.map((s: ParallelrechnungStep) => (
                        <tr key={s.year}>
                          <td className="py-2 pr-4 font-medium text-zinc-900 dark:text-zinc-100">
                            {s.year}
                          </td>
                          <td className="py-2 pr-4 text-zinc-600 dark:text-zinc-400">
                            {formatEur(s.vertragRentCents)}
                          </td>
                          <td className="py-2 pr-4 text-zinc-600 dark:text-zinc-400">
                            {formatEur(s.miewegRentCents)}
                          </td>
                          <td className="py-2 pr-4 font-medium text-zinc-900 dark:text-zinc-100">
                            {formatEur(s.actualRentCents)}
                          </td>
                          <td className="py-2">
                            {!s.contractTriggered ? (
                              <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                                Keine Erhöhung
                              </span>
                            ) : s.binding === "mieweg" ? (
                              <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                MieWeG begrenzt
                              </span>
                            ) : s.binding === "vertrag" ? (
                              <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                Vertrag
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                                Gleich
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {apartmentType === "preisgeschützt" && (
                  <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                    Zusätzlich gilt die Obergrenze nach § 16 Abs 9 MRG. Die
                    tatsächliche Miete kann daher niedriger sein.
                  </div>
                )}
              </div>
            )}

            {showParallel && showParallel.steps.length === 0 && (
              <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-zinc-600 dark:text-zinc-400">
                  Keine Berechnung möglich. Bitte überprüfen Sie Ihre Eingaben.
                </p>
              </div>
            )}

            {/* Proposed rent check */}
            {finalRent != null && (
              <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
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
                    Die vorgeschlagene Miete ist zulässig (nicht höher als{" "}
                    {formatEur(finalRent)}).
                  </p>
                )}
                {proposedInvalid && (
                  <p className="mt-2 text-sm font-medium text-red-600 dark:text-red-400">
                    Die vorgeschlagene Miete überschreitet den maximal
                    zulässigen Betrag von {formatEur(finalRent)}.
                  </p>
                )}
              </div>
            )}

            <button
              onClick={() => setStep("details")}
              className="w-full rounded-md border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Zurück zu Details
            </button>
          </section>
        )}

        <footer className="mt-12 space-y-2 text-center text-sm text-zinc-500 dark:text-zinc-400">
          <p>
            Dieses Tool dient der Information und ersetzt keine rechtliche
            Beratung. Basis: MieWeG (BGBl. I 2025), 5. MILG, in Kraft ab
            1.1.2026.
          </p>
          <p>
            Nicht erfasst: Mietverträge nach dem WGG (außer § 13 Abs 4),
            Geschäftsraummieten, sowie Voll-Ausnahmen vom MRG. Bei negativer
            VPI-Entwicklung (Deflation) bleibt die Miete unverändert.
          </p>
        </footer>
      </main>
    </div>
  );
}
