import { describe, it, expect } from 'vitest';
import { calculateParallelrechnung } from './parallelrechnung';
import { calculateVertragskurve } from './vertragskurve';
import { calculateBegrenzungskurve } from './mieweg';

describe('calculateVertragskurve', () => {
  it('vpiAnnual: carries pending trigger sequence across MieWeG start year', () => {
    const steps = calculateVertragskurve(
      80000, // 800 €
      new Date(2024, 5, 1), // June 2024 reference
      'vpiAnnual',
      { adjustmentMonth: 0 }, // January
      2026, 2028,
      { 2024: 2.9, 2025: 3.5, 2026: 2.4, 2027: 2.0 },
    );
    expect(steps).toHaveLength(3);
    expect(steps[0].contractTriggered).toBe(true);
    expect(steps[0].year).toBe(2026);
    // 2025 trigger (inflation 2024) is pending and carried to 2026.
    expect(steps[0].contractRentCents).toBe(82320); // 80000 * 1.029
    // Next step consumes inflation year 2025.
    expect(steps[1].contractRentCents).toBe(85201); // 82320 * 1.035
  });

  it('vpiThreshold: triggers only when cumulative change exceeds threshold', () => {
    // Base index = 111.6 (2022 avg), threshold 5%
    // 2023 avg = 120.3 → cumulative = (120.3-111.6)/111.6 = 7.7957% > 5% → triggers
    const steps = calculateVertragskurve(
      80000,
      new Date(2022, 0, 1),
      'vpiThreshold',
      { thresholdPercent: 5, baseIndexValue: 111.6 },
      2024, 2026,
    );
    expect(steps[0].year).toBe(2024);
    // inflationYear 2023, avg 120.3, cumulative 7.7957% > 5% → triggers
    expect(steps[0].contractTriggered).toBe(true);
    expect(steps[0].contractRentCents).toBeGreaterThan(86000);

    // After trigger, base resets to 120.3
    // inflationYear 2024, avg 123.8, cumulative from 120.3 = 2.91% < 5% → no trigger
    expect(steps[1].contractTriggered).toBe(false);
  });

  it('staffel percent: fixed 3% yearly increase', () => {
    const steps = calculateVertragskurve(
      80000,
      new Date(2024, 5, 1), // June 2024
      'staffel',
      { increaseType: 'percent' as const, increaseValue: 3, increaseMonth: 0 },
      2026, 2028,
    );
    expect(steps).toHaveLength(3);
    // Jan 2026 (after June 2024 ref): 80000 * 1.03 = 82400
    expect(steps[0].contractTriggered).toBe(true);
    expect(steps[0].contractRentCents).toBe(82400);
    // Jan 2027: 82400 * 1.03 = 84872
    expect(steps[1].contractRentCents).toBe(84872);
  });

  it('staffel amount: fixed €50 yearly increase', () => {
    const steps = calculateVertragskurve(
      80000,
      new Date(2024, 5, 1),
      'staffel',
      { increaseType: 'amount' as const, increaseValue: 5000, increaseMonth: 0 },
      2026, 2028,
    );
    expect(steps[0].contractRentCents).toBe(85000); // 800 + 50 = 850
    expect(steps[1].contractRentCents).toBe(90000); // 850 + 50 = 900
  });
});

