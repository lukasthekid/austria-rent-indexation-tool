/**
 * MietCheck-AT – MieWeG Rent Indexation Calculator
 * Implements Mieten-Wertsicherungsgesetz (MieWeG) § 1 Abs 2 and 3
 */

import { getVpiChangeForYear } from './vpi-data';

export type ApartmentType = 'free' | 'preisgeschützt'; // freier Mietzins vs. full MRG

export interface MieWeGInput {
  currentRentCents: number; // Rent in cents for precision
  /** Vertragsabschluss (date of contract conclusion/signing). Per MieWeG § 1 Abs 2 Z 2, not Vertragsbeginn. */
  contractConclusionDate: Date;
  apartmentType: ApartmentType;
  /** Previous year's VPI 2020 YoY change (single-year mode). For multi-year, VPI is fetched from vpi-data. */
  vpiChangePercent: number;
  valorisationYear: number; // Year of April 1st (e.g. 2027 for April 1, 2027)
  /** For Altverträge: month of last valorisation (§ 4 Abs 2 MieWeG). Enables multi-year gap calculation. */
  lastValorisationMonth?: Date;
  /** Optional VPI override per year for multi-year mode. Key = inflation year (e.g. 2026). */
  vpiChangeByYear?: Record<number, number>;
  /**
   * True if the last valorisation was already computed under MieWeG (subsequent valorisation).
   * When true, aliquotierung (§ 1 Abs 2 Z 2) is skipped because it only applies once
   * at the initial "Einfädeln" into the MieWeG system.
   */
  alreadyInMieWeG?: boolean;
}

export interface MultiYearStep {
  inflationYear: number;
  ratePercent: number;
  rentAfterCents: number;
}

export interface MieWeGResult {
  newRentCents: number;
  effectiveRatePercent: number;
  appliedRatePercent: number;
  breakdown: string[];
  /** Present when multi-year chain was applied */
  multiYearSteps?: MultiYearStep[];
}

/** Austrian rounding: ≤0.5 cent round down, >0.5 cent round up */
export function roundToCent(amountCents: number): number {
  const whole = Math.floor(amountCents);
  const fraction = amountCents - whole;
  if (fraction <= 0.5) {
    return whole;
  }
  return whole + 1;
}

/**
 * Returns April 1st of first indexation date.
 * Per MieWeG § 1 Abs 2 Z 1: "am 1. April des vollen Kalenderjahrs nach Vertragsabschluss"
 * → Always April of (contractYear + 1) for Jan–Nov.
 * December: aliquotierung yields 0/12, so first effective indexation is April year+2.
 */
export function getFirstIndexationDate(contractStart: Date): Date {
  const year = contractStart.getFullYear();
  const month = contractStart.getMonth();
  if (month === 11) {
    return new Date(year + 2, 3, 1);
  }
  return new Date(year + 1, 3, 1);
}

/** Returns full months after contract/reference in the calendar year before valorisation */
export function getFullMonthsInPriorYear(
  valorisationYear: number,
  referenceDate: Date
): number {
  const priorYear = valorisationYear - 1;
  const refYear = referenceDate.getFullYear();
  const refMonth = referenceDate.getMonth();

  // Reference must be in or before priorYear
  if (refYear > priorYear) return 0;
  if (refYear < priorYear) return 12; // Full year

  // Same year: count full months after reference month (exclusive)
  // Month 0=Jan, 1=Feb, ... 11=Dec → months after = 11 - refMonth
  const monthsAfter = 12 - (refMonth + 1);
  return Math.max(0, monthsAfter);
}

/** Valorisation year for a given inflation year (1.4.(inflationYear+1) uses inflationYear) */
export const DEFAULT_VPI_FALLBACK = 2.0;

/**
 * Compute effective rate for a single valorisation step: 3% cap, preisgeschützt cap.
 * Does NOT apply aliquotierung.
 */
export function computeRateForYear(
  vpiChangePercent: number,
  valorisationYear: number,
  apartmentType: ApartmentType
): number {
  let rate = vpiChangePercent > 3 ? 3 + (vpiChangePercent - 3) / 2 : vpiChangePercent;
  if (apartmentType === 'preisgeschützt') {
    if (valorisationYear === 2026) rate = Math.min(rate, 1);
    else if (valorisationYear === 2027) rate = Math.min(rate, 2);
  }
  return rate;
}

/**
 * Calculate maximum legal rent after MieWeG indexation
 */
