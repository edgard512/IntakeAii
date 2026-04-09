import { useState } from "react";

// ── TRANSLATIONS ──────────────────────────────────────────────────────────────
const T = {
  en: {
    langToggle: "Español", langFlag: "🇪🇸",
    // Demo mode
    demoTitle: "IntakeAI Live Demo",
    demoSub: "See the full patient-to-doctor workflow in real time",
    patientView: "Patient View",
    doctorView: "Doctor View",
    demoTip: "Fill the form → AI generates in the background on the Review step → by submit time the summary is already ready on Doctor View",
    // Intake steps
    steps: ["Personal Info", "Visit Reason", "Medical History", "Medications", "Review"],
    stepOf: (s, t) => `Step ${s} of ${t}`,
    personalTitle: "Personal Information",
    firstName: "First Name", firstNamePh: "Maria",
    lastName: "Last Name", lastNamePh: "Garcia",
    dob: "Date of Birth",
    sex: "Sex", sexOptions: ["Select", "Male", "Female", "Non-binary", "Prefer not to say"],
    phone: "Phone", phonePh: "(512) 555-0192",
    email: "Email", emailPh: "maria@email.com",
    visitTitle: "Reason for Visit",
    visitReason: "What brings you in today?",
    visitReasonPh: "e.g. chest pain, follow-up, annual checkup...",
    symptoms: "Describe your symptoms in detail",
    symptomsPh: "Where is the pain? Does it radiate? What makes it better or worse?",
    duration: "How long have you had these symptoms?",
    durationPh: "e.g. 3 days, 2 weeks",
    painLevel: (n) => `Pain Level: ${n}/10`,
    noPain: "No pain", worstPain: "Worst pain",
    historyTitle: "Medical History",
    conditionsLabel: "Select all conditions that apply",
    conditions: ["Diabetes", "Hypertension", "Heart Disease", "Asthma/COPD", "Thyroid Disorder", "Cancer", "Arthritis", "Depression/Anxiety", "None of the above"],
    surgeries: "Prior surgeries or hospitalizations",
    surgeriesPh: "List any surgeries with approximate dates...",
    familyHistory: "Family medical history",
    familyHistoryPh: "e.g. Father: heart disease, Mother: diabetes",
    smoking: "Smoking status", smokingOptions: ["Select", "Never", "Former smoker", "Current smoker"],
    alcohol: "Alcohol use", alcoholOptions: ["Select", "None", "Occasional", "Moderate (1-2/day)", "Heavy (3+/day)"],
    medsTitle: "Medications & Allergies",
    medications: "Current medications (include dosage if known)",
    medicationsPh: "e.g. Lisinopril 10mg daily...",
    allergies: "Known drug or food allergies",
    allergiesPh: "e.g. Penicillin (hives), Shellfish (anaphylaxis)...",
    supplements: "Vitamins or supplements",
    supplementsPh: "e.g. Vitamin D, Fish Oil...",
    reviewTitle: "Review Your Information",
    reviewNote: "Everything correct? Submit to send your intake to the doctor.",
    back: "← Back", continue: "Continue →",
    submit: "✦ Submit Intake", submitting: "Submitting...",
    submitted: "✓ Intake Submitted!",
    submittedSub: "Your information has been sent to the doctor. Your AI clinical summary is ready — switch to Doctor View now.",
    switchToDoctor: "Switch to Doctor View →",
    // Doctor dashboard
    queueTitle: "Today's Patient Queue",
    generating: "Generating AI Summary...",
    genBtn: "✦ Generate Clinical Summary",
    summaryReady: "✓ Summary ready",
    copyBtn: "Copy", markComplete: "Mark Complete",
    aiLabel: "AI CLINICAL SUMMARY",
    painLabel: "Pain",
    newPatient: "New Patient",
    waiting: "Waiting", inProgress: "In Progress", completed: "Completed",
    chiefComplaint: "Chief Complaint", symptomsLabel: "Symptoms",
    durationLabel: "Duration", painLevelLabel: "Pain Level",
    medsLabel: "Medications", allergiesLabel: "Allergies",
    conditionsLabel2: "Conditions", surgeriesLabel: "Surgeries",
    familyLabel: "Family History", smokingLabel: "Smoking", alcoholLabel: "Alcohol",
    tabSummary: "AI Summary", tabIntake: "Intake", tabHistory: "History",
    backToQueue: "← Queue",
    noSummaryYet: "No summary generated yet.",
    footer: "IntakeAI · Bilingual Patient Intake · Live Demo",
  },
  es: {
    langToggle: "English", langFlag: "🇺🇸",
    demoTitle: "Demo en Vivo — IntakeAI",
    demoSub: "Vea el flujo completo de paciente a médico en tiempo real",
    patientView: "Vista del Paciente",
    doctorView: "Vista del Médico",
    demoTip: "Llene el formulario → el resumen IA se genera en segundo plano → al enviar, el resumen ya está listo en Vista del Médico",
    steps: ["Información Personal", "Motivo de Visita", "Historia Médica", "Medicamentos", "Revisión"],
    stepOf: (s, t) => `Paso ${s} de ${t}`,
    personalTitle: "Información Personal",
    firstName: "Nombre", firstNamePh: "María",
    lastName: "Apellido", lastNamePh: "García",
    dob: "Fecha de Nacimiento",
    sex: "Sexo", sexOptions: ["Seleccionar", "Masculino", "Femenino", "No binario", "Prefiero no decir"],
    phone: "Teléfono", phonePh: "(512) 555-0192",
    email: "Correo Electrónico", emailPh: "maria@correo.com",
    visitTitle: "Motivo de la Visita",
    visitReason: "¿Qué le trae hoy a la clínica?",
    visitReasonPh: "p. ej. dolor en el pecho, seguimiento, chequeo anual...",
    symptoms: "Describa sus síntomas en detalle",
    symptomsPh: "¿Dónde siente el dolor? ¿Se irradia? ¿Qué lo mejora o empeora?",
    duration: "¿Hace cuánto tiempo tiene estos síntomas?",
    durationPh: "p. ej. 3 días, 2 semanas",
    painLevel: (n) => `Nivel de Dolor: ${n}/10`,
    noPain: "Sin dolor", worstPain: "Peor dolor",
    historyTitle: "Historia Médica",
    conditionsLabel: "Seleccione todas las condiciones que apliquen",
    conditions: ["Diabetes", "Hipertensión", "Enfermedad Cardíaca", "Asma/EPOC", "Trastorno Tiroideo", "Cáncer", "Artritis", "Depresión/Ansiedad", "Ninguna de las anteriores"],
    surgeries: "Cirugías u hospitalizaciones previas",
    surgeriesPh: "Liste cirugías con fechas aproximadas...",
    familyHistory: "Historia médica familiar",
    familyHistoryPh: "p. ej. Padre: enfermedad cardíaca, Madre: diabetes",
    smoking: "Estado de fumador", smokingOptions: ["Seleccionar", "Nunca fumó", "Ex-fumador", "Fumador actual"],
    alcohol: "Consumo de alcohol", alcoholOptions: ["Seleccionar", "No consume", "Ocasional", "Moderado (1-2/día)", "Excesivo (3+/día)"],
    medsTitle: "Medicamentos y Alergias",
    medications: "Medicamentos actuales (incluya dosis si la conoce)",
    medicationsPh: "p. ej. Lisinopril 10mg diario...",
    allergies: "Alergias conocidas a medicamentos o alimentos",
    allergiesPh: "p. ej. Penicilina (urticaria), Mariscos (anafilaxis)...",
    supplements: "Vitaminas o suplementos",
    supplementsPh: "p. ej. Vitamina D, Aceite de Pescado...",
    reviewTitle: "Revise su Información",
    reviewNote: "¿Todo es correcto? Envíe para que el médico reciba su ingreso.",
    back: "← Atrás", continue: "Continuar →",
    submit: "✦ Enviar Ingreso", submitting: "Enviando...",
    submitted: "✓ ¡Ingreso Enviado!",
    submittedSub: "Su información fue enviada al médico. Su resumen clínico IA está listo — cambie a Vista del Médico ahora.",
    switchToDoctor: "Cambiar a Vista del Médico →",
    queueTitle: "Cola de Pacientes de Hoy",
    generating: "Generando Resumen IA...",
    genBtn: "✦ Generar Resumen Clínico",
    summaryReady: "✓ Resumen listo",
    copyBtn: "Copiar", markComplete: "Marcar Completado",
    aiLabel: "RESUMEN CLÍNICO IA",
    painLabel: "Dolor",
    newPatient: "Paciente Nuevo",
    waiting: "En Espera", inProgress: "En Progreso", completed: "Completado",
    chiefComplaint: "Motivo Principal", symptomsLabel: "Síntomas",
    durationLabel: "Duración", painLevelLabel: "Nivel de Dolor",
    medsLabel: "Medicamentos", allergiesLabel: "Alergias",
    conditionsLabel2: "Condiciones", surgeriesLabel: "Cirugías",
    familyLabel: "Historia Familiar", smokingLabel: "Tabaquismo", alcoholLabel: "Alcohol",
    tabSummary: "Resumen IA", tabIntake: "Ingreso", tabHistory: "Historia",
    backToQueue: "← Cola",
    noSummaryYet: "Aún no se ha generado un resumen.",
    footer: "IntakeAI · Ingreso Bilingüe de Pacientes · Demo en Vivo",
  }
};

