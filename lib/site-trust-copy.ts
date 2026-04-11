/**
 * Einheitliche Trust-/Disclaimer- und Quellentexte (Marketing + Rechtliches).
 * Zentral halten, damit Footer, Rechner, PDF und SEO-Texte nicht auseinanderlaufen.
 */

export const SITE_LINK_RIS = "https://www.ris.bka.gv.at/";
export const SITE_LINK_RIS_LABEL = "RIS – Bundesrecht";

/** Verbraucherpreisindex, Statistik Austria (Themenseite). */
export const SITE_LINK_VPI = "https://www.statistik.at/statistiken/preise-und-verdienste/verbraucherpreisindex-vpi";
export const SITE_LINK_VPI_LABEL = "VPI (Statistik Austria)";

/** Kurz, für Meta, Sidebars und Einzeiler. */
export const SITE_TRUST_TAGLINE =
  "Orientierung nach MieWeG und offiziellen VPI-Daten – ersetzt keine Rechtsberatung.";

export const SITE_DISCLAIMER_MAIN =
  "MietCheck-AT bietet allgemeine Information und eine unabhängige Rechenorientierung zu vertraglichen Wertsicherungen nach dem Mieten-Wertsicherungsgesetz (MieWeG) im Anwendungsbereich des Mietrechtsgesetzes (MRG).";

/** Einbettung (iframe): ohne Produktnamen im Fließtext. */
export const EMBED_DISCLAIMER_MAIN =
  "Dieses Tool stellt allgemeine Information und eine unabhängige Rechenorientierung zu vertraglichen Wertsicherungen nach dem Mieten-Wertsicherungsgesetz (MieWeG) im Anwendungsbereich des Mietrechtsgesetzes (MRG) bereit.";

export const SITE_DISCLAIMER_NO_WARRANTY =
  "Es wird keine Gewähr für die rechtliche Richtigkeit, Vollständigkeit oder Aktualität der dargestellten Inhalte und Rechnerergebnisse übernommen.";

export const SITE_DISCLAIMER_ADVICE =
  "Das ist keine Rechtsberatung. Im Einzelfall empfehlen wir die Beratung durch die Mietervereinigung Österreich oder eine Rechtsanwältin bzw. einen Rechtsanwalt für Mietrecht, bevor Sie verbindliche Entscheidungen treffen oder Zahlungen anpassen.";

export const SITE_SOURCES_LEGAL =
  "Rechtsgrundlagen: MieWeG und 5. Mietrechtliches Inflationslinderungsgesetz (5. MILG), BGBl. I 2025, in Kraft ab 1. Jänner 2026.";

export const SITE_SOURCES_DATA =
  "Datengrundlage für die Inflation: Verbraucherpreisindex (VPI) in Form jährlicher Durchschnittswerte nach Statistik Austria.";

/** Technische Grenze des Rechners (PDF / kompakte Hinweise). */
export const SITE_SCOPE_MR_ONLY =
  "Nicht erfasst: Mietverträge nach dem WGG (außer § 13 Abs 4), Geschäftsraummieten und Voll-Ausnahmen vom MRG.";

/** Wie im Rechner-Footer: Grenzen + VPI-Hinweis. */
export const SITE_SCOPE_LIMITS = `${SITE_SCOPE_MR_ONLY} Bei negativer VPI-Entwicklung bleibt die Miete unverändert.`;

/** PDF-Berechnungsblatt: rechtliche Hinweise (einheitlich mit Website). */
export const SITE_PDF_DISCLAIMERS: string[] = [
  "Die Berechnungen dienen ausschließlich der Orientierung und ersetzen keine individuelle Rechtsberatung.",
  SITE_DISCLAIMER_NO_WARRANTY,
  `${SITE_SOURCES_LEGAL} ${SITE_SOURCES_DATA}`,
  SITE_SCOPE_MR_ONLY,
];
