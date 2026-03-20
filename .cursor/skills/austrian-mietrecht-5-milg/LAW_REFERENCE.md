# 5 MILG / MieWeG Reference (Project Digest)

This file is a compact implementation digest derived from the provided PDF on the 5. Mietrechtliches Inflationslinderungsgesetz.

## Effective date

- 5 MILG and MieWeG take effect on 2026-01-01.

## MieWeG core scope

- Covers apartment main/sub lease contracts in MRG Vollanwendung and Teilanwendung.
- Does not generally cover MRG full exemptions, pure commercial leases, or neutral objects.
- MieWeG limits contractual value protection; it does not create value protection by itself and does not heal invalid clauses.

## Core cap mechanism

- Adjustments are tied to annual average inflation (VPI 2020 annual average change vs prior year annual average).
- General cap: yearly increase uses full inflation up to 3.0%; any part above 3.0% counts only at 50%.
- Timing cap: adjustments occur on 1 April (initially after the first full calendar year logic).
- If contract clause would trigger on another date, shift to next 1 April and freeze to trigger-date level.

## Temporary extra caps in preisgeschuetzter MRG Vollanwendung

- 1 April 2026 adjustment: max 1.0%.
- 1 April 2027 adjustment: max 2.0%.
- From 1 April 2028 onward: return to general 3% + half-above-3 rule.

## First adjustment aliquot rule

- First MieWeG-linked adjustment after contract conclusion uses only full months remaining in the conclusion year (`months/12`).
- Apply legal cap logic first, then aliquot.

## Parallelrechnung concept

- For legacy/non-MieWeG clause designs, calculate:
  1) contractual increase path, and
  2) MieWeG control path.
- Effective increase cannot be earlier or higher than MieWeG control allows.
- Particularly relevant for Altvertraege (contracts concluded before 2026-01-01).

## Altvertraege transition

- MieWeG limitation regime applies to increases occurring (or that would have occurred) from 2026 onward.
- First MieWeG-conform increase for Altvertraege is no earlier than 1 April 2026, subject to contractual trigger logic and caps.
- Transition may require using last relevant index reference month as synthetic "contract month" for aliquot-style entry.

## Rounding

- Final rent rounding follows cent rounding with half-cent threshold.

## Rueckforderung (invalid clauses)

- For Altvertraege with invalid value-protection clauses, recovery is generally limited to last 5 years, plus 3-year subjective limitation from knowledge (long stop 30 years from payment).
- Exception: no such shortening where invalidity is based on abusive consumer terms under EU unfair terms law (Klausel-RL context).
- Cases already litigated before 2026-01-01 are carved out from retroactive shortening.

## Richtwert / Kategorie alignment

- Statutory indexation of rent-law benchmark values aligns with the new cap logic:
  - 2026: 1.0%
  - 2027: 2.0%
  - from 2028: 3% + half-above-3 logic

## Befristung and silent extension updates

- For apartment contracts in MRG Voll- and Teilanwendung:
  - default minimum fixed term moves from 3 to 5 years,
  - default extension duration moves from 3 to 5 years,
  - silent extension generally moves from 3 to 5 years.
- Exception: landlord who is not Unternehmer in KSchG sense at relevant timepoint may keep 3-year track.
- In legal doubt, 5-year handling is the safer conservative default.

## Practical compliance hints for this codebase

- Always capture legal classification explicitly in computation inputs and report payloads.
- Keep both contract-curve and legal-cap-curve values available for auditability.
- Emit assumptions where landlord Unternehmer status or MRG scope is unknown.
- Mark unresolved legal interpretation with a warning instead of guessing silently.
