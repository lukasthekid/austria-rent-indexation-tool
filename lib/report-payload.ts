import type { ApartmentType, MieWeGResult } from "./mieweg";
import type {
  ParallelrechnungResult,
  ParallelrechnungStep,
} from "./parallelrechnung";
import type { BacklogResult } from "./rueckforderung";
import { getVpiAverageForYear, getVpiChangeForYear } from "./vpi-data";

export type ContractMode = "neuvertrag" | "altvertrag";
export type AltvertragClause = "vpiAnnual" | "vpiThreshold" | "staffel" | "unknown";

export interface CalculationReportPayload {
  reportMeta: {
    createdAtIso: string;
    locale: "de-AT";
    currency: "EUR";
  };
  caseContext: {
    contractMode: ContractMode;
    apartmentType: ApartmentType;
    targetYear: number;
    inflationYear: number;
    legalLabel: string;
  };
  inputs: {
    currentRentCents: number;
    contractDate: string;
    lastValorisationDate?: string;
    alreadyInMieWeG?: boolean;
    altHadValorisation?: boolean;
    altLastValorisationDate?: string;
    altvertragClause?: AltvertragClause;
    vpiPercent: number;
    usedCustomVpi: boolean;
    clauseDetails: Array<{ label: string; value: string }>;
    proposedRentCents?: number;
  };
  outputs: {
    finalAllowedRentCents: number;
    totalChangePercent: number;
    proposedCheck?: {
      isAllowed: boolean;
      proposedCents: number;
      maxAllowedCents: number;
      deltaCents: number;
    };
  };
  backlog?: {
    totalBacklogCents: number;
    perYear: Array<{ year: number; backlogCents: number }>;
  };
  explainability: {
    rules: string[];
    vpiTrace: Array<{
      inflationYear: number;
      averagePrevYear: number | null;
      averageCurrentYear: number | null;
      unroundedChangePercent: number | null;
      source: "official" | "estimate" | "custom";
    }>;
  };
  miewegResult?: {
    newRentCents: number;
    effectiveRatePercent: number;
    appliedRatePercent: number;
    breakdown: string[];
    multiYearSteps: Array<{
      inflationYear: number;
      ratePercent: number;
      rentAfterCents: number;
    }>;
  };
  parallelResult?: {
    finalRentCents: number;
    totalChangePercent: number;
    steps: ParallelrechnungStep[];
  };
  disclaimers: string[];
}

export interface BuildCalculationReportPayloadInput {
  createdAt?: Date;
  contractMode: ContractMode;
  apartmentType: ApartmentType;
  targetYear: number;
  inflationYear: number;
  currentRent: string;
  contractDate: string;
  lastValorisationDate: string;
  alreadyInMieWeG: boolean;
  altHadValorisation: boolean | null;
  altLastValorisationDate: string;
  altvertragClause: AltvertragClause;
  vpiPercent: number;
  usedCustomVpi: boolean;
  adjustmentMonth: number;
  vpiBase: string;
  thresholdPercent: string;
  baseIndexValue: string;
  staffelType: "percent" | "amount";
  staffelValue: string;
  staffelMonth: number;
  proposedRent: string;
  showResult: MieWeGResult | null;
  showParallel: ParallelrechnungResult | null;
  finalRent: number | null;
  backlog: BacklogResult | null;
}

function toCents(value: string): number | null {
  if (!value.trim()) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  return Math.round(parsed * 100);
}

function monthName(month: number): string {
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
  return months[month] ?? "Unbekannt";
}

function buildClauseDetails(
  input: BuildCalculationReportPayloadInput
): Array<{ label: string; value: string }> {
  if (input.contractMode !== "altvertrag") return [];

  if (input.altvertragClause === "unknown") {
    return [{ label: "Klausel", value: "Unbekannt / nur MieWeG-Grenze" }];
  }

  if (input.altvertragClause === "vpiAnnual") {
    return [
      { label: "Klauseltyp", value: "VPI-basiert mit jährlicher Anpassung" },
      { label: "VPI-Basis", value: input.vpiBase },
      { label: "Anpassungsmonat", value: `1. ${monthName(input.adjustmentMonth)}` },
    ];
  }

  if (input.altvertragClause === "vpiThreshold") {
    return [
      { label: "Klauseltyp", value: "VPI-basiert mit Schwellenwert" },
      { label: "VPI-Basis", value: input.vpiBase },
      { label: "Schwellenwert", value: `${Number(input.thresholdPercent || "0").toFixed(1)} %` },
      { label: "Basisindexwert", value: input.baseIndexValue || "nicht angegeben" },
    ];
  }

  return [
    { label: "Klauseltyp", value: "Staffelmiete" },
    {
      label: "Staffelart",
      value: input.staffelType === "percent" ? "Prozent" : "Betrag",
    },
    {
      label: "Staffelwert",
      value:
        input.staffelType === "percent"
          ? `${Number(input.staffelValue || "0").toFixed(2)} %`
          : `${Number(input.staffelValue || "0").toFixed(2)} EUR`,
    },
    { label: "Erhöhungsmonat", value: `1. ${monthName(input.staffelMonth)}` },
  ];
}

function collectInflationYears(
  input: BuildCalculationReportPayloadInput
): number[] {
  const years = new Set<number>();

  if (input.showResult?.multiYearSteps?.length) {
    for (const step of input.showResult.multiYearSteps) {
      years.add(step.inflationYear);
    }
  } else {
    years.add(input.inflationYear);
  }

  if (input.showParallel?.steps?.length) {
    for (const step of input.showParallel.steps) {
      years.add(step.year - 1);
    }
  }

  return Array.from(years).sort((a, b) => a - b);
}

