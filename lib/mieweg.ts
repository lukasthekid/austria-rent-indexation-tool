/**
 * MietCheck-AT – MieWeG Rent Indexation Calculator
 * Implements Mieten-Wertsicherungsgesetz (MieWeG) § 1 Abs 2 and 3
 */

export type ApartmentType = 'free' | 'preisgeschützt'; // freier Mietzins vs. full MRG

export interface MieWeGInput {
  currentRentCents: number; // Rent in cents for precision
  /** Vertragsabschluss (date of contract conclusion/signing). Per MieWeG § 1 Abs 2 Z 2, not Vertragsbeginn. */
  contractConclusionDate: Date;
  apartmentType: ApartmentType;
  vpiChangePercent: number; // Previous year's VPI 2020 YoY change (e.g. 3.5)
  valorisationYear: number; // Year of April 1st (e.g. 2027 for April 1, 2027)
  lastValorisationMonth?: Date; // For Altverträge: month of last valorisation
}

export interface MieWeGResult {
  newRentCents: number;
  effectiveRatePercent: number;
  appliedRatePercent: number;
  breakdown: string[];
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
 * December contract: first indexation is April of year+2 (no full months in first year).
 * Januar-March: April same year; April-November: April next year.
 */
export function getFirstIndexationDate(contractStart: Date): Date {
  const year = contractStart.getFullYear();
  const month = contractStart.getMonth();
  if (month === 11) {
    // December: no full months in contract year → first indexation April year+2
    return new Date(year + 2, 3, 1);
  }
  if (month < 3) {
    // Jan–Mar: April of same year
    return new Date(year, 3, 1);
  }
  // Apr–Nov: April of next year
  return new Date(year + 1, 3, 1);
}

/** Returns full months after contract/reference in the calendar year before valorisation */
function getFullMonthsInPriorYear(
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

  // Before first indexation date (e.g. Dec contract → no change at April year+1)
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

  // 2. Effective rate: 3% cap
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

  // 3. Preisgeschützt caps
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

  // 4. Aliquotierung (first indexation only)
  let appliedRate = rate;

  if (isFirstValorisation) {
    const fullMonths = getFullMonthsInPriorYear(valorisationYear, referenceDate);
    if (fullMonths < 12) {
      appliedRate = rate * (fullMonths / 12);
      breakdown.push(
        `Aliquotierung: ${fullMonths}/12 Monate im Vorjahr → ${appliedRate.toFixed(4)}%`
      );
    }
  }

  // 5. Calculate new rent
  const rawNewRent = currentRentCents * (1 + appliedRate / 100);
  const newRentCents = roundToCent(rawNewRent);

  return {
    newRentCents,
    effectiveRatePercent,
    appliedRatePercent: appliedRate,
    breakdown,
  };
}
