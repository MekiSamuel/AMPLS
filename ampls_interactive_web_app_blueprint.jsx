import React, { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Baby,
  BookOpen,
  Brain,
  Calculator,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Flame,
  HeartPulse,
  Home,
  Map,
  Menu,
  Search,
  Stethoscope,
  Truck,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";

const chapters = [
  {
    id: 1,
    title: "Emergency Triage Assessment & Treatment",
    pages: "21-25",
    category: "Triage",
    icon: ClipboardCheck,
    summary: "Use ABCCCD to rapidly identify children needing immediate treatment, priority care, or queue assessment.",
    actions: ["Assess airway obstruction", "Check severe respiratory distress/cyanosis", "Assess shock", "Check coma/convulsions", "Assess severe dehydration"],
    tags: ["ABCCCD", "ETAT", "Emergency", "Priority"],
  },
  {
    id: 2,
    title: "Basic Life Support",
    pages: "26-43",
    category: "Resuscitation",
    icon: HeartPulse,
    summary: "SAFE approach, airway opening, rescue breaths, CPR, and choking management for infants and children.",
    actions: ["Safety, stimulate, shout", "Open airway", "Look/listen/feel <=10 sec", "5 rescue breaths", "15:2 CPR if no pulse/HR <60/no signs of life"],
    tags: ["CPR", "BLS", "Choking", "Airway"],
  },
  {
    id: 3,
    title: "Child with Breathing Difficulty",
    pages: "44-56",
    category: "Breathing",
    icon: Stethoscope,
    summary: "Differentiate stridor, wheeze, pneumonia, bronchiolitis, asthma, and cardiac causes of respiratory distress.",
    actions: ["Assess effort, efficacy, effects", "Clarify respiratory noise", "Treat severe distress immediately", "Escalate for life-threatening features"],
    tags: ["Stridor", "Wheeze", "Asthma", "Pneumonia"],
  },
  {
    id: 4,
    title: "Practical Procedures: Airway & Breathing",
    pages: "57-75",
    category: "Procedures",
    icon: Activity,
    summary: "Airway adjuncts, oxygen delivery, CPAP, intubation preparation, and blocked tracheostomy response.",
    actions: ["Size OPA/NPA", "Deliver oxygen safely", "Monitor SpO2 and work of breathing", "Use DOPE for CPAP problems"],
    tags: ["Oxygen", "CPAP", "OPA", "NPA", "Intubation"],
  },
  {
    id: 5,
    title: "Shock",
    pages: "76-88",
    category: "Circulation",
    icon: AlertTriangle,
    summary: "Recognise hypovolaemic, distributive, dissociative, cardiogenic, and malnutrition-associated shock.",
    actions: ["Identify shock type", "Give appropriate fluids/blood", "Treat sepsis/anaphylaxis/anaemia", "Reassess frequently"],
    tags: ["Shock", "Sepsis", "Anaemia", "Fluids"],
  },
  {
    id: 7,
    title: "Cardiac Arrest",
    pages: "98-109",
    category: "Resuscitation",
    icon: HeartPulse,
    summary: "Manage shockable and non-shockable rhythms, reversible causes, defibrillation, and arrest drugs.",
    actions: ["Start CPR", "Identify rhythm", "Treat 4 Hs and 4 Ts", "Give adrenaline/amiodarone when indicated"],
    tags: ["Arrest", "VF", "PEA", "Defibrillation"],
  },
  {
    id: 10,
    title: "Convulsing Child",
    pages: "131-136",
    category: "Neurology",
    icon: Brain,
    summary: "Emergency treatment pathways for seizures in children over 2 weeks and neonates.",
    actions: ["Check glucose", "Give first-line benzodiazepine", "Escalate to phenobarbitone/phenytoin", "Protect airway"],
    tags: ["Seizure", "Glucose", "Diazepam", "Phenobarbitone"],
  },
  {
    id: 16,
    title: "Burn Injuries",
    pages: "182-193",
    category: "Trauma",
    icon: Flame,
    summary: "Assess burn severity, surface area, depth, emergency management, fluids, analgesia, transfer, and infection risk.",
    actions: ["Stop burning", "Assess airway", "Estimate TBSA", "Calculate fluids", "Manage pain"],
    tags: ["Burns", "TBSA", "Fluids", "Pain"],
  },
  {
    id: 21,
    title: "Transfer of a Sick or Injured Child",
    pages: "233-238",
    category: "Transfer",
    icon: Truck,
    summary: "Stabilise before transfer, identify children requiring transfer, communicate, prepare, and hand over safely.",
    actions: ["Stabilise first", "Prepare equipment/drugs", "Communicate with receiving team", "Use structured handover"],
    tags: ["Transfer", "Handover", "Stabilisation"],
  },
  {
    id: 101,
    title: "Appendix A: The Normal Child",
    pages: "239-243",
    category: "Reference",
    icon: Baby,
    summary: "Normal paediatric weight estimates, heart rate, respiratory rate, blood pressure, anatomy, and physiology.",
    actions: ["Estimate weight", "Compare vitals by age", "Recognise age-specific anatomy"],
    tags: ["Vitals", "Weight", "Age"],
  },
  {
    id: 110,
    title: "Appendix J: Formulary",
    pages: "303-318",
    category: "Reference",
    icon: Calculator,
    summary: "Safe prescribing and drug dosing reference for emergency paediatric care.",
    actions: ["Check weight-based dose", "Confirm maximum dose", "Document route and timing"],
    tags: ["Formulary", "Dosing", "Drugs"],
  },
];

const triageRules = [
  { key: "obstructedBreathing", label: "Obstructed breathing, central cyanosis, severe respiratory distress, or weak/absent breathing", group: "Airway & Breathing" },
  { key: "shock", label: "Cold hands plus capillary refill >3 seconds plus weak fast pulse", group: "Circulation" },
  { key: "slowPulse", label: "Slow pulse <60/min or absent pulse", group: "Circulation" },
  { key: "coma", label: "AVPU = Pain or Unresponsive", group: "Coma" },
  { key: "convulsing", label: "Currently convulsing", group: "Convulsions" },
  { key: "dehydration", label: "Severe dehydration: sunken eyes, reduced skin pinch, lethargy", group: "Dehydration" },
];

const priorityRules = [
  "Tiny baby <2 months",
  "Temperature >38.5 C",
  "Trauma",
  "Pallor - very pale",
  "Poisoning",
  "Severe pain",
  "Restless, irritable, or floppy",
  "Mild-moderate respiratory distress",
  "Urgent referral letter",
  "Malnutrition",
  "Oedema of both feet",
  "Severe burns",
];

const calculators = [
  {
    id: "glucose",
    calculate: weight => ({
      label: "10% dextrose for hypoglycaemia",
      value: `${(5 * weight).toFixed(1)} ml`,
      note: "Dose: 5 ml/kg of 10% dextrose. Recheck glucose after 30 minutes.",
    }),
  },
  {
    id: "fluidBolus",
    calculate: weight => ({
      label: "Initial shock fluid bolus",
      value: `${(10 * weight).toFixed(1)} ml`,
      note: "Dose: 10 ml/kg Ringer lactate or 0.9% saline; reassess and repeat only when indicated.",
    }),
  },
  {
    id: "adrenalineIm",
    calculate: weight => ({
      label: "IM adrenaline for anaphylaxis",
      value: `${Math.min(0.01 * weight, 0.5).toFixed(2)} ml`,
      note: "Using 1:1000 adrenaline; max 0.5 ml.",
    }),
  },
  {
    id: "prednisolone",
    calculate: weight => ({
      label: "Prednisolone for asthma/croup",
      value: `${Math.min(2 * weight, 40).toFixed(1)} mg`,
      note: "Dose shown at 2 mg/kg; max 40 mg.",
    }),
  },
];

const quiz = [
  { id: "triage-shock", q: "A child has cold hands, weak fast pulse, and CRT >3 seconds. What triage category?", a: "Emergency", options: ["Queue", "Priority", "Emergency"] },
  { id: "bls-assessment-time", q: "In BLS, how long should breathing/pulse assessment take?", a: "No more than 10 seconds", options: ["No more than 10 seconds", "30 seconds", "2 minutes"] },
  { id: "cpr-ratio", q: "For paediatric CPR over 28 days of life, what ratio is used?", a: "15 compressions : 2 breaths", options: ["30:2", "15 compressions : 2 breaths", "3:1"] },
];

const buildSteps = [
  ["extract", "1. Extract", "Parse PDF into chapters, headings, tables, figures, drug doses, algorithms, page references, and glossary terms."],
  ["structure", "2. Structure", "Create JSON content models: chapters, emergency signs, priority signs, procedures, calculators, drugs, quiz items, images, and citations."],
  ["ux", "3. Clinical UX", "Use an emergency-first layout: red emergency actions, amber priority prompts, green stable guidance, minimal taps, offline-first mobile design."],
  ["interactivity", "4. Interactivity", "Add triage wizard, ABCCCD checklist, weight-based dosing helpers, procedure mode, search, filters, scenario quizzes, bookmarks, and print handouts."],
  ["safety", "5. Safety", "Show source page, revision date, local protocol disclaimer, max-dose warnings, confirmation steps, and escalation prompts for urgent transfer."],
  ["data", "6. Data", "Store content as versioned JSON; keep user data local unless authentication is added; record training progress without patient identifiers."],
  ["tech", "7. Tech", "React/Next.js, Tailwind, indexed full-text search, PWA offline cache, JSON schema validation, content admin import pipeline."],
  ["qa", "8. QA", "Clinician review, dose calculator unit tests, accessibility testing, low-bandwidth testing, and scenario-based usability testing."],
];

const navItems = [
  { id: "home", icon: Home, label: "Overview" },
  { id: "map", icon: Map, label: "AI build map" },
  { id: "triage", icon: ClipboardCheck, label: "Triage tool" },
  { id: "calculator", icon: Calculator, label: "Dose helpers" },
  { id: "library", icon: BookOpen, label: "Content library" },
  { id: "quiz", icon: CheckCircle2, label: "Training quiz" },
];

function Pill({ children }) {
  return <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">{children}</span>;
}

function SectionTitle({ icon: Icon, title, subtitle }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <div className="rounded-2xl bg-emerald-100 p-3">
        <Icon className="h-5 w-5 text-emerald-700" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}

function getTriageResult(checks, priorityChecks) {
  if (Object.values(checks).some(Boolean)) {
    return { label: "EMERGENCY - treat now", tone: "bg-red-50 text-red-800 border-red-200" };
  }

  if (Object.values(priorityChecks).some(Boolean)) {
    return { label: "PRIORITY - see as soon as possible", tone: "bg-amber-50 text-amber-800 border-amber-200" };
  }

  return { label: "QUEUE - no emergency or priority signs selected", tone: "bg-emerald-50 text-emerald-800 border-emerald-200" };
}

export default function AMPLSAppMap() {
  const [tab, setTab] = useState("home");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [checks, setChecks] = useState({});
  const [priorityChecks, setPriorityChecks] = useState({});
  const [weight, setWeight] = useState(12);
  const [quizIndex, setQuizIndex] = useState(0);
  const [answer, setAnswer] = useState("");

  const categories = useMemo(() => ["All", ...Array.from(new Set(chapters.map(chapter => chapter.category)))], []);

  const filteredChapters = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return chapters.filter(chapter => {
      const matchesCategory = category === "All" || chapter.category === category;
      const searchableText = [chapter.title, chapter.summary, chapter.category, ...chapter.tags, ...chapter.actions].join(" ").toLowerCase();
      return matchesCategory && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });
  }, [category, query]);

  const calculatedResults = useMemo(
    () => calculators.map(calculator => ({ id: calculator.id, ...calculator.calculate(weight) })),
    [weight]
  );

  const currentQuiz = quiz[quizIndex] ?? quiz[0];
  const triageResult = getTriageResult(checks, priorityChecks);

  const updateEmergencyCheck = (key, checked) => {
    setChecks(previous => ({ ...previous, [key]: checked }));
  };

  const updatePriorityCheck = (key, checked) => {
    setPriorityChecks(previous => ({ ...previous, [key]: checked }));
  };

  const goToNextQuestion = () => {
    setAnswer("");
    setQuizIndex(previous => (previous + 1) % quiz.length);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-600 p-2">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black">AMPLS Interactive Clinical Companion</h1>
              <p className="text-xs text-slate-500">Prototype application map generated from the Advanced Malawian Paediatric Life Support manual</p>
            </div>
          </div>
          <Menu className="h-5 w-5 text-slate-400" />
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-[240px_1fr]">
        <aside className="rounded-3xl border bg-white p-3 shadow-sm md:sticky md:top-20 md:h-fit">
          {navItems.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`mb-1 flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm transition ${tab === id ? "bg-emerald-600 text-white shadow" : "hover:bg-slate-100"}`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </aside>

        <section>
          {tab === "home" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="rounded-3xl bg-gradient-to-br from-emerald-700 to-slate-900 p-8 text-white shadow-lg">
                <h2 className="max-w-3xl text-4xl font-black tracking-tight">Fast, searchable, interactive paediatric emergency guidance for Malawi-aligned care.</h2>
                <p className="mt-4 max-w-2xl text-emerald-50">This app converts the PDF manual into triage workflows, searchable chapter cards, calculators, procedure checklists, decision pathways, and training quizzes.</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {["ABCCCD triage", "Weight-based helpers", "Scenario training"].map(item => (
                    <div key={item} className="rounded-2xl bg-white/10 p-4 font-semibold backdrop-blur">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {chapters.slice(0, 6).map(({ id, icon: Icon, title, summary }) => (
                  <div key={id} className="rounded-3xl border bg-white p-5 shadow-sm">
                    <Icon className="mb-3 h-6 w-6 text-emerald-600" />
                    <h3 className="font-bold">{title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{summary}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {tab === "map" && (
            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <SectionTitle icon={Map} title="Complete AI build map" subtitle="Use this as the implementation prompt/spec for a development AI or product team." />
              <div className="grid gap-4 lg:grid-cols-2">
                {buildSteps.map(([id, heading, text]) => (
                  <div key={id} className="rounded-2xl border bg-slate-50 p-5">
                    <h3 className="font-bold text-emerald-700">{heading}</h3>
                    <p className="mt-2 text-sm text-slate-600">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "triage" && (
            <div className="space-y-5 rounded-3xl border bg-white p-6 shadow-sm">
              <SectionTitle icon={ClipboardCheck} title="ABCCCD triage decision tool" subtitle="Select signs present. The output updates immediately." />
              <div className={`rounded-2xl border p-5 text-xl font-black ${triageResult.tone}`}>{triageResult.label}</div>
              <div className="grid gap-3 lg:grid-cols-2">
                <div>
                  <h3 className="mb-3 font-bold">Emergency signs</h3>
                  {triageRules.map(rule => (
                    <label key={rule.key} className="mb-2 flex gap-3 rounded-2xl border p-3 hover:bg-slate-50">
                      <input type="checkbox" checked={Boolean(checks[rule.key])} onChange={event => updateEmergencyCheck(rule.key, event.target.checked)} />
                      <span><b>{rule.group}:</b> {rule.label}</span>
                    </label>
                  ))}
                </div>
                <div>
                  <h3 className="mb-3 font-bold">Priority signs: 3TPRMOB</h3>
                  {priorityRules.map(rule => (
                    <label key={rule} className="mb-2 flex gap-3 rounded-2xl border p-3 hover:bg-slate-50">
                      <input type="checkbox" checked={Boolean(priorityChecks[rule])} onChange={event => updatePriorityCheck(rule, event.target.checked)} />
                      <span>{rule}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "calculator" && (
            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <SectionTitle icon={Calculator} title="Weight-based helper cards" subtitle="Prototype calculators for common emergency values. Final app needs clinician validation." />
              <label className="block text-sm font-semibold" htmlFor="weight-range">Child weight: {weight} kg</label>
              <input
                id="weight-range"
                className="mt-2 w-full"
                type="range"
                min="2"
                max="60"
                step="0.5"
                value={weight}
                onChange={event => setWeight(Number(event.target.value))}
              />
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {calculatedResults.map(result => (
                  <div key={result.id} className="rounded-2xl border bg-slate-50 p-5">
                    <h3 className="font-bold">{result.label}</h3>
                    <p className="mt-2 text-3xl font-black text-emerald-700">{result.value}</p>
                    <p className="mt-2 text-sm text-slate-600">{result.note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "library" && (
            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <SectionTitle icon={BookOpen} title="Searchable content library" subtitle="Filter the extracted manual into actionable clinical cards." />
              <div className="mb-4 flex flex-col gap-3 md:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    value={query}
                    onChange={event => setQuery(event.target.value)}
                    placeholder="Search chapters, tags, or actions..."
                    className="w-full rounded-2xl border py-2 pl-10 pr-3"
                  />
                </div>
                <select value={category} onChange={event => setCategory(event.target.value)} className="rounded-2xl border px-3 py-2">
                  {categories.map(item => <option key={item}>{item}</option>)}
                </select>
              </div>
              <div className="grid gap-4">
                {filteredChapters.map(({ id, icon: Icon, title, pages, category: chapterCategory, summary, tags, actions }) => (
                  <div key={id} className="rounded-2xl border p-5 hover:bg-slate-50">
                    <div className="flex items-start gap-4">
                      <Icon className="mt-1 h-6 w-6 text-emerald-600" />
                      <div className="flex-1">
                        <h3 className="font-bold">{title}</h3>
                        <p className="text-sm text-slate-500">Pages {pages} - {chapterCategory}</p>
                        <p className="mt-2 text-sm text-slate-700">{summary}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {tags.map(tag => <Pill key={`${id}-${tag}`}>{tag}</Pill>)}
                        </div>
                        <ul className="mt-3 grid gap-1 text-sm text-slate-600">
                          {actions.map(action => (
                            <li key={`${id}-${action}`} className="flex items-center gap-2">
                              <ChevronRight className="h-3 w-3" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "quiz" && (
            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <SectionTitle icon={CheckCircle2} title="Scenario training quiz" subtitle="Fast checks for learners; expandable into OSCE-style modules." />
              <h3 className="text-xl font-bold">{currentQuiz.q}</h3>
              <div className="mt-5 grid gap-3">
                {currentQuiz.options.map(option => (
                  <button key={`${currentQuiz.id}-${option}`} type="button" onClick={() => setAnswer(option)} className="rounded-2xl border p-4 text-left hover:bg-slate-50">
                    {option}
                  </button>
                ))}
              </div>
              {answer && (
                <div className={`mt-5 flex items-center gap-3 rounded-2xl p-4 ${answer === currentQuiz.a ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}>
                  {answer === currentQuiz.a ? <CheckCircle2 /> : <XCircle />}
                  {answer === currentQuiz.a ? "Correct" : `Not quite. Correct answer: ${currentQuiz.a}`}
                </div>
              )}
              <button type="button" className="mt-5 rounded-2xl bg-emerald-600 px-5 py-3 font-bold text-white" onClick={goToNextQuestion}>Next question</button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