describe('calculateParallelrechnung', () => {
  it('vpiAnnual free: sequence-aligned control can bind on first pending step', () => {
    const result = calculateParallelrechnung({
      baseRentCents: 80000,
      contractDate: new Date(2024, 5, 1),
      apartmentType: 'free',
      clauseType: 'vpiAnnual',
      clauseParams: { adjustmentMonth: 0 },
      targetYear: 2027,
      vpiOverrideByYear: { 2024: 3.5, 2025: 3.5, 2026: 2.4 },
    });

    expect(result.steps).toHaveLength(2);

    // With June 2024 reference, the MieWeG control includes:
    // first pending trigger step (inflation 2024, aliquotiert 6/12).
    const s2026 = result.steps[0];
    expect(s2026.contractTriggered).toBe(true);
    expect(s2026.vertragRentCents).toBe(82800);
    expect(s2026.miewegRentCents).toBe(81300);
    expect(s2026.binding).toBe('mieweg');
    expect(s2026.actualRentCents).toBe(s2026.miewegRentCents);
  });

  it('vpiAnnual preisgeschützt 2026: caps at 1%', () => {
    const result = calculateParallelrechnung({
      baseRentCents: 80000,
      contractDate: new Date(2024, 5, 1),
      apartmentType: 'preisgeschützt',
      clauseType: 'vpiAnnual',
      clauseParams: { adjustmentMonth: 0 },
      targetYear: 2026,
      vpiOverrideByYear: { 2024: 3.5, 2025: 3.5 },
    });

    expect(result.steps).toHaveLength(1);
    const s = result.steps[0];
    expect(s.binding).toBe('mieweg');
    // Contract: 80000 * 1.035 = 82800
    expect(s.vertragRentCents).toBe(82800);
    // Sequence-aligned control compares against first pending trigger step.
    expect(s.miewegRentCents).toBe(81300);
    expect(s.actualRentCents).toBe(81300);
  });

  it('vpiThreshold: no increase when contract does not trigger', () => {
    // Threshold 10%, VPI change ~3.5% per year → won't trigger for 2 years
    const result = calculateParallelrechnung({
      baseRentCents: 80000,
      contractDate: new Date(2024, 0, 1),
      apartmentType: 'free',
      clauseType: 'vpiThreshold',
      clauseParams: { thresholdPercent: 10, baseIndexValue: 123.8 },
      targetYear: 2027,
      vpiOverrideByYear: { 2024: 3.5, 2025: 3.5, 2026: 2.4 },
    });

    // 2025 avg ≈ 128.2, cum from 123.8 = 3.55% < 10% → no trigger
    // 2026 avg ≈ 131.3, cum from 123.8 ≈ 6.05% < 10% → no trigger
    for (const step of result.steps) {
      if (!step.contractTriggered) {
        expect(step.actualRentCents).toBe(80000);
      }
    }
    expect(result.finalRentCents).toBe(80000);
  });

  it('staffel 3%: at or below MieWeG cap → contract binds', () => {
    const result = calculateParallelrechnung({
      baseRentCents: 80000,
      contractDate: new Date(2024, 5, 1),
      apartmentType: 'free',
      clauseType: 'staffel',
      clauseParams: { increaseType: 'percent', increaseValue: 3, increaseMonth: 0 },
      targetYear: 2027,
      vpiOverrideByYear: { 2024: 3.5, 2025: 3.5, 2026: 2.4 },
    });

    expect(result.steps.length).toBeGreaterThanOrEqual(1);
    const s2026 = result.steps[0];
    expect(s2026.contractTriggered).toBe(true);
    // Sequence-aligned control first applies 2024 inflation with aliquotierung 6/12:
    // 3.5% -> 3.25%, then 1.625% on 80000 => 81300, so MieWeG binds.
    expect(s2026.binding).toBe('mieweg');
  });

  it('staffel 4%: contract can still bind when MieWeG control is higher', () => {
    const result = calculateParallelrechnung({
      baseRentCents: 80000,
      contractDate: new Date(2024, 5, 1),
      apartmentType: 'free',
      clauseType: 'staffel',
      clauseParams: { increaseType: 'percent', increaseValue: 4, increaseMonth: 0 },
      targetYear: 2026,
      vpiOverrideByYear: { 2024: 3.5, 2025: 3.5 },
    });

    expect(result.steps).toHaveLength(1);
    const s = result.steps[0];
    expect(s.contractTriggered).toBe(true);
    // Staffel 4%: 80000 * 1.04 = 83200
    expect(s.vertragRentCents).toBe(83200);
    // Sequence-aligned control compares against first pending trigger step.
    expect(s.miewegRentCents).toBe(81300);
    expect(s.binding).toBe('mieweg');
    expect(s.actualRentCents).toBe(s.miewegRentCents);
  });

  it('returns empty steps when startYear > targetYear', () => {
    const result = calculateParallelrechnung({
      baseRentCents: 80000,
      contractDate: new Date(2030, 0, 1),
      apartmentType: 'free',
      clauseType: 'vpiAnnual',
      clauseParams: { adjustmentMonth: 0 },
      targetYear: 2027,
    });

    expect(result.steps).toHaveLength(0);
    expect(result.finalRentCents).toBe(80000);
  });

  it('maps first triggered comparison to first pending MieWeG control step', () => {
    const result = calculateParallelrechnung({
      baseRentCents: 100000,
      contractDate: new Date(2023, 3, 1), // April 2023 reference
      apartmentType: 'free',
      clauseType: 'staffel',
      clauseParams: { increaseType: 'percent', increaseValue: 20, increaseMonth: 0 },
      targetYear: 2026,
      vpiOverrideByYear: { 2023: 4, 2024: 4, 2025: 4 },
    });

    expect(result.steps).toHaveLength(1);
    const step = result.steps[0];
    // First triggered comparison uses first pending control step:
    // 2024: 3.5% * 8/12 = 2.333... -> 102333
    expect(step.miewegRentCents).toBe(102333);
    expect(step.binding).toBe('mieweg');
    expect(step.actualRentCents).toBe(102333);
  });

  it('regression: Jan clause with missed 2025 uses inflation 2024 at April 2026', () => {
    const result = calculateParallelrechnung({
      baseRentCents: 140000,
      contractDate: new Date(2024, 3, 1), // April 2024
      apartmentType: 'free',
      clauseType: 'vpiAnnual',
      clauseParams: { adjustmentMonth: 0 }, // January
      targetYear: 2026,
      vpiOverrideByYear: { 2024: 2.91, 2025: 3.55 },
    });

    expect(result.steps).toHaveLength(1);
    const s2026 = result.steps[0];
    expect(s2026.year).toBe(2026);
    expect(s2026.contractTriggered).toBe(true);
    // Contract side must use pending 2025 trigger (inflation year 2024), not 2025.
    expect(s2026.vertragRentCents).toBe(144074); // 140000 * 1.0291
    // Control side also compares first pending control step (inflation 2024 with 8/12 aliquot).
    expect(s2026.miewegRentCents).toBe(142716); // 140000 * (1 + (2.91*8/12)/100)
  });

  it('multi-year: steps accumulate correctly', () => {
    const result = calculateParallelrechnung({
      baseRentCents: 80000,
      contractDate: new Date(2024, 0, 1),
      apartmentType: 'free',
      clauseType: 'vpiAnnual',
      clauseParams: { adjustmentMonth: 0 },
      targetYear: 2028,
      vpiOverrideByYear: { 2023: 7.8, 2024: 2.9, 2025: 3.5, 2026: 2.4, 2027: 2.0 },
    });

    expect(result.steps.length).toBe(3);
    // Each step should have higher rent than the previous
    for (let i = 1; i < result.steps.length; i++) {
      const prev = result.steps[i - 1];
      const curr = result.steps[i];
      if (curr.contractTriggered) {
        expect(curr.actualRentCents).toBeGreaterThanOrEqual(prev.actualRentCents);
      }
    }
    expect(result.totalChangePercent).toBeGreaterThan(0);
  });
});

describe('calculateBegrenzungskurve', () => {
  it('produces year-by-year steps with correct caps', () => {
    const steps = calculateBegrenzungskurve({
      baseRentCents: 80000,
      referenceDate: new Date(2024, 5, 1),
      apartmentType: 'preisgeschützt',
      startYear: 2026,
      endYear: 2028,
      vpiOverrideByYear: { 2025: 3.5, 2026: 2.4, 2027: 3.0 },
    });

    expect(steps).toHaveLength(3);
    // 2026 preisgeschützt: max 1%, ref June 2024 → priorYear 2025 > refYear → no aliquotierung
    expect(steps[0].year).toBe(2026);
    expect(steps[0].rentCents).toBe(80800); // 80000 * 1.01
    // 2027 preisgeschützt: max 2%
    expect(steps[1].year).toBe(2027);
    expect(steps[1].rentCents).toBe(82416); // 80800 * 1.02
  });
});
