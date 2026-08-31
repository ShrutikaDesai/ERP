import React, { useState, useRef, useCallback, useEffect } from "react";

export const theme = {
  colors: {
    primary: "#E16D6D",
    primaryHover: "#d45858",
    background: "#F5F6FA",
    surface: "#FFFFFF",
    textPrimary: "#1F2937",
    textSecondary: "#6B7280",
    textMuted: "#9CA3AF",
    border: "#E5E7EB",
    success: "#22C55E",
    warning: "#F59E0B",
    danger: "#EF4444",
    info: "#3B82F6",
    tableHeader: "#F9FAFB",
    tableBorder: "#ECEEF2",
  },
  radius: { sm: "8px", md: "12px", lg: "18px", xl: "24px" },
  shadow: {
    card: "0 1px 3px rgba(0,0,0,0.06)",
    modal: "0 10px 30px rgba(0,0,0,0.08)",
  },
  typography: { fontFamily: "'Plus Jakarta Sans', sans-serif" },
};

// ── Validators ────────────────────────────────────────────────────────────────
const validators = {
  firstName: (v) => !!v && v.trim().length > 0,
  lastName: (v) => !!v && v.trim().length > 0,
  dob: (v) => !!v && /^\d{4}-\d{2}-\d{2}$/.test(v.trim()),
  parentEmail: (v) => !!v && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
};

const recomputeErrors = (s) =>
  Object.keys(validators).filter((f) => !validators[f](s[f]));

// ── Mock data ─────────────────────────────────────────────────────────────────
// ── Mock data ─────────────────────────────────────────────────────────────────
const INIT = [
  { id: 1, firstName: "Aarav", lastName: "Sharma", dob: "2010-05-14", grade: "Grade 8", parentEmail: "r.sharma@email.com" },
  { id: 2, firstName: "Kabir", lastName: "Agarwal", dob: "2009-11-22", grade: "Grade 9", parentEmail: "kabir.agarwal@" },
  { id: 3, firstName: "Ananya", lastName: "", dob: "2011-02-10", grade: "Grade 7", parentEmail: "ananya.parent@email.com" },
  { id: 4, firstName: "Vivaan", lastName: "Shah", dob: "2008-08-30", grade: "Grade 10", parentEmail: "shah.family@email.com" },
  { id: 5, firstName: "Diya", lastName: "Kulkarni", dob: "2010-03-17", grade: "Grade 8", parentEmail: "diya.kulkarni@" },
  { id: 6, firstName: "Ishaan", lastName: "Verma", dob: "2009-07-22", grade: "Grade 9", parentEmail: "ishaan.verma@email.com" },
  { id: 7, firstName: "Saanvi", lastName: "Reddy", dob: "2011-09-05", grade: "Grade 7", parentEmail: "saanvi.reddy@email.com" },
  { id: 8, firstName: "Arjun", lastName: "", dob: "2008-12-19", grade: "Grade 10", parentEmail: "arjun.parent@email.com" },
].map((s) => { const errors = recomputeErrors(s); return { ...s, errors, status: errors.length ? "error" : "valid" }; });

