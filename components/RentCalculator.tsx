"use client";

import { useState, useMemo } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import {
  calculateMieWeGRent,
  computeRateForYear,
  DEFAULT_VPI_FALLBACK,
  getFirstIndexationDate,
  getFullMonthsInPriorYear,
  type ApartmentType,
} from "@/lib/mieweg";
import {
  getVpiChangeForYear,
  getVpiAverageForYear,
  getDefaultVpiBase,
  VPI_ALL_BASES,
  VPI_BASE_NAMES,
  type VpiBaseName,
} from "@/lib/vpi-data";
import {
  calculateParallelrechnung,
  type ParallelrechnungStep,
} from "@/lib/parallelrechnung";
import type { ClauseType, ClauseParams } from "@/lib/vertragskurve";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import CalculationReportPdf from "@/components/CalculationReportPdf";
import { buildCalculationReportPayload } from "@/lib/report-payload";

const CURRENT_YEAR = new Date().getFullYear();
const MIN_VALORISATION_YEAR = 2026;
const OFFICIAL_VPI_2020_YEARS = Object.keys(VPI_ALL_BASES["VPI 2020"] ?? {})
  .map(Number)
  .filter((year) => Number.isFinite(year));
const MAX_OFFICIAL_INFLATION_YEAR =
  OFFICIAL_VPI_2020_YEARS.length > 0
    ? Math.max(...OFFICIAL_VPI_2020_YEARS)
    : MIN_VALORISATION_YEAR - 1;
const MAX_RELIABLE_VALORISATION_YEAR = Math.max(
  MIN_VALORISATION_YEAR,
  Math.min(CURRENT_YEAR, MAX_OFFICIAL_INFLATION_YEAR + 1)
);
const VALORISATION_YEARS = Array.from(
  { length: MAX_RELIABLE_VALORISATION_YEAR - MIN_VALORISATION_YEAR + 1 },
  (_, i) => MIN_VALORISATION_YEAR + i
);

// Neuvertrag: erste Anpassung 1.4.2027 → benötigt VPI 2026
const NEUVERTRAG_FIRST_VALORISATION_YEAR = 2027;
const NEUVERTRAG_MIN_CONTRACT_DATE = "2026-01-01";

// Berechnung möglich, sobald offizielle VPI-Daten für 2026 vorliegen
const NEUVERTRAG_AVAILABLE = (MAX_OFFICIAL_INFLATION_YEAR ?? 0) >= 2026;

