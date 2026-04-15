import { useState, useEffect, useCallback } from "react";

// ── TRANSLATIONS ──────────────────────────────────────────────────────────────
const T = {
  en: {
    langToggle: "Español", langFlag: "🇪🇸",
    steps: ["Personal Info", "Visit Reason", "Medical History", "Medications", "Review"],
    personalTitle: "Personal Information",
    firstName: "First Name", firstNamePh: "Maria",
    lastName: "Last Name", lastNamePh: "Garcia",
    dob: "Date of Birth",
    sex: "Sex", sexOptions: ["Select", "Male", "Female", "Non-binary", "Prefer not to say"],
    phone: "Phone", phonePh: "(512) 555-0192",
    email: "Email", emailPh: "maria@email.com",
    address: "Street Address", addressPh: "123 Main St",
    city: "City", cityPh: "Austin",
    state: "State", statePh: "TX",
    zip: "ZIP Code", zipPh: "78701",
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
    noDoctor: "No doctor link detected",
    noDoctorSub: "Please use the link provided by your doctor to access this form.",
    chiefComplaint: "Chief Complaint", symptomsLabel: "Symptoms",
    durationLabel: "Duration", painLevelLabel: "Pain Level",
    medsLabel: "Medications", allergiesLabel: "Allergies",
    conditionsLabel2: "Conditions", surgeriesLabel: "Surgeries",
    familyLabel: "Family History", smokingLabel: "Smoking", alcoholLabel: "Alcohol",
    footer: "IntakeAI · Bilingual Patient Intake",
  },
  es: {
    langToggle: "English", langFlag: "🇺🇸",
    steps: ["Información Personal", "Motivo de Visita", "Historia Médica", "Medicamentos", "Revisión"],
    personalTitle: "Información Personal",
    firstName: "Nombre", firstNamePh: "María",
    lastName: "Apellido", lastNamePh: "García",
    dob: "Fecha de Nacimiento",
    sex: "Sexo", sexOptions: ["Seleccionar", "Masculino", "Femenino", "No binario", "Prefiero no decir"],
    phone: "Teléfono", phonePh: "(512) 555-0192",
    email: "Correo Electrónico", emailPh: "maria@correo.com",
    address: "Dirección", addressPh: "123 Calle Principal",
    city: "Ciudad", cityPh: "Austin",
    state: "Estado", statePh: "TX",
    zip: "Código Postal", zipPh: "78701",
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
    noDoctor: "No se detectó enlace de médico",
    noDoctorSub: "Por favor use el enlace proporcionado por su médico para acceder a este formulario.",
    chiefComplaint: "Motivo Principal", symptomsLabel: "Síntomas",
    durationLabel: "Duración", painLevelLabel: "Nivel de Dolor",
    medsLabel: "Medicamentos", allergiesLabel: "Alergias",
    conditionsLabel2: "Condiciones", surgeriesLabel: "Cirugías",
    familyLabel: "Historia Familiar", smokingLabel: "Tabaquismo", alcoholLabel: "Alcohol",
    footer: "IntakeAI · Ingreso Bilingüe de Pacientes",
  }
};

const initialForm = {
  firstName: "", lastName: "", dob: "", sex: "", phone: "", email: "",
  address: "", city: "", state: "", zip: "",
  visitReason: "", symptoms: "", symptomDuration: "", painScale: "0",
  conditions: [], surgeries: "", familyHistory: "", smoking: "", alcohol: "",
  medications: "", allergies: "", supplements: "",
};

const EN_CONDITIONS = ["Diabetes","Hypertension","Heart Disease","Asthma/COPD","Thyroid Disorder","Cancer","Arthritis","Depression/Anxiety","None of the above"];

function calcAge(dob) {
  if (!dob) return null;
  const birth = new Date(dob);
  const today = new Date();
  const diffMs = today - birth;
  if (diffMs < 0) return { label: "Invalid date — must be in the past", error: true };
  const days = Math.floor(diffMs / 86400000);
  if (days < 30) return { label: `Age: ${days} day${days !== 1 ? "s" : ""} old — please verify`, error: true };
  const months = Math.floor(days / 30.44);
  if (months < 24) return { label: `Age: ${months} month${months !== 1 ? "s" : ""} old`, error: false };
  const years = Math.floor(days / 365.25);
  return { label: `Age: ${years} year${years !== 1 ? "s" : ""} old`, error: false };
}

