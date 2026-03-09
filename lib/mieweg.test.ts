import { describe, it, expect } from 'vitest';
import {
  calculateMieWeGRent,
  roundToCent,
  getFirstIndexationDate,
} from './mieweg';

describe('roundToCent', () => {
  it('rounds 0.5 cent down', () => {
    expect(roundToCent(100.5)).toBe(100);
  });
  it('rounds above 0.5 cent up', () => {
    expect(roundToCent(100.51)).toBe(101);
  });
  it('rounds 0.5 exactly down', () => {
    expect(roundToCent(50.5)).toBe(50);
  });
});

describe('getFirstIndexationDate', () => {
  it('January contract → April next year (§ 1 Abs 2 Z 1: volles Kalenderjahr nach Vertragsabschluss)', () => {
    const d = getFirstIndexationDate(new Date(2026, 0, 15));
    expect(d.getFullYear()).toBe(2027);
    expect(d.getMonth()).toBe(3);
    expect(d.getDate()).toBe(1);
  });
  it('March contract → April next year', () => {
    const d = getFirstIndexationDate(new Date(2026, 2, 15));
    expect(d.getFullYear()).toBe(2027);
    expect(d.getMonth()).toBe(3);
  });
  it('May contract → April next year', () => {
    const d = getFirstIndexationDate(new Date(2027, 4, 1));
    expect(d.getFullYear()).toBe(2028);
    expect(d.getMonth()).toBe(3);
  });
  it('December contract → April year+2 (no full months in first year)', () => {
    const d = getFirstIndexationDate(new Date(2027, 11, 15));
    expect(d.getFullYear()).toBe(2029);
    expect(d.getMonth()).toBe(3);
  });
});

