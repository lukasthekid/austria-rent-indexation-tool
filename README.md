# Austria Rent Indexation Tool (MietCheck-AT)

A web application to calculate legally compliant rent increases under the Austrian **Mieten-Wertsicherungsgesetz (MieWeG)**, effective April 1, 2026. Supports both **Neuverträge** (new contracts) and **Altverträge** (existing contracts with various indexation clauses).

## Features

- **Neuvertrag (new contract):** Single or multi-year MieWeG valorisation with 3% cap, preisgeschützt caps (2026: 1%, 2027: 2%), and aliquotierung (proportional first-year adjustment)
- **Altvertrag (existing contract):** Parallelrechnung comparing Vertragskurve (contract clause) vs. Begrenzungskurve (MieWeG limit). Payable rent = min of both, only when the contract triggers an increase
- **Contract clause types:** VPI annual, VPI threshold (cumulative), Staffelmiete (fixed % or amount)
- **VPI data:** Uses Statistik Austria Jahresdurchschnittswerte; unrounded YoY change per MieWeG requirement

## Calculation Logic

### MieWeG Basics

Implementation reference: `lib/mieweg.ts`

- **First indexation date:** April 1 of (contractYear + 1) for contracts Jan–Nov; December contracts → April year+2
- **Effective rate formula:** If VPI change > 3%, then `3 + (VPI − 3) / 2`; otherwise full VPI change
- **Aliquotierung:** For first valorisation, rate × (fullMonths/12) in the prior year
- **Multi-year:** Periodengerecht (chain year-by-year from last valorisation)
- **Preisgeschützt (regulated apartments):** 2026 max 1%, 2027 max 2%

### Parallelrechnung

Implementation reference: `lib/parallelrechnung.ts`

```
Vertragskurve = rent per contract clause (uncapped)
Begrenzungskurve = MieWeG maximum rent
Actual rent = min(Vertragskurve, Begrenzungskurve) when contract triggers increase
```

### Contract Clause Types

Implementation reference: `lib/vertragskurve.ts`

| Type | Description |
|------|-------------|
| **vpiAnnual** | Annual adjustment by prior-year VPI change (shifted to April 1 per MieWeG § 1 Abs 4) |
| **vpiThreshold** | Adjust when cumulative VPI change exceeds threshold (e.g. 5%) |
| **staffel** | Fixed percentage or amount increase at a specified month each year |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation & Run

```bash
npm install
npm run dev      # Development server at http://localhost:3000
```

### Other Commands

```bash
npm run build    # Production build
npm run start    # Run production server
npm run test     # Run Vitest tests
npm run lint     # ESLint
```

## Updating VPI Data

VPI (Verbraucherpreisindex) data is sourced from **Statistik Austria** and must be updated periodically when new annual averages become available.

### Source

- [Statistik Austria – VPI 2020](https://data.statistik.gv.at/web/meta.jsp?dataset=OGD_vpi20_VPI_2020_1) (or equivalent ODS export)

### Workflow

1. Download or export VPI Jahresdurchschnittswerte to ODS format from Statistik Austria
2. Replace `vpi_data.ods` in the project root with the updated file
   - Expected structure: rows with `Ø YYYY`, columns for "% zu Vorjahr", VPI 2025, VPI 2020, VPI 2015, VPI 2010, VPI 2005, VPI 2000, VPI 1996, VPI 1986
3. Run: `npm run update-vpi`
4. This regenerates `lib/vpi-data-generated.ts`

### Notes

- The script expects specific column indices. See `scripts/update-vpi-data.mjs`. If Statistik Austria changes its format, the script may need adjustment.
- For years without official data, the app uses fallback estimates defined in `lib/vpi-data.ts` (currently 2026: 2.4%, 2027–2028: 2.0%).

## Project Structure

```
├── app/           # Next.js app router (layout, main wizard page)
├── lib/           # Core logic
│   ├── mieweg.ts           # MieWeG calculation
│   ├── vertragskurve.ts    # Contract clause curves
│   ├── parallelrechnung.ts # Vertrag vs. Begrenzung comparison
│   ├── vpi-data.ts         # VPI API (wraps generated data)
│   └── vpi-data-generated.ts  # Auto-generated from vpi_data.ods
├── scripts/
│   └── update-vpi-data.mjs # Regenerates vpi-data-generated.ts from ODS
├── types/         # Route and validator types
└── vpi_data.ods   # Source VPI data (manual update)
```

## Disclaimer

This tool is for **informational purposes only** and does not constitute legal advice. Rent indexation rules under MieWeG are complex and depend on individual circumstances. Always verify calculations with official sources (e.g. Statistik Austria, BMK) or a qualified professional before taking any action.
