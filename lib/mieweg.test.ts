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
  it('January contract → April same year', () => {
    const d = getFirstIndexationDate(new Date(2026, 0, 15));
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(3);
    expect(d.getDate()).toBe(1);
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
      contractConclusionDate: new Date(2025, 0, 1),
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
      contractConclusionDate: new Date(2025, 0, 1),
      apartmentType: 'free',
      vpiChangePercent: -0.5,
      valorisationYear: 2026,
    });
    expect(result.appliedRatePercent).toBe(-0.5);
    expect(result.newRentCents).toBeLessThan(80000);
  });
});
