# Solar System Registry Terminal

An in-universe information dashboard for the Interplanetary Assembly (IA) — the central diplomatic institution of a near-future Solar System governed by five sovereign blocs spanning Earth to the Saturnian frontier.

Built as a dark-terminal-aesthetic React application styled as an IA Information Systems Division node.

---

## What it covers

**System Map** — a log-scale heliocentric schematic of all five blocs, the Ice Giant Survey Corridor (IGSC), and the trans-Kuiper frontier zone. Click any node for details. Includes a resource dependency map showing critical inter-bloc supply relationships.

**Bloc Comparison** — side-by-side comparison of any two blocs across population, gravity band, currency, governance, military posture, economic pillars, and weaknesses. Includes a live tension strip drawn from inter-bloc political data.

**Treaties** — full registry of political and diplomatic instruments (TKA, MCCP, IDN, TKARC, SMIF, LTAM) and 19 agency-administered technical treaties across environmental, scientific, trade, and financial domains.

**IA Agencies** — expanded dossiers for all ten specialised agencies (IA, INA, ICC, IEA, IHC, IFE, IJC, ISA, ITC, TKA Secretariat), including headquarters, mandate, jurisdiction limits, inter-agency relationships, administered treaties, and a consolidated system-wide presence grid.

**G-Band Table** — the IHC's five-band gravity classification framework with physiological baselines, cross-gravity travel restrictions, and LTAM medication reference.

**Mobility** — the System Movement & Immigration Framework (SMIF) inter-bloc mobility matrix and all special provisions (DSCP, HTO, F-CAW, Diplomatic Exemption).

**Cultural Codex** — demonyms, vernacular codex entries, social rituals, lived environments, and inter-bloc linguistic tensions for all five blocs.

**Search** — full-registry keyword search across blocs, OCCs, conflict zones, treaties, agencies, G-bands, demonyms, and vernacular entries.

**Live Ticker** — a scrolling IA·ISD broadcast footer with system advisories, corridor notices, currency rates, and frontier dispatches.

---

## The five blocs

| Bloc | Full Name | Centre | G-Band |
|------|-----------|--------|--------|
| TLC | Terran–Lunar Commonwealth | Earth · Luna | G1 |
| MF | Martian Federation | Mars · Phobos · Deimos | G2 |
| BCC | Belt Cooperative Compact | Ceres · Belt habitats | G3 |
| JFA | Jovian Federal Alliance | Ganymede · Europa · Callisto · Io | G3 |
| SatCon | Saturnian Concord | Titan · Enceladus · Rhea | G2 |

---

## Tech stack

- React 19
- Vite 8
- Plain JSX — no TypeScript, no external UI libraries
- Google Fonts (Share Tech Mono · Crimson Text)
- Self-contained single component — all data and logic in `Dashboard.jsx`

---

## Running locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

---

## Deployment

Deployed via Vercel. Connected to this repository — pushes to `main` trigger automatic redeployment.

---

*Interplanetary Assembly · Information Systems Division · Node IA-CERES-07 · Status: Nominal*