const initialForm = {
  firstName: "", lastName: "", dob: "", sex: "", phone: "", email: "",
  visitReason: "", symptoms: "", symptomDuration: "", painScale: "0",
  conditions: [], surgeries: "", familyHistory: "", smoking: "", alcohol: "",
  medications: "", allergies: "", supplements: "",
};

const EN_CONDITIONS = ["Diabetes","Hypertension","Heart Disease","Asthma/COPD","Thyroid Disorder","Cancer","Arthritis","Depression/Anxiety","None of the above"];

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState("en");
  const [view, setView] = useState("patient"); // patient | doctor
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [summary, setSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [patientStatus, setPatientStatus] = useState("waiting");
  const [docTab, setDocTab] = useState("summary");
  const [summaryGenerated, setSummaryGenerated] = useState(false);
  const [preGenStarted, setPreGenStarted] = useState(false);

  const t = T[lang];

  const update = (field, val) => setForm(f => ({ ...f, [field]: val }));
  const toggleCondition = (enKey) => setForm(f => ({
    ...f,
    conditions: f.conditions.includes(enKey)
      ? f.conditions.filter(x => x !== enKey)
      : [...f.conditions, enKey]
  }));

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 600));
    setSubmitted(true);
    setSubmitting(false);
    setPatientStatus("in-progress");
    // If pre-gen didn't start yet (e.g. skipped review step), generate now
    if (!preGenStarted) {
      generateSummary(form);
    }
  };

  const generateSummary = async (submittedForm) => {
    const f = submittedForm || form;
    setLoadingSummary(true);
    setSummary("");

    // ── Instant skeleton: show structured header within 300ms ──────────────
    const skeleton = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 INTAKEAI CLINICAL SUMMARY  ·  Generating...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PATIENT OVERVIEW
  Name:    ${f.firstName || "—"} ${f.lastName || "—"}
  DOB:     ${f.dob || "—"}   Sex: ${f.sex || "—"}
  Phone:   ${f.phone || "—"}
  Pain:    ${f.painScale}/10

CHIEF COMPLAINT
  ${f.visitReason || "See intake form"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ⟳ AI analysis in progress...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    await new Promise(r => setTimeout(r, 280));
    setSummary(skeleton);
    setSummaryGenerated(true);
    setPatientStatus("in-progress");

    // ── Type out dots while waiting for real response ──────────────────────
    let dotInterval = setInterval(() => {
      setSummary(prev => {
        if (!prev.includes("⟳")) return prev;
        const dots = (prev.match(/\.+$/) || [""])[0];
        return prev.replace(/⟳ AI analysis in progress\.*/,
          `⟳ AI analysis in progress${dots.length < 4 ? dots + "." : ""}`);
      });
    }, 400);

    try {
      const isEs = lang === "es";
      const prompt = `PATIENT: ${f.firstName} ${f.lastName} | DOB: ${f.dob} | ${f.sex} | Pain: ${f.painScale}/10
CC: ${f.visitReason}
Sx: ${f.symptoms} | Duration: ${f.symptomDuration}
PMH: ${f.conditions.join(", ") || "None"} | Surg: ${f.surgeries || "None"} | FH: ${f.familyHistory || "None"}
Meds: ${f.medications || "None"} | Allergies: ${f.allergies || "NKDA"} | Suppl: ${f.supplements || "None"}
Social: Smoking: ${f.smoking || "N/A"} | ETOH: ${f.alcohol || "N/A"}

Write intake summary:
PATIENT OVERVIEW
CHIEF COMPLAINT & HPI
PMH / MEDS / ALLERGIES
SOCIAL HISTORY
⚠️ RED FLAGS & NEXT STEPS`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 350,
          stream: true,
          system: "You are a clinical documentation AI. Output ONLY a brief physician intake summary using bullet points. No preamble, no explanation, no extra text. Be extremely concise — 1-2 bullets per section maximum. Always respond in English regardless of input language.",
          messages: [{ role: "user", content: prompt }],
        }),
      });

      clearInterval(dotInterval);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      let firstChunk = true;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter(l => l.startsWith("data: "));
        for (const line of lines) {
          const raw = line.slice(6);
          if (raw === "[DONE]") break;
          try {
            const parsed = JSON.parse(raw);
            if (parsed.type === "content_block_delta" && parsed.delta?.text) {
              if (firstChunk) {
                // Replace skeleton with real content as it streams
                fullText = "";
                firstChunk = false;
              }
              fullText += parsed.delta.text;
              setSummary(fullText);
            }
          } catch {}
        }
      }
    } catch (e) {
      clearInterval(dotInterval);
      setSummary("Failed to generate summary. Please try again.");
    }
    setLoadingSummary(false);
  };

  const markComplete = () => setPatientStatus("completed");

  const statusConfig = {
    waiting:       { label: t.waiting,    color: "#f59e0b", bg: "#fffbeb" },
    "in-progress": { label: t.inProgress, color: "#3b82f6", bg: "#eff6ff" },
    completed:     { label: t.completed,  color: "#10b981", bg: "#ecfdf5" },
  };

  return (
    <div style={s.root}>
      <style>{css}</style>

      {/* Top Bar */}
      <header style={s.header}>
        <div style={s.headerLeft}>
          <div style={s.logoMark}>+</div>
          <div>
            <div style={s.logoText}>IntakeAI</div>
            <div style={s.logoSub}>Live Demo</div>
          </div>
        </div>

        {/* View switcher */}
        <div style={s.viewSwitcher}>
          <button
            style={{ ...s.viewBtn, ...(view === "patient" ? s.viewBtnActive : {}) }}
            onClick={() => setView("patient")}
          >
            👤 {t.patientView}
          </button>
          <button
            style={{ ...s.viewBtn, ...(view === "doctor" ? s.viewBtnActive : {}) }}
            onClick={() => setView("doctor")}
          >
            🩺 {t.doctorView}
            {submitted && !summaryGenerated && <span style={s.notifDot} />}
          </button>
        </div>

        <button style={s.langBtn} onClick={() => setLang(l => l === "en" ? "es" : "en")}>
          {t.langFlag} {t.langToggle}
        </button>
      </header>

      {/* Demo tip banner */}
      <div style={s.tipBanner}>
        💡 {t.demoTip}
      </div>

      {/* ── PATIENT VIEW ──────────────────────────────────────────────── */}
      {view === "patient" && !submitted && (
        <div style={s.patientWrap}>
          {/* Progress */}
          <div style={s.progressBar}>
            <div style={{ ...s.progressFill, width: `${(step / 4) * 100}%` }} />
          </div>

          {/* Step nav */}
          <div style={s.stepNav}>
            {t.steps.map((label, i) => (
              <div key={i} style={s.stepItem}>
                <div style={{ ...s.stepDot, ...(i < step ? s.stepDone : {}), ...(i === step ? s.stepActive : {}) }}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span style={{ ...s.stepLabel, ...(i === step ? s.stepLabelActive : {}) }}>{label}</span>
              </div>
            ))}
          </div>

          <div style={s.card} className="card-fade">
            {/* Step 0: Personal */}
            {step === 0 && (
              <Section title={t.personalTitle} icon="👤">
                <Row>
                  <Field label={t.firstName}><input style={s.inp} value={form.firstName} onChange={e => update("firstName", e.target.value)} placeholder={t.firstNamePh} /></Field>
                  <Field label={t.lastName}><input style={s.inp} value={form.lastName} onChange={e => update("lastName", e.target.value)} placeholder={t.lastNamePh} /></Field>
                </Row>
                <Row>
                  <Field label={t.dob}><input style={s.inp} type="date" value={form.dob} onChange={e => update("dob", e.target.value)} /></Field>
                  <Field label={t.sex}>
                    <select style={s.inp} value={form.sex} onChange={e => update("sex", e.target.value)}>
                      {t.sexOptions.map((o, i) => <option key={i} value={i === 0 ? "" : o}>{o}</option>)}
                    </select>
                  </Field>
                </Row>
                <Row>
                  <Field label={t.phone}><input style={s.inp} value={form.phone} onChange={e => update("phone", e.target.value)} placeholder={t.phonePh} /></Field>
                  <Field label={t.email}><input style={s.inp} value={form.email} onChange={e => update("email", e.target.value)} placeholder={t.emailPh} /></Field>
                </Row>
              </Section>
            )}

            {/* Step 1: Visit */}
            {step === 1 && (
              <Section title={t.visitTitle} icon="🩺">
                <Field label={t.visitReason}><input style={s.inp} value={form.visitReason} onChange={e => update("visitReason", e.target.value)} placeholder={t.visitReasonPh} /></Field>
                <Field label={t.symptoms}><textarea style={s.ta} value={form.symptoms} onChange={e => update("symptoms", e.target.value)} placeholder={t.symptomsPh} /></Field>
                <Row>
                  <Field label={t.duration}><input style={s.inp} value={form.symptomDuration} onChange={e => update("symptomDuration", e.target.value)} placeholder={t.durationPh} /></Field>
                  <Field label={t.painLevel(form.painScale)}>
                    <input type="range" min="0" max="10" value={form.painScale} onChange={e => update("painScale", e.target.value)} style={s.range} />
                    <div style={s.rangeLabels}><span>{t.noPain}</span><span>{t.worstPain}</span></div>
                  </Field>
                </Row>
              </Section>
            )}

            {/* Step 2: History */}
            {step === 2 && (
              <Section title={t.historyTitle} icon="📋">
                <Field label={t.conditionsLabel}>
                  <div style={s.checkGrid}>
                    {t.conditions.map((c, i) => {
                      const enKey = EN_CONDITIONS[i];
                      const active = form.conditions.includes(enKey);
                      return (
                        <label key={c} style={{ ...s.checkItem, ...(active ? s.checkActive : {}) }} onClick={() => toggleCondition(enKey)}>
                          {active ? "✓ " : ""}{c}
                        </label>
                      );
                    })}
                  </div>
                </Field>
                <Field label={t.surgeries}><textarea style={{ ...s.ta, minHeight: 70 }} value={form.surgeries} onChange={e => update("surgeries", e.target.value)} placeholder={t.surgeriesPh} /></Field>
                <Field label={t.familyHistory}><input style={s.inp} value={form.familyHistory} onChange={e => update("familyHistory", e.target.value)} placeholder={t.familyHistoryPh} /></Field>
                <Row>
                  <Field label={t.smoking}>
                    <select style={s.inp} value={form.smoking} onChange={e => update("smoking", e.target.value)}>
                      {t.smokingOptions.map((o, i) => <option key={i} value={i === 0 ? "" : o}>{o}</option>)}
                    </select>
                  </Field>
                  <Field label={t.alcohol}>
                    <select style={s.inp} value={form.alcohol} onChange={e => update("alcohol", e.target.value)}>
                      {t.alcoholOptions.map((o, i) => <option key={i} value={i === 0 ? "" : o}>{o}</option>)}
                    </select>
                  </Field>
                </Row>
              </Section>
            )}

            {/* Step 3: Medications */}
            {step === 3 && (
              <Section title={t.medsTitle} icon="💊">
                <Field label={t.medications}><textarea style={s.ta} value={form.medications} onChange={e => update("medications", e.target.value)} placeholder={t.medicationsPh} /></Field>
                <Field label={t.allergies}><textarea style={{ ...s.ta, minHeight: 70 }} value={form.allergies} onChange={e => update("allergies", e.target.value)} placeholder={t.allergiesPh} /></Field>
                <Field label={t.supplements}><input style={s.inp} value={form.supplements} onChange={e => update("supplements", e.target.value)} placeholder={t.supplementsPh} /></Field>
              </Section>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <Section title={t.reviewTitle} icon="✅">
                <div style={s.reviewGrid}>
                  <RB label={`${form.firstName} ${form.lastName}`} value={`DOB: ${form.dob} · ${form.sex}`} />
                  <RB label={t.visitReason} value={form.visitReason} />
                  <RB label={t.symptomsLabel || "Symptoms"} value={`${form.symptoms} (${form.symptomDuration}, pain ${form.painScale}/10)`} />
                  <RB label={t.conditionsLabel2 || "Conditions"} value={form.conditions.map(c => { const i = EN_CONDITIONS.indexOf(c); return i >= 0 ? t.conditions[i] : c; }).join(", ") || "None"} />
                  <RB label={t.medsLabel || "Medications"} value={form.medications || "None"} />
                  <RB label={t.allergiesLabel || "Allergies"} value={form.allergies || "NKDA"} />
                </div>
                <p style={{ fontSize: 13, color: "#6b7c93", marginTop: 16, fontStyle: "italic" }}>{t.reviewNote}</p>
              </Section>
            )}

            {/* Nav */}
            <div style={s.navRow}>
              {step > 0 && <button style={s.btnBack} onClick={() => setStep(s => s - 1)}>{t.back}</button>}
              {step < 4 && (
                <button style={s.btnNext} onClick={() => {
                  const nextStep = step + 1;
                  setStep(nextStep);
                  // Pre-generate summary when patient reaches Review step
                  if (nextStep === 4 && !preGenStarted) {
                    setPreGenStarted(true);
                    generateSummary(form);
                  }
                }}>{t.continue}</button>
              )}
              {step === 4 && (
                <button style={{ ...s.btnNext, background: "#2dd4bf", color: "#0a1628" }}
                  onClick={handleSubmit} disabled={submitting}>
                  {submitting ? t.submitting : t.submit}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Submitted confirmation */}
      {view === "patient" && submitted && (
        <div style={s.patientWrap}>
          <div style={{ ...s.card, textAlign: "center", padding: "60px 40px" }} className="card-fade">
            <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0a1628", marginBottom: 8 }}>{t.submitted}</h2>
            <p style={{ fontSize: 15, color: "#6b7c93", marginBottom: 32, maxWidth: 400, margin: "0 auto 32px" }}>{t.submittedSub}</p>
            <button style={{ ...s.btnNext, background: "#0a1628", color: "#2dd4bf", padding: "14px 32px", fontSize: 15 }}
              onClick={() => setView("doctor")}>
              {t.switchToDoctor}
            </button>
          </div>
        </div>
      )}

      {/* ── DOCTOR VIEW ───────────────────────────────────────────────── */}
      {view === "doctor" && (
        <div style={s.doctorWrap}>
          {/* Patient card */}
          {patientStatus !== "completed" ? (
            <div style={s.queueCard} className="card-fade">
              <div style={s.queueHeader}>
                <span style={s.queueTitle}>🏥 {t.queueTitle}</span>
                {submitted && (
                  <span style={{ ...s.statusBadge, color: statusConfig[patientStatus].color, background: statusConfig[patientStatus].bg }}>
                    {statusConfig[patientStatus].label}
                  </span>
                )}
              </div>

              {!submitted ? (
                <div style={s.emptyQueue}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
                  <p style={{ color: "#8a9bb0", fontSize: 14 }}>No patients yet. Switch to Patient View to submit an intake form.</p>
                </div>
              ) : (
                <div>
                  {/* Patient mini card */}
                  <div style={s.patientRow}>
                    <div style={s.patientAvatar}>{form.firstName?.[0] || "?"}{form.lastName?.[0] || "?"}</div>
                    <div style={s.patientMeta}>
                      <div style={s.patientName}>{form.firstName} {form.lastName}</div>
                      <div style={s.patientSub}>{t.newPatient} · {form.dob} · {form.sex}</div>
                      <div style={s.patientReason}>"{form.visitReason}"</div>
                    </div>
                    <div style={s.painPill}>
                      <span style={s.painNum}>{form.painScale}</span>
                      <span style={s.painLabel}>/10</span>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div style={s.tabRow}>
                    {[["summary", t.tabSummary], ["intake", t.tabIntake], ["history", t.tabHistory]].map(([key, label]) => (
                      <button key={key} style={{ ...s.tab, ...(docTab === key ? s.tabActive : {}) }} onClick={() => setDocTab(key)}>
                        {label}
                        {key === "summary" && summaryGenerated && <span style={{ marginLeft: 5, color: "#10b981", fontSize: 10 }}>●</span>}
                      </button>
                    ))}
                  </div>

                  {/* Tab content */}
                  <div style={s.tabContent}>
                    {docTab === "summary" && (
                      <div>
                        {!summaryGenerated ? (
                          <div style={{ textAlign: "center", padding: "40px 0" }}>
                            <div style={{ fontSize: 36, marginBottom: 16 }} className="spin">⟳</div>
                            <p style={{ color: "#0a1628", fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{t.generating}</p>
                            <p style={{ color: "#8a9bb0", fontSize: 13 }}>
                              {preGenStarted ? "Pre-processing while patient reviewed form..." : "Connecting to AI..."}
                            </p>
                          </div>
                        ) : (
                          <div>
                            <div style={s.summaryToolbar}>
                              <span style={s.summaryLabel}>{t.aiLabel}</span>
                              <div style={{ display: "flex", gap: 8 }}>
                                <button style={s.smBtn} onClick={() => navigator.clipboard.writeText(summary)}>{t.copyBtn}</button>
                                {patientStatus !== "completed" && (
                                  <button style={{ ...s.smBtn, background: "#10b981", color: "#fff", border: "none" }} onClick={markComplete}>{t.markComplete}</button>
                                )}
                              </div>
                            </div>
                            <pre style={s.summaryPre}>{summary}{loadingSummary ? "" : ""}<span style={{ display: loadingSummary ? "inline" : "none" }} className="cursor">▊</span></pre>
                          </div>
                        )}
                      </div>
                    )}

                    {docTab === "intake" && (
                      <div style={s.infoGrid}>
                        <InfoBlock label={t.chiefComplaint} value={form.visitReason} />
                        <InfoBlock label={t.symptomsLabel} value={form.symptoms} />
                        <InfoBlock label={t.durationLabel} value={form.symptomDuration} />
                        <InfoBlock label={t.painLevelLabel} value={`${form.painScale}/10`} />
                        <InfoBlock label={t.medsLabel} value={form.medications || "None"} />
                        <InfoBlock label={t.allergiesLabel} value={form.allergies || "NKDA"} />
                      </div>
                    )}

                    {docTab === "history" && (
                      <div style={s.infoGrid}>
                        <InfoBlock label={t.conditionsLabel2} value={form.conditions.join(", ") || "None"} />
                        <InfoBlock label={t.surgeriesLabel} value={form.surgeries || "None"} />
                        <InfoBlock label={t.familyLabel} value={form.familyHistory || "None"} />
                        <InfoBlock label={t.smokingLabel} value={form.smoking || "N/A"} />
                        <InfoBlock label={t.alcoholLabel} value={form.alcohol || "N/A"} />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {/* ── Completed: show full record with banner ── */}
          {view === "doctor" && submitted && patientStatus === "completed" && (
            <div style={s.queueCard} className="card-fade">
              {/* Completed banner */}
              <div style={s.completedBanner}>
                <div style={s.completedLeft}>
                  <span style={s.completedCheck}>✓</span>
                  <div>
                    <div style={s.completedName}>{form.firstName} {form.lastName} — Visit Complete</div>
                    <div style={s.completedSub}>Summary on file · All records available below</div>
                  </div>
                </div>
                <button style={s.runAgainBtn}
                  onClick={() => { setSubmitted(false); setSummary(""); setSummaryGenerated(false); setPatientStatus("waiting"); setStep(0); setForm(initialForm); setDocTab("summary"); setView("patient"); setPreGenStarted(false); }}>
                  ↩ New Demo
                </button>
              </div>

              {/* Full patient record stays visible */}
              <div style={s.patientRow}>
                <div style={s.patientAvatar}>{form.firstName?.[0] || "?"}{form.lastName?.[0] || "?"}</div>
                <div style={s.patientMeta}>
                  <div style={s.patientName}>{form.firstName} {form.lastName}</div>
                  <div style={s.patientSub}>{t.newPatient} · {form.dob} · {form.sex}</div>
                  <div style={s.patientReason}>"{form.visitReason}"</div>
                </div>
                <div style={s.painPill}>
                  <span style={s.painNum}>{form.painScale}</span>
                  <span style={s.painLabel}>/10</span>
                </div>
              </div>

              {/* Tabs */}
              <div style={s.tabRow}>
                {[["summary", t.tabSummary], ["intake", t.tabIntake], ["history", t.tabHistory]].map(([key, label]) => (
                  <button key={key} style={{ ...s.tab, ...(docTab === key ? s.tabActive : {}) }} onClick={() => setDocTab(key)}>
                    {label}
                    {key === "summary" && <span style={{ marginLeft: 5, color: "#10b981", fontSize: 10 }}>●</span>}
                  </button>
                ))}
              </div>

              <div style={s.tabContent}>
                {docTab === "summary" && (
                  <div>
                    <div style={s.summaryToolbar}>
                      <span style={s.summaryLabel}>{t.aiLabel}</span>
                      <button style={s.smBtn} onClick={() => navigator.clipboard.writeText(summary)}>{t.copyBtn}</button>
                    </div>
                    <pre style={s.summaryPre}>{summary}</pre>
                  </div>
                )}
                {docTab === "intake" && (
                  <div style={s.infoGrid}>
                    <InfoBlock label={t.chiefComplaint} value={form.visitReason} />
                    <InfoBlock label={t.symptomsLabel} value={form.symptoms} />
                    <InfoBlock label={t.durationLabel} value={form.symptomDuration} />
                    <InfoBlock label={t.painLevelLabel} value={`${form.painScale}/10`} />
                    <InfoBlock label={t.medsLabel} value={form.medications || "None"} />
                    <InfoBlock label={t.allergiesLabel} value={form.allergies || "NKDA"} />
                  </div>
                )}
                {docTab === "history" && (
                  <div style={s.infoGrid}>
                    <InfoBlock label={t.conditionsLabel2} value={form.conditions.join(", ") || "None"} />
                    <InfoBlock label={t.surgeriesLabel} value={form.surgeries || "None"} />
                    <InfoBlock label={t.familyLabel} value={form.familyHistory || "None"} />
                    <InfoBlock label={t.smokingLabel} value={form.smoking || "N/A"} />
                    <InfoBlock label={t.alcoholLabel} value={form.alcohol || "N/A"} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <footer style={s.footer}>{t.footer}</footer>
    </div>
  );
}

// ── Reusable Components ───────────────────────────────────────────────────────
function Section({ title, icon, children }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <span style={{ fontSize: 22 }}>{icon}</span>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0a1628", margin: 0 }}>{title}</h2>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>{children}</div>
    </div>
  );
}
function Field({ label, children }) {
  return <div style={{ flex: 1, minWidth: 200, display: "flex", flexDirection: "column", gap: 5 }}><label style={{ fontSize: 12, fontWeight: 600, color: "#4a5568" }}>{label}</label>{children}</div>;
}
function Row({ children }) { return <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>{children}</div>; }
function RB({ label, value }) {
  return (
    <div style={{ padding: "10px 14px", borderRadius: 8, background: "#f8fafc", border: "1px solid #dde6f0" }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: "#8a9bb0", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 13, color: "#1a2332" }}>{value || "—"}</div>
    </div>
  );
}
function InfoBlock({ label, value }) {
  return (
    <div style={{ padding: "12px 14px", borderRadius: 8, background: "#f8fafc", border: "1px solid #dde6f0" }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: "#8a9bb0", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 13, color: "#1a2332", lineHeight: 1.5 }}>{value || "—"}</div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = {
  root: { minHeight: "100vh", background: "#f0f4f8", fontFamily: "'Georgia', serif", color: "#1a2332", display: "flex", flexDirection: "column" },

  header: { background: "#0a1628", padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" },
  headerLeft: { display: "flex", alignItems: "center", gap: 10 },
  logoMark: { width: 32, height: 32, borderRadius: 8, background: "#2dd4bf", color: "#0a1628", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, flexShrink: 0 },
  logoText: { color: "#fff", fontSize: 17, fontWeight: 700 },
  logoSub: { color: "#2dd4bf", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" },

  viewSwitcher: { display: "flex", background: "#1e3a5f", borderRadius: 10, padding: 3, gap: 2 },
  viewBtn: { padding: "8px 18px", borderRadius: 8, border: "none", background: "transparent", color: "#7a9bb8", fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, transition: "all 0.2s", position: "relative" },
  viewBtnActive: { background: "#2dd4bf", color: "#0a1628" },
  notifDot: { position: "absolute", top: 6, right: 6, width: 7, height: 7, borderRadius: "50%", background: "#ef4444" },

  langBtn: { display: "flex", alignItems: "center", gap: 6, background: "#1e3a5f", border: "1px solid #2dd4bf44", color: "#2dd4bf", padding: "7px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 },

  tipBanner: { background: "#1e3a5f", color: "#7dd3fc", fontSize: 12, padding: "8px 28px", textAlign: "center", borderBottom: "1px solid #0a1628" },

  // Patient
  patientWrap: { flex: 1, maxWidth: 700, margin: "0 auto", width: "100%", padding: "24px 16px" },
  progressBar: { height: 3, background: "#dde6f0", marginBottom: 24, borderRadius: 2 },
  progressFill: { height: "100%", background: "#2dd4bf", borderRadius: 2, transition: "width 0.4s ease" },
  stepNav: { display: "flex", justifyContent: "space-between", marginBottom: 24 },
  stepItem: { display: "flex", flexDirection: "column", alignItems: "center", gap: 5 },
  stepDot: { width: 28, height: 28, borderRadius: "50%", background: "#dde6f0", color: "#6b7c93", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, transition: "all 0.3s" },
  stepDone: { background: "#2dd4bf", color: "#0a1628" },
  stepActive: { background: "#0a1628", color: "#fff", boxShadow: "0 0 0 3px #2dd4bf" },
  stepLabel: { fontSize: 10, color: "#8a9bb0", textAlign: "center", maxWidth: 64 },
  stepLabelActive: { color: "#0a1628", fontWeight: 600 },
  card: { background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px rgba(10,22,40,0.08)", padding: "32px 36px" },
  inp: { padding: "10px 12px", borderRadius: 8, border: "1.5px solid #dde6f0", fontSize: 14, fontFamily: "inherit", color: "#1a2332", background: "#f8fafc", outline: "none", width: "100%", boxSizing: "border-box" },
  ta: { padding: "10px 12px", borderRadius: 8, border: "1.5px solid #dde6f0", fontSize: 14, fontFamily: "inherit", color: "#1a2332", background: "#f8fafc", outline: "none", minHeight: 90, resize: "vertical", width: "100%", boxSizing: "border-box" },
  range: { width: "100%", accentColor: "#2dd4bf" },
  rangeLabels: { display: "flex", justifyContent: "space-between", fontSize: 10, color: "#8a9bb0", marginTop: 2 },
  checkGrid: { display: "flex", flexWrap: "wrap", gap: 7 },
  checkItem: { padding: "7px 12px", borderRadius: 18, border: "1.5px solid #dde6f0", fontSize: 12, cursor: "pointer", background: "#f8fafc", transition: "all 0.2s", userSelect: "none" },
  checkActive: { background: "#0a1628", color: "#2dd4bf", border: "1.5px solid #0a1628" },
  reviewGrid: { display: "flex", flexDirection: "column", gap: 10 },
  navRow: { display: "flex", justifyContent: "space-between", marginTop: 28, paddingTop: 20, borderTop: "1px solid #f0f4f8" },
  btnBack: { padding: "11px 22px", borderRadius: 10, border: "1.5px solid #dde6f0", background: "#fff", color: "#4a5568", fontSize: 14, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 },
  btnNext: { marginLeft: "auto", padding: "11px 28px", borderRadius: 10, border: "none", background: "#0a1628", color: "#fff", fontSize: 14, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 },

  // Doctor
  doctorWrap: { flex: 1, maxWidth: 760, margin: "0 auto", width: "100%", padding: "24px 16px" },
  queueCard: { background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px rgba(10,22,40,0.08)", overflow: "hidden" },
  queueHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderBottom: "1px solid #f0f4f8" },
  queueTitle: { fontSize: 15, fontWeight: 700, color: "#0a1628" },
  statusBadge: { fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, letterSpacing: "0.04em" },
  emptyQueue: { textAlign: "center", padding: "48px 32px", color: "#8a9bb0" },
  patientRow: { display: "flex", alignItems: "flex-start", gap: 14, padding: "18px 24px", borderBottom: "1px solid #f0f4f8" },
  patientAvatar: { width: 44, height: 44, borderRadius: "50%", background: "#0a1628", color: "#2dd4bf", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, flexShrink: 0 },
  patientMeta: { flex: 1, minWidth: 0 },
  patientName: { fontSize: 16, fontWeight: 700, color: "#0a1628" },
  patientSub: { fontSize: 12, color: "#8a9bb0", marginTop: 2 },
  patientReason: { fontSize: 13, color: "#4a5568", fontStyle: "italic", marginTop: 4 },
  painPill: { display: "flex", alignItems: "baseline", gap: 1, background: "#fff3e0", borderRadius: 8, padding: "6px 12px", flexShrink: 0 },
  painNum: { fontSize: 20, fontWeight: 700, color: "#e65100" },
  painLabel: { fontSize: 11, color: "#e65100" },
  tabRow: { display: "flex", borderBottom: "1px solid #f0f4f8" },
  tab: { padding: "10px 20px", border: "none", background: "none", fontSize: 13, color: "#8a9bb0", cursor: "pointer", fontFamily: "inherit", borderBottom: "2px solid transparent", transition: "all 0.2s" },
  tabActive: { color: "#0a1628", borderBottom: "2px solid #2dd4bf", fontWeight: 600 },
  tabContent: { padding: "20px 24px" },
  genBtn2: { padding: "13px 32px", borderRadius: 10, border: "none", background: "#0a1628", color: "#2dd4bf", fontSize: 14, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 },
  summaryToolbar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  summaryLabel: { fontSize: 10, fontWeight: 700, color: "#8a9bb0", textTransform: "uppercase", letterSpacing: "0.1em" },
  smBtn: { padding: "5px 14px", borderRadius: 6, border: "1.5px solid #dde6f0", background: "#fff", fontSize: 12, cursor: "pointer", fontFamily: "inherit" },
  summaryPre: { background: "#f8fafc", borderRadius: 10, padding: 20, fontSize: 12, lineHeight: 1.8, whiteSpace: "pre-wrap", fontFamily: "'Courier New', monospace", color: "#2d3748", maxHeight: 400, overflowY: "auto", margin: 0 },
  infoGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },

  footer: { textAlign: "center", padding: "16px", fontSize: 11, color: "#8a9bb0", borderTop: "1px solid #dde6f0", marginTop: "auto" },
  completedBanner: { background: "linear-gradient(135deg, #ecfdf5, #d1fae5)", borderBottom: "1px solid #a7f3d0", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 },
  completedLeft: { display: "flex", alignItems: "center", gap: 12 },
  completedCheck: { width: 36, height: 36, borderRadius: "50%", background: "#10b981", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, flexShrink: 0 },
  completedName: { fontSize: 14, fontWeight: 700, color: "#065f46" },
  completedSub: { fontSize: 11, color: "#6b7280", marginTop: 2 },
  runAgainBtn: { padding: "7px 16px", borderRadius: 8, border: "1px solid #a7f3d0", background: "#fff", color: "#065f46", fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, whiteSpace: "nowrap" },
};

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  input:focus, select:focus, textarea:focus { border-color: #2dd4bf !important; box-shadow: 0 0 0 3px rgba(45,212,191,0.12); outline: none; }
  .card-fade { animation: fadeUp 0.35s ease both; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  button:hover { opacity: 0.87; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .spin { display: inline-block; animation: spin 1s linear infinite; }
  @keyframes progress { 0% { width: 0%; margin-left: 0; } 50% { width: 70%; } 100% { width: 0%; margin-left: 100%; } }
  .cursor { animation: blink 0.7s step-end infinite; }
  @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #f0f4f8; }
  ::-webkit-scrollbar-thumb { background: #cbd5e0; border-radius: 3px; }
`;
