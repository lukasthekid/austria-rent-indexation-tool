#!/usr/bin/env node
/**
 * Downloads VPI ODS from Statistik Austria and generates lib/vpi-data-generated.ts
 *
 * Usage: npm run update-vpi
 * Workflow: Fetches 2_Verbraucherpreisindizes_ab_1990.ods from Statistik Austria,
 * parses it and regenerates vpi-data-generated.ts.
 */

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';

const STATISTIK_AUSTRIA_ODS_URL =
  'https://www.statistik.at/fileadmin/pages/214/2_Verbraucherpreisindizes_ab_1990.ods';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUTPUT_PATH = join(ROOT, 'lib', 'vpi-data-generated.ts');

const VPI_COLUMNS = {
  'VPI 2025': 2,
  'VPI 2020': 3,
  'VPI 2015': 4,
  'VPI 2010': 5,
  'VPI 2005': 6,
  'VPI 2000': 7,
  'VPI 1996': 8,
  'VPI 1986': 9,
};

function parseNumber(s) {
  if (!s || s === '.' || s === '-' || s.trim() === '') return null;
  return parseFloat(s.replace(',', '.'));
}

function parseYear(label) {
  const m = label.match(/Ø\s+(\d+)/);
  if (!m) return null;
  let y = parseInt(m[1], 10);
  if (y < 100) y += 2000;
  return y;
}

async function main() {
  console.log('Downloading VPI data from Statistik Austria...');

  let response;
  try {
    response = await fetch(STATISTIK_AUSTRIA_ODS_URL);
  } catch (err) {
    console.error('Network error:', err.message);
    process.exit(1);
  }

  if (!response.ok) {
    console.error(`Download failed: HTTP ${response.status} ${response.statusText}`);
    process.exit(1);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (buffer.length === 0) {
    console.error('Downloaded file is empty');
    process.exit(1);
  }

  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false });

  const data = {};
  for (const key of Object.keys(VPI_COLUMNS)) {
    data[key] = {};
  }
  let yoyChanges = {};

  for (const row of rows) {
    const label = String(row[0] ?? '');
    if (!label.startsWith('Ø')) continue;

    const year = parseYear(label);
    if (!year) continue;

    const yoy = parseNumber(String(row[1] ?? ''));
    if (yoy != null) yoyChanges[year] = yoy;

    for (const [vpiName, colIdx] of Object.entries(VPI_COLUMNS)) {
      const val = parseNumber(String(row[colIdx] ?? ''));
      if (val != null) {
        data[vpiName][year] = val;
      }
    }
  }

  const yoyYears = Object.keys(yoyChanges).map(Number).sort((a, b) => a - b);
  if (yoyYears.length === 0) {
    console.error('No VPI data found in downloaded file');
    process.exit(1);
  }

  let ts = `/**
 * AUTO-GENERATED from Statistik Austria ODS – do not edit manually.
 * Run: npm run update-vpi
 * Source: ${STATISTIK_AUSTRIA_ODS_URL}
 * Generated: ${new Date().toISOString().split('T')[0]}
 */

export type VpiBaseName = ${Object.keys(VPI_COLUMNS).map(k => `'${k}'`).join(' | ')};

/** All available VPI base year names, ordered newest to oldest */
export const VPI_BASE_NAMES: VpiBaseName[] = [${Object.keys(VPI_COLUMNS).map(k => `'${k}'`).join(', ')}];

/**
 * VPI Jahresdurchschnittswerte by base year.
 * Key: VPI base name, Value: Record<year, average>
 */
export const VPI_ALL_BASES: Record<VpiBaseName, Record<number, number>> = {\n`;

  for (const [vpiName, values] of Object.entries(data)) {
    const years = Object.keys(values).map(Number).sort((a, b) => a - b);
    if (years.length === 0) continue;

    ts += `  '${vpiName}': {\n`;
    for (const y of years) {
      ts += `    ${y}: ${values[y]},\n`;
    }
    ts += `  },\n`;
  }

  ts += `};\n\n`;

  ts += `/**
 * Published rounded YoY % change from ODS (column "% zu Vorjahr").
 * For unrounded calculations, compute from Jahresdurchschnittswerte directly.
 */
export const VPI_PUBLISHED_YOY: Record<number, number> = {\n`;

  for (const y of yoyYears) {
    ts += `  ${y}: ${yoyChanges[y]},\n`;
  }
  ts += `};\n`;

  writeFileSync(OUTPUT_PATH, ts, 'utf-8');

  const baseCount = Object.keys(data).filter(k => Object.keys(data[k]).length > 0).length;
  const yearRange = `${yoyYears[0]}–${yoyYears[yoyYears.length - 1]}`;
  console.log(`✓ Generated ${OUTPUT_PATH}`);
  console.log(`  ${baseCount} VPI bases, years ${yearRange}, ${yoyYears.length} annual averages`);
}

main();
