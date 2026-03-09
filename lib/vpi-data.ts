/**
 * VPI (Verbraucherpreisindex) reference data
 * Source: Statistik Austria – https://data.statistik.gv.at/web/meta.jsp?dataset=OGD_vpi20_VPI_2020_1
 *
 * Actual data is auto-generated from vpi_data.ods into vpi-data-generated.ts.
 * To update: replace vpi_data.ods and run `npm run update-vpi`.
 *
 * Per MieWeG/PDF: "Die Veränderung ist ungerundet zu errechnen" – the change must be
 * computed unrounded from Jahresdurchschnittswerte, not the published rounded figure.
 */

import {
  VPI_ALL_BASES,
  VPI_PUBLISHED_YOY,
  VPI_BASE_NAMES,
  type VpiBaseName,
} from './vpi-data-generated';

export { VPI_ALL_BASES, VPI_BASE_NAMES, VPI_PUBLISHED_YOY, type VpiBaseName };

/** Backward-compatible alias: VPI 2020 averages */
export const VPI_2020_YEARLY_AVERAGES: Record<number, number> =
  VPI_ALL_BASES['VPI 2020'];

/**
 * Fallback estimates for years without official Jahresdurchschnittswerte.
 * Used when no data exists in the generated file.
 */
const VPI_ESTIMATES: Record<number, number> = {
  2026: 2.4,
  2027: 2.0,
  2028: 2.0,
};

/**
 * Compute unrounded YoY change from Jahresdurchschnittswerte for any VPI base.
 * Since % changes are (nearly) identical across bases, defaults to VPI 2020.
 */
function computeUnroundedChange(
  year: number,
  baseName: VpiBaseName = 'VPI 2020',
): number | null {
  const data = VPI_ALL_BASES[baseName];
  if (!data) return null;
  const avgCurrent = data[year];
  const avgPrior = data[year - 1];
  if (avgCurrent == null || avgPrior == null) return null;
  return ((avgCurrent - avgPrior) / avgPrior) * 100;
}

/**
 * Get VPI YoY change for a given year (in percent).
 * Uses unrounded computation from Jahresdurchschnittswerte when available.
 * Falls back to estimates for future years.
 */
export function getVpiChangeForYear(
  year: number,
  baseName: VpiBaseName = 'VPI 2020',
): number | null {
  const unrounded = computeUnroundedChange(year, baseName);
  if (unrounded != null) return unrounded;
  return VPI_ESTIMATES[year] ?? null;
}

/**
 * Get VPI Jahresdurchschnittswert for a given year and base.
 * Returns the actual average if available, or projects from the last known value using estimates.
 */
export function getVpiAverageForYear(
  year: number,
  baseName: VpiBaseName = 'VPI 2020',
): number | null {
  const data = VPI_ALL_BASES[baseName];
  if (!data) return null;
  if (data[year] != null) return data[year];
  const years = Object.keys(data).map(Number);
  const lastKnownYear = Math.max(...years);
  if (year <= lastKnownYear) return null;
  let avg = data[lastKnownYear];
  for (let y = lastKnownYear + 1; y <= year; y++) {
    const change = VPI_ESTIMATES[y] ?? 2.0;
    avg = avg * (1 + change / 100);
  }
  return avg;
}

/**
 * Cumulative VPI change between two years (in percent).
 * Uses Jahresdurchschnittswerte: (avg[toYear] - avg[fromYear]) / avg[fromYear] * 100
 */
export function getCumulativeVpiChange(
  fromYear: number,
  toYear: number,
  baseName: VpiBaseName = 'VPI 2020',
): number | null {
  const avgFrom = getVpiAverageForYear(fromYear, baseName);
  const avgTo = getVpiAverageForYear(toYear, baseName);
  if (avgFrom == null || avgTo == null || avgFrom === 0) return null;
  return ((avgTo - avgFrom) / avgFrom) * 100;
}

/**
 * Detect the best VPI base for a given contract year.
 * Returns the VPI base that was current when the contract was signed.
 */
export function getDefaultVpiBase(contractYear: number): VpiBaseName {
  if (contractYear >= 2025) return 'VPI 2025';
  if (contractYear >= 2020) return 'VPI 2020';
  if (contractYear >= 2015) return 'VPI 2015';
  if (contractYear >= 2010) return 'VPI 2010';
  if (contractYear >= 2005) return 'VPI 2005';
  if (contractYear >= 2000) return 'VPI 2000';
  if (contractYear >= 1996) return 'VPI 1996';
  return 'VPI 1986';
}

/** Published rounded change (for display only). Use getVpiChangeForYear() for calculations. */
export const VPI_YEARLY_CHANGE: Record<number, number> = {
  ...VPI_PUBLISHED_YOY,
  ...VPI_ESTIMATES,
};
