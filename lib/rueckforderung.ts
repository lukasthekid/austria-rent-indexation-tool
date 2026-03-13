import type { ApartmentType } from "./mieweg";
import { calculateBegrenzungskurve } from "./mieweg";
import type { ParallelrechnungResult } from "./parallelrechnung";

export interface BacklogPerYear {
  year: number;
  allowedRentCents: number;
  assumedPaidCents: number;
  backlogCents: number;
}

export interface BacklogResult {
  totalBacklogCents: number;
  perYear: BacklogPerYear[];
}

interface MiewegBacklogInput {
  currentRentCents: number;
  contractConclusionDate: Date;
  lastValorisationMonth?: Date;
  apartmentType: ApartmentType;
  targetYear: number;
  vpiOverrideByYear?: Record<number, number>;
}

export function calculateBacklogForFreeRentMieWeG(
  input: MiewegBacklogInput
): BacklogResult {
  const {
    currentRentCents,
    contractConclusionDate,
    lastValorisationMonth,
    apartmentType,
    targetYear,
    vpiOverrideByYear,
  } = input;

  if (apartmentType !== "free") {
    return { totalBacklogCents: 0, perYear: [] };
  }

  if (targetYear < 2026) {
    return { totalBacklogCents: 0, perYear: [] };
  }

  const referenceDate = lastValorisationMonth ?? contractConclusionDate;
  const refYear = referenceDate.getFullYear();

  const earliestYear = Math.max(2026, refYear + 1, targetYear - 2);
  if (earliestYear > targetYear) {
    return { totalBacklogCents: 0, perYear: [] };
  }

  const begrenzung = calculateBegrenzungskurve({
    baseRentCents: currentRentCents,
    referenceDate,
    apartmentType,
    startYear: earliestYear,
    endYear: targetYear,
    vpiOverrideByYear,
  });

  const perYear: BacklogPerYear[] = [];
  let totalBacklogCents = 0;

  for (const step of begrenzung) {
    const allowedRentCents = step.rentCents;
    const assumedPaidCents = currentRentCents;
    const backlogCents = Math.max(0, allowedRentCents - assumedPaidCents);
    if (backlogCents <= 0) continue;

    perYear.push({
      year: step.year,
      allowedRentCents,
      assumedPaidCents,
      backlogCents,
    });
    totalBacklogCents += backlogCents;
  }

  return { totalBacklogCents, perYear };
}

interface ParallelBacklogInput {
  currentRentCents: number;
  parallelResult: ParallelrechnungResult;
}

export function calculateBacklogForFreeRentParallel(
  input: ParallelBacklogInput
): BacklogResult {
  const { currentRentCents, parallelResult } = input;

  if (!parallelResult.steps.length) {
    return { totalBacklogCents: 0, perYear: [] };
  }

  const steps = parallelResult.steps;
  const latestYear = steps[steps.length - 1]?.year;
  if (!latestYear) {
    return { totalBacklogCents: 0, perYear: [] };
  }

  const minYear = latestYear - 2;

  const filtered = steps.filter((s) => s.year >= minYear);

  const perYear: BacklogPerYear[] = [];
  let totalBacklogCents = 0;

  for (const s of filtered) {
    const allowedRentCents = s.actualRentCents;
    const assumedPaidCents = currentRentCents;
    const backlogCents = Math.max(0, allowedRentCents - assumedPaidCents);
    if (backlogCents <= 0) continue;

    perYear.push({
      year: s.year,
      allowedRentCents,
      assumedPaidCents,
      backlogCents,
    });
    totalBacklogCents += backlogCents;
  }

  return { totalBacklogCents, perYear };
}