function buildPrompt(f) {
  const addressStr = [f.address, f.city, f.state, f.zip].filter(Boolean).join(", ");
  return "PATIENT: " + (f.first_name || f.firstName) + " " + (f.last_name || f.lastName) +
    " | DOB: " + f.dob + " | " + f.sex + " | Pain: " + (f.pain_scale || f.painScale) + "/10" +
    (addressStr ? " | Address: " + addressStr : "") +
    "\nCC: " + (f.visit_reason || f.visitReason) +
    "\nSx: " + f.symptoms + " | Duration: " + (f.symptom_duration || f.symptomDuration) +
    "\nPMH: " + ((f.conditions || []).join(", ") || "None") +
    " | Surg: " + (f.surgeries || "None") +
    " | FH: " + (f.family_history || f.familyHistory || "None") +
    "\nMeds: " + (f.medications || "None") + " | Allergies: " + (f.allergies || "NKDA") +
    "\nSocial: " + (f.smoking || "N/A") + " | ETOH: " + (f.alcohol || "N/A") +
    "\n\nWrite a concise clinical intake summary with these sections:\nPATIENT OVERVIEW\nCHIEF COMPLAINT & HPI\nPMH / MEDS / ALLERGIES\nSOCIAL HISTORY\nRED FLAGS & NEXT STEPS";
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const params = new URLSearchParams(window.location.search);
  const doctorSlug = params.get("doctor") || "";
  const isAdminPage = params.has("admin");

  const [lang, setLang] = useState("en");
  const t = T[lang];

  // Doctor info (fetched on load)
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [doctorLoading, setDoctorLoading] = useState(!!doctorSlug);
  const [doctorNotFound, setDoctorNotFound] = useState(false);

  // Auth state
  const [view, setView] = useState("patient");
  const [doctorPin, setDoctorPin] = useState("");
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [pinLoading, setPinLoading] = useState(false);

  // Patient form
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [preGenSummary, setPreGenSummary] = useState("");
  const [preGenStarted, setPreGenStarted] = useState(false);
  const [submittedPatientId, setSubmittedPatientId] = useState(null);

  // Doctor dashboard
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [docTab, setDocTab] = useState("summary");
  const [liveSummary, setLiveSummary] = useState("");
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Admin panel
  const [adminSecret, setAdminSecret] = useState("");
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [adminDoctors, setAdminDoctors] = useState([]);
  const [adminError, setAdminError] = useState("");
  const [newDoc, setNewDoc] = useState({ name: "", specialty: "", pin: "" });
  const [addingDoc, setAddingDoc] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState("");

  // Fetch doctor info on load
  useEffect(() => {
    if (!doctorSlug || isAdminPage) { setDoctorLoading(false); return; }
    fetch(`/api/doctor/${doctorSlug}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => { setDoctorInfo(data); setDoctorLoading(false); })
      .catch(() => { setDoctorNotFound(true); setDoctorLoading(false); });
  }, [doctorSlug]);

  const update = (field, val) => setForm(f => ({ ...f, [field]: val }));
  const toggleCondition = (enKey) => setForm(f => ({
    ...f,
    conditions: f.conditions.includes(enKey)
      ? f.conditions.filter(x => x !== enKey)
      : [...f.conditions, enKey]
  }));

  // Pre-generate summary (streaming) when patient hits review step
  const preGenerate = useCallback(async (currentForm) => {
    if (preGenStarted) return;
    setPreGenStarted(true);
    try {
      const res = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: buildPrompt(currentForm) }),
      });
      if (!res.ok) return;
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split("\n").filter(l => l.startsWith("data: "))) {
          const raw = line.slice(6);
          if (raw === "[DONE]") break;
          try {
            const p = JSON.parse(raw);
            if (p.type === "content_block_delta" && p.delta?.text) {
              full += p.delta.text;
              setPreGenSummary(full);
            }
          } catch {}
        }
      }
      setPreGenSummary(full);
    } catch {}
  }, [preGenStarted]);

  // Submit patient intake to DB
  const handleSubmit = async () => {
    if (!doctorSlug) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorSlug, form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setSubmittedPatientId(data.patientId);
      setSubmitted(true);
      // Save pre-generated summary to DB if ready
      if (preGenSummary && data.patientId) {
        await fetch(`/api/patients/${data.patientId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug: doctorSlug, pin: doctorPin || "no-pin", ai_summary: preGenSummary }),
        }).catch(() => {});
      }
    } catch (err) {
      setSubmitError(err.message);
    }
    setSubmitting(false);
  };

  // Doctor PIN login
  const handlePinSubmit = async () => {
    if (!pinInput || pinLoading) return;
    setPinLoading(true);
    setPinError("");
    try {
      const res = await fetch("/api/doctor/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: doctorSlug, pin: pinInput }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid PIN");
      setDoctorPin(pinInput);
      setView("doctor");
      setShowPinModal(false);
      setPinInput("");
      loadPatients(pinInput);
    } catch (err) {
      setPinError(err.message);
      setPinInput("");
    }
    setPinLoading(false);
  };

  // Load patients from DB
  const loadPatients = async (pin = doctorPin) => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/doctor/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: doctorSlug, pin }),
      });
      const data = await res.json();
      if (res.ok) setPatients(data.patients || []);
    } catch {}
    setRefreshing(false);
  };

  // Generate AI summary for a patient in doctor view
  const generateSummary = async (patient) => {
    setGeneratingSummary(true);
    setLiveSummary("");
    try {
      const res = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: buildPrompt(patient) }),
      });
      if (!res.ok) { setGeneratingSummary(false); return; }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split("\n").filter(l => l.startsWith("data: "))) {
          const raw = line.slice(6);
          if (raw === "[DONE]") break;
          try {
            const p = JSON.parse(raw);
            if (p.type === "content_block_delta" && p.delta?.text) {
              full += p.delta.text;
              setLiveSummary(full);
            }
          } catch {}
        }
      }
      // Save to DB
      await fetch(`/api/patients/${patient.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: doctorSlug, pin: doctorPin, ai_summary: full }),
      });
      setPatients(ps => ps.map(p => p.id === patient.id ? { ...p, ai_summary: full } : p));
      setSelectedPatient(sp => sp?.id === patient.id ? { ...sp, ai_summary: full } : sp);
    } catch {}
    setGeneratingSummary(false);
  };

  const updatePatientStatus = async (patientId, status) => {
    await fetch(`/api/patients/${patientId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: doctorSlug, pin: doctorPin, status }),
    });
    setPatients(ps => ps.map(p => p.id === patientId ? { ...p, status } : p));
    setSelectedPatient(sp => sp?.id === patientId ? { ...sp, status } : sp);
  };

  // Admin functions
  const adminLogin = async () => {
    setAdminError("");
    try {
      const res = await fetch("/api/admin/list-doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminSecret }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unauthorized");
      setAdminDoctors(data.doctors);
      setAdminAuthed(true);
    } catch (err) {
      setAdminError(err.message);
    }
  };

  const addDoctor = async () => {
    if (!newDoc.name || !newDoc.pin) return;
    setAddingDoc(true);
    setAdminError("");
    try {
      const res = await fetch("/api/admin/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminSecret, ...newDoc }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add doctor");
      setAdminDoctors(d => [...d, data.doctor]);
      setNewDoc({ name: "", specialty: "", pin: "" });
    } catch (err) {
      setAdminError(err.message);
    }
    setAddingDoc(false);
  };

  const copyLink = (slug) => {
    const url = `${window.location.origin}/?doctor=${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(""), 2000);
  };

  const statusConfig = {
    waiting:       { label: "Waiting",     color: "#f59e0b", bg: "#fffbeb" },
    "in-progress": { label: "In Progress", color: "#3b82f6", bg: "#eff6ff" },
    completed:     { label: "Completed",   color: "#10b981", bg: "#ecfdf5" },
  };

  // ── ADMIN PAGE ──────────────────────────────────────────────────────────────
  if (isAdminPage) {
    return (
      <div style={s.root}>
        <style>{css}</style>
        <header style={s.header}>
          <div style={s.headerLeft}>
            <div style={s.logoMark}>+</div>
            <div><div style={s.logoText}>IntakeAI</div><div style={s.logoSub}>Admin Panel</div></div>
          </div>
        </header>

        <div style={{ flex: 1, maxWidth: 700, margin: "0 auto", width: "100%", padding: "32px 16px" }}>
          {!adminAuthed ? (
            <div style={s.card} className="card-fade">
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0a1628", marginBottom: 6 }}>🔐 Admin Login</h2>
              <p style={{ fontSize: 13, color: "#6b7c93", marginBottom: 20 }}>Enter your admin secret to manage doctors.</p>
              <Field label="Admin Secret">
                <input style={s.inp} type="password" value={adminSecret} onChange={e => setAdminSecret(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && adminLogin()} placeholder="••••••••" />
              </Field>
              {adminError && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 8 }}>{adminError}</p>}
              <button style={{ ...s.btnNext, marginTop: 16 }} onClick={adminLogin}>Enter Admin Panel</button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }} className="card-fade">
              {/* Add doctor */}
              <div style={s.card}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0a1628", marginBottom: 20 }}>➕ Add New Doctor</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <Row>
                    <Field label="Full Name"><input style={s.inp} value={newDoc.name} onChange={e => setNewDoc(d => ({ ...d, name: e.target.value }))} placeholder="Dr. Jane Smith" /></Field>
                    <Field label="Specialty"><input style={s.inp} value={newDoc.specialty} onChange={e => setNewDoc(d => ({ ...d, specialty: e.target.value }))} placeholder="Cardiology" /></Field>
                  </Row>
                  <Field label="PIN (4–6 digits)"><input style={s.inp} type="password" maxLength={6} value={newDoc.pin} onChange={e => setNewDoc(d => ({ ...d, pin: e.target.value }))} placeholder="••••" /></Field>
                  {adminError && <p style={{ color: "#ef4444", fontSize: 12 }}>{adminError}</p>}
                  <button style={{ ...s.btnNext, alignSelf: "flex-start" }} onClick={addDoctor} disabled={addingDoc || !newDoc.name || !newDoc.pin}>
                    {addingDoc ? "Adding..." : "Add Doctor"}
                  </button>
                </div>
              </div>

              {/* Doctor list */}
              <div style={s.card}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0a1628", marginBottom: 20 }}>🩺 All Doctors ({adminDoctors.length})</h2>
                {adminDoctors.length === 0 ? (
                  <p style={{ color: "#8a9bb0", fontSize: 14 }}>No doctors added yet.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {adminDoctors.map(doc => (
                      <div key={doc.id} style={{ padding: "14px 16px", borderRadius: 10, background: "#f8fafc", border: "1px solid #dde6f0" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                          <div>
                            <div style={{ fontWeight: 700, color: "#0a1628", fontSize: 14 }}>{doc.name}</div>
                            {doc.specialty && <div style={{ fontSize: 12, color: "#6b7c93" }}>{doc.specialty}</div>}
                          </div>
                          <button
                            style={{ ...s.smBtn, background: copiedSlug === doc.slug ? "#10b981" : "#fff", color: copiedSlug === doc.slug ? "#fff" : "#0a1628", border: copiedSlug === doc.slug ? "none" : "1.5px solid #dde6f0" }}
                            onClick={() => copyLink(doc.slug)}
                          >
                            {copiedSlug === doc.slug ? "✓ Copied!" : "📋 Copy Patient Link"}
                          </button>
                        </div>
                        <div style={{ marginTop: 8, fontSize: 11, color: "#8a9bb0", wordBreak: "break-all" }}>
                          {window.location.origin}/?doctor={doc.slug}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <footer style={s.footer}>{t.footer}</footer>
      </div>
    );
  }

  // ── LOADING ────────────────────────────────────────────────────────────────
  if (doctorLoading) {
    return (
      <div style={{ ...s.root, alignItems: "center", justifyContent: "center" }}>
        <style>{css}</style>
        <div style={{ fontSize: 36, marginBottom: 12 }} className="spin">⟳</div>
        <p style={{ color: "#6b7c93" }}>Loading...</p>
      </div>
    );
  }

  // ── NO DOCTOR / INVALID LINK ──────────────────────────────────────────────
  if (!doctorSlug || doctorNotFound) {
    return (
      <div style={s.root}>
        <style>{css}</style>
        <header style={s.header}>
          <div style={s.headerLeft}>
            <div style={s.logoMark}>+</div>
            <div><div style={s.logoText}>IntakeAI</div></div>
          </div>
        </header>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ ...s.card, textAlign: "center", maxWidth: 460 }} className="card-fade">
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔗</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0a1628", marginBottom: 8 }}>{t.noDoctor}</h2>
            <p style={{ fontSize: 14, color: "#6b7c93" }}>{t.noDoctorSub}</p>
          </div>
        </div>
        <footer style={s.footer}>{t.footer}</footer>
      </div>
    );
  }

  // ── DOCTOR DASHBOARD ───────────────────────────────────────────────────────
  if (view === "doctor") {
    const summaryText = selectedPatient?.ai_summary || liveSummary;
    const hasSummary = !!(selectedPatient?.ai_summary || (liveSummary && !generatingSummary));

    return (
      <div style={s.root}>
        <style>{css}</style>
        <header style={s.header}>
          <div style={s.headerLeft}>
            <div style={s.logoMark}>+</div>
            <div>
              <div style={s.logoText}>IntakeAI</div>
              <div style={s.logoSub}>Doctor Dashboard</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "#2dd4bf", fontSize: 13, fontWeight: 600 }}>🩺 {doctorInfo?.name}</span>
            <button style={s.langBtn} onClick={() => { setView("patient"); setSelectedPatient(null); }}>🔒 Lock</button>
          </div>
        </header>

        <div style={{ flex: 1, maxWidth: 860, margin: "0 auto", width: "100%", padding: "24px 16px", display: "flex", gap: 16 }}>

          {/* Patient Queue */}
          <div style={{ width: 260, flexShrink: 0 }}>
            <div style={{ ...s.card, padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "14px 18px", borderBottom: "1px solid #f0f4f8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#0a1628" }}>Today's Queue</span>
                <button style={{ ...s.smBtn, fontSize: 11 }} onClick={() => loadPatients()} disabled={refreshing}>
                  {refreshing ? "⟳" : "↻ Refresh"}
                </button>
              </div>
              {patients.length === 0 ? (
                <div style={{ padding: "32px 16px", textAlign: "center", color: "#8a9bb0", fontSize: 13 }}>
                  No patients today yet.
                </div>
              ) : (
                patients.map(p => {
                  const sc = statusConfig[p.status] || statusConfig.waiting;
                  const isSelected = selectedPatient?.id === p.id;
                  return (
                    <div
                      key={p.id}
                      style={{ padding: "12px 16px", borderBottom: "1px solid #f0f4f8", cursor: "pointer", background: isSelected ? "#f0f9ff" : "#fff", borderLeft: isSelected ? "3px solid #2dd4bf" : "3px solid transparent" }}
                      onClick={() => {
                        setSelectedPatient(p);
                        setDocTab("summary");
                        setLiveSummary("");
                        if (!p.ai_summary) {
                          updatePatientStatus(p.id, "in-progress");
                          generateSummary(p);
                        }
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ fontWeight: 600, fontSize: 13, color: "#0a1628" }}>{p.first_name} {p.last_name}</div>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 10, color: sc.color, background: sc.bg }}>{sc.label}</span>
                      </div>
                      <div style={{ fontSize: 11, color: "#6b7c93", marginTop: 3 }}>{p.visit_reason || "—"}</div>
                      {p.ai_summary && <div style={{ fontSize: 10, color: "#10b981", marginTop: 3 }}>● Summary ready</div>}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Patient Detail */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {!selectedPatient ? (
              <div style={{ ...s.card, textAlign: "center", padding: "60px 32px", color: "#8a9bb0" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>👈</div>
                <p>Select a patient to view their intake and summary.</p>
              </div>
            ) : (
              <div style={{ ...s.card, padding: 0, overflow: "hidden" }} className="card-fade">
                {/* Patient header */}
                <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f4f8", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={s.patientAvatar}>{selectedPatient.first_name?.[0]}{selectedPatient.last_name?.[0]}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#0a1628" }}>{selectedPatient.first_name} {selectedPatient.last_name}</div>
                    <div style={{ fontSize: 12, color: "#8a9bb0" }}>DOB: {selectedPatient.dob} · {selectedPatient.sex} · Pain: {selectedPatient.pain_scale}/10</div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {selectedPatient.status !== "completed" && (
                      <button style={{ ...s.smBtn, background: "#10b981", color: "#fff", border: "none", fontSize: 12 }}
                        onClick={() => updatePatientStatus(selectedPatient.id, "completed")}>
                        ✓ Complete
                      </button>
                    )}
                    {selectedPatient.status === "completed" && (
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#10b981" }}>✓ Visit Complete</span>
                    )}
                  </div>
                </div>

                {/* Tabs */}
                <div style={s.tabRow}>
                  {[["summary", "AI Summary"], ["intake", "Intake"], ["history", "History"]].map(([key, label]) => (
                    <button key={key} style={{ ...s.tab, ...(docTab === key ? s.tabActive : {}) }} onClick={() => setDocTab(key)}>
                      {label}
                      {key === "summary" && hasSummary && <span style={{ marginLeft: 5, color: "#10b981", fontSize: 10 }}>●</span>}
                    </button>
                  ))}
                </div>

                <div style={s.tabContent}>
                  {/* Summary tab */}
                  {docTab === "summary" && (
                    <div>
                      {!hasSummary && !generatingSummary ? (
                        <div style={{ textAlign: "center", padding: "32px 0" }}>
                          <span className="spin" style={{ display: "inline-block", fontSize: 28 }}>⟳</span>
                          <p style={{ color: "#6b7c93", fontSize: 13, marginTop: 8 }}>Preparing summary...</p>
                        </div>
                      ) : (
                        <div>
                          <div style={s.summaryToolbar}>
                            <span style={s.summaryLabel}>AI CLINICAL SUMMARY</span>
                            <button style={s.smBtn} onClick={() => navigator.clipboard.writeText(summaryText)}>Copy</button>
                          </div>
                          {generatingSummary && !liveSummary ? (
                            <div style={{ textAlign: "center", padding: "24px 0" }}>
                              <span className="spin" style={{ display: "inline-block", fontSize: 28 }}>⟳</span>
                              <p style={{ color: "#6b7c93", fontSize: 13, marginTop: 8 }}>Generating summary...</p>
                            </div>
                          ) : (
                            <pre style={s.summaryPre}>{summaryText}<span style={{ display: generatingSummary ? "inline" : "none" }} className="cursor">▊</span></pre>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Intake tab */}
                  {docTab === "intake" && (
                    <div style={s.infoGrid}>
                      <InfoBlock label="Chief Complaint" value={selectedPatient.visit_reason} />
                      <InfoBlock label="Address" value={[selectedPatient.address, selectedPatient.city, selectedPatient.state, selectedPatient.zip].filter(Boolean).join(", ")} fullWidth />
                      <InfoBlock label="Symptoms" value={selectedPatient.symptoms} />
                      <InfoBlock label="Duration" value={selectedPatient.symptom_duration} />
                      <InfoBlock label="Pain Level" value={`${selectedPatient.pain_scale}/10`} />
                      <InfoBlock label="Medications" value={selectedPatient.medications || "None"} />
                      <InfoBlock label="Allergies" value={selectedPatient.allergies || "NKDA"} />
                      <InfoBlock label="Phone" value={selectedPatient.phone} />
                      <InfoBlock label="Email" value={selectedPatient.email} />
                    </div>
                  )}

                  {/* History tab */}
                  {docTab === "history" && (
                    <div style={s.infoGrid}>
                      <InfoBlock label="Conditions" value={(selectedPatient.conditions || []).join(", ") || "None"} fullWidth />
                      <InfoBlock label="Surgeries" value={selectedPatient.surgeries || "None"} />
                      <InfoBlock label="Family History" value={selectedPatient.family_history || "None"} />
                      <InfoBlock label="Smoking" value={selectedPatient.smoking || "N/A"} />
                      <InfoBlock label="Alcohol" value={selectedPatient.alcohol || "N/A"} />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <footer style={s.footer}>{t.footer}</footer>
      </div>
    );
  }

  // ── PATIENT VIEW ──────────────────────────────────────────────────────────
  return (
    <div style={s.root}>
      <style>{css}</style>

      <header style={s.header}>
        <div style={s.headerLeft}>
          <div style={s.logoMark}>+</div>
          <div>
            <div style={s.logoText}>IntakeAI</div>
            {doctorInfo && <div style={s.logoSub}>{doctorInfo.name}{doctorInfo.specialty ? ` · ${doctorInfo.specialty}` : ""}</div>}
          </div>
        </div>
        <div style={s.viewSwitcher}>
          <button style={{ ...s.viewBtn, ...s.viewBtnActive }}>👤 {t.langToggle === "Español" ? "Patient View" : "Vista del Paciente"}</button>
        </div>
        <button style={s.langBtn} onClick={() => setLang(l => l === "en" ? "es" : "en")}>
          {t.langFlag} {t.langToggle}
        </button>
      </header>

      <div style={s.tipBanner}>
        💡 {t.langToggle === "Español"
          ? "Fill out all steps and submit — your information will be sent directly to your doctor."
          : "Complete todos los pasos y envíe — su información será enviada directamente a su médico."}
      </div>

      {/* Submitted */}
      {submitted ? (
        <div style={s.patientWrap}>
          <div style={{ ...s.card, textAlign: "center", padding: "60px 40px" }} className="card-fade">
            <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0a1628", marginBottom: 8 }}>{t.submitted}</h2>
            <p style={{ fontSize: 15, color: "#6b7c93", maxWidth: 400, margin: "0 auto" }}>
              Your information has been sent to {doctorInfo?.name || "your doctor"}. You may close this window.
            </p>
          </div>
        </div>
      ) : (
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
                  <Field label={t.dob}>
                    <input style={s.inp} type="date" value={form.dob} onChange={e => update("dob", e.target.value)} max={new Date().toISOString().split("T")[0]} min="1900-01-01" />
                    {(() => { const age = calcAge(form.dob); return age ? <span style={{ fontSize: 11, marginTop: 3, color: age.error ? "#ef4444" : "#10b981", fontWeight: 600 }}>{age.label}</span> : null; })()}
                  </Field>
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
                <Field label={t.address}><input style={s.inp} value={form.address} onChange={e => update("address", e.target.value)} placeholder={t.addressPh} /></Field>
                <Row>
                  <Field label={t.city}><input style={s.inp} value={form.city} onChange={e => update("city", e.target.value)} placeholder={t.cityPh} /></Field>
                  <Field label={t.state}><input style={s.inp} value={form.state} onChange={e => update("state", e.target.value)} placeholder={t.statePh} /></Field>
                  <Field label={t.zip}><input style={s.inp} value={form.zip} onChange={e => update("zip", e.target.value)} placeholder={t.zipPh} /></Field>
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
                  <RB label={t.address} value={[form.address, form.city, form.state, form.zip].filter(Boolean).join(", ")} />
                  <RB label={t.visitReason} value={form.visitReason} />
                  <RB label="Symptoms" value={`${form.symptoms} (${form.symptomDuration}, pain ${form.painScale}/10)`} />
                  <RB label="Conditions" value={form.conditions.map(c => { const i = EN_CONDITIONS.indexOf(c); return i >= 0 ? t.conditions[i] : c; }).join(", ") || "None"} />
                  <RB label="Medications" value={form.medications || "None"} />
                  <RB label="Allergies" value={form.allergies || "NKDA"} />
                </div>
                <p style={{ fontSize: 13, color: "#6b7c93", marginTop: 16, fontStyle: "italic" }}>{t.reviewNote}</p>
                {submitError && <p style={{ color: "#ef4444", fontSize: 13, marginTop: 8 }}>{submitError}</p>}
              </Section>
            )}

            {/* Nav */}
            <div style={s.navRow}>
              {step > 0 && <button style={s.btnBack} onClick={() => setStep(s => s - 1)}>{t.back}</button>}
              {step < 4 && (
                <button style={s.btnNext} onClick={() => {
                  const next = step + 1;
                  setStep(next);
                  if (next === 4 && !preGenStarted) preGenerate(form);
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

      {/* PIN Modal */}
      {showPinModal && (
        <div style={s.modalOverlay} onClick={() => { setShowPinModal(false); setPinInput(""); setPinError(""); }}>
          <div style={s.modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🩺</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0a1628", marginBottom: 6 }}>Staff Access</h3>
            <p style={{ fontSize: 13, color: "#6b7c93", marginBottom: 20 }}>Enter your PIN to access the doctor dashboard.</p>
            <input
              style={{ ...s.inp, textAlign: "center", fontSize: 20, letterSpacing: "0.4em", marginBottom: 12 }}
              type="password" maxLength={6} value={pinInput}
              onChange={e => { setPinInput(e.target.value); setPinError(""); }}
              onKeyDown={e => e.key === "Enter" && handlePinSubmit()}
              placeholder="••••" autoFocus
            />
            {pinError && <p style={{ color: "#ef4444", fontSize: 12, marginBottom: 10 }}>{pinError}</p>}
            <button style={{ ...s.btnNext, width: "100%", justifyContent: "center" }}
              onClick={handlePinSubmit} disabled={pinLoading}>
              {pinLoading ? "Verifying..." : "Unlock Dashboard"}
            </button>
          </div>
        </div>
      )}

      <footer style={s.footer}>
        {t.footer}
        <span
          style={{ marginLeft: 16, color: "#b0bec5", cursor: "pointer", fontSize: 10, textDecoration: "underline" }}
          onClick={() => { setShowPinModal(true); setPinInput(""); setPinError(""); }}
        >
          Staff Login
        </span>
      </footer>
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
function InfoBlock({ label, value, fullWidth }) {
  return (
    <div style={{ padding: "12px 14px", borderRadius: 8, background: "#f8fafc", border: "1px solid #dde6f0", ...(fullWidth ? { gridColumn: "1 / -1" } : {}) }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: "#8a9bb0", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 13, color: "#1a2332", lineHeight: 1.5, wordBreak: "break-word" }}>{value || "—"}</div>
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
  langBtn: { display: "flex", alignItems: "center", gap: 6, background: "#1e3a5f", border: "1px solid #2dd4bf44", color: "#2dd4bf", padding: "7px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 },
  tipBanner: { background: "#1e3a5f", color: "#7dd3fc", fontSize: 12, padding: "8px 28px", textAlign: "center", borderBottom: "1px solid #0a1628" },
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
  patientAvatar: { width: 44, height: 44, borderRadius: "50%", background: "#0a1628", color: "#2dd4bf", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, flexShrink: 0 },
  tabRow: { display: "flex", borderBottom: "1px solid #f0f4f8" },
  tab: { padding: "10px 20px", border: "none", background: "none", fontSize: 13, color: "#8a9bb0", cursor: "pointer", fontFamily: "inherit", borderBottom: "2px solid transparent", transition: "all 0.2s" },
  tabActive: { color: "#0a1628", borderBottom: "2px solid #2dd4bf", fontWeight: 600 },
  tabContent: { padding: "20px 24px" },
  summaryToolbar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  summaryLabel: { fontSize: 10, fontWeight: 700, color: "#8a9bb0", textTransform: "uppercase", letterSpacing: "0.1em" },
  smBtn: { padding: "5px 14px", borderRadius: 6, border: "1.5px solid #dde6f0", background: "#fff", fontSize: 12, cursor: "pointer", fontFamily: "inherit" },
  summaryPre: { background: "#f8fafc", borderRadius: 10, padding: 20, fontSize: 12, lineHeight: 1.8, whiteSpace: "pre-wrap", fontFamily: "'Courier New', monospace", color: "#2d3748", maxHeight: 400, overflowY: "auto", margin: 0 },
  infoGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  footer: { textAlign: "center", padding: "16px", fontSize: 11, color: "#8a9bb0", borderTop: "1px solid #dde6f0", marginTop: "auto" },
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(10,22,40,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modalBox: { background: "#fff", borderRadius: 16, padding: "36px 32px", width: "100%", maxWidth: 360, textAlign: "center", boxShadow: "0 20px 60px rgba(10,22,40,0.2)" },
};

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  input:focus, select:focus, textarea:focus { border-color: #2dd4bf !important; box-shadow: 0 0 0 3px rgba(45,212,191,0.12); outline: none; }
  .card-fade { animation: fadeUp 0.35s ease both; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  button:hover { opacity: 0.87; }
  button:disabled { opacity: 0.5; cursor: not-allowed; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .spin { display: inline-block; animation: spin 1s linear infinite; }
  .cursor { animation: blink 0.7s step-end infinite; }
  @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #f0f4f8; }
  ::-webkit-scrollbar-thumb { background: #cbd5e0; border-radius: 3px; }
`;