// ── Icons ─────────────────────────────────────────────────────────────────────
const Ico = {
  Upload: () => (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    </svg>
  ),
  Download: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  Check: ({ s = 14 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5l-4-4 1.41-1.41L10 13.67l6.59-6.59L18 8.5l-8 8z" />
    </svg>
  ),
  Warn: ({ s = 14 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
    </svg>
  ),
  Alert: ({ s = 14 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
    </svg>
  ),
  File: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  Arrow: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  Wrench: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  Pencil: ({ s = 12 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
};

// ── Status Badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) =>
  status === "valid" ? (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700, background: "#DCFCE7", color: "#15803D" }}>
      <Ico.Check s={10} /> Valid
    </span>
  ) : (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700, background: "#FEE2E2", color: "#DC2626" }}>
      <Ico.Alert s={10} /> Error
    </span>
  );

// ── Editable Cell ─────────────────────────────────────────────────────────────
const EditableCell = ({ value, fieldKey, hasError, onSave, compact = false }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value || "");
  const inputRef = useRef(null);

  const validate = validators[fieldKey];
  const isValid = validate ? validate(draft) : true;

  const startEdit = () => { setDraft(value || ""); setEditing(true); setTimeout(() => inputRef.current?.focus(), 0); };
  const commit = () => { if (!isValid) return; setEditing(false); onSave(fieldKey, draft.trim()); };
  const cancel = () => { setDraft(value || ""); setEditing(false); };

  if (!hasError) return <span style={{ color: theme.colors.textPrimary, fontSize: 13 }}>{value}</span>;

  if (editing) return (
    <div style={{ display: "flex", flexDirection: compact ? "column" : "row", alignItems: compact ? "stretch" : "center", gap: 6, minWidth: compact ? "auto" : 200 }}>
      <div style={{ flex: 1, position: "relative" }}>
        <input
          ref={inputRef} value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") cancel(); }}
          style={{
            width: "100%", fontSize: 13, fontFamily: theme.typography.fontFamily,
            padding: "7px 10px", borderRadius: 7, boxSizing: "border-box",
            border: `1.5px solid ${isValid ? theme.colors.primary : theme.colors.danger}`,
            outline: "none", color: theme.colors.textPrimary, background: "#fff",
            boxShadow: isValid ? "0 0 0 3px rgba(225,109,109,0.13)" : "0 0 0 3px rgba(239,68,68,0.10)",
            transition: "border .15s, box-shadow .15s",
          }}
          placeholder={fieldKey === "parentEmail" ? "email@domain.com" : fieldKey === "dob" ? "YYYY-MM-DD" : "Enter value…"}
        />
        {!isValid && draft.length > 0 && (
          <div style={{ position: "absolute", top: "calc(100% + 3px)", left: 0, fontSize: 11, color: theme.colors.danger, fontWeight: 500, whiteSpace: "nowrap" }}>
            {fieldKey === "parentEmail" ? "Enter a valid email" : fieldKey === "dob" ? "Use YYYY-MM-DD format" : "This field is required"}
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <button onClick={commit} disabled={!isValid}
          style={{
            flex: 1, padding: "7px 14px", borderRadius: 6, border: "none", cursor: isValid ? "pointer" : "not-allowed",
            background: isValid ? theme.colors.success : "#D1D5DB", color: "#fff", fontSize: 12, fontWeight: 700,
            fontFamily: theme.typography.fontFamily, whiteSpace: "nowrap", transition: "background .15s"
          }}>
          Save
        </button>
        <button onClick={cancel}
          style={{
            padding: "7px 10px", borderRadius: 6, border: `1px solid ${theme.colors.border}`,
            background: "#fff", cursor: "pointer", fontSize: 12, color: theme.colors.textSecondary,
            fontFamily: theme.typography.fontFamily
          }}>
          ✕
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      <span style={{
        color: value ? theme.colors.danger : theme.colors.textMuted,
        fontStyle: value ? "normal" : "italic", fontSize: 13,
        background: "#FFF5F5", border: "1.5px solid #FECACA", borderRadius: 6,
        padding: "3px 10px", maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>
        {value || "Missing"}
      </span>
      <button onClick={startEdit} className="edit-btn"
        style={{
          display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 6,
          border: `1px solid ${theme.colors.border}`, background: "#fff", cursor: "pointer",
          fontSize: 11, fontWeight: 600, color: theme.colors.primary, fontFamily: theme.typography.fontFamily,
          whiteSpace: "nowrap", transition: "all .15s"
        }}>
        <Ico.Pencil s={11} /> Edit
      </button>
    </div>
  );
};

// ── Mobile student card ───────────────────────────────────────────────────────
const MobileCard = ({ s, onSave }) => {
  const isError = s.status === "error";
  const fields = [
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "dob", label: "Date of Birth" },
    { key: "grade", label: "Grade", readOnly: true },
    { key: "parentEmail", label: "Parent Email" },
  ];

  return (
    <div style={{
      background: isError ? "#FFFBFB" : "#fff",
      border: `1px solid ${isError ? "#FECACA" : theme.colors.tableBorder}`,
      borderRadius: theme.radius.md,
      padding: "14px 16px",
      display: "flex", flexDirection: "column", gap: 10,
    }}>
      {/* card header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            fontSize: 11, fontWeight: 700, color: theme.colors.textMuted, background: theme.colors.background,
            padding: "2px 8px", borderRadius: 6
          }}>#{s.id}</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: theme.colors.textPrimary }}>{s.firstName} {s.lastName || "—"}</span>
        </div>
        <StatusBadge status={s.status} />
      </div>

      {/* fields */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 12px" }}>
        {fields.map(({ key, label, readOnly }) => (
          <div key={key} style={{ display: "flex", flexDirection: "column", gap: 4, gridColumn: key === "parentEmail" ? "1 / -1" : "auto" }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: theme.colors.textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
            {readOnly
              ? <span style={{ fontSize: 13, color: theme.colors.textPrimary }}>{s[key]}</span>
              : <EditableCell value={s[key]} fieldKey={key} hasError={s.errors.includes(key)}
                onSave={(f, v) => onSave(s.id, f, v)} compact />}
          </div>
        ))}
      </div>
    </div>
  );
};

// ── ColHeader ─────────────────────────────────────────────────────────────────
const ColHeader = ({ label, status }) => {
  const icon = status === "ok"
    ? <span style={{ color: theme.colors.success }}><Ico.Check s={12} /></span>
    : status === "warn"
      ? <span style={{ color: theme.colors.warning }}><Ico.Warn s={12} /></span>
      : null;
  return (
    <th style={{ padding: "12px 14px", textAlign: "left", color: theme.colors.textMuted, fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", whiteSpace: "nowrap", background: theme.colors.tableHeader }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>{label}{icon}</span>
    </th>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────
const BulkImport = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showPreview, setShowPreview] = useState(true);
  const [showOnlyErrors, setShowOnlyErrors] = useState(false);
  const [students, setStudents] = useState(INIT);
  const [isMobile, setIsMobile] = useState(false);
  const fileInputRef = useRef(null);

  // Detect mobile
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 700px)");
    const handler = (e) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const total = students.length;
  const valid = students.filter(s => s.status === "valid").length;
  const invalid = students.filter(s => s.status === "error").length;
  const displayed = showOnlyErrors ? students.filter(s => s.status === "error") : students;

  const handleSave = useCallback((studentId, field, newValue) => {
    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;
      const updated = { ...s, [field]: newValue };
      const errors = recomputeErrors(updated);
      return { ...updated, errors, status: errors.length ? "error" : "valid" };
    }));
  }, []);

  const handleDragOver = useCallback((e) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback(() => setIsDragging(false), []);
  const handleDrop = useCallback((e) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) { setUploadedFile(file); setShowPreview(true); }
  }, []);
  const handleFileSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (file) { setUploadedFile(file); setShowPreview(true); }
  }, []);

  const p = theme.colors;

  return (
  <div
  className="w-full"
  style={{
    background: theme.colors.background,
    fontFamily: theme.typography.fontFamily,
  }}
>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .upload-zone { transition: all .2s ease; }
        .upload-zone:hover { border-color: ${p.primary} !important; background: #FFF5F5 !important; }
        .dragging { border-color: ${p.primary} !important; background: #FFF5F5 !important; }
        .btn-primary { transition: background .18s; }
        .btn-primary:hover { background: ${p.primaryHover} !important; }
        .btn-ghost:hover { background: ${p.background} !important; }
        .table-row { border-bottom: 1px solid ${p.tableBorder}; transition: background .1s; }
        .table-row:hover { background: #F9FAFB; }
        .row-error { background: #FFFBFB; }
        .edit-btn:hover { background: #FFF5F5 !important; border-color: ${p.primary} !important; }
        @keyframes flashGreen { 0%{background:#DCFCE7} 100%{background:transparent} }
        .flash { animation: flashGreen 1s ease forwards; }
        /* Scrollbar thin */
        .table-scroll::-webkit-scrollbar { height: 5px; }
        .table-scroll::-webkit-scrollbar-track { background: transparent; }
        .table-scroll::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
      `}</style>

      {/* Header */}
<div className="mb-6 flex items-start justify-between">
        <div>
         <h2
              className="text-xl font-bold"
              style={{
                color: theme.colors.textPrimary,
                  fontSize: "1.7rem",
                      fontWeight: 700,
              }}
            >
            Student Bulk Import
          </h2>

          <p
            className="text-sm"
            style={{
              color: theme.colors.textSecondary,
              margin: 0,
            }}
          >
            Upload CSV to add multiple students at once
          </p>
        </div>

      </div>

      <div style={{ maxWidth: 1150, margin: "0 auto", display: "flex", flexDirection: "column", gap: isMobile ? 14 : 20 }}>

        {/* ── Upload card ── */}
        <div style={{ background: p.surface, borderRadius: theme.radius.lg, padding: isMobile ? "18px 16px" : "28px", boxShadow: theme.shadow.card, border: `1px solid ${p.border}` }}>

          {/* header */}
          <div style={{ display: "flex", alignItems: isMobile ? "flex-start" : "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 18 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: p.textPrimary }}>Upload Data</h2>
              <p style={{ margin: "4px 0 0", fontSize: 12, color: p.textSecondary }}>Please ensure your CSV matches our expected format.</p>
            </div>
            <button className="btn-ghost" style={{
              display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8,
              border: `1.5px solid ${p.border}`, background: "transparent", cursor: "pointer", fontSize: 12, fontWeight: 600, color: p.textSecondary, fontFamily: "inherit"
            }}>
              <Ico.Download /> Download Template
            </button>
          </div>

          {/* drop zone */}
          <div
            className={`upload-zone ${isDragging ? "dragging" : ""}`}
            onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
            style={{
              border: `2px dashed ${isDragging ? p.primary : p.border}`, borderRadius: theme.radius.md,
              padding: isMobile ? "28px 16px" : "36px 24px", textAlign: "center",
              background: isDragging ? "#FFF5F5" : p.background, cursor: "pointer"
            }}
            onClick={() => !uploadedFile && fileInputRef.current?.click()}>
            <input ref={fileInputRef} type="file" accept=".csv" style={{ display: "none" }} onChange={handleFileSelect} />

            {uploadedFile ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center", color: p.success }}><Ico.File /></div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, color: p.textPrimary, fontSize: 13 }}>{uploadedFile.name}</p>
                  <p style={{ margin: "3px 0 0", fontSize: 11, color: p.textMuted }}>{uploadedFile.size ? `${(uploadedFile.size / 1024).toFixed(1)} KB` : "CSV uploaded"}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setUploadedFile(null); setShowPreview(false); }}
                  style={{ fontSize: 11, color: p.danger, background: "#FEE2E2", border: "none", borderRadius: 6, padding: "4px 12px", cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>
                  Remove file
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", color: p.info }}><Ico.Upload /></div>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, color: p.textPrimary, fontSize: 13 }}>Click to upload or drag & drop</p>
                  <p style={{ margin: "4px 0 0", fontSize: 11, color: p.textMuted }}>CSV files only (Max. 10MB)</p>
                </div>
                <button className="btn-primary"
                  style={{ background: p.primary, color: "#fff", border: "none", borderRadius: 8, padding: "9px 22px", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                  Browse Files
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Validation Preview card ── */}
        {showPreview && (
          <div style={{ background: p.surface, borderRadius: theme.radius.lg, padding: isMobile ? "18px 16px" : "28px", boxShadow: theme.shadow.card, border: `1px solid ${p.border}` }}>

            {/* header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: p.textPrimary }}>Data Validation Preview</h2>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: p.textSecondary }}>
                  Click <strong style={{ color: p.primary }}>Edit</strong> on any error cell to fix it inline.
                </p>
              </div>
              {/* Stats */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                {[
                  { label: "TOTAL", val: total, cls: "badge-total", bg: "#F3F4F6", clr: p.textSecondary },
                  { label: "VALID", val: valid, bg: "#DCFCE7", clr: "#15803D", border: "1px solid #BBF7D0" },
                  { label: "INVALID", val: invalid, bg: "#FEE2E2", clr: "#DC2626", border: "1px solid #FECACA" },
                ].map(({ label, val, bg, clr, border: bd }) => (
                  <span key={label} style={{ padding: isMobile ? "4px 10px" : "5px 12px", borderRadius: 8, fontSize: 10, fontWeight: 700, background: bg, color: clr, border: bd || "none", letterSpacing: "0.04em" }}>
                    {label}&nbsp;<span style={{ fontWeight: 800, fontSize: 12 }}>{val}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* toolbar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: p.textSecondary, fontWeight: 500, cursor: "pointer", userSelect: "none" }}>
                <input type="checkbox" checked={showOnlyErrors} onChange={e => setShowOnlyErrors(e.target.checked)}
                  style={{ width: 14, height: 14, accentColor: p.primary }} />
                Show only errors
              </label>
              {invalid > 0
                ? <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: p.warning, fontWeight: 600 }}><Ico.Warn s={12} />{invalid} row{invalid !== 1 ? "s" : ""} need fixing</span>
                : <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: p.success, fontWeight: 600 }}><Ico.Check s={12} />All rows valid!</span>}
            </div>

            {/* ── MOBILE: cards ── */}
            {isMobile ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {displayed.map(s => <MobileCard key={s.id} s={s} onSave={handleSave} />)}
              </div>
            ) : (
              /* ── DESKTOP: table ── */
              <div style={{ border: `1px solid ${p.tableBorder}`, borderRadius: theme.radius.md, overflow: "hidden" }}>
                <div className="table-scroll" style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th style={{ padding: "12px 14px", textAlign: "left", color: p.textMuted, fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", background: p.tableHeader, width: 40 }}>#</th>
                        <th style={{ padding: "12px 14px", textAlign: "left", color: p.textMuted, fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", background: p.tableHeader }}>Status</th>
                        <ColHeader label="First Name" status="ok" />
                        <ColHeader label="Last Name" status="ok" />
                        <ColHeader label="Date of Birth" status="ok" />
                        <ColHeader label="Grade" status="warn" />
                        <ColHeader label="Parent Email" status="ok" />
                      </tr>
                    </thead>
                    <tbody>
                      {displayed.map(s => (
                        <tr key={s.id} className={`table-row${s.status === "error" ? " row-error" : ""}`}>
                          <td style={{ padding: "12px 14px", color: p.textMuted, fontSize: 13, fontWeight: 500 }}>{s.id}</td>
                          <td style={{ padding: "12px 14px" }}><StatusBadge status={s.status} /></td>
                          {[
                            { key: "firstName", min: 130 },
                            { key: "lastName", min: 150 },
                            { key: "dob", min: 130 },
                          ].map(({ key, min }) => (
                            <td key={key} style={{ padding: "12px 14px", minWidth: min }}>
                              <EditableCell value={s[key]} fieldKey={key} hasError={s.errors.includes(key)} onSave={(f, v) => handleSave(s.id, f, v)} />
                            </td>
                          ))}
                          <td style={{ padding: "12px 14px", fontSize: 13, color: p.textPrimary }}>{s.grade}</td>
                          <td style={{ padding: "12px 14px", minWidth: 220 }}>
                            <EditableCell value={s.parentEmail} fieldKey="parentEmail" hasError={s.errors.includes("parentEmail")} onSave={(f, v) => handleSave(s.id, f, v)} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* footer */}
            <div style={{ display: "flex", alignItems: isMobile ? "flex-start" : "center", justifyContent: "space-between", flexDirection: isMobile ? "column" : "row", flexWrap: "wrap", gap: 14, marginTop: 18 }}>
              {/* info */}
              <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: p.textSecondary }}>
                {invalid > 0 ? (
                  <><span style={{ color: p.info }}><Ico.Alert s={14} /></span>
                    <span><strong style={{ color: p.textPrimary }}>{invalid} row{invalid !== 1 ? "s" : ""}</strong> have errors — fix or they'll be skipped.</span></>
                ) : (
                  <><span style={{ color: p.success }}><Ico.Check s={14} /></span>
                    <span>All <strong style={{ color: p.textPrimary }}>{total} rows</strong> ready to import.</span></>
                )}
              </div>
              {/* actions */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: isMobile ? "wrap" : "nowrap", width: isMobile ? "100%" : "auto" }}>
                <button className="btn-ghost"
                  style={{
                    flex: isMobile ? 1 : "none", padding: "9px 16px", borderRadius: 8, border: `1.5px solid ${p.border}`, background: "transparent",
                    cursor: "pointer", fontSize: 12, fontWeight: 600, color: p.textSecondary, fontFamily: "inherit"
                  }}>
                  Cancel
                </button>
                <button style={{
                  flex: isMobile ? 1 : "none", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 16px", borderRadius: 8,
                  border: "1.5px solid #FECACA", background: "#FFF5F5", cursor: "pointer", fontSize: 12, fontWeight: 600, color: p.primary, fontFamily: "inherit"
                }}>
                  <Ico.Wrench /> Fix in CSV
                </button>
                <button className="btn-primary" style={{
                  flex: isMobile ? 1 : "none", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "9px 18px", borderRadius: 8,
                  border: "none", background: p.primary, cursor: "pointer", fontSize: 12, fontWeight: 700, color: "#fff", fontFamily: "inherit"
                }}>
                  Proceed Import <Ico.Arrow />
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default BulkImport;