export function calculateMieWeGRent(input: MieWeGInput): MieWeGResult {
  const {
    currentRentCents,
    contractConclusionDate,
    apartmentType,
    vpiChangePercent,
    valorisationYear,
    lastValorisationMonth,
    vpiChangeByYear,
    alreadyInMieWeG,
  } = input;

  const breakdown: string[] = [];
  const referenceDate = lastValorisationMonth ?? contractConclusionDate;
  const firstIndexation = getFirstIndexationDate(referenceDate);
  const firstIndexationYear = firstIndexation.getFullYear();
  const isFirstValorisation = valorisationYear === firstIndexationYear;

  // 1. Check applicability: MieWeG applies from 2026
  if (valorisationYear < 2026) {
    breakdown.push(
      `Valorisierung vor MieWeG (ab 1.4.2026): Keine Änderung.`
    );
    return {
      newRentCents: currentRentCents,
      effectiveRatePercent: 0,
      appliedRatePercent: 0,
      breakdown,
    };
  }

  // 2. Multi-year gap: last valorisation set and target > 1 year after
  const lastValorisationYear = lastValorisationMonth?.getFullYear();
  const gap = lastValorisationYear != null ? valorisationYear - lastValorisationYear : 0;

  if (gap > 1 && lastValorisationMonth != null) {
    return calculateMultiYearRent({
      currentRentCents,
      apartmentType,
      valorisationYear,
      lastValorisationMonth,
      vpiChangeByYear,
      alreadyInMieWeG,
    });
  }

  // 3. Single-year: Before first indexation date (e.g. Dec contract → no change at April year+1)
  if (valorisationYear < firstIndexationYear) {
    breakdown.push(
      `Erste Valorisierung erst am 1.4.${firstIndexationYear}: Keine Änderung.`
    );
    return {
      newRentCents: currentRentCents,
      effectiveRatePercent: 0,
      appliedRatePercent: 0,
      breakdown,
    };
  }

  // 4. Single-year: Effective rate (3% cap)
  let rate =
    vpiChangePercent > 3
      ? 3 + (vpiChangePercent - 3) / 2
      : vpiChangePercent;

  if (vpiChangePercent > 3) {
    breakdown.push(
      `VPI-Änderung ${vpiChangePercent.toFixed(2)}% → begrenzt auf ${rate.toFixed(2)}% (3% + Hälfte des darüberliegenden Teils)`
    );
  } else {
    breakdown.push(`VPI-Änderung ${vpiChangePercent.toFixed(2)}% unverändert`);
  }

  // 5. Preisgeschützt caps
  if (apartmentType === 'preisgeschützt') {
    if (valorisationYear === 2026) {
      const capped = Math.min(rate, 1);
      if (rate > 1) {
        breakdown.push(
          `Preisgeschützt 2026: Anhebungsgrenze 1% → ${capped}%`
        );
      }
      rate = capped;
    } else if (valorisationYear === 2027) {
      const capped = Math.min(rate, 2);
      if (rate > 2) {
        breakdown.push(
          `Preisgeschützt 2027: Anhebungsgrenze 2% → ${capped}%`
        );
      }
      rate = capped;
    }
  }

  const effectiveRatePercent = rate;

  // 6. Aliquotierung (first indexation only, skipped for subsequent MieWeG valorisations)
  let appliedRate = rate;

  if (isFirstValorisation && !alreadyInMieWeG) {
    const fullMonths = getFullMonthsInPriorYear(valorisationYear, referenceDate);
    if (fullMonths < 12) {
      appliedRate = rate * (fullMonths / 12);
      breakdown.push(
        `Aliquotierung: ${fullMonths}/12 Monate im Vorjahr → ${appliedRate.toFixed(4)}%`
      );
    }
  }

  // 7. Calculate new rent
  const rawNewRent = currentRentCents * (1 + appliedRate / 100);
  const newRentCents = roundToCent(rawNewRent);

  return {
    newRentCents,
    effectiveRatePercent,
    appliedRatePercent: appliedRate,
    breakdown,
  };
}

