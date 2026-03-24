import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { CalculationReportPayload } from "@/lib/report-payload";

const styles = StyleSheet.create({
  page: {
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 30,
    fontSize: 10,
    color: "#111827",
    lineHeight: 1.4,
  },
  header: {
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  logoBlock: {
    flexDirection: "column",
  },
  logoText: {
    fontSize: 14,
    fontWeight: 700,
    color: "#b91c1c",
  },
  logoSubline: {
    fontSize: 8.5,
    color: "#6b7280",
    marginTop: 2,
  },
  title: {
    fontSize: 17,
    fontWeight: 700,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 10,
    color: "#4b5563",
    marginBottom: 0,
  },
  section: {
    marginBottom: 12,
    border: "1 solid #e5e7eb",
    borderRadius: 4,
    padding: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    marginBottom: 3,
    gap: 8,
  },
  label: {
    width: "45%",
    color: "#374151",
  },
  value: {
    width: "55%",
    fontWeight: 600,
  },
  listItem: {
    marginBottom: 3,
  },
  listPrefix: {
    color: "#6b7280",
  },
  resultBox: {
    padding: 8,
    borderRadius: 4,
    border: "1 solid #d1d5db",
    backgroundColor: "#f9fafb",
  },
  strong: {
    fontWeight: 700,
  },
  formulaLine: {
    marginBottom: 3,
    fontSize: 9.5,
    color: "#111827",
  },
  disclaimer: {
    color: "#4b5563",
    fontSize: 9,
    marginBottom: 3,
  },
  footer: {
    marginTop: 8,
    fontSize: 8.5,
    color: "#6b7280",
  },
  pageBreakTitle: {
    fontSize: 15,
    fontWeight: 700,
    marginBottom: 6,
  },
  pageBreakSubtitle: {
    fontSize: 9.5,
    color: "#374151",
    marginBottom: 10,
  },
  auditBlock: {
    marginBottom: 8,
    border: "1 solid #e5e7eb",
    borderRadius: 4,
    padding: 7,
  },
  auditTitle: {
    fontSize: 10.5,
    fontWeight: 700,
    marginBottom: 4,
  },
  auditLine: {
    fontSize: 9.2,
    marginBottom: 2,
    color: "#111827",
  },
  muted: {
    color: "#6b7280",
  },
});

function formatEur(cents: number): string {
  return new Intl.NumberFormat("de-AT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

function formatPercent(value: number): string {
  return `${value.toFixed(2)} %`;
}

function formatDate(isoOrDate: string): string {
  const date = new Date(isoOrDate);
  if (Number.isNaN(date.getTime())) return isoOrDate;
  return new Intl.DateTimeFormat("de-AT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatIndexValue(value: number | null): string {
  if (value == null) return "n/v";
  return value.toFixed(3);
}

function fmtStepRate(
  rawRate: number,
  cappedRate: number,
  aliquotMonths: number,
  appliedRate: number
): string {
  return `raw ${rawRate.toFixed(4)}%, gedeckelt ${cappedRate.toFixed(4)}%, aliquot ${aliquotMonths}/12 -> angewandt ${appliedRate.toFixed(4)}%`;
}

type Props = {
  payload: CalculationReportPayload;
};

export default function CalculationReportPdf({ payload }: Props) {
  const isParallel = payload.parallelResult != null;
  const trace = payload.calculationTrace;
  const vpiAuditLines = trace.vpiDerivation.map((item) => {
    if (item.unroundedChangePercent == null) {
      return `VPI ${item.inflationYear}: keine vollstaendigen Jahresdurchschnittswerte (Quelle: ${item.source}).`;
    }
    return `VPI ${item.inflationYear}: ${item.formula} (Quelle: ${item.source})`;
  });

  return (
    <Document title="MietCheck Berechnungsblatt">
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.logoBlock}>
            <Text style={styles.logoText}>MietCheck-AT</Text>
            <Text style={styles.logoSubline}>Mieten-Wertsicherungsrechner</Text>
          </View>
          <View>
            <Text style={styles.title}>Berechnungsblatt</Text>
            <Text style={styles.subtitle}>
              Erstellt am {formatDate(payload.reportMeta.createdAtIso)} -{" "}
              {payload.caseContext.legalLabel}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fallkontext</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Vertragstyp</Text>
            <Text style={styles.value}>
              {payload.caseContext.contractMode === "neuvertrag"
                ? "Neuvertrag"
                : "Altvertrag"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Wohnungstyp</Text>
            <Text style={styles.value}>
              {payload.caseContext.apartmentType === "preisgeschützt"
                ? "Preisgeschützt"
                : "Freier Mietzins"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Zieljahr (Anpassung)</Text>
            <Text style={styles.value}>1.4.{payload.caseContext.targetYear}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Inflationsjahr</Text>
            <Text style={styles.value}>{payload.caseContext.inflationYear}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Eingabedaten</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Aktuelle Miete</Text>
            <Text style={styles.value}>{formatEur(payload.inputs.currentRentCents)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Vertragsdatum</Text>
            <Text style={styles.value}>{payload.inputs.contractDate}</Text>
          </View>
          {payload.inputs.lastValorisationDate && (
            <View style={styles.row}>
              <Text style={styles.label}>Letzte Valorisierung</Text>
              <Text style={styles.value}>{payload.inputs.lastValorisationDate}</Text>
            </View>
          )}
          {payload.inputs.altLastValorisationDate && (
            <View style={styles.row}>
              <Text style={styles.label}>Letzte Indexierung Altvertrag</Text>
              <Text style={styles.value}>{payload.inputs.altLastValorisationDate}</Text>
            </View>
          )}
          <View style={styles.row}>
            <Text style={styles.label}>VPI-Änderung</Text>
            <Text style={styles.value}>
              {formatPercent(payload.inputs.vpiPercent)}{" "}
              {payload.inputs.usedCustomVpi ? "(manuell)" : "(Standard)"}
            </Text>
          </View>
          {payload.inputs.clauseDetails.map((item) => (
            <View style={styles.row} key={item.label}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.value}>{item.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Rechenschritte {isParallel ? "(Parallelrechnung)" : "(MieWeG)"}
          </Text>
          {trace.miewegSteps.length > 0 && (
            <>
              <Text style={[styles.listItem, styles.strong]}>MieWeG je Stichtag:</Text>
              {trace.miewegSteps.map((step) => (
                <Text key={`${step.valorisationYear}-${step.resultRentCents}`} style={styles.listItem}>
                  <Text style={styles.listPrefix}>- </Text>
                  {step.stepLabel}: VPI {step.inflationYear} = {formatPercent(step.rawVpiPercent)}; gedeckelt{" "}
                  {formatPercent(step.cappedRatePercent)}; Monate {step.aliquotMonths}/12; angewandt{" "}
                  {formatPercent(step.appliedRatePercent)}; Ergebnis {formatEur(step.resultRentCents)}
                </Text>
              ))}
            </>
          )}

          {trace.parallelSteps.length > 0 && (
            <>
              <Text style={[styles.listItem, styles.strong]}>Parallelrechnung je Jahr:</Text>
              {trace.parallelSteps.map((step) => (
                <Text key={step.year} style={styles.listItem}>
                  <Text style={styles.listPrefix}>- </Text>
                  {step.year}: Vertrag {formatEur(step.contractRentCents)}, MieWeG{" "}
                  {formatEur(step.controlRentCents)}, min {formatEur(step.minCandidateCents)}, maßgeblich{" "}
                  {formatEur(step.resultActualRentCents)} ({step.contractTriggered ? step.binding : "keine Erhoehung"})
                </Text>
              ))}
            </>
          )}
        </View>

        {trace.miewegSteps.length + trace.parallelSteps.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Formeln der Berechnung</Text>
            {trace.miewegSteps.map((step, index) => (
              <Text key={`mieweg-formula-${step.valorisationYear}`} style={styles.formulaLine}>
                {index + 1}. {step.stepLabel}: {step.formula}
              </Text>
            ))}
            {trace.parallelSteps.map((step, index) => (
              <Text key={`parallel-formula-${step.year}`} style={styles.formulaLine}>
                {trace.miewegSteps.length + index + 1}. 1.4.{step.year}:{" "}
                {step.lines.join(" | ")}
              </Text>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Regeln und Rohdaten je Jahr</Text>
          {payload.explainability.rules.map((rule, index) => (
            <Text key={`rule-${index}`} style={styles.listItem}>
              <Text style={styles.listPrefix}>- </Text>
              {rule}
            </Text>
          ))}
          <Text style={[styles.listItem, styles.strong]}>Verwendete VPI-Rohdaten:</Text>
          {payload.explainability.vpiTrace.map((item) => (
            <Text key={`vpi-${item.inflationYear}`} style={styles.listItem}>
              <Text style={styles.listPrefix}>- </Text>
              Jahr {item.inflationYear}: Ø Vorjahr {formatIndexValue(item.averagePrevYear)}, Ø Jahr{" "}
              {formatIndexValue(item.averageCurrentYear)}, ungerundete Veränderung{" "}
              {item.unroundedChangePercent != null
                ? formatPercent(item.unroundedChangePercent)
                : "n/v"}{" "}
              (Quelle: {item.source})
            </Text>
          ))}
        </View>

        <View style={[styles.section, styles.resultBox]}>
          <Text style={styles.sectionTitle}>Ergebnis</Text>
          <Text style={styles.listItem}>
            Maximal zulässige Miete:{" "}
            <Text style={styles.strong}>
              {formatEur(payload.outputs.finalAllowedRentCents)}
            </Text>
          </Text>
          <Text style={styles.listItem}>
            Gesamtänderung: <Text style={styles.strong}>{formatPercent(payload.outputs.totalChangePercent)}</Text>
          </Text>
          {payload.outputs.proposedCheck && (
            <Text style={styles.listItem}>
              Vorgeschlagene Miete: {formatEur(payload.outputs.proposedCheck.proposedCents)} -{" "}
              {payload.outputs.proposedCheck.isAllowed
                ? "zulässig"
                : `nicht zulässig (Abweichung ${formatEur(
                    payload.outputs.proposedCheck.deltaCents
                  )})`}
            </Text>
          )}
          {payload.backlog && payload.backlog.totalBacklogCents > 0 && (
            <>
              <Text style={[styles.listItem, styles.strong]}>
                Mögliche rückwirkende Nachforderung bei freiem Mietzins
              </Text>
              <Text style={styles.listItem}>
                Auf Basis der eingegebenen Daten könnte bei freiem Mietzins rechnerisch ein Rückstand von{" "}
                <Text style={styles.strong}>{formatEur(payload.backlog.totalBacklogCents)}</Text> für die letzten bis
                zu drei Jahre bestehen.
              </Text>
              {payload.backlog.perYear.map((entry) => (
                <Text key={entry.year} style={styles.listItem}>
                  - 1.4.{entry.year}: {formatEur(entry.backlogCents)} rechnerischer Rückstand
                </Text>
              ))}
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hinweise und Haftungsausschluss</Text>
          {payload.disclaimers.map((line, index) => (
            <Text style={styles.disclaimer} key={`${line}-${index}`}>
              - {line}
            </Text>
          ))}
        </View>

        <Text style={styles.footer}>
          Dieses Berechnungsblatt wurde automatisch erzeugt und dient der
          Nachvollziehbarkeit der im Rechner verwendeten Daten und Rechenschritte.
        </Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.pageBreakTitle}>Pruefblatt zur Nachrechnung (letzte Seite)</Text>
        <Text style={styles.pageBreakSubtitle}>
          Diese Seite zeigt die Rechenlogik so, dass das Ergebnis ohne Gesetzestext Schritt fuer Schritt
          kontrolliert werden kann.
        </Text>

        <View style={styles.auditBlock}>
          <Text style={styles.auditTitle}>1) Grundformeln fuer die Kontrolle</Text>
          <Text style={styles.auditLine}>- VPI-Jahresaenderung = ((JD Jahr n - JD Jahr n-1) / JD Jahr n-1) x 100</Text>
          <Text style={styles.auditLine}>- MieWeG-Deckel (allgemein): bis 3 % voll, darueber nur die Haelfte</Text>
          <Text style={styles.auditLine}>- Preisgeschuetzt: 1.4.2026 max 1 %, 1.4.2027 max 2 %</Text>
          <Text style={styles.auditLine}>- Einstieg (Aliquotierung): gedeckelter Satz x (volle Monate / 12)</Text>
          <Text style={styles.auditLine}>- Parallelrechnung: anwendbar ist min(Vertragskurve, Begrenzungskurve)</Text>
          <Text style={[styles.auditLine, styles.muted]}>
            Alle Geldwerte sind auf Cent nach MieWeG-Rundungsregel gerechnet.
          </Text>
        </View>

        <View style={styles.auditBlock}>
          <Text style={styles.auditTitle}>2) VPI-Rohdaten und ungerundete Ableitung</Text>
          {vpiAuditLines.map((line, i) => (
            <Text key={`vpi-audit-${i}`} style={styles.auditLine}>
              - {line}
            </Text>
          ))}
        </View>

        {trace.miewegSteps.length > 0 && (
          <View style={styles.auditBlock}>
            <Text style={styles.auditTitle}>3) MieWeG-Rechnung mit konkreten Zahlen</Text>
            {trace.miewegSteps.map((step, i) => (
              <Text key={`mieweg-audit-${step.valorisationYear}`} style={styles.auditLine}>
                {i + 1}. {step.stepLabel}: VPI {step.inflationYear} {fmtStepRate(step.rawVpiPercent, step.cappedRatePercent, step.aliquotMonths, step.appliedRatePercent)}; {step.formula}
              </Text>
            ))}
          </View>
        )}

        {trace.parallelSteps.length > 0 && (
          <View style={styles.auditBlock}>
            <Text style={styles.auditTitle}>4) Parallelrechnung pro Stichtag 1. April</Text>
            {trace.parallelSteps.map((step) => (
              <Text key={`parallel-audit-${step.year}`} style={styles.auditLine}>
                1.4.{step.year}: {step.lines.join(" | ")}
              </Text>
            ))}
          </View>
        )}

        <View style={[styles.auditBlock, styles.resultBox]}>
          <Text style={styles.auditTitle}>5) Endkontrolle</Text>
          <Text style={styles.auditLine}>
            Endergebnis laut Rechner: <Text style={styles.strong}>{formatEur(payload.outputs.finalAllowedRentCents)}</Text>
          </Text>
          <Text style={styles.auditLine}>
            Gesamtveraenderung: <Text style={styles.strong}>{formatPercent(payload.outputs.totalChangePercent)}</Text>
          </Text>
          <Text style={[styles.auditLine, styles.muted]}>
            Kontrollfrage: Ist die vorgeschlagene Miete kleiner/gleich dem Endergebnis?
          </Text>
          {payload.outputs.proposedCheck ? (
            <Text style={styles.auditLine}>
              Antwort: {payload.outputs.proposedCheck.isAllowed ? "Ja, zulaessig." : "Nein, nicht zulaessig."}
            </Text>
          ) : (
            <Text style={styles.auditLine}>Antwort: Kein Vorschlagswert eingegeben.</Text>
          )}
        </View>
      </Page>
    </Document>
  );
}
