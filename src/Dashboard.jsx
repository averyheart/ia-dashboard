import { useState, useMemo } from "react";

// ─── COLOUR HELPERS ──────────────────────────────────────────────────────────
const BLOC_META = {
  TLC:    { color: "#4a9eff", accent: "#0a1830", gband: "G1",  grange: "0.9–1.0g",    orbitX: 18,  orbitY: 50 },
  MF:     { color: "#e05a3a", accent: "#200800", gband: "G2",  grange: "0.38–0.8g",   orbitX: 30,  orbitY: 50 },
  BCC:    { color: "#b0b0b0", accent: "#181818", gband: "G3",  grange: "0.3–0.6g",    orbitX: 46,  orbitY: 50 },
  JFA:    { color: "#f0a030", accent: "#1a0e00", gband: "G3",  grange: "0.6–1.0g",    orbitX: 62,  orbitY: 50 },
  SatCon: { color: "#c8a860", accent: "#1a1400", gband: "G2",  grange: "0.3–0.7g",    orbitX: 78,  orbitY: 50 },
};

// ─── DATA ────────────────────────────────────────────────────────────────────

const BLOCS = [
  {
    id: "TLC", name: "Terran–Lunar Commonwealth",
    tagline: "Sovereign Consortium · Bureaucratic Authority · Inner System Anchor",
    mantra: '"We endure by order."',
    population: "~10–12 billion",
    currency: { name: "Terran Standard Credit (TSC)", slang: "Creds / Standards / Bluebacks" },
    governance: "Global Parliament Assembly (GPA) + Lunar Administrative Council (LAC)",
    identity: "Polite, image-conscious, diplomacy-driven. Rising youth and interplanetary identity tension.",
    pillars: ["Finance & banking (Earth/Eros)", "R&D & aerospace (Luna)", "Orbital construction", "NEO resource extraction", "Cultural exports"],
    weaknesses: ["Food imports from JFA", "Water & volatiles from BCC", "Advanced science reliant on SatCon"],
    factions: ["Corporate Bloc (dominant)", "New Earth Alliance", "Lunar Progressives", "Reform Cohort"],
    militaryDoc: "Commonwealth Defence Network (CDN) — diplomacy-first; sanctions & legal enforcement over conflict.",
    occs: [
      { id: "TLC-0048", body: "4 Vesta", name: "Vesta Joint Development Charter", purpose: "Industrial expansion, metals, robotics", status: "Highly Contested", notes: "Primary rival claimants: MF, BCC. TLC megacorp-backed." },
      { id: "ECA", body: "433 Eros", name: "Eros Commercial Accords", purpose: "Financial freeport, tax treaties, bonded warehouses", status: "Stable", notes: "Hosts major banking guilds and arbitration courts." },
      { id: "JSRT", body: "3 Juno", name: "Juno Scientific Retainer Treaty", purpose: "High-energy physics & exobiology", status: "Stable", notes: "Diplomatically sensitive; SatCon monitors closely." },
      { id: "PMC", body: "16 Psyche", name: "Psyche Metals Concession", purpose: "Metallic ore extraction", status: "Stable", notes: "Widely criticised for exploitative labour frameworks." },
      { id: "GRGM", body: "1036 Ganymed", name: "Ganymed Relay Governance Mandate", purpose: "Navigation relay & transit authority", status: "Technically Stable", notes: "Frequent MF interference incidents." },
    ],
    conflicts: [
      { zone: "2 Pallas (MF OCC)", nature: "Orbital militarisation vs corporate development", risk: "High" },
      { zone: "511 Davida (BCC OCC)", nature: "Debt liability disputes", risk: "Medium" },
      { zone: "624 Hektor (JFA OCC)", nature: "Alleged TLC data interference", risk: "Medium" },
      { zone: "153 Hilda (JFA OCC)", nature: "Trade tariff disagreement", risk: "Low–Medium" },
    ],
  },
  {
    id: "MF", name: "Martian Federation",
    tagline: "Sovereign Polity · Expeditionary Culture · Mid-Gravity Adapted",
    mantra: '"Mars endures."',
    population: "~152 million (Mars surface + Phobos, Deimos, orbitals)",
    currency: { name: "Martian RedMark (MRM)", slang: "Reds / Marks / Ironbacks" },
    governance: "Federal Assembly of Mars (FAM) + Executive Command Council (ECC) — joint civil–military authority",
    identity: "Disciplined, independent, suspicious of Inner System influence. Strong pioneering and terraforming pride.",
    pillars: ["Engineering & robotics", "Terraforming industry", "Minerals & metals", "Orbital shipyards (Deimos)", "Military manufacturing"],
    weaknesses: ["Food imports from JFA", "Water imports from BCC", "TLC financial network dependency"],
    factions: ["Terraforming Directorate", "Orbital Defence Command", "Red Line Militarists", "Civilian Reform Assembly"],
    militaryDoc: "Red Line Strategic Perimeter Doctrine — deterrence through strength and rapid deployment. Assets: Orbital Command Fleet, Surface Defence Grid, Phobos Tactical Lenses.",
    occs: [
      { id: "PFAD", body: "2 Pallas", name: "Pallas Forward Authority Directive", purpose: "Military-forward operations & resource extraction", status: "Active, Diplomatically Contested", notes: "Anchors the Red Line defensive perimeter. TLC & BCC strongly object." },
      { id: "LEP", body: "21 Lutetia", name: "Lutetia Expansion Protocol", purpose: "Industrial hub & logistics node", status: "Stable", notes: "Optimised for Mars-bound freight. BCC activity monitored closely." },
      { id: "JTDM", body: "89 Julia", name: "Julia Terraformic Development Mandate", purpose: "Experimental terraforming research", status: "Stable, High-Security", notes: "Criticised by SatCon for ethical concerns. Prestige R&D centre." },
    ],
    conflicts: [
      { zone: "4 Vesta (TLC OCC)", nature: "Sphere-of-influence clash; Terran 'militarised commerce'", risk: "High" },
      { zone: "Koronis Worker Bloc (BCC OCC)", nature: "Transit rights & ideological friction", risk: "Medium" },
      { zone: "624 Hektor (JFA OCC)", nature: "Surveillance range overlaps MF security", risk: "Medium–High" },
      { zone: "Priamus Outer Guard (JFA OCC)", nature: "JFA naval posture vs Red Line safety buffers", risk: "Low–Medium" },
    ],
  },
  {
    id: "BCC", name: "Belt Cooperative Compact",
    tagline: "Cooperative Federation · Labour Sovereignty · Resource Critical",
    mantra: '"We survive together."',
    population: "~38–45 million (distributed across Belt habitats)",
    currency: { name: "Belt Mutual Token (BMT)", slang: "Mutes / Tokens / Rockbits" },
    governance: "Belt Syndicate Assembly + station militias + cooperative councils (Ceres-centred)",
    identity: "Pragmatic, community-bound, anti-authority. Strongest self-determination movement in the system.",
    pillars: ["Water ice & volatiles (liquid hydrogen, deuterium)", "Metals extraction & shipbreaking", "Life-support exports", "Mid-Belt refineries"],
    weaknesses: ["Governance fragmentation", "Susceptible to tariffs & blockades", "Reliant on JFA & SatCon for food & science"],
    factions: ["Syndicalists", "Freehold Independents", "Progressive Belters", "Moderates"],
    militaryDoc: "Defensive ambush tactics, low-G specialist combat, harassment of larger ships. Station militias, cooperative defence coalitions, patrol skiffs.",
    occs: [
      { id: "DCSA", body: "511 Davida", name: "Davida Collective Stewardship Accord", purpose: "Refuge colony & cooperative mining", status: "Stable — Financially Strained", notes: "Key site for displaced Belter populations. Heavy TLC debt leverage impacts autonomy." },
      { id: "UMPC", body: "375 Ursula", name: "Ursula Mutual Protection Charter", purpose: "Cooperative defence & protection hub", status: "Stable", notes: "Symbol of Belt solidarity. Subject to TLC cargo interference." },
      { id: "KWAC", body: "Koronis", name: "Koronis Worker Assembly Compact", purpose: "Labour centre & industrial hub", status: "Stable — Politically Tense", notes: "MF accuses it of disrupting military lanes." },
      { id: "MAC", body: "758 Mancunia", name: "Mancunia Autonomous Communiqué", purpose: "Individualist enclave; reluctant BCC affiliate", status: "Unstable", notes: "Threatens secession regularly. Distrusts all major blocs." },
    ],
    conflicts: [
      { zone: "4 Vesta (TLC OCC)", nature: "Labour exploitation & resource monopolisation", risk: "High" },
      { zone: "2 Pallas (MF OCC)", nature: "MF militarisation in Belt territory", risk: "Medium–High" },
      { zone: "Hektor Trojan Region (JFA OCCs)", nature: "Jovian overreach into former Belt mining claims", risk: "Medium" },
      { zone: "Psyche Metals Concession (TLC OCC)", nature: "Demands for fair ore profit redistribution", risk: "Medium" },
    ],
  },
  {
    id: "JFA", name: "Jovian Federal Alliance",
    tagline: "Sovereign Consortium · Scientific Mandate · Radiation-Conditioned",
    mantra: '"We feed the system."',
    population: "~121–125 million (Ganymede, Europa, Callisto, Io + orbitals)",
    currency: { name: "Jovian Helion Unit (JHU)", slang: "Helions / J-Hus / Brights" },
    governance: "Pan-Jovian Federal Council (PJFC) + Great Moons Administrative Triumvirate (Ganymede, Europa, Callisto Directorates)",
    identity: "Structured, technocratic, collectivist. Food-culture pride and multi-moon poly-systems heritage.",
    pillars: ["Food production (60–70% system-wide)", "He-3 atmospheric skimming (w/ SatCon)", "Shipbuilding & logistics (Callisto)", "Geothermal energy (Io)"],
    weaknesses: ["Vulnerable to blockades at food relay points", "High energy demands for habitat climate control", "Political overextension into Belt"],
    factions: ["Pan-Jovian Federal Council majority", "Freight Guilds", "Agricultural Cooperatives", "Energy Corporations"],
    militaryDoc: "Convoy Protection First doctrine. Assets: Convoy Defence Fleets, Trojan Patrol Squadrons, Callisto Shipyards, Europa Cybergrids.",
    occs: [
      { id: "H-FOR", body: "624 Hektor", name: "Hektor Federal Operations Registry", purpose: "Trojan monitoring & logistics anchoring", status: "Stable — Conflict-Prone", notes: "Illegal BCC mining nearby. MF accuses JFA of surveillance overreach." },
      { id: "OARC", body: "1143 Odysseus", name: "Odysseus Agricultural Relay Convention", purpose: "Storage & redistribution of food exports", status: "Stable", notes: "Critical for feeding TLC & MF. Frequent TLC corporate interference attempts." },
      { id: "HSTG", body: "153 Hilda", name: "Hilda Stability & Transit Guarantee", purpose: "Stabilising Belt–Jovian transit routes", status: "Stable", notes: "SatCon scientific encroachment creates tension. Key energy reserve stop." },
      { id: "POPD", body: "884 Priamus", name: "Priamus Outer Perimeter Directive", purpose: "Perimeter watchstation for JFA security", status: "Stable — Sensitive", notes: "MF probes detected in region. Central to monitoring Red Line movements." },
    ],
    conflicts: [
      { zone: "4 Vesta (TLC OCC)", nature: "TLC pricing & transit tariffs harm Jovian food convoys", risk: "Medium" },
      { zone: "2 Pallas (MF OCC)", nature: "MF militarisation destabilises Trojan convoy lanes", risk: "Medium–High" },
      { zone: "Mid-Belt Relays", nature: "Historical logistics rights vs BCC & TLC competition", risk: "Medium" },
      { zone: "Outer Belt Research Sites (SatCon)", nature: "SatCon probes infringe on JFA convoy space", risk: "Low–Medium" },
    ],
  },
  {
    id: "SatCon", name: "Saturnian Concord",
    tagline: "Sovereign Forum · Ethical Governance · Cryogenic Research Mandate",
    mantra: '"Knowledge in Service."',
    population: "~79–83 million (Titan, Enceladus, Rhea + ring habitats)",
    currency: { name: "Saturnian Solvency Note (SSN)", slang: "Solves / Notes / Frostmarks" },
    governance: "Assembly of Titan (AoT) + Enceladus Cryo-Accords Board (ECAB) + Rhea Engineering Consortium (REC)",
    identity: "Calm, introspective, consensus-oriented. Evidence-first; speed is seen as reckless.",
    pillars: ["Advanced AI & robotics", "Biotech & cryobiology", "He-3 skimming from Saturn (w/ JFA)", "Precision instruments & sensor grids", "Astronomical systems"],
    weaknesses: ["Food imports required", "High-value research attracts espionage", "Minimal offensive capacity"],
    factions: ["Consensus Bloc (majority)", "Titan Realists", "Cryo-Preservationists", "Rhea Engineers"],
    militaryDoc: "Preservation Over Power doctrine. Assets: AI Ethical Grids, Cryo-Fog Arrays, Probe-Swarm Guardians, Rhea Sensor Lines (best early-warning system-wide).",
    occs: [
      { id: "VDSC", body: "20000 Varuna", name: "Varuna Deep-Sky Charter", purpose: "Far-out observatory & gravitational anomaly research", status: "Stable", notes: "Joint oversight with OSC legacy arrangements. MF suspects recon applications (unproven)." },
      { id: "PSBM", body: "3200 Phaethon", name: "Phaethon Solar Behaviour Mandate", purpose: "Solar flare modelling & heliophysics research", status: "Stable", notes: "Critical radiation-warning system for the entire Solar System. TLC corporate attempts to privatise early-access data." },
      { id: "CRAA", body: "10199 Chariklo", name: "Chariklo Rings Analysis Accord", purpose: "Micro-ring formation & material science research", status: "Prestige OCC", notes: "Deep cultural symbolism for the Concord. Data restrictions during political tensions." },
      { id: "ACRT", body: "8405 Asbolus", name: "Asbolus Cryogenic Research Treaty", purpose: "Cryo-organism simulation & deep-cold material physics", status: "Stable", notes: "Shared with select universities system-wide. Occasional espionage attempts." },
    ],
    conflicts: [
      { zone: "153 Hilda (JFA OCC)", nature: "JFA limits scientific access to preserve logistical dominance", risk: "Low–Medium" },
      { zone: "Outer Belt Cryo-Probes", nature: "MF/TLC activity disrupts probe trajectories", risk: "Low" },
      { zone: "Pallas Data Corridor (MF Zone)", nature: "Militarisation threatens delicate scientific equipment", risk: "Low–Medium" },
      { zone: "Chariklo Drift Region", nature: "OSC legacy vessels interfere with ring-anomaly sensors", risk: "Low" },
    ],
  },
];

// Tension matrix: [fromBloc][toBloc] = { level: 0-4, label, note }
// 0=Cooperative, 1=Friction, 2=Contested, 3=Tense, 4=Critical
const TENSION = {
  TLC: {
    MF:     { level: 3, label: "Tense",      note: "Sphere-of-influence clashes; 2 Pallas militarisation; 'old-world drag' vs 'red ambition'." },
    BCC:    { level: 4, label: "Critical",   note: "Sharpest class tension in the system. Debt leverage, labour exploitation, resource monopolisation." },
    JFA:    { level: 2, label: "Contested",  note: "Transit tariffs harm Jovian food convoys; Hektor data interference allegations." },
    SatCon: { level: 1, label: "Friction",   note: "TLC corporate attempts to privatise SatCon early-access radiation data." },
  },
  MF: {
    TLC:    { level: 3, label: "Tense",      note: "Inner system foundational tension; Red Line security vs TLC corporate expansion." },
    BCC:    { level: 3, label: "Tense",      note: "Territorial & ideological friction. 'The red creep' vs 'cooperative chaos'." },
    JFA:    { level: 2, label: "Contested",  note: "Hektor surveillance overlap; Priamus perimeter encroachment." },
    SatCon: { level: 1, label: "Friction",   note: "Militarisation threatens SatCon's delicate scientific equipment. Pallas Data Corridor friction." },
  },
  BCC: {
    TLC:    { level: 4, label: "Critical",   note: "Registry rules, hollow promises, exploitative labour at Psyche. Deepest systemic grievance." },
    MF:     { level: 3, label: "Tense",      note: "'The red creep'. MF militarisation in Belt territory. No binding BCC authority to negotiate with." },
    JFA:    { level: 2, label: "Contested",  note: "Jovian overreach into former Belt mining claims around Hektor Trojans." },
    SatCon: { level: 0, label: "Cooperative", note: "No significant active disputes. BCC relies on SatCon scientific technology." },
  },
  JFA: {
    TLC:    { level: 2, label: "Contested",  note: "Food convoy tariff pressure; TLC corporate interference at Odysseus relay." },
    MF:     { level: 2, label: "Contested",  note: "Trojan convoy lane destabilisation; Priamus perimeter tension." },
    BCC:    { level: 2, label: "Contested",  note: "Illegal BCC mining near Hektor; historical Belt mining claim disputes." },
    SatCon: { level: 1, label: "Friction",   note: "The outer system's quiet rivalry. 'The slow answer' vs 'yield without wisdom'. He-3 handshake awareness." },
  },
  SatCon: {
    TLC:    { level: 1, label: "Friction",   note: "Research data privatisation attempts; Juno compliance monitoring." },
    MF:     { level: 1, label: "Friction",   note: "89 Julia terraforming ethics concerns; Pallas corridor instrument risks." },
    BCC:    { level: 0, label: "Cooperative", note: "Broadly cooperative; BCC relies on SatCon science & technology imports." },
    JFA:    { level: 1, label: "Friction",   note: "Scientific access disputes at Hilda; Chariklo drift navigational friction." },
  },
};

