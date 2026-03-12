/**
 * Parallelrechnung – Comparison of Vertragskurve and Begrenzungskurve
 *
 * Per Kothbauer PDF I. h) and MieWeG § 1 Abs 4:
 * - Vertragskurve: contract-based rent, calculated as if MieWeG didn't exist
 * - Begrenzungskurve: MieWeG maximum rent, calculated independently
 * - Actual payable rent at each April 1st = min(Vertragskurve, Begrenzungskurve),
 *   but only when the contract actually triggers an increase.
 */

import type { ApartmentType } from './mieweg';
import { calculateBegrenzungskurve } from './mieweg';
import {
  calculateVertragskurve,
  type ClauseType,
  type ClauseParams,
} from './vertragskurve';

export interface ParallelrechnungInput {
  baseRentCents: number;
  contractDate: Date;
  apartmentType: ApartmentType;
  lastValorisationMonth?: Date;
  clauseType: ClauseType;
  clauseParams: ClauseParams;
  /** Calculate up to and including 1.4.targetYear */
  targetYear: number;
  vpiOverrideByYear?: Record<number, number>;
}

export interface ParallelrechnungStep {
  year: number;
  vertragRentCents: number;
  miewegRentCents: number;
  actualRentCents: number;
  /** 'none' when contract did not trigger (rent unchanged) */
  binding: 'vertrag' | 'mieweg' | 'equal' | 'none';
  contractTriggered: boolean;
}

export interface ParallelrechnungResult {
  steps: ParallelrechnungStep[];
  finalRentCents: number;
  totalChangePercent: number;
}

export function calculateParallelrechnung(
  input: ParallelrechnungInput,
): ParallelrechnungResult {
  const {
    baseRentCents,
    contractDate,
    apartmentType,
    lastValorisationMonth,
    clauseType,
    clauseParams,
    targetYear,
    vpiOverrideByYear,
  } = input;

  const referenceDate = lastValorisationMonth ?? contractDate;
  const refYear = referenceDate.getFullYear();
  const startYear = Math.max(refYear + 1, 2026);
  const controlStartYear = refYear + 1;

  if (startYear > targetYear) {
    return {
      steps: [],
      finalRentCents: baseRentCents,
      totalChangePercent: 0,
    };
  }

  const vertragSteps = calculateVertragskurve(
    baseRentCents,
    referenceDate,
    clauseType,
    clauseParams,
    startYear,
    targetYear,
    vpiOverrideByYear,
  );

  const begrenzungSteps = calculateBegrenzungskurve({
    baseRentCents,
    referenceDate,
    apartmentType,
    startYear: controlStartYear,
    endYear: targetYear,
    vpiOverrideByYear,
  });
  const begrenzungByYear = new Map(begrenzungSteps.map((step) => [step.year, step]));

  const steps: ParallelrechnungStep[] = [];
  let actualRentCents = baseRentCents;

  for (let i = 0; i < vertragSteps.length; i++) {
    const vStep = vertragSteps[i];
    const bStep = begrenzungByYear.get(vStep.year);

    if (!vStep || !bStep) break;

    const vertragRent = vStep.contractRentCents;
    const miewegRent = bStep.rentCents;

    if (!vStep.contractTriggered) {
      steps.push({
        year: vStep.year,
        vertragRentCents: vertragRent,
        miewegRentCents: miewegRent,
        actualRentCents,
        binding: 'none',
        contractTriggered: false,
      });
      continue;
    }

    const newActual = Math.min(vertragRent, miewegRent);
    actualRentCents = Math.max(actualRentCents, newActual);

    let binding: 'vertrag' | 'mieweg' | 'equal';
    if (vertragRent < miewegRent) binding = 'vertrag';
    else if (vertragRent > miewegRent) binding = 'mieweg';
    else binding = 'equal';

    steps.push({
      year: vStep.year,
      vertragRentCents: vertragRent,
      miewegRentCents: miewegRent,
      actualRentCents,
      binding,
      contractTriggered: true,
    });
  }

  const finalRentCents = steps.length > 0 ? steps[steps.length - 1].actualRentCents : baseRentCents;
  const totalChangePercent =
    baseRentCents > 0
      ? ((finalRentCents - baseRentCents) / baseRentCents) * 100
      : 0;

  return { steps, finalRentCents, totalChangePercent };
}
