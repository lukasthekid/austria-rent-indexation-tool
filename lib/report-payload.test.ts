import { describe, expect, it } from "vitest";
import { buildCalculationReportPayload } from "./report-payload";

describe("buildCalculationReportPayload calculationTrace", () => {
  it("captures cap-then-aliquot path for single-step MieWeG trace", () => {
    const payload = buildCalculationReportPayload({
      contractMode: "altvertrag",
      apartmentType: "free",
      targetYear: 2026,
      inflationYear: 2025,
      currentRent: "1350",
      contractDate: "2025-01-01",
      lastValorisationDate: "",
      alreadyInMieWeG: false,
      altHadValorisation: true,
      altLastValorisationDate: "2025-01-01",
      altvertragClause: "vpiAnnual",
      vpiPercent: 3.5541,
      usedCustomVpi: true,
      adjustmentMonth: 0,
      vpiBase: "vpi2020",
      thresholdPercent: "",
      baseIndexValue: "",
      staffelType: "percent",
      staffelValue: "",
      staffelMonth: 0,
      proposedRent: "",
      showResult: {
        newRentCents: 139055,
        effectiveRatePercent: 3.27705,
        appliedRatePercent: 3.0039625,
        breakdown: [],
        multiYearSteps: [],
      },
      showParallel: null,
      finalRent: 139055,
      backlog: null,
    });

    expect(payload).not.toBeNull();
    if (!payload) return;
    expect(payload.calculationTrace.miewegSteps).toHaveLength(1);
    const step = payload.calculationTrace.miewegSteps[0];
    expect(step.cappedRatePercent).toBeCloseTo(3.27705, 5);
    expect(step.aliquotMonths).toBe(11);
    expect(step.appliedRatePercent).toBeCloseTo(3.0039625, 5);
    expect(step.resultRentCents).toBe(139055);
  });

  it("captures parallel step lines without reverse rate reconstruction", () => {
    const payload = buildCalculationReportPayload({
      contractMode: "altvertrag",
      apartmentType: "free",
      targetYear: 2026,
      inflationYear: 2025,
      currentRent: "1400",
      contractDate: "2024-04-01",
      lastValorisationDate: "",
      alreadyInMieWeG: false,
      altHadValorisation: true,
      altLastValorisationDate: "2025-01-01",
      altvertragClause: "vpiAnnual",
      vpiPercent: 3.55,
      usedCustomVpi: true,
      adjustmentMonth: 0,
      vpiBase: "vpi2020",
      thresholdPercent: "",
      baseIndexValue: "",
      staffelType: "percent",
      staffelValue: "",
      staffelMonth: 0,
      proposedRent: "",
      showResult: null,
      showParallel: {
        finalRentCents: 142716,
        totalChangePercent: 1.94,
        steps: [
          {
            year: 2026,
            vertragRentCents: 144074,
            miewegRentCents: 142716,
            actualRentCents: 142716,
            binding: "mieweg",
            contractTriggered: true,
          },
        ],
      },
      finalRent: 142716,
      backlog: null,
    });

    expect(payload).not.toBeNull();
    if (!payload) return;
    expect(payload.calculationTrace.parallelSteps).toHaveLength(1);
    const step = payload.calculationTrace.parallelSteps[0];
    expect(step.contractTriggered).toBe(true);
    expect(step.lines[0]).toContain("Vertragskurve");
    expect(step.lines[1]).toContain("Begrenzungskurve");
    expect(step.lines[2]).toContain("min(Vertrag, MieWeG)");
  });
});