describe('calculateMieWeGRent', () => {
  it('applies 3% inflation cap: 3.824% → effective 3.412%', () => {
    const result = calculateMieWeGRent({
      currentRentCents: 10000, // 100 €
      contractConclusionDate: new Date(2024, 0, 1), // Jan 2024 → first indexation April 2025, so 2026 is not first
      apartmentType: 'free',
      vpiChangePercent: 3.824,
      valorisationYear: 2026,
    });
    expect(result.effectiveRatePercent).toBeCloseTo(3.412, 2);
    expect(result.appliedRatePercent).toBeCloseTo(3.412, 2);
    expect(result.newRentCents).toBe(roundToCent(10000 * 1.03412));
  });

  it('preisgeschützt 2026: caps at 1%', () => {
    const result = calculateMieWeGRent({
      currentRentCents: 80000, // 800 €
      contractConclusionDate: new Date(2024, 0, 1),
      apartmentType: 'preisgeschützt',
      vpiChangePercent: 3.5,
      valorisationYear: 2026,
    });
    expect(result.effectiveRatePercent).toBe(1);
    expect(result.appliedRatePercent).toBe(1);
    expect(result.newRentCents).toBe(80800);
  });

  it('preisgeschützt 2027: caps at 2%', () => {
    const result = calculateMieWeGRent({
      currentRentCents: 80000,
      contractConclusionDate: new Date(2024, 0, 1),
      apartmentType: 'preisgeschützt',
      vpiChangePercent: 3.5,
      valorisationYear: 2027,
    });
    expect(result.effectiveRatePercent).toBe(2);
    expect(result.newRentCents).toBe(81600);
  });

  it('aliquotierung: contract Jan 2026, April 2027 → 11/12 (Kothbauer example)', () => {
    const result = calculateMieWeGRent({
      currentRentCents: 80000,
      contractConclusionDate: new Date(2026, 0, 15), // January 2026
      apartmentType: 'free',
      vpiChangePercent: 2.4,
      valorisationYear: 2027, // First indexation per corrected logic
    });
    // 2.4% * 11/12 = 2.2%
    expect(result.effectiveRatePercent).toBeCloseTo(2.4, 2);
    expect(result.appliedRatePercent).toBeCloseTo(2.2, 2);
  });

  it('aliquotierung: contract May 2027, April 2028 indexation → 7/12 of rate', () => {
    const result = calculateMieWeGRent({
      currentRentCents: 100000, // 1000 €
      contractConclusionDate: new Date(2027, 4, 1), // May 2027
      apartmentType: 'free',
      vpiChangePercent: 2.613,
      valorisationYear: 2028,
    });
    // 2.613% * 7/12 = 1.52425%
    expect(result.appliedRatePercent).toBeCloseTo(1.52425, 2);
    expect(result.effectiveRatePercent).toBeCloseTo(2.613, 2);
  });

  it('December contract: no change at April year+1', () => {
    const result = calculateMieWeGRent({
      currentRentCents: 80000,
      contractConclusionDate: new Date(2027, 11, 15), // Dec 2027
      apartmentType: 'free',
      vpiChangePercent: 2.5,
      valorisationYear: 2028, // April 2028 - before first indexation (2029)
    });
    expect(result.newRentCents).toBe(80000);
    expect(result.appliedRatePercent).toBe(0);
    expect(result.breakdown.some((b) => b.includes('Erste Valorisierung erst'))).toBe(true);
  });

  it('December contract: full rate at April year+2', () => {
    const result = calculateMieWeGRent({
      currentRentCents: 80000,
      contractConclusionDate: new Date(2027, 11, 15),
      apartmentType: 'free',
      vpiChangePercent: 2.5,
      valorisationYear: 2029, // First actual indexation
    });
    expect(result.appliedRatePercent).toBe(2.5);
    expect(result.newRentCents).toBe(82000);
  });

  it('valorisation before 2026 returns no change', () => {
    const result = calculateMieWeGRent({
      currentRentCents: 80000,
      contractConclusionDate: new Date(2024, 0, 1),
      apartmentType: 'free',
      vpiChangePercent: 3,
      valorisationYear: 2025,
    });
    expect(result.newRentCents).toBe(80000);
    expect(result.appliedRatePercent).toBe(0);
  });

  it('handles negative inflation (rent decrease)', () => {
    const result = calculateMieWeGRent({
      currentRentCents: 80000,
      contractConclusionDate: new Date(2024, 0, 1), // Jan 2024 → first indexation April 2025
      apartmentType: 'free',
      vpiChangePercent: -0.5,
      valorisationYear: 2026,
    });
    expect(result.appliedRatePercent).toBe(-0.5);
    expect(result.newRentCents).toBeLessThan(80000);
  });

  it('multi-year: 2026→2029, preisgeschützt, 3 steps with caps', () => {
    const result = calculateMieWeGRent({
      currentRentCents: 80000, // 800 €
      contractConclusionDate: new Date(2023, 0, 1),
      apartmentType: 'preisgeschützt',
      vpiChangePercent: 3.5, // not used in multi-year
      valorisationYear: 2029,
      lastValorisationMonth: new Date(2026, 3, 1), // April 2026
      vpiChangeByYear: {
        2026: 3.5, // capped to 2% (preisgeschützt 2027), then 8/12 aliquotierung
        2027: 3.5, // capped to 3%+half = 3.25% (no preisgeschützt cap for 1.4.2028)
        2028: 3.824, // 3% + (0.824/2) = 3.412%
      },
    });
    expect(result.multiYearSteps).toHaveLength(3);
    // Step 1: 2% * 8/12 = 1.333% (Aliquotierung: April 2026 ref → 8 months in 2026)
    expect(result.multiYearSteps![0].inflationYear).toBe(2026);
    expect(result.multiYearSteps![0].ratePercent).toBeCloseTo(1.333, 2);
    expect(result.multiYearSteps![0].rentAfterCents).toBe(81067);
    // Step 2: 2027 inflation 3.5% → 3.25%
    expect(result.multiYearSteps![1].inflationYear).toBe(2027);
    expect(result.multiYearSteps![1].ratePercent).toBeCloseTo(3.25, 2);
    // Step 3: 2028 inflation 3.824% → 3.412%
    expect(result.multiYearSteps![2].inflationYear).toBe(2028);
    expect(result.multiYearSteps![2].ratePercent).toBeCloseTo(3.412, 2);
    expect(result.newRentCents).toBeGreaterThan(86000);
    expect(result.newRentCents).toBeLessThan(87000);
    expect(result.breakdown.some((b) => b.includes('Mehrjahr-Valorisierung'))).toBe(true);
  });

  it('multi-year: aliquotierung on first step (April 2026 ref → 8/12 for 2026)', () => {
    const result = calculateMieWeGRent({
      currentRentCents: 80000,
      contractConclusionDate: new Date(2023, 0, 1),
      apartmentType: 'free',
      vpiChangePercent: 2,
      valorisationYear: 2028,
      lastValorisationMonth: new Date(2026, 3, 1), // April 2026
      vpiChangeByYear: {
        2026: 2.4, // 8/12 → 1.6%
        2027: 2.0,
      },
    });
    expect(result.multiYearSteps).toHaveLength(2);
    // First step: 2.4% * 8/12 = 1.6% (May–Dec 2026 after April ref)
    expect(result.multiYearSteps![0].ratePercent).toBeCloseTo(1.6, 2);
    expect(result.multiYearSteps![0].rentAfterCents).toBe(81280); // 80000 * 1.016
    expect(result.multiYearSteps![1].ratePercent).toBe(2);
    expect(result.newRentCents).toBe(82906); // 81280 * 1.02 = 82905.6 → 82906
  });

  it('single-year unchanged when no lastValorisation (backward compat)', () => {
    const result = calculateMieWeGRent({
      currentRentCents: 80000,
      contractConclusionDate: new Date(2024, 0, 1),
      apartmentType: 'preisgeschützt',
      vpiChangePercent: 3.5,
      valorisationYear: 2026,
    });
    expect(result.multiYearSteps).toBeUndefined();
    expect(result.effectiveRatePercent).toBe(1);
    expect(result.newRentCents).toBe(80800);
  });

  it('gap=1 uses single-year path (not multi-year)', () => {
    const result = calculateMieWeGRent({
      currentRentCents: 80000,
      contractConclusionDate: new Date(2024, 0, 1),
      apartmentType: 'preisgeschützt',
      vpiChangePercent: 3.5,
      valorisationYear: 2027,
      lastValorisationMonth: new Date(2026, 3, 1), // April 2026
    });
    expect(result.multiYearSteps).toBeUndefined();
    // Single-year with aliquotierung: ref April 2026 → 8/12 of 2% = 1.333%
    expect(result.newRentCents).toBe(81067);
  });

  it('alreadyInMieWeG: skips aliquotierung on subsequent valorisation (single-year)', () => {
    const result = calculateMieWeGRent({
      currentRentCents: 80000,
      contractConclusionDate: new Date(2024, 0, 1),
      apartmentType: 'preisgeschützt',
      vpiChangePercent: 3.5,
      valorisationYear: 2027,
      lastValorisationMonth: new Date(2026, 3, 1), // April 2026
      alreadyInMieWeG: true,
    });
    expect(result.multiYearSteps).toBeUndefined();
    // No aliquotierung → full 2% (preisgeschützt 2027 cap)
    expect(result.appliedRatePercent).toBe(2);
    expect(result.newRentCents).toBe(81600);
  });

  it('alreadyInMieWeG: skips aliquotierung on first step (multi-year)', () => {
    const result = calculateMieWeGRent({
      currentRentCents: 80000,
      contractConclusionDate: new Date(2023, 0, 1),
      apartmentType: 'free',
      vpiChangePercent: 2,
      valorisationYear: 2028,
      lastValorisationMonth: new Date(2026, 3, 1), // April 2026
      alreadyInMieWeG: true,
      vpiChangeByYear: {
        2026: 2.4,
        2027: 2.0,
      },
    });
    expect(result.multiYearSteps).toHaveLength(2);
    // Without alreadyInMieWeG: step 1 would be 2.4% * 8/12 = 1.6%
    // With alreadyInMieWeG: step 1 is full 2.4%
    expect(result.multiYearSteps![0].ratePercent).toBe(2.4);
    expect(result.multiYearSteps![0].rentAfterCents).toBe(81920); // 80000 * 1.024
    expect(result.multiYearSteps![1].ratePercent).toBe(2);
    expect(result.newRentCents).toBe(83558); // 81920 * 1.02 = 83558.4 → 83558
  });
});