const GBAND_TABLE = [
  { band: "G1", range: "0.9–1.1g", natives: "Terrans, Luna AG, inner-system habitats", baseline: "Dense skeletal mass, strong cardiovascular output. High susceptibility to microgravity deconditioning.", inward: "Native", outward: "Routine — deconditioning risk on extended low-G exposure", outwardLevel: "routine" },
  { band: "G2", range: "0.6–0.9g", natives: "Martians, Titanians, major hab-ring environments", baseline: "Moderated bone density, efficient vascular adaptation. Manageable long-term with standard IHC protocols.", inward: "Medically supervised — 6–12 month acclimation", outward: "Easy", outwardLevel: "easy" },
  { band: "G3", range: "0.3–0.6g", natives: "Belters, Cereans, Jovian AG zones", baseline: "Lower musculoskeletal mass, high metabolic efficiency. High tolerance for AG cycling.", inward: "Restricted — full screening, 12–18 month acclimation, possible exoskeletal assist", outward: "Easy", outwardLevel: "easy" },
  { band: "G4", range: "0.05–0.3g", natives: "Long-term Belters, outer AG habitats", baseline: "Extreme low-G adaptation. High downwell collapse risk. Cannot safely function at G1.", inward: "Severely restricted — medically expensive, rare", outward: "Routine", outwardLevel: "routine" },
  { band: "G5", range: "Micro-G", natives: "Frontier rotation crew, deep-space crews", baseline: "Extreme adaptability. Highest downwell collapse risk. LTAM booster cycles required. No generational baselines under TKA statute.", inward: "Prohibited without full LTAM programme", outward: "Routine", outwardLevel: "routine" },
];

// ─── SMALL COMPONENTS ────────────────────────────────────────────────────────

const mono = "'Share Tech Mono', monospace";
const serif = "'Crimson Text', serif";

// ─── COLOUR CONSTANTS ────────────────────────────────────────────────────────
const C = {
  // Bloc colours
  tlc:     "#4a9eff",
  mf:      "#e05a3a",
  bcc:     "#b0b0b0",
  jfa:     "#f0a030",
  satcon:  "#c8a860",

  // IA institutional
  ia:      "#50c8ff",

  // Risk / mobility / G-band scale
  rNone:   "#40c8a0",   // native / no restriction / green
  rLow:    "#c8b040",   // low–medium / routine outward
  rMed:    "#f0a030",   // medium / medically supervised
  rMedH:   "#e08030",   // medium–high / controlled
  rHigh:   "#e05a3a",   // high / restricted
  rProhib: "#c03020",   // prohibited / severe

  // Status
  stable:    "#40c8a0",
  contested: "#e05a3a",
  strained:  "#f0a030",

  // Tension matrix
  tCoop:    "#40c8a0",
  tFric:    "#c8b040",
  tCont:    "#f0a030",
  tTense:   "#e08030",
  tCrit:    "#e05a3a",

  // Text
  textPrimary:   "#d8d0c0",
  textSecondary: "#b0a898",
  textDim:       "#a0a0a0",
  textFaint:     "#888898",

  // Agency colours
  agIA:    "#6ab0ff",
  agINA:   "#f0c030",
  agICC:   "#50c8ff",
  agIEA:   "#60d860",
  agIHC:   "#e080c0",
  agIFE:   "#c8a040",
  agIJC:   "#e05a3a",
  agISA:   "#a060e0",
  agITC:   "#f0a030",
  agTKA:   "#80c8e0",
};


function Label({ children, style }) {
  return <div style={{ color: "#9090a8", fontSize: 11, letterSpacing: 2, fontFamily: mono, marginBottom: 3, textTransform: "uppercase", ...style }}>{children}</div>;
}

function riskColor(r) {
  if (!r) return C.textDim;
  const rl = r.toLowerCase();
  if (rl.includes("prohibit") || rl.includes("severe")) return C.rProhib;
  if (rl === "high" || rl === "critical") return C.rHigh;
  if (rl.includes("medium–high") || rl.includes("controlled")) return C.rMedH;
  if (rl.includes("medium")) return C.rMed;
  if (rl.includes("low–medium")) return C.rLow;
  return C.rNone;
}

function statusColor(s) {
  if (!s) return C.textDim;
  const sl = s.toLowerCase();
  if (sl.includes("unstable") || sl.includes("contested")) return C.contested;
  if (sl.includes("tense") || sl.includes("strained")) return C.strained;
  if (sl.includes("stable") || sl.includes("active")) return C.stable;
  return C.ia;
}

function tensionColor(level) {
  return [C.tCoop, C.tFric, C.tCont, C.tTense, C.tCrit][level] || C.textDim;
}

// ─── LOG-SCALE POSITION HELPER ────────────────────────────────────────────────
// Maps AU values to SVG x positions using log scale, range 4–96
const AU_MIN = 0.4, AU_MAX = 120;
function auToX(au) {
  const logMin = Math.log(AU_MIN), logMax = Math.log(AU_MAX);
  return 4 + ((Math.log(au) - logMin) / (logMax - logMin)) * 92;
}

// ─── SYSTEM MAP ───────────────────────────────────────────────────────────────

const MAP_NODES = [
  { id: "TLC",    label: "TLC", auMid: 1.0,  au: "0.0–1.6 AU",  note: "Earth (1.0 AU) · Luna · EL1–L5 · NEO Network",                          type: "bloc" },
  { id: "MF",     label: "MF",  auMid: 1.52, au: "1.5–2.0 AU",  note: "Mars (1.52 AU) · Phobos · Deimos · Hungaria Group",                      type: "bloc" },
  { id: "BCC",    label: "BCC", auMid: 2.77, au: "2.0–3.5 AU",  note: "Ceres (2.77 AU) · Vesta · Belt freeholds & cooperative stations",         type: "bloc" },
  { id: "JFA",    label: "JFA", auMid: 5.2,  au: "5.0–5.5 AU",  note: "Jupiter (5.2 AU) · Ganymede · Europa · Callisto · Io · Trojans",           type: "bloc" },
  { id: "SatCon", label: "SAT", auMid: 9.58, au: "9.0–10.0 AU", note: "Saturn (9.58 AU) · Titan · Enceladus · Rhea · Ring habitats",               type: "bloc" },
];

const ZONE_NODES = [
  {
    id: "IGSC", label: "IGSC", auMid: 22, au: "~19–30 AU", type: "zone", color: "#50c8ff",
    title: "Ice Giant Survey Corridor",
    classification: "INA Class-II Survey Zone",
    sub: [
      { id: "USZ", label: "USZ", auMid: 19.2, au: "~19 AU", note: "Uranus Survey Zone · no crewed outpost · robotic probes only" },
      { id: "NSZ", label: "NSZ", auMid: 30.1, au: "~30 AU", note: "Neptune Survey Zone · no crewed outpost · robotic probes only" },
    ],
    details: [
      "Uranus (USZ) and Neptune (NSZ) are classified as INA Class-II Survey Zones — charted but unserviced.",
      "No permanent traffic infrastructure, corridor designation, or emergency response capability.",
      "ISA maintains standing robotic probe research permits for both systems.",
      "No bloc OCC claims. No IA territorial dispute recorded.",
      "Vessels transiting must file waypoint telemetry with INA; no customs or consular obligations.",
      "USZ offers viable gravitational assist geometry; INA publishes IGSC slingshot schedules annually.",
      "Frontier crews informally call USZ and NSZ the Skipped Lords — 'passing the Lords' marks the psychological threshold between the Saturnian sphere and the true deep frontier.",
    ],
  },
  {
    id: "TKA", label: "TKA", auMid: 50, au: "30+ AU", type: "zone", color: "#50c8ff",
    title: "TKA Frontier — Trans-Kuiper Zone",
    classification: "TKA Treaty Zone — Non-Sovereign Frontier",
    sub: [],
    details: [
      "Governed by the Trans-Kuiper Accord (TKA) — neutral, non-sovereign framework.",
      "No bloc holds territorial sovereignty beyond Neptune.",
      "FarReach Gateway (FRG) at high Saturn orbit is the inner gate to the deep frontier.",
      "Kuiper Gateway Station (KGS) at ~100 AU is the outer coordination point.",
      "Big Six scientific sites: Pluto–Charon, Haumea, Makemake, Quaoar, Orcus–Vanth, Eris.",
      "Quaoar is the sole current holder of a TKA Residential Charter (TKARC).",
      "Frontier rotation: 36–60 months standard. No frontier citizenship exists.",
      "All residents retain home-bloc citizenship. Kuiper-born children inherit parents' nationality.",
    ],
  },
];

