---
name: austrian-mietrecht-5-milg
description: Applies Austrian 5. Mietrechtliches Inflationslinderungsgesetz (5. MILG) and MieWeG constraints to rent indexation logic, contract checks, and legal reporting text. Use when implementing or reviewing Austrian rent indexation, MieWeG calculations, parallelrechnung, Befristung rules, or legal explanation output in this project.
---

# Austrian Mietrecht 5 MILG Compliance

Use this skill for code and content that must comply with 5. MILG (effective from 2026-01-01), especially MieWeG rent indexation limits.

## Scope and safety

- Treat this skill as implementation guidance for this project, not legal advice.
- If legal interpretation is ambiguous, keep behavior conservative and explicitly flag assumptions.
- Keep terms consistent: MieWeG, 5 MILG, Vollanwendung, Teilanwendung, Altvertrag, Neuvertrag, Parallelrechnung.

## Source of truth

- Read `LAW_REFERENCE.md` in this skill directory before changing legal logic.
- If a change depends on details not covered there, ask to validate against the original PDF text before finalizing.

## Required workflow

Copy this checklist and keep it updated while implementing:

```markdown
Legal-Compliance Progress
- [ ] 1. Classify contract scope
- [ ] 2. Select applicable cap model by year and rent type
- [ ] 3. Apply timing rule (1 April) and first-step aliquot rule
- [ ] 4. Apply parallelrechnung logic for non-MieWeG clauses / Altvertraege
- [ ] 5. Validate Befristung and silent extension rules where relevant
- [ ] 6. Validate Rueckforderung window rules where relevant
- [ ] 7. Produce transparent output with assumptions and legal basis
```

## Implementation rules

### 1) Contract classification

Determine and store:

- Contract type: Hauptmiete/Untermiete, Wohnung vs Geschaeftsraum.
- MRG scope: Vollanwendung, Teilanwendung, or excluded.
- Rent regime: preisgeschuetzt (MRG caps apply) vs freier Mietzins.
- Contract timing: Altvertrag (< 2026-01-01) or Neuvertrag (>= 2026-01-01).
- Landlord role for Befristung exception: Unternehmer vs non-Unternehmer (KSchG sense).

If classification is unclear, emit an explicit warning and do not hide uncertainty.

### 2) Cap model for indexation

Apply annual indexation only at 1 April, with year-specific caps:

- General MieWeG cap: up to 3.0% fully, above 3.0% only 50% counts.
- Preisgeschuetzte MRG Vollanwendung temporary caps:
  - 2026 increase (based on 2025 inflation): max 1.0%
  - 2027 increase (based on 2026 inflation): max 2.0%
  - from 2028 onward: general 3% + half-above-3 model

Always use unrounded average annual index change derived from annual averages.

### 3) Timing and first-step aliquot

- Increases (and reductions) happen on 1 April.
- If contract clause triggers at a different date, shift to next 1 April and freeze amount to what was reached at trigger date.
- On first MieWeG adjustment after contract conclusion, apply aliquot by full remaining months of conclusion year (`months/12`), then apply to already-capped rate.

### 4) Parallelrechnung requirements

For clauses that do not directly mirror MieWeG, compute both:

1. Contract curve under agreed clause.
2. MieWeG control curve with legal caps and dates.

At each possible increase date, allowed increase is constrained by both curves. For Altvertraege, this control logic is mandatory from 2026 onward when increases would occur.

### 5) Befristung / extension checks

For Wohnung contracts in Voll- and Teilanwendung:

- Default minimum fixed term: 5 years.
- Default extension and silent extension: 5 years.
- Exception for landlords that are not Unternehmer at relevant legal timepoint: 3 years may remain valid.
- In doubtful classification, treat 5 years as safer default and flag uncertainty.

### 6) Rueckforderung constraints

When handling potentially invalid value-protection clauses in Altvertraege:

- Recovery window is generally limited to 5 years plus a 3-year subjective limitation period.
- This limitation does not apply when invalidity is based on abusive consumer clauses under EU unfair terms framework.
- Preserve explicit distinction between domestic invalidity and abusive-clause cases.

### 7) Rounding and output transparency

- Round final rent amount to cent with half-cent threshold.
- Output must include:
  - selected legal regime,
  - applied cap formula,
  - relevant years used,
  - whether aliquot applied,
  - whether parallelrechnung applied,
  - assumptions / unresolved legal uncertainty.

## Output format for legal explanations

Use this structure in generated legal explanation text:

```markdown
## Legal basis used
- 5 MILG / MieWeG regime: [which part]
- Contract classification: [classification]
- Effective adjustment date: [date and why]

## Calculation logic
- Contract curve result: [value or n/a]
- MieWeG control result: [value]
- Applied cap and year logic: [rule]
- Final allowed adjustment: [value]

## Assumptions and caveats
- [assumption 1]
- [assumption 2]
```

## Additional resource

- Detailed legal rule summary: `LAW_REFERENCE.md`
