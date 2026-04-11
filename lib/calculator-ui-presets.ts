/**
 * UI-Klassen und Akzentfarben für den MieWeG-Rechner: öffentliche Website vs. eingebettete Darstellung.
 */

export type CalculatorVariant = "site" | "embedLexis";

export type CalculatorUi = {
  /** Primärfarbe für SVG/Recharts (Hex) */
  chartAccentHex: string;
  wizardStepActive: string;
  wizardStepBadge: string;
  radioCardSelected: string;
  radioInput: string;
  /** Radio mit geringerem oberen Margin (Ausrichtung an mehrzeiligem Text) */
  radioInputCompact: string;
  textInput: string;
  /** Eingabe „vorgeschlagene Miete“ (größere Touch-Fläche) */
  proposedRentInput: string;
  checkboxInput: string;
  /** Volle Breite, primärer CTA */
  primaryButtonWide: string;
  /** flex-1, gleiche Höhe wie Wide */
  primaryButtonFlex: string;
  linkAccentSmall: string;
  linkAccent: string;
  tableBadgeMieweg: string;
  textDanger: string;
  footerLink: string;
  pdfButton: string;
};

const site: CalculatorUi = {
  chartAccentHex: "#c8102e",
  wizardStepActive: "bg-red-50 font-semibold text-red-700",
  wizardStepBadge: "bg-red-600 text-white",
  radioCardSelected: "border-red-600 bg-red-50",
  radioInput: "mt-1 h-4 w-4 text-red-600 focus:ring-red-600",
  radioInputCompact: "mt-0.5 h-4 w-4 text-red-600 focus:ring-red-600",
  textInput:
    "mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm placeholder:text-zinc-500 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600",
  proposedRentInput:
    "mt-1 block w-full max-w-xs min-h-[44px] rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-base text-zinc-900 shadow-sm placeholder:text-zinc-500 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 sm:min-h-0 sm:py-2",
  checkboxInput:
    "mt-0.5 h-4 w-4 rounded border-zinc-300 text-red-600 focus:ring-red-600",
  primaryButtonWide:
    "min-h-[44px] w-full rounded-lg bg-red-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 active:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-0 sm:w-auto sm:py-2.5",
  primaryButtonFlex:
    "min-h-[44px] flex-1 rounded-lg bg-red-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 active:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-0 sm:py-2.5",
  linkAccentSmall: "mt-1.5 text-xs text-red-600 hover:underline",
  linkAccent: "text-red-600 hover:underline",
  tableBadgeMieweg:
    "inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 ",
  textDanger: "mt-2 text-sm font-medium text-red-600",
  footerLink:
    "text-red-700 underline underline-offset-2 hover:text-red-800",
  pdfButton:
    "inline-flex min-h-[44px] items-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 active:bg-red-800",
};

/** LexisNexis-inspiriert: Primär #e8171f, Sekundär-Akzent #006997 (nur wo sinnvoll). */
const embedLexis: CalculatorUi = {
  chartAccentHex: "#e8171f",
  wizardStepActive: "bg-red-50 font-semibold text-[#b8141b]",
  wizardStepBadge: "bg-[#e8171f] text-white",
  radioCardSelected: "border-[#e8171f] bg-red-50",
  radioInput: "mt-1 h-4 w-4 text-[#e8171f] focus:ring-[#e8171f]",
  radioInputCompact: "mt-0.5 h-4 w-4 text-[#e8171f] focus:ring-[#e8171f]",
  textInput:
    "mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm placeholder:text-zinc-500 focus:border-[#e8171f] focus:outline-none focus:ring-1 focus:ring-[#e8171f]",
  proposedRentInput:
    "mt-1 block w-full max-w-xs min-h-[44px] rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-base text-zinc-900 shadow-sm placeholder:text-zinc-500 focus:border-[#e8171f] focus:outline-none focus:ring-1 focus:ring-[#e8171f] sm:min-h-0 sm:py-2",
  checkboxInput:
    "mt-0.5 h-4 w-4 rounded border-zinc-300 text-[#e8171f] focus:ring-[#e8171f]",
  primaryButtonWide:
    "min-h-[44px] w-full rounded-lg bg-[#e8171f] px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-[#c41419] focus:outline-none focus:ring-2 focus:ring-[#e8171f] focus:ring-offset-2 active:bg-[#a01114] disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-0 sm:w-auto sm:py-2.5",
  primaryButtonFlex:
    "min-h-[44px] flex-1 rounded-lg bg-[#e8171f] px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-[#c41419] focus:outline-none focus:ring-2 focus:ring-[#e8171f] focus:ring-offset-2 active:bg-[#a01114] disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-0 sm:py-2.5",
  linkAccentSmall: "mt-1.5 text-xs text-[#006997] hover:underline",
  linkAccent: "text-[#006997] hover:underline",
  tableBadgeMieweg:
    "inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-[#b8141b] ",
  textDanger: "mt-2 text-sm font-medium text-[#e8171f]",
  footerLink:
    "text-[#006997] underline underline-offset-2 hover:text-[#004d6b]",
  pdfButton:
    "inline-flex min-h-[44px] items-center rounded-lg bg-[#e8171f] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#c41419] focus:outline-none focus:ring-2 focus:ring-[#e8171f] focus:ring-offset-2 active:bg-[#a01114]",
};

export const CALCULATOR_UI: Record<CalculatorVariant, CalculatorUi> = {
  site,
  embedLexis,
};
