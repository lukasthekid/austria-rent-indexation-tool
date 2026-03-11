# MietCheck-AT

> Mietzinserhöhung prüfen – MieWeG Rechner für Österreich

Webanwendung zur Berechnung rechtskonformer Mietzinserhöhungen nach dem österreichischen **Mieten-Wertsicherungsgesetz (MieWeG)** (gültig ab 1. April 2026).

## Live Demo

**[https://mietcheck-at.vercel.app/](https://mietcheck-at.vercel.app/)**

Prüfen Sie kostenlos, ob Ihre Mietzinserhöhung rechtskonform ist – für Neuverträge und Altverträge.

---

## Features

- **Neuvertrag (ab 1.1.2026):** MieWeG-Valorisierung mit 3%-Deckel, preisgeschützte Obergrenzen (2026: 1%, 2027: 2%), Aliquotierung bei Erstanpassung
- **Altvertrag (vor 1.1.2026):** Parallelrechnung: Vertragskurve vs. MieWeG-Begrenzung – maßgeblich ist der niedrigere Wert
- **Vertragsklauseln:** VPI jährlich, VPI-Schwellenwert, Staffelmiete
- **VPI-Daten:** Statistik Austria Jahresdurchschnittswerte, ungerundete Vorjahresänderung gemäß MieWeG

## Berechnungslogik

### MieWeG-Grundlagen

Referenz: `lib/mieweg.ts`

- **Erster Anpassungstermin:** 1. April im Jahr (Vertragsjahr + 1) für Verträge Jan–Nov; Dezember-Verträge → April Jahr+2
- **Effektiver Satz:** Bei VPI > 3%: `3 + (VPI − 3) / 2`; sonst volle VPI-Änderung
- **Aliquotierung:** Bei erster Valorisierung: Satz × (volle Monate/12) im Vorjahr
- **Mehrjährig:** Periodengerecht (jahrweise verkettet ab letzter Valorisierung)
- **Preisgeschützt:** 2026 max 1%, 2027 max 2%

### Parallelrechnung

Referenz: `lib/parallelrechnung.ts`

```
Vertragskurve = Miete gemäß Vertragsklausel (unbegrenzt)
Begrenzungskurve = MieWeG-Maximalmiete
Tatsächliche Miete = min(Vertragskurve, Begrenzungskurve), wenn Vertrag Erhöhung auslöst
```

### Vertragsklauseltypen

Referenz: `lib/vertragskurve.ts`

| Typ | Beschreibung |
|-----|--------------|
| **vpiAnnual** | Jährliche Anpassung an VPI-Vorjahresänderung (auf 1.4. verschoben, MieWeG § 1 Abs 4) |
| **vpiThreshold** | Anpassung, wenn kumulierte VPI-Änderung Schwellenwert überschreitet (z.B. 5%) |
| **staffel** | Fixe prozentuale oder betragsmäßige Erhöhung pro Jahr an einem festen Monat |

## Lokale Entwicklung

### Voraussetzungen

- Node.js 18+
- npm

### Installation & Start

```bash
npm install
npm run dev      # → http://localhost:3000
```

### Weitere Befehle

```bash
npm run build    # Production-Build
npm run start    # Production-Server
npm run test     # Vitest-Tests
npm run lint     # ESLint
```

## VPI-Daten aktualisieren

VPI-Daten stammen von **Statistik Austria** und müssen periodisch aktualisiert werden.

### Ablauf

`npm run update-vpi` lädt die ODS-Datei von Statistik Austria und erzeugt `lib/vpi-data-generated.ts`.

**Quelle:**  
[https://www.statistik.at/fileadmin/pages/214/2_Verbraucherpreisindizes_ab_1990.ods](https://www.statistik.at/fileadmin/pages/214/2_Verbraucherpreisindizes_ab_1990.ods)

Struktur: Zeilen mit `Ø YYYY`, Spalte 1 = "% zu Vorjahr", Spalten 2–9 = VPI 2025, 2020, 2015, 2010, 2005, 2000, 1996, 1986.

### Fallback

Für Jahre ohne offizielle Daten verwendet die App Schätzwerte in `lib/vpi-data.ts` (aktuell 2026: 2,4%, 2027–2028: 2,0%).

## Projektstruktur

```
├── app/                 # Next.js App Router
│   ├── layout.tsx       # Metadata, SEO, JSON-LD
│   ├── page.tsx         # Wizard-UI
│   ├── robots.ts
│   └── sitemap.ts
├── lib/
│   ├── mieweg.ts
│   ├── vertragskurve.ts
│   ├── parallelrechnung.ts
│   ├── vpi-data.ts
│   └── vpi-data-generated.ts
├── scripts/
│   └── update-vpi-data.mjs
└── types/
```

## Haftungsausschluss

Dieses Tool dient ausschließlich der **Orientierung** und ersetzt keine Rechtsberatung. MieWeG-Regeln sind komplex und fallabhängig. Bitte Berechnungen mit offiziellen Quellen (Statistik Austria, BMK) oder Fachpersonen prüfen, bevor Sie handeln.