function buildVpiTrace(
  input: BuildCalculationReportPayloadInput
): CalculationReportPayload["explainability"]["vpiTrace"] {
  const years = collectInflationYears(input);

  return years.map((year) => {
    const avgPrev = getVpiAverageForYear(year - 1);
    const avgCurrent = getVpiAverageForYear(year);
    const unrounded = getVpiChangeForYear(year);
    const source: "official" | "estimate" | "custom" =
      input.usedCustomVpi && year === input.inflationYear
        ? "custom"
        : avgPrev != null && avgCurrent != null
          ? "official"
          : "estimate";

    return {
      inflationYear: year,
      averagePrevYear: avgPrev ?? null,
      averageCurrentYear: avgCurrent ?? null,
      unroundedChangePercent: unrounded ?? null,
      source,
    };
  });
}

export function buildCalculationReportPayload(
  input: BuildCalculationReportPayloadInput
): CalculationReportPayload | null {
  if (input.finalRent == null) return null;

  const createdAtIso = (input.createdAt ?? new Date()).toISOString();
  const currentRentCents = toCents(input.currentRent) ?? 0;
  const proposedRentCents = toCents(input.proposedRent);
  const legalLabel =
    input.showParallel != null
      ? "Parallelrechnung (Vertragskurve vs. MieWeG)"
      : "MieWeG-Begrenzung";

  const totalChangePercent =
    input.showParallel?.totalChangePercent ??
    input.showResult?.appliedRatePercent ??
    (currentRentCents > 0
      ? ((input.finalRent - currentRentCents) / currentRentCents) * 100
      : 0);

  const proposedCheck =
    proposedRentCents != null
      ? {
          isAllowed: proposedRentCents <= input.finalRent,
          proposedCents: proposedRentCents,
          maxAllowedCents: input.finalRent,
          deltaCents: proposedRentCents - input.finalRent,
        }
      : undefined;

  return {
    reportMeta: {
      createdAtIso,
      locale: "de-AT",
      currency: "EUR",
    },
    caseContext: {
      contractMode: input.contractMode,
      apartmentType: input.apartmentType,
      targetYear: input.targetYear,
      inflationYear: input.inflationYear,
      legalLabel,
    },
    inputs: {
      currentRentCents,
      contractDate: input.contractDate,
      lastValorisationDate: input.lastValorisationDate || undefined,
      alreadyInMieWeG: input.lastValorisationDate ? input.alreadyInMieWeG : undefined,
      altHadValorisation:
        input.contractMode === "altvertrag" ? (input.altHadValorisation ?? undefined) : undefined,
      altLastValorisationDate:
        input.contractMode === "altvertrag"
          ? input.altLastValorisationDate || undefined
          : undefined,
      altvertragClause:
        input.contractMode === "altvertrag" ? input.altvertragClause : undefined,
      vpiPercent: input.vpiPercent,
      usedCustomVpi: input.usedCustomVpi,
      clauseDetails: buildClauseDetails(input),
      proposedRentCents: proposedRentCents ?? undefined,
    },
    outputs: {
      finalAllowedRentCents: input.finalRent,
      totalChangePercent,
      proposedCheck,
    },
    backlog:
      input.backlog && input.apartmentType === "free" && input.backlog.totalBacklogCents > 0
        ? {
            totalBacklogCents: input.backlog.totalBacklogCents,
            perYear: input.backlog.perYear.map((entry) => ({
              year: entry.year,
              backlogCents: entry.backlogCents,
            })),
          }
        : undefined,
    explainability: {
      rules: [
        "Zeitregel: Valorisierungen erfolgen am 1. April (MieWeG).",
        "Deckelregel: Über 3 % Inflation wird nur die Hälfte des übersteigenden Teils angerechnet.",
        "Preisgeschützt: 1.4.2026 max 1 %, 1.4.2027 max 2 %.",
        "Aliquotierung beim Einstieg: anwendbarer Satz zuerst deckeln, danach mit vollen Monaten / 12 kürzen.",
        "Parallelrechnung: maßgeblich ist min(Vertragskurve, MieWeG-Kurve) bei ausgelöster Vertragserhöhung.",
        "Rundung: <= 0,5 Cent abrunden, > 0,5 Cent aufrunden.",
      ],
      vpiTrace: buildVpiTrace(input),
    },
    miewegResult: input.showResult
      ? {
          newRentCents: input.showResult.newRentCents,
          effectiveRatePercent: input.showResult.effectiveRatePercent,
          appliedRatePercent: input.showResult.appliedRatePercent,
          breakdown: input.showResult.breakdown,
          multiYearSteps: input.showResult.multiYearSteps ?? [],
        }
      : undefined,
    parallelResult: input.showParallel
      ? {
          finalRentCents: input.showParallel.finalRentCents,
          totalChangePercent: input.showParallel.totalChangePercent,
          steps: input.showParallel.steps,
        }
      : undefined,
    disclaimers: [
      "Die Berechnungen dienen ausschließlich der Orientierung und ersetzen keine individuelle Rechtsberatung.",
      "Es wird keine Gewähr für rechtliche Richtigkeit, Vollständigkeit oder Aktualität übernommen.",
      "Nicht erfasst: Mietverträge nach dem WGG (außer § 13 Abs 4), Geschäftsraummieten und Voll-Ausnahmen vom MRG.",
    ],
  };
}
