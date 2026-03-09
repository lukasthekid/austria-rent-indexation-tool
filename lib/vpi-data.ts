/**
 * VPI 2020 (Verbraucherpreisindex) reference data
 * Source: Statistik Austria – https://data.statistik.gv.at/web/meta.jsp?dataset=OGD_vpi20_VPI_2020_1
 *
 * Per MieWeG/PDF: "Die Veränderung ist ungerundet zu errechnen" – the change must be
 * computed unrounded from Jahresdurchschnittswerte, not the published rounded figure.
 * Formula: (avg[year] - avg[year-1]) / avg[year-1] * 100
 */

/** VPI 2020 Jahresdurchschnittswerte (2015=100 → rebased to 2020=100). Official Statistik Austria data. */
export const VPI_2020_YEARLY_AVERAGES: Record<number, number> = {
  2020: 100.0, // Base year
  2021: 102.8, // Statistik Austria
  2022: 111.6, // Statistik Austria
  2023: 120.3, // Statistik Austria
  2024: 123.8, // Statistik Austria
  2025: 128.2, // Statistik Austria
};

/**
 * Fallback for years without official Jahresdurchschnittswerte (estimates).
 * Use getVpiChangeForYear() which prefers unrounded computed values.
 */
const VPI_ESTIMATES: Record<number, number> = {
  2026: 2.4, // WIFO prognosis
};

/**
 * Compute unrounded YoY change from Jahresdurchschnittswerte.
 * Returns null if either year's average is missing.
 */
function computeUnroundedChange(year: number): number | null {
  const avgCurrent = VPI_2020_YEARLY_AVERAGES[year];
  const avgPrior = VPI_2020_YEARLY_AVERAGES[year - 1];
  if (avgCurrent == null || avgPrior == null) return null;
  return ((avgCurrent - avgPrior) / avgPrior) * 100;
}

/**
 * Get VPI 2020 average YoY change for a given year (in percent).
 * Uses unrounded values when Jahresdurchschnittswerte are available (per MieWeG requirement).
 * @param year - Calendar year for which the inflation applies (the year before valorisation)
 * @returns Percent change (unrounded when computed from raw data) or null if unknown
 */
export function getVpiChangeForYear(year: number): number | null {
  const unrounded = computeUnroundedChange(year);
  if (unrounded != null) return unrounded;
  return VPI_ESTIMATES[year] ?? null;
}

/** Published rounded change (for display only). Use getVpiChangeForYear() for calculations. */
export const VPI_YEARLY_CHANGE: Record<number, number> = {
  ...Object.fromEntries(
    Object.keys(VPI_2020_YEARLY_AVERAGES)
      .filter((y) => Number(y) > 2020)
      .map((y) => {
        const year = Number(y);
        const v = computeUnroundedChange(year);
        return [year, v != null ? Math.round(v * 10) / 10 : 0];
      })
  ),
  ...VPI_ESTIMATES,
};
