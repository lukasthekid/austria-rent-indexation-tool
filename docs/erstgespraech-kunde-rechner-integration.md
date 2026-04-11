# Erstgespräch: Rechner auf der Kunden-Website

Leitfaden für euer erstes Gespräch. Ziel: Bedarf, Integration, Rechtliches und nächste Schritte klären — noch **keine** technische Zusage, bis die wichtigsten Punkte beantwortet sind.

---

## Ziele dieses Termins

- Verstehen, **was** der Kunde auf seiner Seite erreichen will (Traffic, Vertrauen, Lead-Gen, interne Tools).
- **Wie** die Einbindung aus Sicht Nutzer:innen und Marketing aussehen soll (eigener Look vs. „Fremdwidget“).
- **Rahmen** für Angebot: Umfang, Laufzeit, Verantwortlichkeiten, Datenschutz grob einsortieren.
- **Nächster Schritt** vereinbaren (z. B. Demo-URL testen, Entscheidung iframe vs. API, zweiter Termin mit IT).

---

## Kurze Agenda (ca. 45–60 Min.)

| Zeit   | Thema                          |
| ------ | -------------------------------- |
| 5 min  | Vorstellung, Ziel des Meetings   |
| 15 min | Zielbild & Nutzer:innen          |
| 15 min | Technische / organisatorische Einbindung |
| 10 min | Recht, Datenschutz, Haftung (oberflächlich) |
| 10 min | Kommerzielles & nächste Schritte |

---

## 1. Zielbild und Nutzer:innen

- **Wer** soll den Rechner nutzen (Mieter:innen, Eigentümer:innen, interne Sachbearbeitung, alle)?
- **Was** soll nach dem Besuch passieren (nur Information, Kontaktaufnahme, Weiterleitung in ein Portal)?
- Braucht der Kunde **eine feste URL** nur für sich (White-Label / Subdomain) oder reicht **Einbettung** in bestehende Seiten?
- Gibt es **Pflichtinhalte** neben dem Rechner (Disclaimer, Impressum-Link, Hilfe/FAQ)?

**Notizen:**

```
…
```

---

## 2. Einbindung und Erscheinungsbild

- Soll der Rechner **im Fluss der Website** wirken (kaum sichtbar „von außen“) — dann oft **iframe** oder **eigenes UI mit API**.
- Ist ein **sichtbarer Rahmen** („Tool von MietCheck-AT“) akzeptabel oder verlangt die Marke **100 % eigenes Design**?
- **Wer pflegt** Texte und ggf. rechtliche Hinweise auf der Kundenseite rund um das Tool?
- Gibt es eine **IT-Ansprechperson** oder Agentur, die später technisch einbindet?

**Klärung „iframe vs. API“ (für dich zum Erklären):**

- **iframe:** Schnell, zentral aktualisiert, klar abgegrenzter Kasten auf der Seite.
- **API:** Kunde baut eigenes Formular/Ergebnis; höherer Aufwand, maximal integriert.

**Notizen:**

```
…
```

---

## 3. Technik und Betrieb (oberflächlich)

- **Hosting:** Rechner läuft bei euch (typisch); bestätigen, ob der Kunde **ausschließlich** das akzeptiert oder Self-Hosting braucht.
- **Verfügbarkeit:** Gibt es Erwartungen (z. B. „geschäftskritisch“)? Grob: Uptime, Support-Kanal.
- **Updates:** VPI- und gesetzliche Anpassungen — der Kunde soll wissen, dass **laufende Pflege** sinnvoll ist (Abrechnungsmodell später).
- **Messung:** Braucht der Kunde **Analytics** (Aufrufe, Absprünge)? Welche Tools sind auf seiner Seite erlaubt?

**Notizen:**

```
…
```

---

## 4. Datenschutz und Verantwortung (für Erstgespräch, keine Rechtsberatung)

- Werden **personenbezogene Daten** eingegeben (Namen, Adressen) oder nur **sachliche Vertrags-/Zahlenwerte**?
- Laufen Daten **nur im Browser** oder auch **auf dem Server**? (Beeinflusst AV-Vertrag, Privacy Policy.)
- **Haftung:** Gemeinsam grob festhalten: Hilfsmittel, **kein Ersatz** für Einzelfall-Beratung — Details im Vertrag mit Jurist:in.

**Notizen:**

```
…
```

---

## 5. Kommerzielles (wenn ihr es ansprechen wollt)

- **Budget-Rahmen** oder „erst Angebot“?
- **Laufzeit** eher einmalig, jährlich, monatlich?
- **Exklusivität** (nur dieser Kunde in Branche X) oder Standard-Lizenz?

**Notizen:**

```
…
```

---

## 6. Entscheidungen, die ihr mitnehmen wollt

Am Ende des Gesprächs idealerweise klar (auch wenn Antwort „noch offen“):

| Thema              | Entscheidung / nächster Schritt |
| ------------------ | ------------------------------- |
| Einbindung         | Link / iframe / API / offen     |
| Branding           | Standard / angepasst / offen    |
| Ansprechpartner IT | Name, E-Mail                    |
| Nächster Termin    | Datum                           |
| Unterlagen vom Kunden | z. B. Screenshot Wunschlayout, Domain |

---

## 7. Checkliste: Was du mitgeben kannst

- Link zur **Live-Demo** (eure Production-URL).
- Kurz **eine Satz-Erklärung**, was der Rechner kann und was er **nicht** kann (keine Rechtsberatung).
- Optional: **Ein-Pager** oder Folie — falls vorhanden.

---

## iframe-Einbettung (technisches Snippet)

Wenn der Kunde den Rechner per **iframe** einbindet (eigene Route `/embed`, angepasstes Erscheinungsbild, ohne MietCheck-Banner), reicht ein einfaches HTML-Snippet. Die **Höhe** ist zunächst fest; der Inhalt kann länger sein als der sichtbare Bereich — dann scrollt das iframe intern, oder ihr erhöht `height` testweise (z. B. 1200–1600 px). Eine automatische Höhenanpassung per `postMessage` wäre eine mögliche spätere Erweiterung.

**Beispiel** (Domain und `height` anpassen):

```html
<iframe
  title="Mietrechner – Orientierung MieWeG"
  src="https://<eure-production-domain>/embed"
  width="100%"
  height="1200"
  loading="lazy"
  referrerpolicy="strict-origin-when-cross-origin"
></iframe>
```

---

## Nach dem Gespräch (für dich)

- [ ] Kurzes **Protokoll** (E-Mail an Kunde, 5–10 Zeilen).
- [ ] **Angebot** skizzieren: Umfang (Embed/API), Setup, laufende Kosten, was im Support enthalten ist.
- [ ] Intern: technische Machbarkeit mit dem, was besprochen wurde, **abgleichen**.

---

*Dokument für interne Vorbereitung. Keine Rechts- oder Steuerberatung.*