/** Multi-year periodengerechte calculation per Kothbauer PDF I. h) */
function calculateMultiYearRent(params: {
  currentRentCents: number;
  apartmentType: ApartmentType;
  valorisationYear: number;
  lastValorisationMonth: Date;
  vpiChangeByYear?: Record<number, number>;
  alreadyInMieWeG?: boolean;
}): MieWeGResult {
  const {
    currentRentCents,
    apartmentType,
    valorisationYear,
    lastValorisationMonth,
    vpiChangeByYear,
    alreadyInMieWeG,
  } = params;

  const breakdown: string[] = [];
  const lastValorisationYear = lastValorisationMonth.getFullYear();
  const steps: MultiYearStep[] = [];
  let rentCents = currentRentCents;

  breakdown.push(
    `Mehrjahr-Valorisierung: ${lastValorisationYear + 1}–${valorisationYear} (Lücke seit 1.4.${lastValorisationYear})`
  );

  let stepIndex = 0;
  for (let inflationYear = lastValorisationYear; inflationYear < valorisationYear; inflationYear++) {
    stepIndex++;
    const vpiPercent =
      vpiChangeByYear?.[inflationYear] ??
      getVpiChangeForYear(inflationYear) ??
      DEFAULT_VPI_FALLBACK;

    if (vpiChangeByYear?.[inflationYear] == null && getVpiChangeForYear(inflationYear) == null) {
      breakdown.push(
        `VPI ${inflationYear}: Schätzwert ${DEFAULT_VPI_FALLBACK}% (keine offiziellen Daten)`
      );
    }

    const stepValorisationYear = inflationYear + 1;
    let rate = computeRateForYear(vpiPercent, stepValorisationYear, apartmentType);

    // Aliquotierung only on first step (Einfädeln), skipped for subsequent MieWeG valorisations
    const fullMonths = getFullMonthsInPriorYear(stepValorisationYear, lastValorisationMonth);
    if (stepIndex === 1 && fullMonths < 12 && !alreadyInMieWeG) {
      rate = rate * (fullMonths / 12);
    }

    const rawNewRent = rentCents * (1 + rate / 100);
    rentCents = roundToCent(rawNewRent);

    steps.push({
      inflationYear,
      ratePercent: rate,
      rentAfterCents: rentCents,
    });

    const fmt = (c: number) => (c / 100).toFixed(2).replace('.', ',');
    const aliquotNote =
      stepIndex === 1 && fullMonths < 12 && !alreadyInMieWeG ? ` (Aliquotierung ${fullMonths}/12)` : '';
    breakdown.push(
      `${inflationYear}: ${rate.toFixed(2)}%${aliquotNote} → ${fmt(rentCents)} €`
    );
  }

  const totalChangePercent =
    currentRentCents > 0
      ? ((rentCents - currentRentCents) / currentRentCents) * 100
      : 0;

  return {
    newRentCents: rentCents,
    effectiveRatePercent: totalChangePercent,
    appliedRatePercent: totalChangePercent,
    breakdown,
    multiYearSteps: steps,
  };
}

export interface BegrenzungskurveStep {
  year: number;
  ratePercent: number;
  rentCents: number;
}

/**
 * Calculate the MieWeG Begrenzungskurve (limit curve) as year-by-year steps.
 * Used by parallelrechnung.ts for the comparison with the Vertragskurve.
 */
export function calculateBegrenzungskurve(params: {
  baseRentCents: number;
  referenceDate: Date;
  apartmentType: ApartmentType;
  startYear: number;
  endYear: number;
  vpiOverrideByYear?: Record<number, number>;
}): BegrenzungskurveStep[] {
  const { baseRentCents, referenceDate, apartmentType, startYear, endYear, vpiOverrideByYear } = params;
  const steps: BegrenzungskurveStep[] = [];
  let rentCents = baseRentCents;
  let isFirst = true;

  for (let valorisationYear = startYear; valorisationYear <= endYear; valorisationYear++) {
    const inflationYear = valorisationYear - 1;
    const vpiPercent =
      vpiOverrideByYear?.[inflationYear] ??
      getVpiChangeForYear(inflationYear) ??
      DEFAULT_VPI_FALLBACK;

    let rate = computeRateForYear(vpiPercent, valorisationYear, apartmentType);

    if (isFirst) {
      const fullMonths = getFullMonthsInPriorYear(valorisationYear, referenceDate);
      if (fullMonths < 12) {
        rate = rate * (fullMonths / 12);
      }
      isFirst = false;
    }

    const rawNewRent = rentCents * (1 + rate / 100);
    rentCents = roundToCent(rawNewRent);

    steps.push({ year: valorisationYear, ratePercent: rate, rentCents });
  }

  return steps;
}