function formatEur(cents: number): string {
  return new Intl.NumberFormat("de-AT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

function parseDateInput(value: string): Date | null {
  if (!value.trim()) return null;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(y, (m ?? 1) - 1, d ?? 1);
  return isNaN(date.getTime()) ? null : date;
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  if (Array.isArray(value) && value.length > 0) return asNumber(value[0]);
  return null;
}

function AliquotierungTimeline({
  startMonthIndex,
  months,
}: {
  startMonthIndex: number;
  months: string[];
}) {
  const width = 400;
  const height = 72;
  const padding = { top: 8, right: 16, bottom: 28, left: 16 };
  const chartWidth = width - padding.left - padding.right;
  const segmentWidth = chartWidth / 12;
  const lineY = padding.top + 16;
  const strokeLineY = lineY + 4;

  const startX =
    padding.left + (startMonthIndex + 0.5) * segmentWidth;
  const endX = padding.left + 12 * segmentWidth;
  const arrowSize = 8;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full max-w-lg"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      {/* Month labels */}
      {months.map((m, i) => (
        <text
          key={m}
          x={padding.left + (i + 0.5) * segmentWidth}
          y={height - 6}
          textAnchor="middle"
          fill="#71717a"
          fontSize={10}
        >
          {m.slice(0, 3)}
        </text>
      ))}
      {/* Baseline */}
      <line
        x1={padding.left}
        y1={strokeLineY}
        x2={padding.left + chartWidth}
        y2={strokeLineY}
        stroke="#e4e4e7"
        strokeWidth={1}
      />
      {/* Red vertical start line */}
      <line
        x1={startX}
        y1={padding.top}
        x2={startX}
        y2={strokeLineY}
        stroke="#c8102e"
        strokeWidth={3}
        strokeLinecap="round"
      />
      {/* Horizontal arrow from start to end */}
      <line
        x1={startX}
        y1={strokeLineY}
        x2={endX - arrowSize * 0.6}
        y2={strokeLineY}
        stroke="#c8102e"
        strokeWidth={2}
      />
      {/* Arrowhead */}
      <polygon
        points={`${endX},${strokeLineY} ${endX - arrowSize},${strokeLineY - arrowSize / 2} ${endX - arrowSize},${strokeLineY + arrowSize / 2}`}
        fill="#c8102e"
      />
    </svg>
  );
}

type WizardStep = "grunddaten" | "vertragsart" | "details" | "ergebnis";
type ContractMode = "neuvertrag" | "altvertrag";
type AltvertragClause = ClauseType | "unknown";

export default function RentCalculator() {
  const [step, setStep] = useState<WizardStep>("vertragsart");

  // Step 1: Vertragstyp
  const [contractMode, setContractMode] = useState<ContractMode | null>(null);
  const [altHadValorisation, setAltHadValorisation] = useState<boolean | null>(
    null
  );
  const [altLastValorisationDate, setAltLastValorisationDate] =
    useState<string>(""); // "YYYY-MM-01" für Monat der Indexzahl

  // Step 2: Vertragsdaten
  const [currentRent, setCurrentRent] = useState<string>("800");
  const [contractDate, setContractDate] = useState<string>("2024-06-01");
  const [apartmentType, setApartmentType] = useState<ApartmentType>("free");
  const [altvertragClause, setAltvertragClause] =
    useState<AltvertragClause>("vpiAnnual");

  // Step 3a: Neuvertrag fields
  const [valorisationYear, setValorisationYear] = useState<number>(
    VALORISATION_YEARS[VALORISATION_YEARS.length - 1]
  );
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
  const [altTargetYear, setAltTargetYear] = useState<number>(
    VALORISATION_YEARS[VALORISATION_YEARS.length - 1]
  );
  const [proposedRent, setProposedRent] = useState<string>("");

  const autoContractMode: ContractMode = useMemo(() => {
    const year = Number(contractDate.split("-")[0]);
    return year < 2026 ? "altvertrag" : "neuvertrag";
  }, [contractDate]);

  const effectiveMode = contractMode ?? autoContractMode;
  const isAltvertrag = effectiveMode === "altvertrag";

  const canProceedFromStep1 =
    effectiveMode != null &&
    (isAltvertrag
      ? altHadValorisation !== null &&
        (altHadValorisation === false ||
          altLastValorisationDate.trim() !== "")
      : NEUVERTRAG_AVAILABLE);

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

    let lastValorisationMonth: Date | undefined;
    if (
      altHadValorisation === true &&
      altLastValorisationDate.trim() !== ""
    ) {
      const [ly, lm, ld] = altLastValorisationDate.split("-").map(Number);
      lastValorisationMonth = new Date(ly, (lm ?? 1) - 1, ld ?? 1);
      if (isNaN(lastValorisationMonth.getTime()))
        lastValorisationMonth = undefined;
    }

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
      lastValorisationMonth,
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
    altHadValorisation,
    altLastValorisationDate,
  ]);

  const firstIndexationDate = useMemo(() => {
    const [y, m, d] = contractDate.split("-").map(Number);
    const d2 = new Date(y ?? 2025, (m ?? 1) - 1, d ?? 1);
    return isNaN(d2.getTime()) ? null : getFirstIndexationDate(d2);
  }, [contractDate]);

  const canProceedFromStep2 =
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

  const reportPayload = useMemo(() => {
    const targetYear =
      effectiveMode === "altvertrag" && altvertragClause !== "unknown"
        ? altTargetYear
        : valorisationYear;
    return buildCalculationReportPayload({
      contractMode: effectiveMode,
      apartmentType,
      targetYear,
      inflationYear: targetYear - 1,
      currentRent,
      contractDate,
      lastValorisationDate,
      alreadyInMieWeG,
      altHadValorisation,
      altLastValorisationDate,
      altvertragClause,
      vpiPercent,
      usedCustomVpi: customVpi.trim() !== "",
      adjustmentMonth,
      vpiBase,
      thresholdPercent,
      baseIndexValue,
      staffelType,
      staffelValue,
      staffelMonth,
      proposedRent,
      showResult,
      showParallel,
      finalRent: finalRent ?? null,
    });
  }, [
    effectiveMode,
    apartmentType,
    altTargetYear,
    valorisationYear,
    currentRent,
    contractDate,
    lastValorisationDate,
    alreadyInMieWeG,
    altHadValorisation,
    altLastValorisationDate,
    altvertragClause,
    vpiPercent,
    customVpi,
    adjustmentMonth,
    vpiBase,
    thresholdPercent,
    baseIndexValue,
    staffelType,
    staffelValue,
    staffelMonth,
    proposedRent,
    showResult,
    showParallel,
    finalRent,
  ]);

  const pdfFileName = useMemo(() => {
    const date = new Date().toISOString().slice(0, 10);
    const modePrefix = showParallel ? "parallelrechnung" : "mieweg";
    return `mietcheck-berechnungsblatt-${modePrefix}-${date}.pdf`;
  }, [showParallel]);

  const miewegTimelineData = useMemo(() => {
    if (!showResult?.multiYearSteps || showResult.multiYearSteps.length === 0)
      return [];
    return showResult.multiYearSteps.map((step) => ({
      yearLabel: `1.4.${step.inflationYear + 1}`,
      rentEur: step.rentAfterCents / 100,
      ratePercent: step.ratePercent,
    }));
  }, [showResult]);

  const aliquotVisual = useMemo(() => {
    if (showParallel && showParallel.steps.length > 0) {
      const firstYear = showParallel.steps[0]?.year;
      if (firstYear == null) return null;
      const referenceDate =
        (altHadValorisation && parseDateInput(altLastValorisationDate)) ||
        parseDateInput(contractDate);
      if (!referenceDate) return null;
      const fullMonths = getFullMonthsInPriorYear(firstYear, referenceDate);
      if (fullMonths >= 12) return null;
      const inflationYear = firstYear - 1;
      const baseRate = computeRateForYear(
        getVpiChangeForYear(inflationYear) ?? DEFAULT_VPI_FALLBACK,
        firstYear,
        apartmentType
      );
      return {
        fullMonths,
        baseRate,
        aliquotRate: (baseRate * fullMonths) / 12,
        yearLabel: `1.4.${firstYear}`,
      };
    }

    if (!showResult) return null;
    const referenceDate =
      parseDateInput(lastValorisationDate) ?? parseDateInput(contractDate);
    if (!referenceDate) return null;

    if (showResult.multiYearSteps && showResult.multiYearSteps.length > 0) {
      if (alreadyInMieWeG) return null;
      const firstStep = showResult.multiYearSteps[0];
      if (!firstStep) return null;
      const firstYear = firstStep.inflationYear + 1;
      const fullMonths = getFullMonthsInPriorYear(firstYear, referenceDate);
      if (fullMonths >= 12) return null;
      const baseRate = computeRateForYear(
        getVpiChangeForYear(firstStep.inflationYear) ?? DEFAULT_VPI_FALLBACK,
        firstYear,
        apartmentType
      );
      return {
        fullMonths,
        baseRate,
        aliquotRate: firstStep.ratePercent,
        yearLabel: `1.4.${firstYear}`,
      };
    }

    if (showResult.appliedRatePercent >= showResult.effectiveRatePercent) {
      return null;
    }
    const fullMonths = getFullMonthsInPriorYear(valorisationYear, referenceDate);
    if (fullMonths >= 12) return null;
    return {
      fullMonths,
      baseRate: showResult.effectiveRatePercent,
      aliquotRate: showResult.appliedRatePercent,
      yearLabel: `1.4.${valorisationYear}`,
    };
  }, [
    showParallel,
    showResult,
    altHadValorisation,
    altLastValorisationDate,
    contractDate,
    apartmentType,
    lastValorisationDate,
    alreadyInMieWeG,
    valorisationYear,
  ]);

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
  const currentYear = new Date().getFullYear();
  const lastIndexationYearOptions = Array.from(
    { length: currentYear - 1986 + 1 },
    (_, i) => currentYear - i
  );

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
    <div className="min-h-screen overflow-x-hidden bg-zinc-50 font-sans">
      <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <header className="mb-6 flex flex-col gap-3 border-b border-zinc-200 pb-6 sm:mb-8 sm:gap-4 sm:pb-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-2xl lg:text-3xl">
            Ihr Vermieter hat die Miete erhöht? Prüfen Sie hier, ob die Erhöhung legal ist.
          </h1>
          <p className="text-base text-zinc-600 sm:text-lg">
            Das neue Mieten-Wertsicherungsgesetz (MieWeG) begrenzt seit 1. Jänner 2026,
            wie stark die Miete steigen darf. Geben Sie Ihre Daten ein – unser Rechner zeigt
            die maximal zulässige Miete.
          </p>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 sm:text-base">
            <p className="font-medium">Kein Rechtsexperte nötig – der Rechner führt Sie Schritt für Schritt.</p>
          </div>
        </header>

        {/* Progress indicator – horizontal scroll auf Mobile */}
        <nav
          className="mb-6 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:overflow-visible sm:px-0"
          aria-label="Fortschritt"
        >
          <div className="flex min-w-max items-center gap-1 py-1 text-xs sm:text-sm sm:min-w-0 sm:flex-wrap sm:gap-2">
            {(
              [
                ["vertragsart", "Vertragstyp", "Typ"],
                ["grunddaten", "Vertragsdaten", "Daten"],
                ["details", "Details", "Details"],
                ["ergebnis", "Ergebnis", "Ergebnis"],
              ] as const
            ).map(([s, label, labelShort], i) => (
              <span key={s} className="flex shrink-0 items-center gap-1 sm:gap-2">
                {i > 0 && (
                  <span
                    className="h-px w-2 shrink-0 bg-zinc-200 sm:w-4"
                    aria-hidden
                  />
                )}
                <button
                  onClick={() => setStep(s)}
                    className={`flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 transition-colors sm:min-h-0 sm:rounded-md sm:px-2 sm:py-1 ${
                    step === s
                      ? "bg-red-50 font-semibold text-red-700"
                      : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
                  }`}
                >
                  <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[0.7rem] font-medium sm:h-5 sm:w-5 ${
                      step === s ? "bg-red-600 text-white" : "bg-zinc-200 text-zinc-600"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span>
                    <span className="sm:hidden">{labelShort}</span>
                    <span className="hidden sm:inline">{label}</span>
                  </span>
                </button>
              </span>
            ))}
          </div>
        </nav>

        {/* Step 1: Vertragstyp */}
        {step === "vertragsart" && (
          <section className="space-y-6 rounded-xl border border-zinc-100 bg-white p-4 shadow sm:space-y-7 sm:p-6">
            <h2 className="text-lg font-semibold text-zinc-900">
              Schritt 1: Ihr Vertragstyp
            </h2>

            <p className="text-sm text-zinc-600">
              Neuverträge (ab 1.1.2026) und Altverträge (vor 1.1.2026) werden
              unterschiedlich berechnet. Wir führen Sie Schritt für Schritt
              durch.
            </p>

            <fieldset className="space-y-3">
              <legend className="text-sm font-medium text-zinc-700">
                Wann wurde Ihr Mietvertrag unterzeichnet?
              </legend>
              {(
                [
                  [
                    "altvertrag",
                    "Vor dem 1. Januar 2026 (Altvertrag)",
                    "Verträge mit älteren Wertsicherungsklauseln",
                  ],
                  [
                    "neuvertrag",
                    "Am oder nach dem 1. Januar 2026 (Neuvertrag)",
                    "Oder Vertrag verweist auf MieWeG § 1 Abs 2",
                  ],
                ] as const
              ).map(([val, title, desc]) => {
                const isNeuvertragUnavailable =
                  val === "neuvertrag" && !NEUVERTRAG_AVAILABLE;
                return (
                  <label
                    key={val}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
                      effectiveMode === val
                        ? "border-red-600 bg-red-50"
                        : "border-zinc-200 hover:border-zinc-300"
                    } ${isNeuvertragUnavailable ? "opacity-90" : ""}`}
                  >
                    <input
                      type="radio"
                      name="contractMode"
                      value={val}
                      checked={effectiveMode === val}
                      onChange={() => {
                        setContractMode(val);
                        if (val === "neuvertrag") {
                          setAltHadValorisation(null);
                          setAltLastValorisationDate("");
                          const year = Number(contractDate.split("-")[0]);
                          if (year < 2026) {
                            setContractDate("2026-01-01");
                          }
                        }
                      }}
                      className="mt-1 h-4 w-4 text-red-600 focus:ring-red-600"
                    />
                    <div className="flex-1">
                      <span className="block text-sm font-medium text-zinc-900">
                        {title}
                        {isNeuvertragUnavailable && (
                          <span className="ml-2 inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                            Derzeit nicht verfügbar
                          </span>
                        )}
                      </span>
                      <span className="block text-xs text-zinc-500">
                        {desc}
                      </span>
                    </div>
                  </label>
                );
              })}
            </fieldset>

            {!NEUVERTRAG_AVAILABLE && effectiveMode === "neuvertrag" && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Die Berechnung für Neuverträge ist derzeit nicht möglich. Die
                erste mögliche Mietanpassung ist der 1. April 2027; hierfür
                fehlen noch die offiziellen VPI-Daten 2026 (voraussichtlich
                verfügbar ab 2027).
              </div>
            )}

            {isAltvertrag && (
              <>
                <fieldset className="space-y-3">
                  <legend className="text-sm font-medium text-zinc-700">
                    Wurde Ihre Miete seit Unterzeichnung bereits erhöht?
                  </legend>
                  <p className="text-xs text-zinc-500">
                    Hat Ihr Vermieter Ihre Miete seit Vertragsunterzeichnung
                    schon angehoben?
                  </p>
                  <label
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
                      altHadValorisation === false
                        ? "border-red-600 bg-red-50"
                        : "border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="altHadValorisation"
                      checked={altHadValorisation === false}
                      onChange={() => {
                        setAltHadValorisation(false);
                        setAltLastValorisationDate("");
                      }}
                      className="mt-1 h-4 w-4 text-red-600 focus:ring-red-600"
                    />
                    <span className="text-sm font-medium text-zinc-900">
                      Nein, noch keine Anpassung
                    </span>
                  </label>
                  <label
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
                      altHadValorisation === true
                        ? "border-red-600 bg-red-50"
                        : "border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="altHadValorisation"
                      checked={altHadValorisation === true}
                      onChange={() => setAltHadValorisation(true)}
                      className="mt-1 h-4 w-4 text-red-600 focus:ring-red-600"
                    />
                    <span className="text-sm font-medium text-zinc-900">
                      Ja
                    </span>
                  </label>
                </fieldset>

                {altHadValorisation === true && (
                  <div className="space-y-2 rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <label className="block text-sm font-medium text-zinc-700">
                      Monat der letzten Indexierung
                    </label>
                    <p className="text-xs text-zinc-600">
                      Der Monat steht oft auf dem Mieterhöhungsschreiben, z.B.
                      als „VPI Februar 2025“. Maßgeblich ist der Monat der
                      Indexzahl, nicht der Tag der Anzeige.
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                      <select
                        value={
                          altLastValorisationDate
                            ? Number(altLastValorisationDate.split("-")[1]) - 1
                            : ""
                        }
                        onChange={(e) => {
                          const m = e.target.value;
                          if (m === "") {
                            setAltLastValorisationDate("");
                            return;
                          }
                          const mi = Number(m);
                          const y = altLastValorisationDate
                            ? altLastValorisationDate.split("-")[0]
                            : String(currentYear);
                          setAltLastValorisationDate(
                            `${y}-${String(mi + 1).padStart(2, "0")}-01`
                          );
                        }}
                        className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
                      >
                        <option value="">Monat wählen</option>
                        {months.map((mo, i) => (
                          <option key={i} value={i}>
                            {mo}
                          </option>
                        ))}
                      </select>
                      <select
                        value={
                          altLastValorisationDate
                            ? altLastValorisationDate.split("-")[0]
                            : ""
                        }
                        onChange={(e) => {
                          const y = e.target.value;
                          const m = altLastValorisationDate
                            ? altLastValorisationDate.split("-")[1]
                            : "01";
                          setAltLastValorisationDate(
                            y ? `${y}-${m}-01` : ""
                          );
                        }}
                        className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
                      >
                        <option value="">Jahr wählen</option>
                        {lastIndexationYearOptions.map((yr) => (
                          <option key={yr} value={yr}>
                            {yr}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                <fieldset className="space-y-3">
                  <legend className="text-sm font-medium text-zinc-700">
                    Wie wird die Miete in Ihrem Vertrag angepasst?
                  </legend>
                  <p className="text-xs text-zinc-500">
                    Bitte schauen Sie in Ihren Mietvertrag – oft steht dies in
                    der Wertsicherungsklausel.
                  </p>
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
                        "Berechnet nur die maximal zulässige Miete",
                      ],
                    ] as const
                  ).map(([val, title, desc]) => (
                    <label
                      key={val}
                      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                        altvertragClause === val
                          ? "border-red-600 bg-red-50"
                          : "border-zinc-200 hover:border-zinc-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="altvertragClause"
                        value={val}
                        checked={altvertragClause === val}
                        onChange={() => setAltvertragClause(val)}
                        className="mt-0.5 h-4 w-4 text-red-600 focus:ring-red-600"
                      />
                      <div>
                        <span className="block text-sm font-medium text-zinc-900">
                          {title}
                        </span>
                        <span className="block text-xs text-zinc-500">
                          {desc}
                        </span>
                      </div>
                    </label>
                  ))}
                </fieldset>
              </>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <button
                onClick={() => setStep("grunddaten")}
                className="min-h-[44px] rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 active:bg-zinc-100 sm:min-h-0 sm:py-2.5"
              >
                Zurück
              </button>
              <button
                onClick={() => setStep("grunddaten")}
                disabled={!canProceedFromStep1}
                className="min-h-[44px] flex-1 rounded-lg bg-red-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 active:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-0 sm:py-2.5"
              >
                Weiter
              </button>
            </div>
          </section>
        )}

        {/* Step 2: Vertragsdaten */}
        {step === "grunddaten" && (
          <section className="space-y-6 rounded-xl border border-zinc-100 bg-white p-4 shadow sm:space-y-7 sm:p-6">
            <h2 className="text-lg font-semibold text-zinc-900">
              Schritt 2: Vertragsdaten
            </h2>

            {isAltvertrag && altHadValorisation === true && (
              <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
                Für die Berechnung verwenden wir den Monat der letzten
                Indexierung als Referenzdatum (§ 4 Abs 2 MieWeG), nicht das
                Unterzeichnungsdatum.
              </div>
            )}

            <div>
              <label
                htmlFor="contractDate"
                className="block text-sm font-medium text-zinc-700"
              >
                Vertragsunterzeichnung
              </label>
              <input
                id="contractDate"
                type="date"
                min={effectiveMode === "neuvertrag" ? NEUVERTRAG_MIN_CONTRACT_DATE : undefined}
                value={contractDate}
                onChange={(e) => {
                  const next = e.target.value;
                  if (
                    effectiveMode === "neuvertrag" &&
                    next !== "" &&
                    next < NEUVERTRAG_MIN_CONTRACT_DATE
                  ) {
                    setContractDate(NEUVERTRAG_MIN_CONTRACT_DATE);
                  } else {
                    setContractDate(next);
                  }
                }}
                className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm placeholder:text-zinc-500 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
              />
              <p className="mt-1 text-xs text-zinc-500">
                Datum, an dem Sie den Mietvertrag unterschrieben haben. Nicht
                das Einzugsdatum.
              </p>
            </div>
            <div>
              <label
                htmlFor="rent"
                className="block text-sm font-medium text-zinc-700"
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
                className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm placeholder:text-zinc-500 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
              />
              <p className="mt-1 text-xs text-zinc-500">
                Die Miete, die Sie derzeit zahlen (inkl. letzter Anpassung falls
                bereits erhöht).
              </p>
            </div>
            <div>
              <label
                htmlFor="apartmentType"
                className="block text-sm font-medium text-zinc-700"
              >
                Wohnungstyp
              </label>
              <select
                id="apartmentType"
                value={apartmentType}
                onChange={(e) =>
                  setApartmentType(e.target.value as ApartmentType)
                }
                className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm placeholder:text-zinc-500 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
              >
                <option value="free">
                  Freier Mietzins – z.B. Neubau, teilanwendungsbereich MRG
                </option>
                <option value="preisgeschützt">
                  Preisgeschützt – Richtwert- oder Kategoriemiete (Vollanwendung
                  MRG)
                </option>
              </select>
              <p className="mt-1 text-xs text-zinc-500">
                Nicht erfasst: Freizeitwohnungen, Ein-/Zweiobjekthäuser,
                Geschäftsräume, WGG (außer § 13 Abs 4).
              </p>
            </div>
            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <button
                onClick={() => setStep("vertragsart")}
                className="min-h-[44px] rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 active:bg-zinc-100 sm:min-h-0 sm:py-2.5"
              >
                Zurück
              </button>
              <button
                onClick={() => setStep("details")}
                disabled={!canProceedFromStep2}
                className="min-h-[44px] flex-1 rounded-lg bg-red-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 active:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-0 sm:py-2.5"
              >
                Weiter
              </button>
            </div>
          </section>
        )}

        {/* Step 3: Details */}
        {step === "details" && (
          <section className="space-y-6 rounded-xl border border-zinc-100 bg-white p-4 shadow sm:space-y-7 sm:p-6">
            <h2 className="text-lg font-semibold text-zinc-900">
              Schritt 3: Details
            </h2>

            {/* Neuvertrag or "unknown" clause → simple MieWeG */}
            {(effectiveMode === "neuvertrag" ||
              altvertragClause === "unknown") && (
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="valorisationYear"
                    className="block text-sm font-medium text-zinc-700"
                  >
                    Für welches Jahr soll die maximale Miete berechnet werden?
                  </label>
                  <select
                    id="valorisationYear"
                    value={valorisationYear}
                    onChange={(e) =>
                      setValorisationYear(Number(e.target.value))
                    }
                    className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm placeholder:text-zinc-500 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
                  >
                    {VALORISATION_YEARS.map((y) => (
                      <option key={y} value={y}>
                        1. April {y}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-zinc-500">
                    Nur Jahre mit offiziellen VPI-Jahresdurchschnittswerten
                    (derzeit bis 1.4.{MAX_RELIABLE_VALORISATION_YEAR}).
                  </p>
                  {firstIndexationDate && (
                    <p className="mt-1 text-xs text-zinc-500">
                      Mietanpassungen sind nur ab dem 1.4.
                      {firstIndexationDate.getFullYear()} zulässig.
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="customVpi"
                    className="block text-sm font-medium text-zinc-700"
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
                    className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm placeholder:text-zinc-500 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                  <p className="mt-1 text-xs text-zinc-500">
                    Nur anpassen, wenn Sie andere Inflationsdaten verwenden
                    möchten. Standardwert aus Statistik Austria.
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="lastVal"
                    className="block text-sm font-medium text-zinc-700"
                  >
                    Letzte Valorisierung (optional)
                  </label>
                  <input
                    id="lastVal"
                    type="date"
                    value={lastValorisationDate}
                    onChange={(e) => setLastValorisationDate(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm placeholder:text-zinc-500 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                  <p className="mt-1 text-xs text-zinc-500">
                    Wenn Ihre Miete bereits angehoben wurde: Monat der
                    Indexzahl, die die letzte Anpassung ausgelöst hat (steht oft
                    auf der Mieterhöhungsanzeige).
                  </p>
                  {lastValorisationDate.trim() && (
                    <label className="mt-3 flex items-start gap-2 text-sm text-zinc-700">
                      <input
                        type="checkbox"
                        checked={alreadyInMieWeG}
                        onChange={(e) => setAlreadyInMieWeG(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-red-600 focus:ring-red-600"
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
                      className="block text-sm font-medium text-zinc-700"
                    >
                      Für welches Jahr soll die maximale Miete berechnet werden?
                    </label>
                    <select
                      id="altTargetYear"
                      value={altTargetYear}
                      onChange={(e) =>
                        setAltTargetYear(Number(e.target.value))
                      }
                      className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm placeholder:text-zinc-500 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
                    >
                      {VALORISATION_YEARS.map((y) => (
                        <option key={y} value={y}>
                          1. April {y}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-zinc-500">
                      Das Jahr, für das Sie die zulässige Miete prüfen möchten.
                      Nur Jahre mit offiziellen VPI-Jahresdurchschnittswerten
                      (derzeit bis 1.4.{MAX_RELIABLE_VALORISATION_YEAR}).
                    </p>
                  </div>

                  {(altvertragClause === "vpiAnnual" ||
                    altvertragClause === "vpiThreshold") && (
                    <div>
                      <label
                        htmlFor="vpiBase"
                        className="block text-sm font-medium text-zinc-700"
                      >
                        VPI-Basis im Vertrag
                      </label>
                      <select
                        id="vpiBase"
                        value={vpiBase}
                        onChange={(e) =>
                          setVpiBase(e.target.value as VpiBaseName)
                        }
                        className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm placeholder:text-zinc-500 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
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
                      <p className="mt-1 text-xs text-zinc-500">
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
                        className="block text-sm font-medium text-zinc-700"
                      >
                        Vertraglicher Anpassungstermin
                      </label>
                      <select
                        id="adjustmentMonth"
                        value={adjustmentMonth}
                        onChange={(e) =>
                          setAdjustmentMonth(Number(e.target.value))
                        }
                        className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm placeholder:text-zinc-500 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
                      >
                        {months.map((m, i) => (
                          <option key={i} value={i}>
                            1. {m}
                          </option>
                        ))}
                      </select>
                      <p className="mt-1 text-xs text-zinc-500">
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
                          className="block text-sm font-medium text-zinc-700"
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
                          className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm placeholder:text-zinc-500 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
                        />
                        <p className="mt-1 text-xs text-zinc-500">
                          Ab welcher kumulativen VPI-Änderung wird die Miete
                          angepasst?
                        </p>
                      </div>
                      <div>
                        <label
                          htmlFor="baseIndexValue"
                          className="block text-sm font-medium text-zinc-700"
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
                          className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm placeholder:text-zinc-500 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
                        />
                        {defaultBaseIndex != null && !baseIndexValue && (
                          <button
                            type="button"
                            onClick={() =>
                              setBaseIndexValue(defaultBaseIndex.toFixed(1))
                            }
                            className="mt-1.5 text-xs text-red-600 hover:underline"
                          >
                            Ø {contractYear} übernehmen:{" "}
                            {defaultBaseIndex.toFixed(1)}
                          </button>
                        )}
                        <p className="mt-1 text-xs text-zinc-500">
                          {vpiBase} Jahresdurchschnittswert bei letzter
                          Anpassung. Quelle:{" "}
                          <a
                            href="https://data.statistik.gv.at"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red-600 hover:underline"
                          >
                            data.statistik.gv.at
                          </a>
                        </p>
                      </div>
                    </>
                  )}

                  {altvertragClause === "staffel" && (
                    <>
                      <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800 ">
                        Hinweis: Staffelerhöhungen, die einen von der
                        Wertsicherung verschiedenen Grund haben (z.B.
                        vereinbarte Erhöhung nach Abschluss von Bauarbeiten),
                        sind vom MieWeG ausgenommen (§ 1 Abs 4 Satz 4 MieWeG).
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700">
                          Art der Staffelung
                        </label>
                        <div className="mt-1 flex gap-4">
                          <label className="flex items-center gap-2 text-sm text-zinc-700">
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
                          <label className="flex items-center gap-2 text-sm text-zinc-700">
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
                          className="block text-sm font-medium text-zinc-700"
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
                          className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm placeholder:text-zinc-500 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="staffelMonth"
                          className="block text-sm font-medium text-zinc-700"
                        >
                          Erhöhungstermin
                        </label>
                        <select
                          id="staffelMonth"
                          value={staffelMonth}
                          onChange={(e) =>
                            setStaffelMonth(Number(e.target.value))
                          }
                          className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm placeholder:text-zinc-500 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
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

            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <button
                onClick={() => setStep("grunddaten")}
                className="min-h-[44px] rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 active:bg-zinc-100 sm:min-h-0 sm:py-2.5"
              >
                Zurück
              </button>
              <button
                onClick={() => setStep("ergebnis")}
                className="min-h-[44px] flex-1 rounded-lg bg-red-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 active:bg-red-800 sm:min-h-0 sm:py-2.5"
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
              <div className="rounded-xl border border-zinc-100 bg-white p-4 shadow sm:p-6">
                <h2 className="text-lg font-semibold text-zinc-900">
                  Ergebnis – MieWeG-Begrenzung
                </h2>
                <div className="mt-4 space-y-2">
                  <p className="text-xl font-bold leading-tight text-zinc-900 sm:text-2xl">
                    Max. zulässige Miete ab{" "}
                    {apartmentType === "preisgeschützt" ? "1.5" : "1.4"}.
                    {valorisationYear}: {formatEur(showResult.newRentCents)}
                  </p>
                  <p className="text-sm text-zinc-600">
                    {showResult.multiYearSteps
                      ? `Kumulierte Änderung: ${showResult.appliedRatePercent.toFixed(2)}%`
                      : `Angewendeter Satz: ${showResult.appliedRatePercent.toFixed(2)}%`}
                  </p>
                </div>
                {apartmentType === "preisgeschützt" && (
                  <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 ">
                    Zusätzlich gilt die Obergrenze nach § 16 Abs 9 MRG
                    (Richtwert, Kategoriebeträge). Die tatsächliche Miete kann
                    daher niedriger sein.
                  </div>
                )}
                <ul className="mt-4 list-inside list-disc space-y-1 text-sm text-zinc-600">
                  {showResult.breakdown.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>

                {miewegTimelineData.length > 1 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-semibold text-zinc-900">
                      Zeitachse der MieWeG-Anpassung
                    </h3>
                    <p className="mt-1 text-sm text-zinc-600">
                      Die Kurve zeigt, wie sich die zulässige Miete von Jahr zu
                      Jahr unter den MieWeG-Grenzen entwickelt.
                    </p>
                    <div className="mt-3 h-56 w-full min-w-0 sm:h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={miewegTimelineData}
                          margin={{ top: 8, right: 8, left: 4, bottom: 4 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="yearLabel" tick={{ fontSize: 11 }} />
                          <YAxis
                            tickFormatter={(value: number) =>
                              formatEur(Math.round(value * 100))
                            }
                            width={64}
                            tick={{ fontSize: 11 }}
                          />
                          <Tooltip
                            formatter={(value) => {
                              const numericValue = asNumber(value);
                              if (numericValue == null) return ["-", "Miete"];
                              return [
                                formatEur(Math.round(numericValue * 100)),
                                "Miete",
                              ];
                            }}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="rentEur"
                            name="Miete"
                            stroke="#c8102e"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Parallelrechnung result */}
            {showParallel && showParallel.steps.length > 0 && (
              <div className="rounded-xl border border-zinc-100 bg-white p-4 shadow sm:p-6">
                <h2 className="text-lg font-semibold text-zinc-900">
                  Ergebnis – Parallelrechnung
                </h2>
                <p className="mt-2 text-sm text-zinc-600">
                  Vergleich der Vertragskurve mit der
                  MieWeG-Begrenzungskurve. Maßgeblich ist der niedrigere Wert.
                </p>

                <div className="mt-4 space-y-2">
                  <p className="text-xl font-bold leading-tight text-zinc-900 sm:text-2xl">
                    Max. zulässige Miete ab{" "}
                    {apartmentType === "preisgeschützt" ? "1.5" : "1.4"}.
                    {altTargetYear}:{" "}
                    {formatEur(showParallel.finalRentCents)}
                  </p>
                  <p className="text-sm text-zinc-600">
                    Gesamtänderung:{" "}
                    {showParallel.totalChangePercent.toFixed(2)}%
                  </p>
                </div>

                {/* Comparison table – horizontal scroll auf Mobile */}
                <div className="mt-6 overflow-x-auto" style={{ WebkitOverflowScrolling: "touch" }}>
                  <table className="min-w-[340px] text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-zinc-200 text-[0.7rem] sm:text-xs font-medium uppercase tracking-wider text-zinc-500">
                        <th className="pb-2 pr-4">1. April</th>
                        <th className="pb-2 pr-4">Vertrag</th>
                        <th className="pb-2 pr-4">MieWeG</th>
                        <th className="pb-2 pr-4">Miete</th>
                        <th className="pb-2">Bindend</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {showParallel.steps.map((s: ParallelrechnungStep) => (
                        <tr key={s.year} className="even:bg-zinc-50">
                          <td className="py-2 pr-4 font-medium text-zinc-900">
                            {s.year}
                          </td>
                          <td className="py-2 pr-4 text-zinc-600">
                            {formatEur(s.vertragRentCents)}
                          </td>
                          <td className="py-2 pr-4 text-zinc-600">
                            {formatEur(s.miewegRentCents)}
                          </td>
                          <td className="py-2 pr-4 font-medium text-zinc-900">
                            {formatEur(s.actualRentCents)}
                          </td>
                          <td className="py-2">
                            {!s.contractTriggered ? (
                              <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
                                Keine Erhöhung
                              </span>
                            ) : s.binding === "mieweg" ? (
                              <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 ">
                                MieWeG begrenzt
                              </span>
                            ) : s.binding === "vertrag" ? (
                              <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 ">
                                Vertrag
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
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
                  <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 ">
                    Zusätzlich gilt die Obergrenze nach § 16 Abs 9 MRG. Die
                    tatsächliche Miete kann daher niedriger sein.
                  </div>
                )}
              </div>
            )}

            {aliquotVisual && (
              <div className="rounded-xl border border-zinc-100 bg-white p-4 shadow sm:p-6">
                <h2 className="text-lg font-semibold text-zinc-900">
                  Aliquotierung verständlich erklärt
                </h2>
                <p className="mt-2 text-sm text-zinc-600">
                  Bei der ersten MieWeG-Anpassung wird nur der Anteil der
                  vollen Monate im Vorjahr berücksichtigt. Der Startmonat
                  markiert, ab wann diese Monate gezählt werden; die Anpassung
                  erfolgt jeweils am 1. April.
                </p>
                <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="min-w-0 flex-1">
                    <AliquotierungTimeline
                      startMonthIndex={12 - aliquotVisual.fullMonths}
                      months={months}
                    />
                  </div>
                  <div className="shrink-0 sm:w-48">
                    <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 font-mono text-sm">
                      <div className="font-medium text-zinc-600">
                        Berechnungsformel
                      </div>
                      <div className="mt-1.5 text-zinc-900">
                        {aliquotVisual.baseRate.toFixed(4)} % ×{" "}
                        {aliquotVisual.fullMonths}/12 ={" "}
                        {aliquotVisual.aliquotRate.toFixed(4)} %
                      </div>
                      <p className="mt-2 text-xs text-zinc-500">
                        Für {aliquotVisual.yearLabel}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showParallel && showParallel.steps.length === 0 && (
              <div className="rounded-xl border border-zinc-100 bg-white p-6 shadow">
                <p className="text-zinc-600">
                  Keine Berechnung möglich. Bitte überprüfen Sie Ihre Eingaben.
                </p>
              </div>
            )}

            {/* Proposed rent check */}
            {finalRent != null && (
              <div className="rounded-xl border border-zinc-100 bg-white p-4 shadow sm:p-6">
                <label
                  htmlFor="proposedRent"
                  className="block text-sm font-medium text-zinc-700"
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
                  className="mt-1 block w-full max-w-xs min-h-[44px] rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-base text-zinc-900 shadow-sm placeholder:text-zinc-500 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 sm:min-h-0 sm:py-2"
                />
                {proposedValid && (
                  <p className="mt-2 text-sm font-medium text-green-600">
                    Die vorgeschlagene Miete ist zulässig (nicht höher als{" "}
                    {formatEur(finalRent)}).
                  </p>
                )}
                {proposedInvalid && (
                  <p className="mt-2 text-sm font-medium text-red-600">
                    Die vorgeschlagene Miete überschreitet den maximal
                    zulässigen Betrag von {formatEur(finalRent)}.
                  </p>
                )}
              </div>
            )}

            {reportPayload && (
              <div className="rounded-xl border border-zinc-100 bg-white p-4 shadow sm:p-6">
                <h3 className="text-base font-semibold text-zinc-900">
                  Berechnungsblatt als PDF
                </h3>
                <p className="mt-1 text-sm text-zinc-600">
                  Laden Sie alle Eingaben, Rechenschritte und Hinweise als
                  nachvollziehbares Berechnungsblatt herunter.
                </p>
                <div className="mt-4">
                  <PDFDownloadLink
                    document={<CalculationReportPdf payload={reportPayload} />}
                    fileName={pdfFileName}
                    className="inline-flex min-h-[44px] items-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 active:bg-red-800"
                  >
                    {({ loading }) =>
                      loading ? "PDF wird erstellt..." : "PDF herunterladen"
                    }
                  </PDFDownloadLink>
                </div>
              </div>
            )}

            <button
              onClick={() => setStep("details")}
              className="w-full min-h-[44px] rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 active:bg-zinc-100 sm:min-h-0 sm:py-2.5"
            >
              Zurück zu Details
            </button>
          </section>
        )}

        {/* FAQ für SEO – Accordion mit details/summary + Tailwind */}
        <section
          className="mt-10 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm sm:mt-12"
          aria-labelledby="faq-heading"
        >
          <h2
            id="faq-heading"
            className="border-b border-zinc-200 bg-zinc-50 px-4 py-3 text-base font-semibold text-zinc-900 sm:px-6 sm:py-4 sm:text-lg"
          >
            Häufige Fragen zum MieWeG
          </h2>
          <div className="divide-y divide-zinc-200">
            <details className="group">
              <summary className="flex min-h-[48px] cursor-pointer list-none items-center justify-between px-4 py-3 font-medium text-zinc-900 transition-colors hover:bg-zinc-50 active:bg-zinc-100 sm:min-h-0 sm:px-6 sm:py-4 [&::-webkit-details-marker]:hidden">
                Ab wann gilt das neue MieWeG?
                <span className="shrink-0 pl-2 text-zinc-400 transition-transform group-open:rotate-180">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <div className="border-t border-zinc-100 bg-zinc-50/50 px-4 py-3 text-sm text-zinc-600 sm:px-6 sm:py-4">
                Das Mieten-Wertsicherungsgesetz (MieWeG) gilt ab 1. Jänner 2026
                und betrifft sowohl neu abgeschlossene Mietverträge als auch
                bestehende Altverträge. Die erste mögliche Anpassung nach MieWeG
                erfolgt zum 1. April 2026.
              </div>
            </details>
            <details className="group">
              <summary className="flex min-h-[48px] cursor-pointer list-none items-center justify-between px-4 py-3 font-medium text-zinc-900 transition-colors hover:bg-zinc-50 active:bg-zinc-100 sm:min-h-0 sm:px-6 sm:py-4 [&::-webkit-details-marker]:hidden">
                Was ist die maximale Mietzinserhöhung?
                <span className="shrink-0 pl-2 text-zinc-400 transition-transform group-open:rotate-180">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <div className="border-t border-zinc-100 bg-zinc-50/50 px-4 py-3 text-sm text-zinc-600 sm:px-6 sm:py-4">
                Liegt die Inflation unter 3 %, gilt die volle VPI-Änderung. Bei
                Inflation über 3 % wird der darüberliegende Teil nur zur Hälfte
                berücksichtigt (z.B. bei 6 % Inflation ≈ 4,5 % zulässige
                Erhöhung). Für preisgeschützte Wohnungen gelten niedrigere
                Obergrenzen: 2026 maximal 1 %, 2027 maximal 2 %.
              </div>
            </details>
            <details className="group">
              <summary className="flex min-h-[48px] cursor-pointer list-none items-center justify-between px-4 py-3 font-medium text-zinc-900 transition-colors hover:bg-zinc-50 active:bg-zinc-100 sm:min-h-0 sm:px-6 sm:py-4 [&::-webkit-details-marker]:hidden">
                Gilt das MieWeG auch für meinen Altvertrag?
                <span className="shrink-0 pl-2 text-zinc-400 transition-transform group-open:rotate-180">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <div className="border-t border-zinc-100 bg-zinc-50/50 px-4 py-3 text-sm text-zinc-600 sm:px-6 sm:py-4">
                Ja. Das MieWeG gilt für alle Wohnungsmietverträge – unabhängig
                vom Abschlussdatum. Bei Altverträgen mit Wertsicherungsklausel
                wird die Parallelrechnung angewendet: Maßgeblich ist der
                niedrigere Wert aus Vertragsklausel und MieWeG-Begrenzung.
              </div>
            </details>
            <details className="group">
              <summary className="flex min-h-[48px] cursor-pointer list-none items-center justify-between px-4 py-3 font-medium text-zinc-900 transition-colors hover:bg-zinc-50 active:bg-zinc-100 sm:min-h-0 sm:px-6 sm:py-4 [&::-webkit-details-marker]:hidden">
                Wann darf die Miete angepasst werden?
                <span className="shrink-0 pl-2 text-zinc-400 transition-transform group-open:rotate-180">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <div className="border-t border-zinc-100 bg-zinc-50/50 px-4 py-3 text-sm text-zinc-600 sm:px-6 sm:py-4">
                Wertsicherungen sind nur einmal jährlich zum 1. April zulässig –
                unabhängig von abweichenden Klauseln in Ihrem Vertrag. Dies gilt
                ab 2026 für alle von MieWeG erfassten Mietverträge.
              </div>
            </details>
            <details className="group">
              <summary className="flex min-h-[48px] cursor-pointer list-none items-center justify-between px-4 py-3 font-medium text-zinc-900 transition-colors hover:bg-zinc-50 active:bg-zinc-100 sm:min-h-0 sm:px-6 sm:py-4 [&::-webkit-details-marker]:hidden">
                Wie prüfe ich meine Mietzinserhöhung?
                <span className="shrink-0 pl-2 text-zinc-400 transition-transform group-open:rotate-180">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <div className="border-t border-zinc-100 bg-zinc-50/50 px-4 py-3 text-sm text-zinc-600 sm:px-6 sm:py-4">
                Geben Sie Ihre aktuelle Miete, Vertragsdaten und ggf. die
                letzte Indexierung in den Rechner ein. Er zeigt die maximal
                zulässige Miete. Ist die vom Vermieter geforderte Erhöhung
                höher, können Sie sie anfechten oder rechtliche Beratung
                einholen.
              </div>
            </details>
          </div>
        </section>

        <footer className="mt-10 space-y-4 sm:mt-12">
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-4 text-sm text-zinc-600">
            <p className="font-medium text-zinc-700">Haftungsausschluss</p>
            <p className="mt-2">
              Die Berechnungen dieses Rechners dienen ausschließlich der
              Vereinfachung und Orientierung. Es wird keine Garantie für die
              rechtliche Richtigkeit, Vollständigkeit oder Aktualität der
              Angaben übernommen. Insbesondere ersetzen die Ergebnisse keine
              individuelle Prüfung durch eine sachkundige Person.
              Nutzer:innen sollten die Berechnungen stets selbst überprüfen oder
              rechtlichen Rat einholen, bevor sie Entscheidungen treffen oder
              Zahlungen anpassen.
            </p>
          </div>
          <p className="text-center text-xs text-zinc-500">
            Nicht erfasst: Mietverträge nach dem WGG (außer § 13 Abs 4),
            Geschäftsraummieten, Voll-Ausnahmen vom MRG. Bei negativer
            VPI-Entwicklung bleibt die Miete unverändert.
          </p>
        </footer>
      </main>
    </div>
  );
}
