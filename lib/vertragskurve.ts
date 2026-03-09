/**
 * Vertragskurve – Contract-based rent curve calculation
 * Calculates what the rent would be under the original contract clause,
 * ignoring MieWeG caps entirely. Used for the Parallelrechnung comparison.
 */

import { getVpiChangeForYear, getVpiAverageForYear, type VpiBaseName } from './vpi-data';
import { roundToCent } from './mieweg';

export type ClauseType = 'vpiAnnual' | 'vpiThreshold' | 'staffel';

export interface VpiAnnualParams {
  /** Month of annual adjustment (0=Jan, 11=Dec) */
  adjustmentMonth: number;
  /** VPI base referenced in contract (defaults to VPI 2020) */
  vpiBase?: VpiBaseName;
}

export interface VpiThresholdParams {
  /** Threshold percentage (e.g. 5 for 5%) */
  thresholdPercent: number;
  /** VPI Jahresdurchschnittswert at last adjustment */
  baseIndexValue: number;
  /** VPI base referenced in contract (defaults to VPI 2020) */
  vpiBase?: VpiBaseName;
}

export interface StaffelParams {
  increaseType: 'percent' | 'amount';
  /** Percentage (e.g. 3 for 3%) or amount in cents */
  increaseValue: number;
  /** Month of annual increase (0=Jan, 11=Dec) */
  increaseMonth: number;
}

export type ClauseParams = VpiAnnualParams | VpiThresholdParams | StaffelParams;

export interface VertragskurveStep {
  /** Valorisation year (April 1st of this year) */
  year: number;
  /** Whether the contract triggered an increase for this year */
  contractTriggered: boolean;
  /** Rent per contract (uncapped, compounded independently) */
  contractRentCents: number;
  /** Month the contract clause would have triggered (0-11), if applicable */
  triggerMonth?: number;
  /** The contract's own increase percentage for this step */
  increasePercent?: number;
}

const DEFAULT_VPI = 2.0;

/**
 * VPI-annual: rent adjusts yearly on a fixed date based on prior-year VPI change.
 * Under MieWeG § 1 Abs 4, these increases are shifted to the next April 1st.
 */
export function calculateVpiAnnualCurve(
  baseRentCents: number,
  referenceDate: Date,
  params: VpiAnnualParams,
  startYear: number,
  endYear: number,
  vpiOverrideByYear?: Record<number, number>,
): VertragskurveStep[] {
  const steps: VertragskurveStep[] = [];
  let rentCents = baseRentCents;
  const refYear = referenceDate.getFullYear();
  const refMonth = referenceDate.getMonth();

  for (let valorisationYear = startYear; valorisationYear <= endYear; valorisationYear++) {
    const contractAdjustmentYear =
      params.adjustmentMonth <= 2 ? valorisationYear : valorisationYear - 1;

    const hasPassedRef =
      contractAdjustmentYear > refYear ||
      (contractAdjustmentYear === refYear && params.adjustmentMonth > refMonth);

    if (!hasPassedRef) {
      steps.push({
        year: valorisationYear,
        contractTriggered: false,
        contractRentCents: rentCents,
      });
      continue;
    }

    const inflationYear = contractAdjustmentYear - 1;
    const vpiChange =
      vpiOverrideByYear?.[inflationYear] ??
      getVpiChangeForYear(inflationYear, params.vpiBase) ??
      DEFAULT_VPI;

    const rawNewRent = rentCents * (1 + vpiChange / 100);
    rentCents = roundToCent(rawNewRent);

    steps.push({
      year: valorisationYear,
      contractTriggered: true,
      contractRentCents: rentCents,
      triggerMonth: params.adjustmentMonth,
      increasePercent: vpiChange,
    });
  }

  return steps;
}

/**
 * VPI-threshold: rent adjusts only when cumulative VPI change exceeds threshold.
 * Uses VPI 2020 Jahresdurchschnittswerte for comparison.
 */