function SystemMap({ onSelectBloc, selectedBloc, onZoneChange, selectedZone }) {
  const handleZoneClick = (id) => onZoneChange(selectedZone === id ? null : id);
  const handleBlocClick = (id) => { onSelectBloc(selectedBloc === id ? null : id); onZoneChange(null); };

  const selectedZoneData = ZONE_NODES.find(z => z.id === selectedZone);
  const selectedBlocNode = MAP_NODES.find(n => n.id === selectedBloc);

  return (
    <div style={{ background: "#04060c", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 2, padding: "16px 20px", marginBottom: 16 }}>
      <Label>HELIOCENTRIC SYSTEM SCHEMATIC · INNER → OUTER</Label>
      <svg viewBox="0 0 104 22" style={{ width: "100%", height: 140, display: "block", marginTop: 6 }}>
        {/* Sun */}
        <circle cx={auToX(0.4)} cy="11" r="2.2" fill="#f0c030" opacity="0.9" />
        <text x={auToX(0.4)} y="18" textAnchor="middle" fill="#f0c03066" fontSize="1.7" fontFamily="Share Tech Mono, monospace">SOL</text>

        {/* Orbital rings */}
        {MAP_NODES.map((b, i) => {
          const x = auToX(b.auMid);
          return (
            <ellipse key={b.id} cx={auToX(0.4)} cy="11" rx={x - auToX(0.4)} ry={2.8 + i * 0.35}
              fill="none" stroke={selectedBloc === b.id ? BLOC_META[b.id].color : "rgba(255,255,255,0.04)"}
              strokeWidth={selectedBloc === b.id ? 0.35 : 0.15} strokeDasharray="0.8 0.8" />
          );
        })}

        {/* IGSC shaded band — only when selected */}
        {(() => {
          const sel = selectedZone === "IGSC";
          if (!sel) return null;
          const x1 = auToX(19), x2 = auToX(30);
          return (
            <rect x={x1} y="5" width={x2 - x1} height="12" fill="rgba(80,200,255,0.06)"
              stroke="rgba(80,200,255,0.2)" strokeWidth="0.2" strokeDasharray="0.6 0.4" rx="0.3" />
          );
        })()}

        {/* TKA zone shading — only when selected, starts cleanly after NSZ */}
        {(() => {
          const sel = selectedZone === "TKA";
          if (!sel) return null;
          const x1 = auToX(30.1) + 3, x2 = 104;
          return (
            <rect x={x1} y="5" width={x2 - x1} height="12" fill="rgba(80,200,255,0.04)"
              stroke="rgba(80,200,255,0.15)" strokeWidth="0.2" strokeDasharray="0.6 0.4" rx="0.3" />
          );
        })()}

        {/* Bloc nodes */}
        {MAP_NODES.map((b) => {
          const meta = BLOC_META[b.id];
          const sel = selectedBloc === b.id;
          const x = auToX(b.auMid);
          return (
            <g key={b.id} onClick={() => { handleBlocClick(b.id); onZoneChange(null); }} style={{ cursor: "pointer" }}>
              <circle cx={x} cy="11" r={sel ? 2.0 : 1.5}
                fill={sel ? meta.color : meta.color + "99"}
                stroke={sel ? meta.color : "transparent"} strokeWidth="0.3" />
              {sel && <circle cx={x} cy="11" r="3.2" fill="none" stroke={meta.color} strokeWidth="0.18" opacity="0.35" />}
              <text x={x} y="7.5" textAnchor="middle" fill={meta.color} fontSize="2.0"
                fontFamily="Share Tech Mono, monospace" opacity={sel ? 1 : 0.8}>{b.label}</text>
            </g>
          );
        })}

        {/* Zone nodes — USZ, NSZ, TKA marker */}
        {ZONE_NODES.map(z => {
          const sel = selectedZone === z.id;
          const x = auToX(z.auMid);
          if (z.id === "IGSC") {
            const uszX = auToX(z.sub[0].auMid), nszX = auToX(z.sub[1].auMid);
            return (
              <g key={z.id} onClick={() => { handleZoneClick(z.id); onSelectBloc(null); }} style={{ cursor: "pointer" }}>
                {/* Invisible full hit area covering the entire IGSC zone */}
                <rect x={uszX - 3} y="3" width={nszX - uszX + 6} height="16" fill="transparent" />
                <text x={(uszX + nszX) / 2} y="4.2" textAnchor="middle" fill={sel ? z.color : z.color + "55"}
                  fontSize="1.6" fontFamily="Share Tech Mono, monospace">IGSC</text>
                {/* USZ node */}
                <circle cx={uszX} cy="11" r={sel ? 1.6 : 1.2} fill={sel ? z.color + "22" : "transparent"}
                  stroke={sel ? z.color : z.color + "66"} strokeWidth="0.35" strokeDasharray={sel ? "none" : "0.5 0.3"} />
                <text x={uszX} y="8.5" textAnchor="middle" fill={sel ? z.color : z.color + "77"}
                  fontSize="1.7" fontFamily="Share Tech Mono, monospace">USZ</text>
                {/* NSZ node */}
                <circle cx={nszX} cy="11" r={sel ? 1.6 : 1.2} fill={sel ? z.color + "22" : "transparent"}
                  stroke={sel ? z.color : z.color + "66"} strokeWidth="0.35" strokeDasharray={sel ? "none" : "0.5 0.3"} />
                <text x={nszX} y="8.5" textAnchor="middle" fill={sel ? z.color : z.color + "77"}
                  fontSize="1.7" fontFamily="Share Tech Mono, monospace">NSZ</text>
              </g>
            );
          }
          // TKA — positioned with clear gap after NSZ
          return (
            <g key={z.id} onClick={() => { handleZoneClick(z.id); onSelectBloc(null); }} style={{ cursor: "pointer" }}>
              <rect x={78} y="3" width="18" height="16" fill="transparent" />
              <text x={78} y="8" fill={sel ? z.color : z.color + "88"}
                fontSize="1.8" fontFamily="Share Tech Mono, monospace">TKA</text>
              <text x={78} y="11" fill={sel ? z.color : z.color + "55"}
                fontSize="1.5" fontFamily="Share Tech Mono, monospace">FRONTIER</text>
            </g>
          );
        })}
      </svg>

      <div style={{ color: "#888898", fontSize: 11, fontFamily: mono, textAlign: "center", marginBottom: 8 }}>
        ☉ LOG-SCALE · click a bloc node or zone for details · orbital distances approximate
      </div>

      {/* Slim bar — same format for both blocs and zones */}
      {(selectedBloc || selectedZone) && (() => {
        if (selectedZone) {
          const z = selectedZoneData;
          return (
            <div style={{ border: `1px solid ${z.color}33`, borderLeft: `3px solid ${z.color}`, borderRadius: 2, padding: "10px 14px", background: "rgba(10,18,36,0.8)", fontFamily: mono, display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
              <span style={{ color: z.color, fontSize: 13 }}>{z.au}</span>
              <span style={{ color: "#aaaaaa", fontSize: 12 }}>{z.classification}</span>
            </div>
          );
        }
        const n = selectedBlocNode;
        const meta = BLOC_META[selectedBloc];
        return (
          <div style={{ border: `1px solid ${meta.color}33`, borderLeft: `3px solid ${meta.color}`, borderRadius: 2, padding: "10px 14px", background: `${meta.accent}aa`, fontFamily: mono, display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <span style={{ color: meta.color, fontSize: 13 }}>{n.au}</span>
            <span style={{ color: "#aaaaaa", fontSize: 12 }}>{n.note}</span>
          </div>
        );
      })()}
    </div>
  );
}

// ─── ZONE DETAIL CARD ─────────────────────────────────────────────────────────

function ZoneDetail({ zone }) {
  const z = zone;
  return (
    <div style={{ border: `1px solid ${z.color}44`, borderLeft: `3px solid ${z.color}`, borderRadius: 2, padding: 16, background: "rgba(10,18,36,0.7)", marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div>
          <span style={{ fontFamily: mono, color: z.color, fontSize: 13, letterSpacing: 2 }}>[{z.id}]</span>
          <div style={{ fontFamily: serif, fontSize: 20, color: "#f0ece4", marginTop: 2 }}>{z.title}</div>
          <div style={{ fontFamily: mono, fontSize: 11, color: "#a0a0a0", marginTop: 2 }}>{z.classification}</div>
        </div>
        <div style={{ textAlign: "right", fontFamily: mono }}>
          <div style={{ color: z.color, fontSize: 13 }}>{z.au}</div>
          {z.sub.length > 0 && (
            <div style={{ marginTop: 4 }}>
              {z.sub.map(s => (
                <div key={s.id} style={{ color: "#a0a0a0", fontSize: 11 }}>{s.label} · {s.au}</div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 10 }}>
        {z.details.map((d, i) => (
          <div key={i} style={{ color: "#aaa8b0", fontFamily: mono, fontSize: 12, padding: "3px 0", lineHeight: 1.5 }}>
            › {d}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TRADE DEPENDENCY PANEL ───────────────────────────────────────────────────

function TradeDependencyPanel() {
  const deps = [
    { from: "TLC", to: "JFA", what: "Food (primary importer)", critical: true },
    { from: "TLC", to: "BCC", what: "Water & volatiles (primary importer)", critical: true },
    { from: "TLC", to: "SatCon", what: "Advanced science & AI", critical: false },
    { from: "MF",  to: "JFA", what: "Food (primary importer)", critical: true },
    { from: "MF",  to: "BCC", what: "Water during shortages", critical: false },
    { from: "MF",  to: "TLC", what: "Earth–Mars transit cooperation", critical: false },
    { from: "BCC", to: "JFA", what: "Food imports", critical: true },
    { from: "BCC", to: "SatCon", what: "Scientific technology", critical: false },
    { from: "JFA", to: "TLC", what: "Food exports (60–70% system-wide)", critical: true },
    { from: "JFA", to: "MF",  what: "Food exports", critical: true },
    { from: "JFA", to: "SatCon", what: "He-3 skimming coordination (shared)", critical: false },
    { from: "SatCon", to: "JFA", what: "He-3 skimming (shared supply)", critical: false },
    { from: "SatCon", to: "All", what: "Food imports (SatCon is net importer)", critical: true },
    { from: "BCC", to: "All",  what: "Water & volatiles supply (system-critical)", critical: true },
  ];

  const grouped = {};
  deps.forEach(d => {
    if (!grouped[d.from]) grouped[d.from] = [];
    grouped[d.from].push(d);
  });

  return (
    <div style={{ background: "#04060c", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 2, padding: 16, marginBottom: 16 }}>
      <Label style={{ marginBottom: 12 }}>SYSTEM RESOURCE DEPENDENCY MAP · IFE REFERENCE · ITC TRADE REGISTRY</Label>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
        {Object.entries(grouped).map(([from, items]) => {
          const meta = BLOC_META[from] || { color: "#b0b0b0" };
          return (
            <div key={from} style={{ borderLeft: `2px solid ${meta.color}55`, paddingLeft: 10 }}>
              <div style={{ color: meta.color, fontFamily: mono, fontSize: 12, letterSpacing: 1, marginBottom: 6 }}>{from}</div>
              {items.map((d, i) => (
                <div key={i} style={{ display: "flex", gap: 6, alignItems: "flex-start", marginBottom: 4 }}>
                  <span style={{ color: d.critical ? "#e05a3a" : "#a0a0a0", fontSize: 12, marginTop: 1 }}>{d.critical ? "●" : "○"}</span>
                  <div>
                    <span style={{ color: "#aaa8b0", fontFamily: mono, fontSize: 12 }}>{d.to !== "All" ? (BLOC_META[d.to]?.color ? <span style={{ color: BLOC_META[d.to].color }}>{d.to}</span> : d.to) : <span style={{ color: "#b0b0b0" }}>SYSTEM</span>}</span>
                    <span style={{ color: "#9090a0", fontFamily: mono, fontSize: 12 }}> — {d.what}</span>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 10, display: "flex", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ color: "#e05a3a", fontSize: 12 }}>●</span><span style={{ color: "#909090", fontFamily: mono, fontSize: 11 }}>Critical dependency</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ color: "#a0a0a0", fontSize: 12 }}>○</span><span style={{ color: "#909090", fontFamily: mono, fontSize: 11 }}>Significant dependency</span></div>
      </div>
    </div>
  );
}

// ─── TENSION MATRIX ───────────────────────────────────────────────────────────

function TensionMatrix() {
  const [selected, setSelected] = useState(null);
  const blocs = ["TLC", "MF", "BCC", "JFA", "SatCon"];

  const handleClick = (key) => setSelected(selected === key ? null : key);

  return (
    <div style={{ background: "#04060c", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 2, padding: 16 }}>
      <Label style={{ marginBottom: 12 }}>INTER-BLOC TENSION MATRIX · IA COUNCIL OF SYSTEMS AFFAIRS · CLICK CELL TO EXPAND</Label>
      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", width: "100%", fontFamily: mono, fontSize: 13 }}>
          <thead>
            <tr>
              <td style={{ padding: "6px 10px", color: "#888898", fontSize: 11 }}>FROM ↓ TO →</td>
              {blocs.map(b => (
                <td key={b} style={{ padding: "6px 10px", color: BLOC_META[b].color, textAlign: "center", fontSize: 12, letterSpacing: 1 }}>{b}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            {blocs.map(from => (
              <tr key={from}>
                <td style={{ padding: "6px 10px", color: BLOC_META[from].color, fontSize: 12, letterSpacing: 1, whiteSpace: "nowrap" }}>{from}</td>
                {blocs.map(to => {
                  if (from === to) return (
                    <td key={to} style={{ padding: "6px 10px", textAlign: "center", background: "rgba(255,255,255,0.02)" }}>
                      <span style={{ color: "#888898" }}>—</span>
                    </td>
                  );
                  const t = TENSION[from]?.[to];
                  const key = `${from}-${to}`;
                  const isSel = selected === key;
                  return (
                    <td key={to}
                      onClick={() => handleClick(key)}
                      style={{ padding: "6px 10px", textAlign: "center", cursor: "pointer",
                        background: isSel ? `${tensionColor(t?.level)}18` : "transparent",
                        outline: isSel ? `1px solid ${tensionColor(t?.level)}55` : "none",
                        transition: "background 0.15s" }}>
                      <div style={{ color: tensionColor(t?.level), fontSize: 13, fontWeight: 600 }}>{t?.level ?? "?"}</div>
                      <div style={{ color: tensionColor(t?.level), fontSize: 8, opacity: 0.7 }}>{t?.label}</div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Click-to-expand detail panel */}
      {selected && (() => {
        const [from, to] = selected.split("-");
        const t = TENSION[from]?.[to];
        if (!t) return null;
        const fMeta = BLOC_META[from], tMeta = BLOC_META[to];
        return (
          <div style={{ marginTop: 12, padding: "12px 16px", border: `1px solid ${tensionColor(t.level)}44`, borderLeft: `3px solid ${tensionColor(t.level)}`, borderRadius: 2, background: `${tensionColor(t.level)}06` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontFamily: mono, fontSize: 13 }}>
                <span style={{ color: fMeta.color }}>{from}</span>
                <span style={{ color: "#909090" }}> → </span>
                <span style={{ color: tMeta.color }}>{to}</span>
              </div>
              <div style={{ color: tensionColor(t.level), fontFamily: mono, fontSize: 12, letterSpacing: 1 }}>
                LEVEL {t.level} · {t.label.toUpperCase()}
              </div>
            </div>
            <div style={{ color: "#b8b0a8", fontFamily: mono, fontSize: 13, lineHeight: 1.6 }}>{t.note}</div>
          </div>
        );
      })()}

      <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
        {[0,1,2,3,4].map(l => (
          <div key={l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: 1, background: tensionColor(l) }} />
            <span style={{ color: "#a0a0a0", fontSize: 11, fontFamily: mono }}>{l} — {["Cooperative","Friction","Contested","Tense","Critical"][l]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── BLOC DETAIL ──────────────────────────────────────────────────────────────

function BlocDetail({ bloc }) {
  const [subtab, setSubtab] = useState("overview");
  const meta = BLOC_META[bloc.id];
  const tabs = ["overview", "OCCs", "conflicts"];

  return (
    <div style={{ border: `1px solid ${meta.color}44`, borderLeft: `3px solid ${meta.color}`, borderRadius: 2, padding: 16, background: `${meta.accent}aa`, marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div>
          <span style={{ fontFamily: mono, color: meta.color, fontSize: 13, letterSpacing: 2 }}>[{bloc.id}]</span>
          <div style={{ fontFamily: serif, fontSize: 21, color: "#f0ece4", marginTop: 2 }}>{bloc.name}</div>
          <div style={{ fontFamily: mono, fontSize: 12, color: "#aaaaaa", marginTop: 2 }}>{bloc.tagline}</div>
        </div>
        <div style={{ textAlign: "right", fontFamily: mono }}>
          <div style={{ color: meta.color, fontSize: 13 }}>{meta.gband}</div>
          <div style={{ color: "#909090", fontSize: 11, marginTop: 1 }}>{meta.grange}</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 0, marginBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setSubtab(t)} style={{
            background: "transparent", border: "none",
            borderBottom: subtab === t ? `2px solid ${meta.color}` : "2px solid transparent",
            color: subtab === t ? meta.color : "#909090",
            fontFamily: mono, fontSize: 11, letterSpacing: 2,
            padding: "6px 14px", cursor: "pointer", textTransform: "uppercase"
          }}>{t}</button>
        ))}
      </div>

      {subtab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <Label>POPULATION</Label>
            <div style={{ color: "#d8d0c0", fontFamily: mono, fontSize: 13, marginBottom: 10 }}>{bloc.population}</div>
            <Label>CURRENCY</Label>
            <div style={{ color: "#d8d0c0", fontFamily: mono, fontSize: 13 }}>{bloc.currency.name}</div>
            <div style={{ color: "#aaaaaa", fontFamily: mono, fontSize: 12, marginBottom: 10 }}>{bloc.currency.slang}</div>
            <Label>GOVERNANCE</Label>
            <div style={{ color: "#d8d0c0", fontFamily: mono, fontSize: 13, lineHeight: 1.5, marginBottom: 10 }}>{bloc.governance}</div>
            <Label>IDENTITY</Label>
            <div style={{ color: "#b8b0a8", fontFamily: mono, fontSize: 13, lineHeight: 1.5, marginBottom: 10 }}>{bloc.identity}</div>
            <Label>MANTRA</Label>
            <div style={{ color: meta.color, fontFamily: mono, fontSize: 13 }}>{bloc.mantra}</div>
          </div>
          <div>
            <Label>ECONOMIC PILLARS</Label>
            {bloc.pillars.map((p, i) => <div key={i} style={{ color: "#b8b0a8", fontFamily: mono, fontSize: 13, padding: "2px 0" }}>› {p}</div>)}
            <div style={{ marginTop: 10 }} />
            <Label>STRATEGIC WEAKNESSES</Label>
            {bloc.weaknesses.map((w, i) => <div key={i} style={{ color: "#d07060", fontFamily: mono, fontSize: 13, padding: "2px 0" }}>✕ {w}</div>)}
            <div style={{ marginTop: 10 }} />
            <Label>INTERNAL FACTIONS</Label>
            {bloc.factions.map((f, i) => <div key={i} style={{ color: "#aaaabc", fontFamily: mono, fontSize: 13, padding: "2px 0" }}>· {f}</div>)}
            <div style={{ marginTop: 10 }} />
            <Label>MILITARY/SECURITY POSTURE</Label>
            <div style={{ color: "#aaaabc", fontFamily: mono, fontSize: 12, lineHeight: 1.5 }}>{bloc.militaryDoc}</div>
          </div>
        </div>
      )}

      {subtab === "OCCs" && (
        <div>
          <Label style={{ marginBottom: 10 }}>CONFIRMED OVERRANGE COLONIAL CHARTERS</Label>
          {bloc.occs.map((occ, i) => (
            <div key={i} style={{ marginBottom: 10, borderLeft: `2px solid ${meta.color}44`, paddingLeft: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <span style={{ color: meta.color, fontFamily: mono, fontSize: 12 }}>[{occ.id}]</span>
                  <span style={{ color: "#e0d8cc", fontFamily: serif, fontSize: 15, marginLeft: 8 }}>{occ.body} — {occ.name}</span>
                </div>
                <span style={{ color: statusColor(occ.status), fontFamily: mono, fontSize: 11, letterSpacing: 1, whiteSpace: "nowrap", marginLeft: 10 }}>● {occ.status}</span>
              </div>
              <div style={{ color: "#b8b0a8", fontFamily: mono, fontSize: 13, marginTop: 3 }}>{occ.purpose}</div>
              <div style={{ color: "#a0a0a0", fontFamily: mono, fontSize: 12, marginTop: 3, lineHeight: 1.5 }}>⚑ {occ.notes}</div>
            </div>
          ))}
        </div>
      )}

      {subtab === "conflicts" && (
        <div>
          <Label style={{ marginBottom: 10 }}>DISPUTED ZONES & CONFLICT POSITIONS</Label>
          {bloc.conflicts.map((c, i) => (
            <div key={i} style={{ marginBottom: 10, display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "start", borderBottom: "1px solid rgba(255,255,255,0.04)", paddingBottom: 10 }}>
              <div>
                <div style={{ color: "#d8d0c0", fontFamily: mono, fontSize: 13 }}>{c.zone}</div>
                <div style={{ color: "#aaa8b0", fontFamily: mono, fontSize: 13, marginTop: 2 }}>{c.nature}</div>
              </div>
              <div style={{ color: riskColor(c.risk), fontFamily: mono, fontSize: 12, textAlign: "right", whiteSpace: "nowrap" }}>
                RISK: {c.risk}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── GRAVITY TABLE ────────────────────────────────────────────────────────────

function GravityTable() {
  const [sel, setSel] = useState(null);
  return (
    <div>
      <Label style={{ marginBottom: 12 }}>IHC G-BAND CLASSIFICATION · LTAM CROSS-GRAVITY COMPATIBILITY FRAMEWORK</Label>
      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", width: "100%", fontFamily: mono, fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              {["Band", "Range", "Native Populations", "Inward Travel (→G1)", "Outward Travel (→G5)"].map(h => (
                <th key={h} style={{ padding: "8px 12px", color: "#a0a0a0", fontSize: 11, letterSpacing: 2, textAlign: "left", fontWeight: "normal" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {GBAND_TABLE.map((row, i) => {
              const isOpen = sel === row.band;
              const bandColor = ["#50c8ff","#f0a030","#f0a030","#e05a3a","#b0b0b0"][i];
              return (
                <>
                  <tr key={row.band} onClick={() => setSel(isOpen ? null : row.band)}
                    style={{ cursor: "pointer", background: isOpen ? "rgba(255,255,255,0.03)" : "transparent", borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.15s" }}>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{ color: bandColor, fontWeight: 600 }}>{row.band}</span>
                    </td>
                    <td style={{ padding: "10px 12px", color: "#d8d0c0" }}>{row.range}</td>
                    <td style={{ padding: "10px 12px", color: "#b8b0a8" }}>{row.natives}</td>
                    <td style={{ padding: "10px 12px", color: row.inward.toLowerCase().includes("prohibit") ? C.rProhib : row.inward.toLowerCase().includes("severe") ? C.rHigh : row.inward.toLowerCase().includes("restrict") ? C.rMedH : row.inward.toLowerCase().includes("medic") ? C.rMed : C.rNone }}>
                      {row.inward.split(" — ")[0]}
                    </td>
                    <td style={{ padding: "10px 12px", color: row.outwardLevel === "easy" ? C.rNone : C.rLow }}>{row.outward.split(" — ")[0]}</td>
                  </tr>
                  {isOpen && (
                    <tr key={`${row.band}-detail`}>
                      <td colSpan={5} style={{ padding: "0 12px 14px 24px", background: "rgba(0,0,0,0.2)" }}>
                        <div style={{ color: "#b8b0a8", fontFamily: mono, fontSize: 13, lineHeight: 1.6, borderLeft: `2px solid ${bandColor}44`, paddingLeft: 12, marginTop: 8 }}>
                          <div style={{ marginBottom: 6 }}><span style={{ color: "#a0a0a0" }}>BASELINE: </span>{row.baseline}</div>
                          <div style={{ marginBottom: 4 }}><span style={{ color: "#a0a0a0" }}>INWARD: </span>{row.inward}</div>
                          <div><span style={{ color: "#a0a0a0" }}>OUTWARD: </span>{row.outward}</div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 14, padding: "10px 14px", border: "1px dashed rgba(255,255,255,0.06)", borderRadius: 2 }}>
        <Label>KEY CROSS-G MEDICATIONS (LTAM FRAMEWORK)</Label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 8, marginTop: 6 }}>
          {[
            { name: "OsteoBoost Serums", use: "Mineral-binding; preventative bone density" },
            { name: "OsteoSeal Rapid Response", use: "Microfracture stabilisation for low-G entrants" },
            { name: "Gravity-Shock Stabilisers (GSS)", use: "Acute downwell strain; injectable" },
            { name: "CircuGuard Infusions", use: "Emergency anti-pooling; G-collapse events" },
            { name: "SynaptAlign Modulators", use: "Neural vestibular recalibration" },
            { name: "VascuFlow Regulators", use: "Vascular blood pooling prevention" },
          ].map(m => (
            <div key={m.name} style={{ borderLeft: "2px solid rgba(80,200,255,0.3)", paddingLeft: 8 }}>
              <div style={{ color: "#50c8ff", fontFamily: mono, fontSize: 12 }}>{m.name}</div>
              <div style={{ color: "#a0a0a0", fontFamily: mono, fontSize: 12, marginTop: 1 }}>{m.use}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MOBILITY PANEL ───────────────────────────────────────────────────────────

function MobilityPanel() {
  const rows = [
    { route: "TLC ↔ MF", direction: "Inner ↔ Mid", friction: "Low–Medium", notes: "Structurally open but bureaucratic. Professional, academic, and technical exchanges common." },
    { route: "MF ↔ BCC", direction: "Mid ↔ Belt", friction: "Medium", notes: "Labour-driven. BCC most open bloc; MF applies moderate screening." },
    { route: "BCC ↔ JFA", direction: "Belt ↔ Outer", friction: "Medium–High", notes: "Labour-driven. JFA accepts only agriculture/energy-domain applicants. Residency temporary." },
    { route: "JFA ↔ SatCon", direction: "Outer ↔ Far Outer", friction: "High", notes: "Highly restrictive. Mostly research-invitation corridors. SatCon: no citizenship pathway." },
    { route: "Any → TKA Frontier", direction: "Outbound", friction: "Controlled", notes: "Not immigration. Strict 36–60 month rotation cycles. All personnel retain home-bloc citizenship. IHC clearance + AG certification mandatory." },
  ];
  const specials = [
    { id: "DSCP", name: "Dual Security Clearance Pass", note: "Granted to individuals with concurrent authorisations from 2+ agencies. Accelerated screening; rare; annual revalidation." },
    { id: "HTO", name: "Humanitarian Transit Override", note: "Activated by IHC or IA during crises only. Temporary visa waivers, emergency inward migration, protected transit corridors." },
    { id: "F-CAW", name: "Frontier Critical Access Waiver", note: "TKA-linked only. Immediate redeployment to any TKA node; normal rotation limits suspended. Triggered by TKA Command + INA + IHC." },
    { id: "DipEx", name: "Diplomatic Exemption", note: "IM/CM personnel retain unrestricted mobility for duration of posting. Overrides standard visa requirements; monitored by IA/INA for misuse." },
  ];

  return (
    <div>
      <Label style={{ marginBottom: 12 }}>SMIF MOBILITY MATRIX · SYSTEM MOVEMENT & IMMIGRATION FRAMEWORK</Label>
      <div style={{ marginBottom: 16 }}>
        {rows.map((r, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "140px 110px 120px 1fr", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", alignItems: "start" }}>
            <div style={{ color: "#d8d0c0", fontFamily: mono, fontSize: 13 }}>{r.route}</div>
            <div style={{ color: "#aaaaaa", fontFamily: mono, fontSize: 12 }}>{r.direction}</div>
            <div style={{ color: riskColor(r.friction), fontFamily: mono, fontSize: 12 }}>{r.friction}</div>
            <div style={{ color: "#aaa8b0", fontFamily: mono, fontSize: 12, lineHeight: 1.5 }}>{r.notes}</div>
          </div>
        ))}
      </div>
      <Label style={{ marginBottom: 10 }}>SPECIAL PROVISIONS & EXEMPTIONS</Label>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 8 }}>
        {specials.map(s => (
          <div key={s.id} style={{ border: "1px solid rgba(80,200,255,0.15)", borderTop: "2px solid rgba(80,200,255,0.4)", padding: "10px 12px", borderRadius: 2 }}>
            <div style={{ color: "#50c8ff", fontFamily: mono, fontSize: 12, letterSpacing: 1 }}>{s.id}</div>
            <div style={{ color: "#d8d0c0", fontFamily: serif, fontSize: 14, marginTop: 2 }}>{s.name}</div>
            <div style={{ color: "#aaaaaa", fontFamily: mono, fontSize: 12, marginTop: 6, lineHeight: 1.5 }}>{s.note}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TREATIES ─────────────────────────────────────────────────────────────────

const TREATIES = [
  { id: "TKA", name: "Trans-Kuiper Accord", type: "Multilateral Treaty Framework", parties: ["TLC","MF","BCC","JFA","SatCon"], purpose: "Regulates all human activity beyond Neptune. Safety standards, non-sovereign Kuiper settlements, inter-bloc equality at the frontier.", status: "Active", notes: "Replaced the Outer Systems Compact (OSC). Deposited with IA Secretariat. TKARC currently held only by Quaoar." },
  { id: "MCCP", name: "Multi-Currency Convertibility Protocol", type: "Economic Framework", parties: ["TLC","MF","BCC","JFA","SatCon"], purpose: "Governs interoperability of all five bloc currencies. TSC serves as the baseline settlement currency system-wide.", status: "Active", notes: "Each currency anchored to different assets: TSC→GPA debt instruments; JHU→food output index; SSN→knowledge asset reserves; BMT→Belt Resource Basket." },
  { id: "IDN", name: "Inter-Diplomatic Network", type: "Diplomatic Infrastructure Framework", parties: ["TLC","MF","BCC","JFA","SatCon"], purpose: "Governs Interplanetary Missions (IMs)—sovereign enclaves functioning as space-era embassies. Addresses gravity incompatibility, political autonomy, orbital residency.", status: "Active", notes: "Diplomatic personnel hold unrestricted mobility exemptions. IA nodes at Luna, Mars Orbit, Ganymede, and FarReach." },
  { id: "TKARC", name: "TKA Residential Charter", type: "Frontier Governance Instrument", parties: ["TKA Secretariat","IHC"], purpose: "Grants qualifying frontier settlements the right to admit dependants, operate schools, and register frontier-born children. Requires hab-ring gravity ≥0.6g and full FMN clinic presence.", status: "Active — Quaoar only", notes: "Reviewed every ten years jointly by TKA Secretariat and IHC. Quaoar is the sole current holder." },
  { id: "SMIF", name: "System Movement & Immigration Framework", type: "Interplanetary Mobility Framework", parties: ["TLC","MF","BCC","JFA","SatCon"], purpose: "Establishes consistent, gravity-aware, medically realistic movement rules across all blocs. Defines visa classes, G-Band requirements, and rotation protocols.", status: "Active", notes: "Rotation, residency, and citizenship are distinct legal layers. Special provisions: DSCP, HTO, F-CAW, Diplomatic Exemption." },
  { id: "LTAM", name: "Long-Term Adaptation Medicine Framework", type: "Medical Standards Framework", parties: ["IHC — all blocs"], purpose: "Unified medical standards for maintaining human health across varied gravitational environments. Defines G-Band classifications, preventative care, and emergency protocols.", status: "Active", notes: "LTAM clearance required for LTSP, high-mobility visas, occupational visas, and all TKA frontier deployment." },
];

function TreatyRow({ t }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: "1px solid rgba(255,255,255,0.06)", borderRadius: 2, marginBottom: 8, overflow: "hidden" }}>
      <div onClick={() => setOpen(!open)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", cursor: "pointer", background: "rgba(255,255,255,0.02)" }}>
        <div>
          <span style={{ fontFamily: mono, color: "#50c8ff", fontSize: 13, letterSpacing: 1 }}>[{t.id}]</span>
          <span style={{ color: "#f0ece4", fontSize: 15, fontFamily: serif, marginLeft: 10 }}>{t.name}</span>
          <span style={{ color: "#909090", fontFamily: mono, fontSize: 11, marginLeft: 10 }}>{t.type}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: statusColor(t.status), fontSize: 11, fontFamily: mono, letterSpacing: 1 }}>● {t.status}</span>
          <span style={{ color: "#a0a0a0", fontSize: 13 }}>{open ? "▲" : "▼"}</span>
        </div>
      </div>
      {open && (
        <div style={{ padding: "0 16px 14px", background: "rgba(0,0,0,0.2)" }}>
          <div style={{ color: "#b8b0a8", fontFamily: mono, fontSize: 13, lineHeight: 1.6, marginBottom: 8 }}>{t.purpose}</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
            {t.parties.map(p => {
              const b = BLOC_META[p];
              return <span key={p} style={{ color: b?.color || "#b0b0b0", fontFamily: mono, fontSize: 12, border: `1px solid ${b?.color || "#a0a0a0"}33`, padding: "2px 6px", borderRadius: 2 }}>{p}</span>;
            })}
          </div>
          <div style={{ color: "#a0a0a0", fontFamily: mono, fontSize: 12, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 8 }}>⚑ {t.notes}</div>
        </div>
      )}
    </div>
  );
}

// ─── AGENCIES ─────────────────────────────────────────────────────────────────

const AGENCIES = [
  {
    id: "IA", name: "Interplanetary Assembly", type: "Diplomatic & Treaty Authority",
    hq: "Earth–Luna L1 Diplomatic Complex (EL1-DC) — fully extraterritorial",
    role: "Diplomatic anchor, treaty custodian, and system governance forum for all five blocs.",
    mandate: ["Treaty deposit & archival custody", "Annual System Governance Cycle (bloc leaders + agency heads)", "Crisis mediation & diplomatic facilitation", "Political observer of TKA Secretariat"],
    canDo: ["Host inter-bloc negotiations", "Recommend sanctions via member votes", "Custody all deposited treaties"],
    cannotDo: ["Military enforcement", "Compel bloc compliance", "Override sovereign bloc decisions"],
    interagency: "All 9 specialised agencies report annually to the IA Plenum. IA provides diplomatic oversight while preserving agency independence.",
    treatiesToAdminister: "TKA (custody), MCCP, IDN, TKARC, SMIF, LTAM (and all agency-administered technical treaties on deposit)",
    offices: [{ code: "EL1-DC", loc: "Earth–Luna L1 (extraterritorial)", note: "Primary HQ · Assembly Chamber, Secretariat Ring, arbitration halls, mission pavilions" }, { code: "IARO–Ceres", loc: "Ceres, BCC civil district", note: "Mid-System executive & administrative oversight; treaty compliance & resource flow" }, { code: "IALN–Mars", loc: "Mars Orbit (outside Red Line)", note: "Primary diplomatic link with MF" }, { code: "IADS–Ganymede", loc: "Ganymede, JFA (neutral zone)", note: "Embassy-level representation; JFA Crown Territory" }, { code: "IACH–FarReach", loc: "Saturn Orbit (high-inclination)", note: "TKA frontier coordination + SatCon liaison" }],
    color: "#6ab0ff",
  },
  {
    id: "INA", name: "Interplanetary Navigation Authority", type: "Transport Safety Authority",
    hq: "Ganymede, JFA — Navigation Standards Complex",
    role: "Navigation safety, transport regulation, propulsion compliance, and traffic coordination across all corridors.",
    mandate: ["Corridor certification & lane volume standards", "Burn-timing window management (Hammerfall Burn Registry)", "Reactor safety & propulsion compliance (Aurora Compliance Directorate)", "IGSC waypoint telemetry processing (USZ/NSZ passage)", "TKOS convoy dispatch from FarReach Gateway"],
    canDo: ["Certify/suspend navigation corridors", "Mandate trajectory compliance", "Issue IGSC slingshot schedules", "Suspend dangerous lanes"],
    cannotDo: ["Micromanage individual vessels", "Override bloc military movements", "Set trade tariffs"],
    interagency: "ITC (freight lane integration), ICC (timestamp syncing), IHC (medical evacuation routing), ISA (mission trajectory approval), IEA (atmospheric hazard modelling).",
    treatiesToAdminister: "HBCA (Hammerfall Burn Certification Agreement), ADISC (Aurora Drive International Standards Charter), SNPC (Standardised Navigation Protocols Compact), RHNF (Radiation Hazard Notification Framework)",
    offices: [{ code: "INA-GAN", loc: "Ganymede, JFA", note: "Primary HQ · Navigation Standards Council, Hazard Analysis Core, Hammerfall Burn Registry, Aurora Compliance Directorate, Long-range Telemetry Vaults" }, { code: "INAO–Earth", loc: "Earth Orbit", note: "INA Liaison Office — high-density inner-system traffic, burn scheduling near Earth & Luna, reactor safety investigations" }, { code: "INAO–Ceres", loc: "Ceres, Belt", note: "INA Regional Node — Belt traffic flows, industrial fleet certification, debris hazard mapping, convoy timing oversight" }, { code: "INAO–Callisto", loc: "Callisto, JFA", note: "INA Outer System Hub — Jovian–Saturnian routes, radiation corridor monitoring, deep-system drift lanes" }, { code: "INAO–FarReach", loc: "FarReach Gateway", note: "INA Interface Point — TKOS convoy dispatches, telemetry verification, deep-frontier hazard reports" }],
    color: "#f0c030",
  },
  {
    id: "ICC", name: "Interplanetary Communications Commission", type: "Communications Infrastructure Authority",
    hq: "Earth–Luna L2 Comms Array Cluster (EL2 halo orbit)",
    role: "Governs communications protocols, frequency standards, timestamp regulation, and the Helion Relay Network (HRN) system-wide.",
    mandate: ["HRN Master Array operation (radio, laser, navigational timing)", "Timestamp Harmonisation Core — unified Solar System time reference", "Deep-Space Protocol Suite (HRN-DPS) maintenance", "Relay Standards Bureau — transmission protocols, error correction", "TKOS uplinks via FarReach Interface Unit"],
    canDo: ["Set communications standards for all blocs", "Maintain unified time reference (used by banking, navigation, law)", "Govern deep-frontier latency management"],
    cannotDo: ["Control content of communications", "Override bloc internal signals", "Enforce sanctions"],
    interagency: "INA (navigation timestamps), IFE (transaction timestamp integrity), ISA (research data timestamping), IHC (emergency broadcast protocols), IJC (legal timestamp verification).",
    treatiesToAdminister: "HRNSC (Helion Relay Network Standards Compact), STHA (Solar Timestamp Harmonisation Agreement), ORIC (Optical and Radio Interoperability Charter), DSCSP (Deep-Space Communications Safety Protocol)",
    offices: [{ code: "ICC-EL2", loc: "Earth–Luna L2 (extraterritorial)", note: "Primary HQ · HRN Master Array, Timestamp Harmonisation Core, Laser Comms Directorate, Relay Standards Bureau, Deep-Space Protocol Division" }, { code: "ICCO–Mars", loc: "Mars Orbit", note: "ICC Mars Relay Bureau — mid-system communications, Mars Relay Arc, inner–outer HRN synchronisation" }, { code: "ICCO–Ceres", loc: "Ceres, Belt", note: "ICC Belt Calibration Hub — antenna calibration, frequency audits, industrial relay maintenance, Belt timestamp integrity" }, { code: "ICCO–Ganymede", loc: "Ganymede, JFA", note: "ICC Jovian Signal Node — long-baseline arrays, deep-space targeting verification, outer-system signal stability" }, { code: "ICCO–FarReach", loc: "FarReach Gateway", note: "ICC FarReach Interface Unit — TKOS uplinks, deep-frontier latency management, scientific telemetry support" }],
    color: "#c8a860",
  },
  {
    id: "IEA", name: "Interplanetary Environmental Alliance", type: "Environmental Oversight Authority",
    hq: "Mars High-Orbit Environmental Array (MHEA) — ring-linked station cluster",
    role: "Environmental regulation, atmospheric protection, planetary contamination prevention, and terraforming oversight.",
    mandate: ["Climate Stability Directorate — atmospheric models, terraforming evaluation", "Planetary Protection Bureau — microbial drift prevention, contamination control", "Environmental Sensor Web (ESW) — distributed orbital sensor network", "Terraforming Oversight Model (TOM) — simulation engine for atmospheric interventions", "Terraforming Ethics Secretariat — in-house ethics body for MF interventions"],
    canDo: ["Issue operational shutdown orders", "Override extraction activities violating PPC", "Mandate contamination protocols at TKA frontier"],
    cannotDo: ["Override local bloc environmental law (unless treaties require)", "Regulate trade", "Hold enforcement powers beyond shutdown orders", "Interfere with military installations unless contamination concerns arise"],
    interagency: "INA (atmospheric nav hazard modelling), ICC (HRN integration), IHC (biocontamination response), ISA (research collaboration), ITC (environmental compliance in trade lanes).",
    treatiesToAdminister: "PPC, TEC, AEF, IEIC, CRIA",
    offices: [{ code: "IEA-MHEA", loc: "Mars High-Orbit (ring-linked station cluster)", note: "Primary HQ · Climate Stability Directorate, Planetary Protection Bureau, Atmospheric Hazard Analytics Core, Biosphere Integrity Council, Terraforming Ethics Secretariat" }, { code: "IEAO–Earth", loc: "Earth Stratospheric Platform", note: "IEA Terran Atmospheric Hub — climate data consolidation, pollution impact assessment, biogeochemical modelling" }, { code: "IEAO–Ceres", loc: "Ceres, Belt", note: "IEA Belt Ecological Node — extraction impact audits, regolith contamination modelling, Belt industrial ecological standards" }, { code: "IEAO–Callisto", loc: "Callisto, JFA", note: "IEA Jovian Environmental Station — radiation ecology, cryo-plume analysis, outer-system biosphere contamination risks" }, { code: "IEAO–Titan", loc: "Titan Orbit, SatCon", note: "IEA Titan Hydrocarbon Observatory — Titan atmospheric chemistry, prebiotic hydrocarbon system protection" }],
    color: "#60d860",
  },
  {
    id: "IHC", name: "Interplanetary Health Council", type: "Medical Standards & Biohazard Authority",
    hq: "Earth–Luna L2 Biomedical Nexus (EL2-BioNex) — high-containment station complex",
    role: "Medical standards, epidemiological surveillance, biohazard containment, and inter-bloc health coordination including LTAM and G-Band certification.",
    mandate: ["Epidemiology Directorate — communicable disease surveillance system-wide", "Frontier Health Command — health readiness for outer-system, TKA, and convoy deployments", "Biohazard Containment Bureau — outbreak response, quarantine protocols", "Medical Standards Council — clinical practice, pharma, hospital accreditation", "LTAM administration — gravity adaptation medicine standards", "G-Band certification — prerequisite for LTSP, high-mobility visas, frontier deployment"],
    canDo: ["Issue TKARC medical reviews (joint with TKA Secretariat)", "Activate HTO (Humanitarian Transit Override)", "Mandate quarantine across blocs", "Certify or deny AG clearance for immigration"],
    cannotDo: ["Override bloc domestic health policy", "Set pharmaceutical prices", "Detain individuals without bloc consent"],
    interagency: "INA (medevac routing), ICC (emergency broadcast), IEA (biocontamination response), ISA (biohazard compliance), IFE (pharmaceutical financing), IJC (medical malpractice cases), ITC (biological commodity checks).",
    treatiesToAdminister: "IBCF (Interplanetary Biohazard Containment Framework), FMSC (Frontier Medical Safety Convention), PSHA (Pharmaceutical Standards Harmonisation Accord), CTEC (Clinical Transparency & Ethics Compact), RCPP (Regolith & Cryogenic Pathogen Protocol)",
    offices: [{ code: "EL2-BioNex", loc: "Earth–Luna L2 (high-containment station)", note: "Primary HQ · Epidemiology Directorate, Frontier Health Command, Biohazard Containment Bureau, Medical Standards Council, Deep-Space Health Modelling Core, Pharmaceutical Harmonisation Office" }, { code: "IHCO–Earth", loc: "Earth, TLC", note: "IHC Terran Disease Intelligence Unit — Earth-origin pathogen tracking, population health metrics, biomedical developments" }, { code: "IHCO–Mars", loc: "Mars, MF", note: "IHC Martian Regolith Biohazard Lab — regolith-borne microbial hazards, modified biosphere drift, terraforming health risks" }, { code: "IHCO–Ceres", loc: "Ceres, Belt", note: "IHC Belt Occupational Health Node — industrial health impacts, low-G physiology drift, long-term bone-density studies" }, { code: "IHCO–Ganymede", loc: "Ganymede, JFA", note: "IHC Jovian Radiation Medicine Station — radiation exposure research, cellular damage modelling, Jovian biosurveillance" }, { code: "IHCO–Titan", loc: "Titan, SatCon", note: "IHC Titan Cryo-Pathogen Observatory — prebiotic compounds, cryogenic pathogens, hydrocarbon biosignatures, contamination risk" }],
    color: "#e080c0",
  },
  {
    id: "IFE", name: "Interplanetary Fiscal Exchange", type: "Macroeconomic Stability Authority",
    hq: "Terran Geosynchronous Finance Ring (TGFR) — Earth geostationary orbit",
    role: "Macroeconomic stability, inter-bloc financial oversight, cross-system transaction integrity, and MCCP administration.",
    mandate: ["Monetary Governance Board (MGB) — currency convertibility, exchange rate bands, sovereign liquidity", "Commodity Stability Council (CSC) — reference prices for Belt metals, Jovian energy, Titan hydrocarbons", "System Credit Authority (SCA) — inter-bloc credit ratings, sovereign lending risk, emergency liquidity", "Anti-Fraud & Compliance Bureau — account freeze authority, financial crimes coordination", "Convoy Insurance Modelling Suite (CIMS) — risk prediction for long-haul freight"],
    canDo: ["Freeze fraudulent accounts", "Suspend settlement windows", "Issue macroeconomic advisories", "Coordinate crisis lending packages"],
    cannotDo: ["Set bloc tax policy", "Intervene in domestic budgets", "Regulate wages", "Control trade tariffs", "Enforce sanctions independently"],
    interagency: "ITC (trade-linked financial flows), ICC (transaction timestamp integrity), IHC (pharmaceutical financing), IEA (environmental cost modelling), ISA (research funding oversight), IJC (financial misconduct cases).",
    treatiesToAdminister: "SFTA, ILSF, CPIP, FESC, AFCCC; MCCP operational administration",
    offices: [{ code: "TGFR", loc: "Earth Geostationary Orbit (ring-linked station cluster)", note: "Primary HQ · Monetary Governance Board, Commodity Stability Council, System Credit Authority, Anti-Fraud & Compliance Bureau, Deep-Space Economic Modelling Lab" }, { code: "IFEO–Mars", loc: "Mars Orbit", note: "IFE Settlement & Arbitration Hub — inter-bloc settlement disputes, Belt & Martian financial audit coordination" }],
    color: "#c8a040",
  },
  {
    id: "IJC", name: "Interplanetary Judicial Court", type: "Supreme Extraterritorial Court",
    hq: "Earth–Luna L1 Judicial Complex (EL1-JC) — zero-sovereignty extraterritorial station",
    role: "Inter-bloc dispute resolution, treaty violation adjudication, and system-level criminal prosecution beyond any single bloc's jurisdiction.",
    mandate: ["High Tribunal — supreme inter-bloc arbitration", "Criminal Division — piracy, large-scale fraud, multi-bloc criminal networks", "Inter-bloc Arbitration Bench — trade, territorial, and treaty disputes", "Precedent & Treaty Analysis Office — legal interpretation of interplanetary law", "Frontier Enforcement Liaison — TKA violations, frontier accidents, contamination breaches"],
    canDo: ["Prosecute system-level crimes", "Adjudicate treaty violations", "Issue binding rulings on inter-bloc disputes", "Ultimate arbiter of TKA safety violations & frontier criminal activity"],
    cannotDo: ["Override bloc domestic courts", "Enforce rulings without inter-bloc cooperation", "Regulate intra-bloc criminal matters"],
    interagency: "INA (navigation fraud prosecution), ITC (trade dispute escalation), IFE (financial crimes cases), ISA (research malpractice), IEA (environmental crime), IHC (medical malpractice).",
    treatiesToAdminister: "IJA (Interplanetary Judicial Accord), FLIC (Frontier Legal Integration Charter), APNPC (Anti-Piracy & Navigation Protection Convention), SWCCT (System-Wide Criminal Cooperation Treaty), EITP (Evidence Integrity & Timestamp Protocol)",
    offices: [{ code: "EL1-JC", loc: "Earth–Luna L1 (zero-sovereignty extraterritorial)", note: "Primary HQ · High Tribunal, Criminal Division, Inter-bloc Arbitration Bench, Precedent & Treaty Analysis Office, Forensic Oversight Directorate" }, { code: "IJCO–Ceres", loc: "Ceres, Belt", note: "IJC Arbitration Field Office — Belt-related disputes and frontier legal claims" }, { code: "IJCO–Mars", loc: "Mars Orbit", note: "IJC Criminal Field Wing — industrial crimes, regolith exploitation, cross-bloc labour violations" }, { code: "IJCO–Callisto", loc: "Callisto, JFA", note: "IJC Navigation & Piracy Unit — piracy, convoy raids, navigation fraud, violent crime on Jovian trade routes" }, { code: "IJCO–Titan", loc: "Titan, SatCon", note: "IJC Frontier Enforcement Liaison — TKA-linked frontier violations and deep-system incident prosecutions" }],
    color: "#e05a3a",
  },
  {
    id: "ISA", name: "Interplanetary Scientific Authority", type: "Research Governance Authority",
    hq: "Ceres L4 Scientific Accord Campus (CL4-SAC) — politically neutral, all-bloc access",
    role: "Scientific governance, research access regulation, ethical oversight, and frontier science coordination.",
    mandate: ["Scientific Access Council (SAC) — surface access, sampling quotas, mission authorisations", "Mission Approval Directorate (MAD) — probes, high-risk expeditions, TKA deployments", "Office of Research Ethics & Conduct (OREC) — genetic engineering, AI governance, biohazard research", "High-Risk Technology Review Board (HRTRB) — reactor-adjacent and cryogenic microbe studies", "Frontier Science Integration Office (FSIO) — trans-Neptunian scheduling, Big Six research cycles", "Celestial Access Registry (CAR) — tracks protected zones and research claims"],
    canDo: ["Deny scientific access", "Suspend high-risk experiments", "Revoke research permits", "Issue cease-work orders", "Restrict frontier expedition timing"],
    cannotDo: ["Regulate military science", "Prevent blocs from conducting domestic research", "Override IJC rulings", "Control non-scientific missions"],
    interagency: "INA (mission trajectory approval), ICC (research timestamping), IEA (ecological oversight), IHC (biohazard compliance), IFE (funding transparency), IJC (malpractice prosecution), ITC (commercialisation of by-products).",
    treatiesToAdminister: "SREC (System Research Ethics Convention), TCBA (Titan & Cryogenic Biosignature Accord) — plus frontier access protocols administered jointly with TKA Secretariat",
    offices: [{ code: "CL4-SAC", loc: "Ceres L4 (politically neutral)", note: "Primary HQ · Scientific Access Council, Mission Approval Directorate, Office of Research Ethics & Conduct, High-Risk Technology Review Board, Frontier Science Integration Office" }, { code: "ISAO–Earth", loc: "Earth, TLC", note: "ISA Terran Research Liaison Hub — major Terran academic institutions, climate research partners, planetary science teams" }, { code: "ISAO–Mars", loc: "Mars, MF", note: "ISA Martian Geoscience Bureau — Martian surface access, geologic sampling rights, terraforming-impact studies" }, { code: "ISAO–Europa", loc: "Europa Orbit, JFA", note: "ISA Jovian Cryo-Oceanic Lab — scientific access to Jovian icy moons, cryovolcanic plume research, bio-signature controls" }, { code: "ISAO–Titan", loc: "Titan, SatCon", note: "ISA Titan Atmospheric Sciences Station — hydrocarbon atmospheric chemistry, high-risk chemical experimentation regulation" }, { code: "ISAO–FRG", loc: "FarReach Gateway", note: "ISA Frontier Science Node — TKA-linked research, frontier mission approvals, trans-Neptunian science protocols" }],
    color: "#a060e0",
  },
  {
    id: "ITC", name: "Interplanetary Trade Commission", type: "Trade Standards & Customs Authority",
    hq: "Earth–Mars Economic Mesh (EM-EMesh) — dual structure: Earth Orbital Trade Secretariat (EOTS) + Mars Orbital Tariff Directorate (MOTD)",
    role: "Governs the formal movement of goods system-wide: trade rules, tariff protocols, freight corridor certification, and customs coordination.",
    mandate: ["System Trade Standards Council (STSC) — commodity codes, tariff baselines, dispute procedures", "Customs Coordination Directorate (CCD) — port certification, anti-smuggling operations", "Economic Corridors Authority (ECA) — trade lane designation, blue corridors, risk-tiered routes", "Inter-Bloc Arbitration Panel (IBAP) — tariff disagreements, port access conflicts", "Frontier Resource Board (FRB) — trans-Neptunian commercial samples, frontier material export limits"],
    canDo: ["Certify or decertify ports", "Suspend trade lanes", "Issue tariff compliance orders", "Fine freight operators", "Block noncompliant shipments", "Impose corridor restrictions during crises"],
    cannotDo: ["Set domestic trade policy", "Control economic sanctions", "Dictate internal taxation", "Override judicial rulings", "Regulate scientific samples unless commercialised"],
    interagency: "INA (freight lanes + certified corridors), ICC (trade manifest timestamp integrity), IEA (environmental compliance for extraction exports), IHC (biohazard checks on biological commodities), IFE (macroeconomic forecasting + tariff impact), IJC (trade dispute judicial escalation), ISA (commercialisation of research by-products).",
    treatiesToAdminister: "STTC, FSHA, BCPP, FREC",
    offices: [{ code: "EM-EMesh", loc: "Earth Orbital Trade Secretariat (EOTS) + Mars Orbital Tariff Directorate (MOTD)", note: "Primary HQ · dual structure ensuring Terran–Martian balance; System Trade Standards Council, Customs Coordination Directorate, Economic Corridors Authority" }, { code: "ITCO–Ceres", loc: "Ceres, Belt", note: "ITC Belt Commerce Bureau — raw materials certification, asteroid-origin commodity standards, Belt industrial export tariff mediation" }, { code: "ITCO–Ganymede", loc: "Ganymede, JFA", note: "ITC Jovian Port Commission — high-mass freight processing, cryo-fuel export rules, Jovian corridor customs compliance" }, { code: "ITCO–Titan", loc: "Titan Orbit, SatCon", note: "ITC Saturnian Trade Registry — hydrocarbon trade standards, atmospheric product export licensing, anti-smuggling surveillance" }, { code: "ITCO–FarReach", loc: "FarReach Gateway", note: "ITC Frontier Commerce Desk — trans-Neptunian import controls, frontier sample commercialisation, Big Six research by-product trade restrictions" }],
    color: "#f0a030",
  },
  {
    id: "TKA", name: "TKA Secretariat", type: "Frontier Treaty Administration",
    hq: "FarReach Gateway (FRG) — high Saturn-orbit extraterritorial complex; secondary at Kuiper Gateway Station (KGS)",
    role: "Administers the Trans-Kuiper Accord beyond Neptune: safety standards, Big Six scientific sites, TKARC, and frontier rotation governance.",
    mandate: ["TKARC administration — residential charter (currently: Quaoar only)", "Big Six scientific site coordination (Pluto–Charon, Haumea, Makemake, Quaoar, Orcus–Vanth, Eris)", "Frontier rotation cycle enforcement (36–60 months standard)", "FRR (Frontier Rotational Residency) clearance administration", "TKA safety violation reporting to IJC", "Non-voting IA Plenum observer"],
    canDo: ["Trigger F-CAW (Frontier Critical Access Waiver)", "Enforce rotation limits", "Administer Big Six research access", "Issue FRR mission clearances"],
    cannotDo: ["Grant frontier citizenship (no frontier citizenship exists)", "Override bloc sovereignty", "Act as sixth bloc", "Vote at IA Plenum"],
    interagency: "IHC (TKARC joint reviews, LTAM frontier screening), INA (TKOS convoy dispatch), ISA (Big Six science scheduling), IJC (frontier criminal prosecution), IEA (frontier contamination protocols), IFE (frontier logistics credit).",
    treatiesToAdminister: "TKA (primary), TKARC, SMIF frontier provisions, FSAP (joint with ISA)",
    offices: [{ code: "TKA-FRG", loc: "FarReach Gateway, Saturn Orbit", note: "Primary operational base; inner gate to the deep frontier" }, { code: "TKA-KGS", loc: "Kuiper Gateway Station (~100+ AU)", note: "Outer frontier station; relay point for Big Six coordination" }, { code: "TKA-IA", loc: "IA Secretariat, Ceres", note: "Non-voting observer liaison office" }],
    color: "#80c8e0",
  },
];

// ─── CULTURAL ─────────────────────────────────────────────────────────────────

const CULTURAL = [
  {
    bloc: "TLC", demonyms: ["Terran", "Lunar", "Lunan"],
    slang: [
      { term: "Grav-cycle", meaning: "Lunar jargon for daily schedule structured around AG maintenance windows." },
      { term: "Hard-pitch", meaning: "Lunar engineering term; a solution with no contingency margin." },
      { term: '"By the registry—"', meaning: "Terran expletive; short for Registry Code Violation." },
      { term: "Alignments / Deliverables", meaning: "Terran corporate-speak that has become shorthand for bureaucratic overcomplication." },
    ],
    rituals: ["Bureaucratic micro-rituals (commuter queue etiquette, form-based interactions)", "Lunar Tech Circles (informal evening engineering puzzle sessions)", "Arcology sky-simulation and rainfall evening events"],
    lived: "Heavy reliance on climate-regulated mega-arcologies. Ubiquitous simulated nature: rain domes, holographic skylines, atmospheric gardens. Clear hierarchy between Terran-born, Lunar-born, and orbital habitat workers.",
    tensions: [
      { pair: "TLC ↔ BCC", note: '"Registry rules", "hollow promises", "cooperative obstruction" — the Solar System\'s sharpest class tension.' },
      { pair: "TLC ↔ MF", note: '"Old-world drag" (MF) vs "red ambition" (TLC) — Earth\'s institutional weight vs Mars\'s emerging power.' },
    ],
  },
  {
    bloc: "MF", demonyms: ["Martian", "Phoban", "Deimosan", "Orbital Martian"],
    slang: [
      { term: "Ironbacks", meaning: "Colloquial for Martian RedMarks (MRM); references red-metal composite on early hard notes." },
      { term: "Thin-walkers", meaning: "System-wide term for Martians; references thin-atmospheric heritage. Neutral to mildly sympathetic." },
      { term: "Drybacks", meaning: "Belt-origin charged term for MF nationals; implies parochialism and inability to adapt." },
      { term: '"By-the-book downwell"', meaning: "MF military dismissal of TLC's procedural approach; implies documentation over direct action." },
    ],
    rituals: ["Red Line boundary ceremonies marking annual security perimeter reviews", "Terraforming milestone broadcasts (rare; celebrated system-wide)", "Military muster parades on Federation Day"],
    lived: "Pressurised domes and underground arcologies under 0.38g. Strong martial culture. Terraforming progress treated as national identity. Green/Amber/Red Zone stratification shapes daily life.",
    tensions: [
      { pair: "MF ↔ BCC", note: '"The red creep" (BCC) vs "cooperative chaos" (MF) — territorial and ideological friction in Belt-adjacent space.' },
      { pair: "MF ↔ TLC", note: "Foundational inner-system tension. Red ambition vs old-world drag." },
    ],
  },
  {
    bloc: "BCC", demonyms: ["Belter", "Cerean", "Freeholder", "Stationer", "Knotters"],
    slang: [
      { term: "Rock / I'm a rock", meaning: "Self-identifier implying rootedness in Belt culture despite physical rootlessness." },
      { term: "Patch crew", meaning: "A tight-knit cooperative team; the highest term of social solidarity in Belt culture." },
      { term: "Floater", meaning: "Someone without cooperative membership or station affiliation. Neutral to mildly charged." },
      { term: "Rockbits", meaning: "Slang for Belt Mutual Tokens (BMT); references micro-denomination mining credits." },
    ],
    rituals: ["Cooperative muster ceremonies at station docking arrivals", "Mutual-aid pledge renewals at Belt Syndicate Assembly sessions", "Salvage auctions as major social events"],
    lived: "Life in tunnels, sealed stations, and artificial habitats. Micro-G or low-G daily existence. Strong emphasis on mutual aid and physical resourcefulness. Low-gravity agility is a point of cultural pride.",
    tensions: [
      { pair: "BCC ↔ TLC", note: '"Hollows", "registry rules", "hollow promises" — the deepest systemic grievance in the Solar System.' },
      { pair: "BCC ↔ MF", note: '"Dust-boots", "the red creep" — territorial encroachment, military presence in Belt-adjacent space.' },
    ],
  },
  {
    bloc: "JFA", demonyms: ["Jovian", "Ganymedean", "Europan", "Callistan", "Ioter", "Jovian Orbital"],
    slang: [
      { term: "Brights", meaning: "Colloquial for Jovian Helion Units (JHU); from the luminous watermark on early convoy tender scripts." },
      { term: "Poly-systems heritage", meaning: "JFA term for the multi-moon cultural blending identity unique to the Alliance." },
      { term: '"Efficiency is survival"', meaning: "Cultural mantra; the Jovian equivalent of a civic pledge." },
      { term: "The He-3 handshake", meaning: "System-wide term for the implicit JFA-SatCon joint control of frontier propulsion fuel. Not discussed explicitly in IA forums." },
    ],
    rituals: ["Food-culture pride festivals celebrating seasonal Ganymede harvests", "Convoy arrival ceremonies at Callisto shipyards", "Io hazard-watch rotations as communal vigils"],
    lived: "Orderly AG-regulated habitats across four moons. Structured civic discipline. Food culture is central to identity. Technocratic expertise is a form of social capital. Multi-moon 'poly-systems' identity supersedes moon nationalism.",
    tensions: [
      { pair: "JFA ↔ SatCon", note: '"The slow answer" (JFA) vs "yield without wisdom" (SatCon) — the outer system\'s quiet, mutually denied rivalry.' },
      { pair: "JFA ↔ BCC", note: "Jovian overreach into former Belt mining claims; the He-3 handshake structural tension." },
    ],
  },
  {
    bloc: "SatCon", demonyms: ["Saturnian", "Titanian", "Enceladan", "Rhean", "Ringborn"],
    slang: [
      { term: "Frostmarks", meaning: "Colloquial for Saturnian Solvency Notes (SSN); from frost-pattern security aesthetic on early quantum tokens." },
      { term: "The Long View", meaning: "Cultural shorthand for SatCon's generational thinking and scientific patience." },
      { term: "Cryo-monk", meaning: "Informal term for Enceladus researchers who adopt near-monastic research routines." },
      { term: '"The slow answer"', meaning: "JFA's mildly exasperated term for SatCon's characteristic delay on joint proposals." },
    ],
    rituals: ["Cryo-Vigils marking scientific milestones", "Ring Nights — storytelling sessions overlooking Saturn's rings", "Titan philosophical guild meetings", "AI monastic enclave retreats"],
    lived: "Cool-lit domes, cryo-labs, methane halls, and quiet observatories. Amber Titan light and Enceladan ice interiors define local identity. Contemplative, enclosed spaces. Soundscapes of cryogenic pumps, sensor drones, and soft airflow.",
    tensions: [
      { pair: "SatCon ↔ JFA", note: '"Yield without wisdom" — efficiency at expense of depth. A rivalry both blocs deny.' },
      { pair: "SatCon ↔ TLC", note: "Research data privatisation attempts; Juno compliance monitoring; quiet institutional friction." },
    ],
  },
];

// ─── SEARCH ───────────────────────────────────────────────────────────────────

function SearchPanel({ query, setQuery }) {
  const allResults = useMemo(() => {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase();
    const results = [];

    // Blocs, OCCs, Conflicts, Pillars
    BLOCS.forEach(b => {
      const bMeta = BLOC_META[b.id];
      if ([b.name, b.id, b.tagline, b.identity, b.governance, b.mantra, b.currency.name, b.currency.slang].some(s => s.toLowerCase().includes(q))) {
        results.push({ type: "Bloc", id: b.id, title: b.name, subtitle: b.tagline, color: bMeta.color });
      }
      b.occs.forEach(o => {
        if ([o.name, o.body, o.purpose, o.id, o.notes, o.status].some(s => s.toLowerCase().includes(q))) {
          results.push({ type: "OCC", id: o.id, title: `${o.body} — ${o.name}`, subtitle: `${o.purpose} · ${b.id}`, color: bMeta.color });
        }
      });
      b.conflicts.forEach(c => {
        if ([c.zone, c.nature, c.risk].some(s => s.toLowerCase().includes(q))) {
          results.push({ type: "Conflict Zone", id: c.zone, title: c.zone, subtitle: `${c.nature} · Risk: ${c.risk} · ${b.id}`, color: riskColor(c.risk) });
        }
      });
      b.pillars.forEach(p => {
        if (p.toLowerCase().includes(q))
          results.push({ type: "Economic Pillar", id: p, title: p, subtitle: `${b.name} pillar`, color: bMeta.color });
      });
    });

    // Treaties & frameworks
    TREATIES.forEach(t => {
      const fields = [t.id, t.name, t.type, t.purpose, t.status, ...(t.parties || []), t.notes].filter(Boolean);
      if (fields.some(s => s.toLowerCase().includes(q))) {
        results.push({ type: "Treaty", id: t.id, title: `[${t.id}] ${t.name}`, subtitle: `${t.type} · ${t.status}`, color: "#f0a030" });
      }
    });

    // Agencies
    AGENCIES.forEach(a => {
      const fields = [a.id, a.name, a.type, a.hq, a.interagency, a.treatiesToAdminister, ...(a.mandate || []), ...(a.canDo || []), ...(a.cannotDo || [])].filter(Boolean);
      if (fields.some(s => s.toLowerCase().includes(q))) {
        results.push({ type: "Agency", id: a.id, title: `${a.id} — ${a.name}`, subtitle: a.type, color: a.color });
      }
    });

    // G-Bands
    GBAND_TABLE.forEach((g, gi) => {
      if ([g.band, g.range, g.natives, g.baseline, g.inward, g.outward].some(s => s.toLowerCase().includes(q))) {
        results.push({ type: "G-Band", id: g.band, title: `${g.band} (${g.range})`, subtitle: g.natives, color: ["#50c8ff","#f0a030","#f0a030","#e05a3a","#b0b0b0"][gi] });
      }
    });

    // Cultural — demonyms & slang
    CULTURAL.forEach(c => {
      const bMeta = BLOC_META[c.bloc];
      c.demonyms.forEach(d => {
        if (d.toLowerCase().includes(q))
          results.push({ type: "Demonym", id: d, title: d, subtitle: `${c.bloc} recognised demonym`, color: bMeta.color });
      });
      c.slang.forEach(s => {
        if (s.term.toLowerCase().includes(q) || s.meaning.toLowerCase().includes(q))
          results.push({ type: "Vernacular", id: s.term, title: s.term, subtitle: `${c.bloc} — ${s.meaning}`, color: bMeta.color });
      });
    });

    // Deduplicate by type+id
    const seen = new Set();
    return results.filter(r => {
      const key = r.type + r.id;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [query]);

  return (
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 2, padding: "8px 14px" }}>
        <span style={{ color: "#50c8ff", fontFamily: mono, fontSize: 13 }}>⌕</span>
        <input value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Search blocs, OCCs, treaties, agencies, G-bands, vernacular..."
          style={{ background: "transparent", border: "none", outline: "none", color: "#d8d0c0", fontFamily: mono, fontSize: 13, width: "100%" }} />
        {query && <button onClick={() => setQuery("")} style={{ background: "transparent", border: "none", color: "#909090", cursor: "pointer", fontFamily: mono, fontSize: 13 }}>✕</button>}
      </div>
      {allResults.length > 0 && (
        <div style={{ marginTop: 8, border: "1px solid rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
          {allResults.map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.04)", background: "rgba(0,0,0,0.3)" }}>
              <span style={{ color: r.color, fontFamily: mono, fontSize: 11, letterSpacing: 1, minWidth: 72 }}>{r.type.toUpperCase()}</span>
              <div>
                <div style={{ color: "#d8d0c0", fontFamily: mono, fontSize: 13 }}>{r.title}</div>
                <div style={{ color: "#a0a0a0", fontFamily: mono, fontSize: 12, marginTop: 1 }}>{r.subtitle}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {query.length >= 2 && allResults.length === 0 && (
        <div style={{ marginTop: 8, padding: "10px 14px", border: "1px solid rgba(255,255,255,0.06)", color: "#909090", fontFamily: mono, fontSize: 13 }}>
          No results found for "{query}"
        </div>
      )}
    </div>
  );
}

// ─── TECH TREATY ROW ──────────────────────────────────────────────────────────

function TechTreatyRow({ t, group }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", overflow: "hidden" }}>
      <div onClick={() => setOpen(!open)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 10px 10px 20px", cursor: "pointer", background: open ? "rgba(255,255,255,0.03)" : "transparent" }}>
        <div>
          <span style={{ color: group.color, fontFamily: mono, fontSize: 12 }}>[{t.id}]</span>
          <span style={{ color: "#d0c8b8", fontFamily: serif, fontSize: 14, marginLeft: 10 }}>{t.name}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: C.stable, fontSize: 11, fontFamily: mono, letterSpacing: 1 }}>● Active</span>
          <span style={{ color: "#909090", fontSize: 11 }}>{open ? "▲" : "▼"}</span>
        </div>
      </div>
      {open && (
        <div style={{ padding: "6px 16px 12px 20px", background: "rgba(0,0,0,0.15)" }}>
          <div style={{ color: "#a0a0a0", fontFamily: mono, fontSize: 12, lineHeight: 1.6, marginBottom: 6 }}>{t.scope}</div>
          <div style={{ color: "#888898", fontFamily: mono, fontSize: 11, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 6 }}>⚑ Administered by {group.agencyName}</div>
        </div>
      )}
    </div>
  );
}

// ─── BLOC COMPARISON ──────────────────────────────────────────────────────────

function BlocComparison() {
  const [blocA, setBlocA] = useState("TLC");
  const [blocB, setBlocB] = useState("MF");

  const A = BLOCS.find(b => b.id === blocA);
  const B = BLOCS.find(b => b.id === blocB);
  const mA = BLOC_META[blocA], mB = BLOC_META[blocB];
  const tension = TENSION[blocA]?.[blocB];

  const rows = [
    { label: "POPULATION",       a: A.population,        b: B.population },
    { label: "GRAVITY BAND",     a: `${mA.gband} · ${mA.grange}`, b: `${mB.gband} · ${mB.grange}` },
    { label: "CURRENCY",         a: A.currency.name,     b: B.currency.name },
    { label: "COLLOQUIAL",       a: A.currency.slang,    b: B.currency.slang },
    { label: "GOVERNANCE",       a: A.governance,        b: B.governance },
    { label: "MANTRA",           a: A.mantra,            b: B.mantra },
    { label: "IDENTITY",         a: A.identity,          b: B.identity },
    { label: "MILITARY POSTURE", a: A.militaryDoc,       b: B.militaryDoc },
  ];

  return (
    <div>
      <div style={{ color: "#888898", fontSize: 11, letterSpacing: 2, marginBottom: 16 }}>SIDE-BY-SIDE BLOC COMPARISON · SELECT TWO BLOCS</div>

      {/* Selector row */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap", alignItems: "flex-start" }}>
        {[{ label: "BLOC A", val: blocA, set: setBlocA, other: blocB },
          { label: "BLOC B", val: blocB, set: setBlocB, other: blocA }].map(({ label, val, set, other }) => (
          <div key={label}>
            <Label style={{ marginBottom: 6 }}>{label}</Label>
            <div style={{ display: "flex", gap: 5 }}>
              {BLOCS.map(b => (
                <button key={b.id} onClick={() => set(b.id)} disabled={b.id === other} style={{
                  background: val === b.id ? BLOC_META[b.id].color : "transparent",
                  border: `1px solid ${BLOC_META[b.id].color}`,
                  color: val === b.id ? "#060810" : BLOC_META[b.id].color,
                  fontFamily: mono, fontSize: 12, padding: "4px 12px", borderRadius: 2,
                  cursor: b.id === other ? "not-allowed" : "pointer",
                  opacity: b.id === other ? 0.25 : 1, fontWeight: 600, letterSpacing: 1,
                }}>{b.id}</button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Tension strip */}
      {tension && (
        <div style={{ marginBottom: 16, padding: "10px 14px", border: `1px solid ${tensionColor(tension.level)}44`, borderLeft: `3px solid ${tensionColor(tension.level)}`, borderRadius: 2, background: `${tensionColor(tension.level)}06`, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: 2, color: "#a0a0a0" }}>CURRENT TENSION</div>
          <div style={{ color: tensionColor(tension.level), fontFamily: mono, fontSize: 13, fontWeight: 600 }}>LEVEL {tension.level} — {tension.label.toUpperCase()}</div>
          <div style={{ color: "#aaa8b0", fontFamily: mono, fontSize: 12, lineHeight: 1.5 }}>{tension.note}</div>
        </div>
      )}

      {/* Comparison table — unified grid including economic profile */}
      <div style={{ border: "1px solid rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden", marginBottom: 12 }}>
        {/* Header row */}
        <div style={{ display: "grid", gridTemplateColumns: "130px 1fr 1fr" }}>
          <div style={{ padding: "8px 12px", background: "rgba(255,255,255,0.02)" }} />
          {[{ bloc: A, m: mA }, { bloc: B, m: mB }].map(({ bloc, m }) => (
            <div key={bloc.id} style={{ padding: "10px 14px", borderLeft: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", background: `${m.accent}88` }}>
              <span style={{ color: m.color, fontFamily: mono, fontSize: 12, letterSpacing: 1 }}>{bloc.id}</span>
              <div style={{ color: "#e0d8cc", fontFamily: serif, fontSize: 15, marginTop: 2 }}>{bloc.name}</div>
            </div>
          ))}
        </div>
        {/* Data rows */}
        {rows.map((r, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "130px 1fr 1fr", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
            <div style={{ padding: "9px 12px", background: "rgba(255,255,255,0.01)" }}>
              <Label style={{ marginBottom: 0 }}>{r.label}</Label>
            </div>
            <div style={{ padding: "9px 14px", borderLeft: "1px solid rgba(255,255,255,0.04)", color: "#c8bfb0", fontFamily: mono, fontSize: 12, lineHeight: 1.5 }}>{r.a}</div>
            <div style={{ padding: "9px 14px", borderLeft: "1px solid rgba(255,255,255,0.04)", color: "#c8bfb0", fontFamily: mono, fontSize: 12, lineHeight: 1.5 }}>{r.b}</div>
          </div>
        ))}
      </div>

      {/* Economic profiles — separate table, columns aligned to main table */}
      <div style={{ border: "1px solid rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden", display: "grid", gridTemplateColumns: "130px 1fr 1fr" }}>
        <div style={{ padding: "9px 12px", background: "rgba(255,255,255,0.02)", gridRow: "1 / 3" }}>
          <Label style={{ marginBottom: 6 }}>ECONOMIC PROFILE</Label>
        </div>
        {[{ bloc: A, m: mA }, { bloc: B, m: mB }].map(({ bloc, m }) => (
          <div key={bloc.id} style={{ padding: "12px 14px", borderLeft: "1px solid rgba(255,255,255,0.04)", borderTop: `2px solid ${m.color}` }}>
            <div style={{ color: m.color, fontFamily: mono, fontSize: 11, marginBottom: 8 }}>{bloc.id} · PILLARS</div>
            {bloc.pillars.map((p, i) => <div key={i} style={{ color: "#aaa8b0", fontFamily: mono, fontSize: 12, padding: "2px 0" }}>› {p}</div>)}
            <div style={{ color: "#d07060", fontFamily: mono, fontSize: 11, marginTop: 10, marginBottom: 6 }}>{bloc.id} · WEAKNESSES</div>
            {bloc.weaknesses.map((w, i) => <div key={i} style={{ color: "#d07060", fontFamily: mono, fontSize: 12, padding: "2px 0" }}>✕ {w}</div>)}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────

const TABS = [
  { id: "map",        label: "SYSTEM MAP" },
  { id: "comparison", label: "BLOC COMPARISON" },
  { id: "treaties",   label: "TREATIES" },
  { id: "agencies",   label: "IA AGENCIES" },
  { id: "gravity",    label: "G-BAND TABLE" },
  { id: "mobility",   label: "MOBILITY" },
  { id: "culture",    label: "CULTURAL CODEX" },
  { id: "search",     label: "SEARCH" },
];

export default function Dashboard() {
  const [tab, setTab] = useState("map");
  const [selectedBloc, setSelectedBloc] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [agencySel, setAgencySel] = useState(null);
  const [cultureSel, setCultureSel] = useState("TLC");

  return (
    <div style={{ minHeight: "100vh", background: "#060810", color: "#d8d0c0", fontFamily: mono, padding: "0 0 80px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: #333; }
        ::-webkit-scrollbar { width: 3px; height: 3px; }
        ::-webkit-scrollbar-track { background: #060810; }
        ::-webkit-scrollbar-thumb { background: #222; }
        button { transition: all 0.15s ease; }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "20px 28px 0", background: "#04060c" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18 }}>
          <div>
            <div style={{ color: "#50c8ff", fontSize: 11, letterSpacing: 4, marginBottom: 5 }}>INTERPLANETARY ASSEMBLY · INFORMATION SYSTEMS DIVISION · NODE IA-CERES-07</div>
            <div style={{ fontFamily: serif, fontSize: 26, color: "#f0ece4", letterSpacing: 0.5 }}>Solar System Registry Terminal</div>
            <div style={{ color: "#888898", fontSize: 11, marginTop: 4, letterSpacing: 1 }}>STATUS: NOMINAL · CYCLE: 2847.4 SOL · SMIF CLEARANCE: STANDARD · LTAM CERT: CURRENT</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { label: "BLOCS",         value: "5",  color: "#50c8ff" },
              { label: "AGENCIES",      value: "10", color: "#50c8ff" },
              { label: "TREATIES",      value: "6",  color: "#50c8ff" },
              { label: "TECH TREATIES", value: "19", color: "#50c8ff" },
              { label: "ACTIVE OCCS",   value: "20", color: "#50c8ff" },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "center", border: "1px solid rgba(255,255,255,0.05)", padding: "8px 12px", borderTop: `2px solid ${s.color}` }}>
                <div style={{ color: s.color, fontSize: 19, fontFamily: serif }}>{s.value}</div>
                <div style={{ color: "#888898", fontSize: 8, letterSpacing: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              background: "transparent", border: "none",
              borderBottom: tab === t.id ? "2px solid #50c8ff" : "2px solid transparent",
              color: tab === t.id ? "#50c8ff" : "#909090",
              fontFamily: mono, fontSize: 11, letterSpacing: 2,
              padding: "10px 16px", cursor: "pointer", whiteSpace: "nowrap",
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "24px 28px" }}>

        {/* SYSTEM MAP */}
        {tab === "map" && (
          <div>
            <SystemMap onSelectBloc={setSelectedBloc} selectedBloc={selectedBloc} onZoneChange={setSelectedZone} selectedZone={selectedZone} />
            <TradeDependencyPanel />
            {selectedZone && (
              <div style={{ marginTop: 16 }}>
                <ZoneDetail zone={ZONE_NODES.find(z => z.id === selectedZone)} />
              </div>
            )}
            {selectedBloc && !selectedZone && (
              <div style={{ marginTop: 16 }}>
                <BlocDetail bloc={BLOCS.find(b => b.id === selectedBloc)} />
              </div>
            )}
            {!selectedBloc && !selectedZone && (
              <div style={{ marginTop: 0, color: "#888898", fontFamily: mono, fontSize: 11, textAlign: "center", padding: "16px", border: "1px dashed rgba(255,255,255,0.03)", borderRadius: 2 }}>
                SELECT A BLOC NODE OR ZONE IN THE SCHEMATIC ABOVE TO LOAD FULL DOSSIER
              </div>
            )}
          </div>
        )}

        {/* BLOC COMPARISON */}
        {tab === "comparison" && <BlocComparison />}

        {/* TREATIES */}
        {tab === "treaties" && (
          <div>
            <div style={{ color: "#888898", fontSize: 11, letterSpacing: 2, marginBottom: 4 }}>POLITICAL & DIPLOMATIC INSTRUMENTS · IA CUSTODY · DIRECT INTER-BLOC APPLICATION</div>
            <div style={{ color: "#888898", fontFamily: mono, fontSize: 11, marginBottom: 14, lineHeight: 1.6 }}>
              These are multilateral agreements between blocs, deposited with and custodied by the Interplanetary Assembly. They govern political relationships, frontier access, mobility, and monetary interoperability directly.
            </div>
            {TREATIES.map(t => <TreatyRow key={t.id} t={t} />)}

            <div style={{ marginTop: 24, marginBottom: 4 }}>
              <div style={{ color: "#888898", fontSize: 11, letterSpacing: 2, marginBottom: 4 }}>AGENCY-ADMINISTERED TECHNICAL TREATIES · DEPOSITED AT IA · ADMINISTERED BY SPECIALISED AGENCIES</div>
              <div style={{ color: "#888898", fontFamily: mono, fontSize: 11, marginBottom: 14, lineHeight: 1.6 }}>
                These are technical, scientific, environmental, health, financial, and trade instruments. Deposited with the IA for legitimacy and archival custody, but day-to-day administration delegated to the relevant specialised agency. They constitute binding interplanetary law within their domains.
              </div>
            </div>
            {[
              { agency: "IEA", agencyName: "Interplanetary Environmental Alliance", color: "#60d860", treaties: [
                { id: "PPC",  name: "Planetary Protection Convention",         scope: "Prevents microbial drift, contamination of pristine bodies, and cross-contamination between habitable worlds." },
                { id: "TEC",  name: "Terraforming Ethics Charter",             scope: "Governs atmospheric modification, mass redistribution, and large-scale climate engineering. Reserved in IA register." },
                { id: "AEF",  name: "Atmospheric Emissions Framework",         scope: "Sets system-wide standards for industrial atmospheric output and extraction-linked emissions." },
                { id: "IEIC", name: "Industrial Environmental Impact Compact", scope: "Environmental compliance obligations for all major extractive operations system-wide." },
                { id: "CRIA", name: "Cryo-Region Integrity Accord",            scope: "Protects cryogenic regions from contamination and habitat encroachment." },
              ]},
              { agency: "ISA", agencyName: "Interplanetary Scientific Authority", color: "#f0a030", treaties: [
                { id: "SAPC",  name: "Scientific Access & Protection Charter",       scope: "Governs research permissions, celestial body access rights, and sample quotas system-wide." },
                { id: "HLASC", name: "High-Risk Laboratory Safety Convention",       scope: "Safety standards for high-energy experiments, reactor-adjacent research, and cryogenic microbe studies." },
                { id: "TCBA",  name: "Titan & Cryogenic Biosignature Accord",        scope: "Protects Titan and Enceladus prebiotic chemistry zones from contamination and exploitative access." },
                { id: "SREC",  name: "System Research Ethics Convention",            scope: "Unified ethics framework: biological research, genetic manipulation, hazardous materials, human subjects." },
                { id: "FSAP",  name: "Frontier Scientific Access Protocol",          scope: "Governs research expeditions to TKA frontier zones and Big Six scientific sites." },
              ]},
              { agency: "ITC", agencyName: "Interplanetary Trade Commission", color: "#f0a030", treaties: [
                { id: "STTC",  name: "System Tariff & Trade Convention",       scope: "Establishes system-wide tariff bands and prevents economic coercion between blocs." },
                { id: "FSHA",  name: "Freight Standards & Handling Accord",    scope: "Accreditation standards for containers, processing facilities, orbital hubs, and mass cargo vessels." },
                { id: "BCPP",  name: "Blue Corridor Protection Protocol",      scope: "Designates and protects high-value freight lanes from interference, piracy, and tariff manipulation." },
                { id: "FREC",  name: "Frontier Resource Export Compact",       scope: "Regulates transport and commercialisation of frontier-origin materials from the Big Six sites." },
              ]},
              { agency: "IFE", agencyName: "Interplanetary Fiscal Exchange", color: "#c8a040", treaties: [
                { id: "SFTA",  name: "System Financial Transparency Accord",          scope: "Fiscal transparency obligations for all blocs operating within the MCCP settlement system." },
                { id: "ILSF",  name: "Inter-bloc Liquidity Stabilisation Framework", scope: "Defines crisis credit lines and liquidity facilities during inter-bloc financial shocks." },
                { id: "CPIP",  name: "Commodity Price Integrity Pact",               scope: "Prevents commodity price manipulation and maintains reference ranges within MCCP bands." },
                { id: "FESC",  name: "Frontier Economic Support Convention",          scope: "Structures frontier logistics credit, emergency economic support, and inter-bloc risk pooling." },
                { id: "AFCCC", name: "Anti-Corruption & Financial Crimes Convention", scope: "Authorises IFE to freeze fraudulent accounts and coordinate system-wide anti-corruption enforcement." },
              ]},
            ].map(group => (
              <div key={group.agency} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, padding: "6px 10px", background: "rgba(255,255,255,0.02)", borderRadius: 2 }}>
                  <span style={{ color: group.color, fontFamily: mono, fontSize: 12, letterSpacing: 1 }}>{group.agency}</span>
                  <span style={{ color: "#a0a0a0", fontFamily: mono, fontSize: 11 }}>{group.agencyName}</span>
                </div>
              {group.treaties.map(t => (
                  <TechTreatyRow key={t.id} t={t} group={group} />
                ))}
              </div>
            ))}

            <div style={{ marginTop: 20, padding: "14px 16px", border: "1px dashed rgba(255,255,255,0.06)", borderRadius: 2 }}>
              <div style={{ color: "#888898", fontSize: 11, letterSpacing: 2, marginBottom: 8 }}>IA DEPOSITED TREATY REGISTER — RESERVED ENTRIES (PENDING MULTILATERAL FRAMEWORK)</div>
              {["Terraforming Ethics Charter (multilateral political version — separate from IEA's TEC technical instrument)", "Cryo-Biome Preservation Convention", "High-Energy Propulsion Safety Accord", "Outer Ice Access Compact"].map(r => (
                <div key={r} style={{ color: "#888898", fontSize: 12, padding: "3px 0", fontFamily: mono }}>○ {r}</div>
              ))}
            </div>
          </div>
        )}

        {/* AGENCIES */}
        {tab === "agencies" && (
          <div>
            <div style={{ color: "#888898", fontSize: 11, letterSpacing: 2, marginBottom: 16 }}>IA SPECIALISED AGENCIES & TKA SECRETARIAT · CLICK TO EXPAND</div>
            {AGENCIES.map(a => {
              const isOpen = agencySel === a.id;
              return (
                <div key={a.id} style={{ marginBottom: 8, border: `1px solid ${isOpen ? a.color + "55" : "rgba(255,255,255,0.06)"}`, borderTop: `2px solid ${isOpen ? a.color : a.color + "33"}`, borderRadius: 2, overflow: "hidden" }}>
                  <div onClick={() => setAgencySel(isOpen ? null : a.id)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", cursor: "pointer", background: isOpen ? `rgba(0,0,0,0.25)` : "rgba(255,255,255,0.01)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ color: a.color, fontFamily: mono, fontSize: 13, letterSpacing: 1, minWidth: 40 }}>{a.id}</span>
                      <div>
                        <div style={{ color: "#e0d8cc", fontFamily: serif, fontSize: 16 }}>{a.name}</div>
                        <div style={{ color: "#909090", fontFamily: mono, fontSize: 11, marginTop: 1 }}>{a.type}</div>
                      </div>
                    </div>
                    <span style={{ color: "#909090", fontSize: 13 }}>{isOpen ? "▲" : "▼"}</span>
                  </div>

                  {isOpen && (
                    <div style={{ padding: "0 16px 16px", background: "rgba(0,0,0,0.2)" }}>
                      <div style={{ color: "#b8b0a8", fontFamily: mono, fontSize: 13, lineHeight: 1.6, marginBottom: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.05)" }}>{a.role}</div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                        <div>
                          <Label>HEADQUARTERS</Label>
                          <div style={{ color: "#b8b0a8", fontFamily: mono, fontSize: 12, lineHeight: 1.5, marginBottom: 10 }}>{a.hq}</div>
                          <Label>MANDATE / KEY FUNCTIONS</Label>
                          {a.mandate.map((m, i) => <div key={i} style={{ color: "#aaa8b0", fontFamily: mono, fontSize: 12, padding: "2px 0", lineHeight: 1.5 }}>› {m}</div>)}
                        </div>
                        <div>
                          <Label>CAN DO</Label>
                          {a.canDo.map((m, i) => <div key={i} style={{ color: "#40c8a0", fontFamily: mono, fontSize: 12, padding: "2px 0" }}>✓ {m}</div>)}
                          <div style={{ marginTop: 8 }} />
                          <Label>CANNOT DO</Label>
                          {a.cannotDo.map((m, i) => <div key={i} style={{ color: "#e05a3a", fontFamily: mono, fontSize: 12, padding: "2px 0" }}>✕ {m}</div>)}
                        </div>
                      </div>

                      <Label>INTER-AGENCY RELATIONSHIPS</Label>
                      <div style={{ color: "#a0a0b0", fontFamily: mono, fontSize: 12, lineHeight: 1.6, marginBottom: 10 }}>{a.interagency}</div>

                      <Label>TREATIES ADMINISTERED / CUSTODIED</Label>
                      <div style={{ color: "#a0a0b0", fontFamily: mono, fontSize: 12, lineHeight: 1.6, marginBottom: 12 }}>{a.treatiesToAdminister}</div>

                      <Label>SYSTEM OFFICES & FIELD PRESENCE</Label>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {a.offices.map((o, i) => (
                          <div key={i} style={{ display: "grid", gridTemplateColumns: "140px 200px 1fr", gap: 10, padding: "5px 0", borderBottom: "1px solid rgba(255,255,255,0.03)", alignItems: "start" }}>
                            <span style={{ color: a.color, fontFamily: mono, fontSize: 11 }}>{o.code}</span>
                            <span style={{ color: "#aaaaaa", fontFamily: mono, fontSize: 12 }}>{o.loc}</span>
                            <span style={{ color: "#909090", fontFamily: mono, fontSize: 12 }}>{o.note}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* System-wide presence grid */}
            <div style={{ marginTop: 24, padding: "14px 16px", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 2 }}>
              <Label style={{ marginBottom: 12 }}>CONSOLIDATED SYSTEM PRESENCE · ALL AGENCIES BY LOCATION</Label>
              {[
                { loc: "Earth / Earth Orbit / EL1–L2", agencies: ["IA (EL1-DC — Primary HQ)", "IJC (EL1-JC — HQ)", "ICC (EL2 — HQ)", "IHC (EL2-BioNex — HQ)", "IFE (TGFR — HQ)", "INA (INAO–Earth)", "ITC (EOTS — HQ)", "ISA (ISAO–Earth)", "IHCO–Earth"] },
                { loc: "Mars / Mars Orbit", agencies: ["IEA (MHEA — HQ)", "INA (INAO–Mars)", "ICC (ICCO–Mars)", "IJC (IJCO–Mars — Criminal Field Wing)", "IFE (IFEO–Mars — Settlement Hub)", "ITC (MOTD — HQ)", "ISA (ISAO–Mars)", "IHC (IHCO–Mars)"] },
                { loc: "Ceres / Belt", agencies: ["ISA (CL4-SAC — HQ)", "IA (IARO–Ceres — Regional Office)", "INA (INAO–Ceres)", "ICC (ICCO–Ceres)", "IEA (IEAO–Ceres)", "IJC (IJCO–Ceres)", "ITC (ITCO–Ceres)", "IHC (IHCO–Ceres)"] },
                { loc: "Ganymede / Callisto / JFA", agencies: ["INA (INA-GAN — HQ)", "ICC (ICCO–Ganymede)", "IEA (IEAO–Callisto)", "IJC (IJCO–Callisto — Piracy Unit)", "ITC (ITCO–Ganymede)", "IHC (IHCO–Ganymede)"] },
                { loc: "Europa / JFA", agencies: ["ISA (ISAO–Europa — Cryo-Oceanic Lab)"] },
                { loc: "Titan / Saturn / SatCon", agencies: ["IEA (IEAO–Titan)", "IHC (IHCO–Titan — Cryo-Pathogen)", "IJC (IJCO–Titan — Frontier Liaison)", "ISA (ISAO–Titan)", "ITC (ITCO–Titan)"] },
                { loc: "FarReach Gateway / Saturn Orbit", agencies: ["TKA (FRG — primary base)", "INA (INAO–FarReach)", "ICC (ICCO–FarReach)", "ITC (ITCO–FarReach — Frontier Commerce)", "ISA (ISAO–FRG)", "IA (IACH–FarReach liaison)"] },
                { loc: "Kuiper Gateway Station (~100 AU)", agencies: ["TKA (KGS — outer frontier station)"] },
              ].map(row => (
                <div key={row.loc} style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 12, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", alignItems: "start" }}>
                  <div style={{ color: "#b0b0b0", fontFamily: mono, fontSize: 12 }}>{row.loc}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {row.agencies.map((ag, i) => (
                      <span key={i} style={{ color: "#a0a0a0", fontFamily: mono, fontSize: 11, border: "1px solid rgba(255,255,255,0.05)", padding: "2px 6px", borderRadius: 2 }}>{ag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GRAVITY TABLE */}
        {tab === "gravity" && <GravityTable />}

        {/* MOBILITY */}
        {tab === "mobility" && <MobilityPanel />}

        {/* CULTURAL CODEX */}
        {tab === "culture" && (
          <div>
            <div style={{ color: "#888898", fontSize: 11, letterSpacing: 2, marginBottom: 16 }}>INTERPLANETARY DEMONYM & VERNACULAR CODEX · ISD CULTURAL DIVISION</div>
            <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
              {CULTURAL.map(c => {
                const meta = BLOC_META[c.bloc];
                return (
                  <button key={c.bloc} onClick={() => setCultureSel(c.bloc)} style={{
                    background: cultureSel === c.bloc ? meta.color : "transparent",
                    border: `1px solid ${meta.color}`,
                    color: cultureSel === c.bloc ? "#060810" : meta.color,
                    fontFamily: mono, fontSize: 12, padding: "5px 14px",
                    borderRadius: 2, cursor: "pointer", letterSpacing: 1, fontWeight: 600,
                  }}>{c.bloc}</button>
                );
              })}
            </div>
            {(() => {
              const data = CULTURAL.find(c => c.bloc === cultureSel);
              const meta = BLOC_META[cultureSel];
              const bloc = BLOCS.find(b => b.id === cultureSel);
              if (!data) return null;
              return (
                <div>
                  <div style={{ fontFamily: serif, fontSize: 22, color: meta.color, marginBottom: 2 }}>{bloc.name}</div>
                  <div style={{ fontFamily: mono, fontSize: 12, color: "#909090", marginBottom: 20 }}>{bloc.tagline}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    <div>
                      <Label>OFFICIAL & RECOGNISED DEMONYMS</Label>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                        {data.demonyms.map(d => <span key={d} style={{ color: meta.color, border: `1px solid ${meta.color}33`, fontFamily: mono, fontSize: 12, padding: "3px 8px", borderRadius: 2 }}>{d}</span>)}
                      </div>
                      <Label>LIVED ENVIRONMENT</Label>
                      <div style={{ color: "#b8b0a8", fontFamily: mono, fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>{data.lived}</div>
                      <Label>SOCIAL RITUALS</Label>
                      {data.rituals.map((r, i) => <div key={i} style={{ color: "#aaa8a8", fontFamily: mono, fontSize: 13, padding: "3px 0", lineHeight: 1.5 }}>› {r}</div>)}
                    </div>
                    <div>
                      <Label>VERNACULAR CODEX ENTRIES</Label>
                      {data.slang.map((s, i) => (
                        <div key={i} style={{ marginBottom: 12, borderLeft: `2px solid ${meta.color}44`, paddingLeft: 10 }}>
                          <div style={{ color: meta.color, fontFamily: mono, fontSize: 13 }}>{s.term}</div>
                          <div style={{ color: "#aaa8a8", fontFamily: mono, fontSize: 12, marginTop: 2, lineHeight: 1.5 }}>{s.meaning}</div>
                        </div>
                      ))}
                      <Label style={{ marginTop: 10 }}>KEY INTER-BLOC LINGUISTIC TENSIONS</Label>
                      {data.tensions.map((t, i) => (
                        <div key={i} style={{ marginBottom: 10, background: "rgba(0,0,0,0.2)", padding: "8px 10px", borderRadius: 2 }}>
                          <div style={{ color: "#b0b0b0", fontFamily: mono, fontSize: 12, marginBottom: 4 }}>{t.pair}</div>
                          <div style={{ color: "#a09898", fontFamily: mono, fontSize: 12, lineHeight: 1.5 }}>{t.note}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* SEARCH */}
        {tab === "search" && (
          <div>
            <div style={{ color: "#888898", fontSize: 11, letterSpacing: 2, marginBottom: 16 }}>FULL-REGISTRY KEYWORD SEARCH · BLOCS · OCCS · CONFLICT ZONES · AGENCIES</div>
            <SearchPanel query={searchQuery} setQuery={setSearchQuery} />
          </div>
        )}

      </div>

      {/* ── TICKER FOOTER ── */}
      {(() => {
        const ticks = [
          "INA ADVISORY · Blue Corridor operational · all segments nominal · next perihelion alignment window: 14 sols",
          "IFE MCCP RATES · 1 TSC = 0.91 MRM · 1.28 BMT · 0.77 JHU · 1.13 SSN · within standard stability bands",
          "ITC NOTICE · ITCO–Ceres: Belt industrial export queue elevated · estimated clearance delay: 3–5 sols",
          "IHC BULLETIN · G4/G5 downwell acclimation programme — next cohort intake: Ganymede node · contact IHCO–Ganymede",
          "TKA SECRETARIAT · Frontier rotation window open · FRR applications via INA transit approval · IHC clearance required",
          "INA IGSC NOTICE · USZ gravitational assist window active · slingshot schedule filed · waypoint telemetry mandatory",
          "IA PLENUM · Annual System Governance Cycle session confirmed · all bloc delegations notified · venue: Ceres Neutral Zone",
          "IEA ADVISORY · Extraction impact audit in progress · Koronis Worker Bloc region · IEAO–Ceres coordinating",
          "ISA NOTICE · Big Six research cycle rotation · Pluto–Charon site access queue open · FSIO coordinating allocations",
          "IJC BULLETIN · Arbitration Field Office Ceres: Belt-origin tariff dispute hearing scheduled · parties notified",
          "IFE COMMODITY · Belt Mutual Token within band · BMT volatility index: nominal · no IFE/ITC joint advisory triggered",
          "INA CORRIDOR · Martian-Jovian Corridor (MF ↔ Belt ↔ Jovians): STL segment Pallas → Ganymede · minor debris advisory active",
          "FRONTIER DISPATCH · FarReach Gateway: convoy departure window T-minus 6 sols · FRR rotation cohort embarking",
          "IHC LTAM · Cryo-pathogen survey complete · Enceladus sector cleared · IHCO–Titan report filed with ISA",
          "ITC FRONTIER · Makemake propellant export certified · ITCO–FarReach cleared for inner-system dispatch",
          "IA REGISTRY · TKARC review cycle: Quaoar — next joint IHC/TKA assessment in 3 standard years",
          "CULTURAL NOTE · Long-haul convoy log, FRG departure: 'Passing the Lords' — Skipped Lords transited · deep frontier ahead",
          "ISA SAPC · Chariklo Rings Analysis Accord data window open · SatCon priority access period: 30 sols",
          "IFE ADVISORY · Jovian He-3 futures index stable · radiation cycle adjustment factored · no volatility alert",
          "ICC HRN · Timestamp synchronisation complete · all relay nodes nominal · deep-frontier latency: within protocol",
          "INA HAMMERFALL · High-energy burn registry updated · all scheduled burns filed · aurora compliance confirmed",
          "IEA TERRAFORMING · MF Green Zone atmospheric reading nominal · Amber Zone dust monitoring elevated — routine",
          "IJC PIRACY UNIT · Callisto node: convoy raid investigation ongoing · INA navigation fraud referral received",
          "TKA NOTICE · Quaoar TKARC — school registration open · FMN clinic presence confirmed · hab-ring gravity: compliant",
        ];
        const charWidth = 7.2;
        const gap = 80;
        const totalWidth = ticks.reduce((a, t) => a + t.length * charWidth + gap, 0);
        const duration = Math.round(totalWidth / 60);
        const keyframes = `@keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-${Math.round(totalWidth)}px); } }`;
        return (
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#02040a", borderTop: "1px solid rgba(74,158,255,0.12)", height: 28, overflow: "hidden", zIndex: 100, display: "flex", alignItems: "center" }}>
            <style>{keyframes}</style>
            <div style={{ flexShrink: 0, padding: "0 14px", borderRight: "1px solid rgba(80,200,255,0.15)", fontFamily: mono, fontSize: 11, color: "#50c8ff", letterSpacing: 2, whiteSpace: "nowrap" }}>
              IA · ISD LIVE
            </div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div style={{ display: "flex", whiteSpace: "nowrap", animation: `ticker ${duration}s linear infinite`, willChange: "transform" }}>
                {[...ticks, ...ticks].map((t, i) => {
                  const parts = t.split(" · ");
                  return (
                    <span key={i} style={{ display: "inline-flex", alignItems: "center", paddingRight: `${gap}px` }}>
                      <span style={{ color: "#50c8ff55", fontFamily: mono, fontSize: 11, marginRight: 8 }}>◆</span>
                      <span style={{ color: "#50c8ff", fontFamily: mono, fontSize: 11, marginRight: 3 }}>{parts[0]}</span>
                      {parts.slice(1).map((p, j) => (
                        <span key={j} style={{ color: "#8888aa", fontFamily: mono, fontSize: 11 }}> · {p}</span>
                      ))}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