export function calculateVpiThresholdCurve(
  baseRentCents: number,
  _referenceDate: Date,
  params: VpiThresholdParams,
  startYear: number,
  endYear: number,
  _vpiOverrideByYear?: Record<number, number>,
): VertragskurveStep[] {
  const steps: VertragskurveStep[] = [];
  let rentCents = baseRentCents;
  let currentBaseIndex = params.baseIndexValue;

  for (let valorisationYear = startYear; valorisationYear <= endYear; valorisationYear++) {
    const inflationYear = valorisationYear - 1;
    const currentAvg = getVpiAverageForYear(inflationYear, params.vpiBase);

    if (currentAvg == null) {
      steps.push({
        year: valorisationYear,
        contractTriggered: false,
        contractRentCents: rentCents,
      });
      continue;
    }

    const cumulativeChange = ((currentAvg - currentBaseIndex) / currentBaseIndex) * 100;

    if (Math.abs(cumulativeChange) >= params.thresholdPercent) {
      const rawNewRent = rentCents * (1 + cumulativeChange / 100);
      rentCents = roundToCent(rawNewRent);
      currentBaseIndex = currentAvg;

      steps.push({
        year: valorisationYear,
        contractTriggered: true,
        contractRentCents: rentCents,
        increasePercent: cumulativeChange,
      });
    } else {
      steps.push({
        year: valorisationYear,
        contractTriggered: false,
        contractRentCents: rentCents,
      });
    }
  }

  return steps;
}

/**
 * Staffelmiete: fixed percentage or amount increase at a specified month each year.
 */
export function calculateStaffelCurve(
  baseRentCents: number,
  referenceDate: Date,
  params: StaffelParams,
  startYear: number,
  endYear: number,
): VertragskurveStep[] {
  const steps: VertragskurveStep[] = [];
  let rentCents = baseRentCents;
  const refYear = referenceDate.getFullYear();
  const refMonth = referenceDate.getMonth();

  for (let valorisationYear = startYear; valorisationYear <= endYear; valorisationYear++) {
    const increaseYear =
      params.increaseMonth <= 2 ? valorisationYear : valorisationYear - 1;

    const hasPassedRef =
      increaseYear > refYear ||
      (increaseYear === refYear && params.increaseMonth > refMonth);

    if (!hasPassedRef) {
      steps.push({
        year: valorisationYear,
        contractTriggered: false,
        contractRentCents: rentCents,
      });
      continue;
    }

    let increasePercent: number;
    if (params.increaseType === 'percent') {
      increasePercent = params.increaseValue;
      const rawNewRent = rentCents * (1 + params.increaseValue / 100);
      rentCents = roundToCent(rawNewRent);
    } else {
      increasePercent = rentCents > 0 ? (params.increaseValue / rentCents) * 100 : 0;
      rentCents = roundToCent(rentCents + params.increaseValue);
    }

    steps.push({
      year: valorisationYear,
      contractTriggered: true,
      contractRentCents: rentCents,
      triggerMonth: params.increaseMonth,
      increasePercent,
    });
  }

  return steps;
}

export function calculateVertragskurve(
  baseRentCents: number,
  referenceDate: Date,
  clauseType: ClauseType,
  clauseParams: ClauseParams,
  startYear: number,
  endYear: number,
  vpiOverrideByYear?: Record<number, number>,
): VertragskurveStep[] {
  switch (clauseType) {
    case 'vpiAnnual':
      return calculateVpiAnnualCurve(
        baseRentCents, referenceDate, clauseParams as VpiAnnualParams,
        startYear, endYear, vpiOverrideByYear,
      );
    case 'vpiThreshold':
      return calculateVpiThresholdCurve(
        baseRentCents, referenceDate, clauseParams as VpiThresholdParams,
        startYear, endYear, vpiOverrideByYear,
      );
    case 'staffel':
      return calculateStaffelCurve(
        baseRentCents, referenceDate, clauseParams as StaffelParams,
        startYear, endYear,
      );
  }
}
