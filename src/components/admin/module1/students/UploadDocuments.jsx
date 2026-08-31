import React, { useState, useRef, useCallback } from "react";
import { Button }   from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge }    from "@/components/ui/badge";
import {
  ArrowRight, ArrowLeft, Upload, FileText, FileImage,
  File, X, CheckCircle2, AlertCircle, Eye, Trash2, CloudUpload,
} from "lucide-react";
import { theme } from "../../../../theme/theme";

// ── Document types (mirrors student_documents schema) ────────────────────────
const DOCUMENT_TYPES = [
  { id: "birth_certificate",    label: "Birth Certificate",     required: true,  accept: ".pdf,.jpg,.jpeg,.png", icon: "📄" },
  { id: "transfer_certificate", label: "Transfer Certificate",  required: false, accept: ".pdf,.jpg,.jpeg,.png", icon: "📋" },
//   { id: "passport",             label: "Passport",              required: false, accept: ".pdf,.jpg,.jpeg,.png", icon: "🪪" },
  { id: "aadhar_card",          label: "Aadhar Card",           required: true,  accept: ".pdf,.jpg,.jpeg,.png", icon: "🆔" },
//   { id: "report_card",          label: "Previous Report Card",  required: false, accept: ".pdf,.jpg,.jpeg,.png", icon: "📊" },
  { id: "medical_certificate",  label: "Medical Certificate",   required: false, accept: ".pdf,.jpg,.jpeg,.png", icon: "🏥" },
];

const STEPS = ["Basic Info", "Contact", "Guardian", "Documents", "Fees"];

// ── File-type helpers ─────────────────────────────────────────────────────────
const getFileIcon = (file) => {
  if (!file) return <File className="w-4 h-4" />;
  if (file.type.startsWith("image/")) return <FileImage className="w-4 h-4" />;
  if (file.type === "application/pdf")  return <FileText  className="w-4 h-4" />;
  return <File className="w-4 h-4" />;
};

const fmtSize = (bytes) => {
  if (bytes < 1024)        return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// ── Individual document slot ──────────────────────────────────────────────────
const DocumentSlot = ({ docType, document: doc, onUpload, onRemove, onPreview }) => {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onUpload(docType.id, file);
  }, [docType.id, onUpload]);

  const handleDrag  = useCallback((e) => { e.preventDefault(); setDragging(true);  }, []);
  const handleLeave = useCallback(() => setDragging(false), []);
  const handleInput = useCallback((e) => {
    const file = e.target.files[0];
    if (file) onUpload(docType.id, file);
  }, [docType.id, onUpload]);

  const p = theme.colors;

  return (
    <div style={{
      borderRadius: theme.radius.md,
      border: `1px solid ${doc ? p.success + "55" : p.border}`,
      background: doc ? "#F0FDF4" : p.surface,
      transition: "all .2s",
      overflow: "hidden",
    }}>
      {/* Slot header */}
      <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 10,
        borderBottom: `1px solid ${doc ? p.success + "33" : p.border}`,
        background: doc ? "#F0FDF4" : p.tableHeader }}>
        <span style={{ fontSize: 18 }}>{docType.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: p.textPrimary }}>{docType.label}</span>
            {docType.required && (
              <span style={{ fontSize: 10, fontWeight: 700, color: p.danger, background: "#FEE2E2",
                padding: "1px 6px", borderRadius: 99 }}>Required</span>
            )}
            {!docType.required && (
              <span style={{ fontSize: 10, color: p.textMuted, background: p.background,
                padding: "1px 6px", borderRadius: 99 }}>Optional</span>
            )}
          </div>
          {doc && (
            <div style={{ fontSize: 11, color: p.success, fontWeight: 500, marginTop: 2,
              display: "flex", alignItems: "center", gap: 4 }}>
              <CheckCircle2 style={{ width: 11, height: 11 }}/> Uploaded
            </div>
          )}
        </div>
        {doc && (
          <div style={{ display: "flex", gap: 4 }}>
            <button onClick={() => onPreview(doc)}
              style={{ padding: "5px 8px", borderRadius: 6, border: `1px solid ${p.border}`,
                background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
                fontSize: 11, color: p.textSecondary, fontFamily: theme.typography.fontFamily }}>
              <Eye style={{ width: 12, height: 12 }}/> View
            </button>
            <button onClick={() => onRemove(docType.id)}
              style={{ padding: "5px 8px", borderRadius: 6, border: "1px solid #FECACA",
                background: "#FFF5F5", cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
                fontSize: 11, color: p.danger, fontFamily: theme.typography.fontFamily }}>
              <Trash2 style={{ width: 12, height: 12 }}/> Remove
            </button>
          </div>
        )}
      </div>

      {/* Upload zone or file info */}
      {doc ? (
        <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "#DCFCE7",
            display: "flex", alignItems: "center", justifyContent: "center", color: p.success, flexShrink: 0 }}>
            {doc.preview && doc.file?.type?.startsWith("image/")
              ? <img src={doc.preview} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover" }}/>
              : getFileIcon(doc.file)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: p.textPrimary,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.file?.name}</p>
            <p style={{ margin: "2px 0 0", fontSize: 11, color: p.textMuted }}>
              {fmtSize(doc.file?.size)} · {doc.file?.type?.split("/")[1]?.toUpperCase()}
            </p>
          </div>
          <CheckCircle2 style={{ width: 18, height: 18, color: p.success, flexShrink: 0 }}/>
        </div>
      ) : (
        <div
          onDragOver={handleDrag} onDragLeave={handleLeave} onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          style={{
            padding: "20px 16px", textAlign: "center", cursor: "pointer",
            background: dragging ? "#FFF5F5" : "transparent",
            border: dragging ? `1.5px dashed ${p.primary}` : "1.5px dashed transparent",
            transition: "all .2s", margin: 8, borderRadius: 8,
          }}>
          <input ref={inputRef} type="file" accept={docType.accept} style={{ display: "none" }} onChange={handleInput}/>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#EEF2FF",
              display: "flex", alignItems: "center", justifyContent: "center", color: p.info }}>
              <CloudUpload style={{ width: 18, height: 18 }}/>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: p.textPrimary }}>
                Click to upload <span style={{ color: p.textMuted, fontWeight: 400 }}>or drag & drop</span>
              </p>
              <p style={{ margin: "3px 0 0", fontSize: 11, color: p.textMuted }}>PDF, JPG, PNG (Max 5MB)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Preview modal ─────────────────────────────────────────────────────────────
const PreviewModal = ({ doc, onClose }) => {
  if (!doc) return null;
  const isImage = doc.file?.type?.startsWith("image/");
  const p = theme.colors;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center",
      justifyContent: "center", background: "rgba(0,0,0,0.55)", padding: 16 }}
      onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: theme.radius.lg, boxShadow: theme.shadow?.modal,
        maxWidth: 640, width: "100%", maxHeight: "90vh", display: "flex", flexDirection: "column", overflow: "hidden" }}
        onClick={(e) => e.stopPropagation()}>
        {/* header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 18px", borderBottom: `1px solid ${p.border}` }}>
          <div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: p.textPrimary }}>{doc.file?.name}</p>
            <p style={{ margin: "2px 0 0", fontSize: 11, color: p.textMuted }}>{fmtSize(doc.file?.size)}</p>
          </div>
          <button onClick={onClose}
            style={{ width: 30, height: 30, borderRadius: "50%", border: `1px solid ${p.border}`,
              background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              color: p.textSecondary }}>
            <X style={{ width: 14, height: 14 }}/>
          </button>
        </div>
        {/* content */}
        <div style={{ flex: 1, overflow: "auto", padding: 18, display: "flex", alignItems: "center", justifyContent: "center", background: p.background }}>
          {isImage
            ? <img src={doc.preview} alt={doc.file?.name} style={{ maxWidth: "100%", maxHeight: 500, borderRadius: 8, boxShadow: "0 2px 12px rgba(0,0,0,.1)" }}/>
            : <div style={{ textAlign: "center", padding: 40 }}>
                <FileText style={{ width: 48, height: 48, color: p.textMuted, margin: "0 auto 12px" }}/>
                <p style={{ fontSize: 13, color: p.textSecondary, margin: 0 }}>PDF preview not available</p>
                <p style={{ fontSize: 12, color: p.textMuted, marginTop: 4 }}>File is ready to upload</p>
              </div>}
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════
//  Main Component
// ════════════════════════════════════════════════════════════════════
const UploadDocuments = ({
  onNext,
  onBack,
  isEditMode = false,
  formData,      // { [document_type]: { file, preview, uploaded_at } }
  setFormData,
}) => {
  // fallback local state if used standalone
  const [localDocs, setLocalDocs] = useState({});
  const docs    = formData    ?? localDocs;
  const setDocs = setFormData ?? setLocalDocs;

  const [errors,     setErrors]     = useState({});
  const [previewDoc, setPreviewDoc] = useState(null);

  const currentStep     = 3;
  const progressPercent = Math.round(((currentStep + 1) / STEPS.length) * 100);
  const p = theme.colors;

  // ── Handlers ──────────────────────────────────────────────────────
  const handleUpload = useCallback((docTypeId, file) => {
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, [docTypeId]: "File size must be under 5 MB" }));
      return;
    }
    const preview = URL.createObjectURL(file);
    setDocs(prev => ({ ...prev, [docTypeId]: { file, preview, uploaded_at: new Date().toISOString() } }));
    setErrors(prev => { const n = { ...prev }; delete n[docTypeId]; return n; });
  }, [setDocs]);

  const handleRemove = useCallback((docTypeId) => {
    setDocs(prev => { const n = { ...prev }; delete n[docTypeId]; return n; });
  }, [setDocs]);

  const validate = () => {
    const e = {};
    DOCUMENT_TYPES.filter(d => d.required).forEach(d => {
      if (!docs[d.id]) e[d.id] = `${d.label} is required`;
    });
    return e;
  };

  const handleNext = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setErrors({});
    onNext?.();
  };

  // ── Stats ─────────────────────────────────────────────────────────
  const uploadedCount  = Object.keys(docs).length;
  const requiredCount  = DOCUMENT_TYPES.filter(d => d.required).length;
  const requiredUploaded = DOCUMENT_TYPES.filter(d => d.required && docs[d.id]).length;
  const allRequiredDone  = requiredUploaded === requiredCount;

  return (
    <>
      <PreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)}/>

      <div className="min-h-screen flex flex-col"
        style={{ background: p.background, fontFamily: theme.typography.fontFamily, padding: theme.layout?.contentPadding ?? "15px" }}>

        <div className="w-full max-w-5xl">
          <div className="flex flex-col gap-1 mb-6">
            <h1 style={{ fontSize: "1.7rem", fontWeight: 700, color: p.textPrimary, margin: 0 }}>
              {isEditMode ? "Edit Student" : "Add Student"}
            </h1>
            <p className="text-sm" style={{ color: p.textSecondary, margin: 0 }}>
              {isEditMode ? "Update student documents." : "Register new students and manage admission records."}
            </p>
          </div>
        </div>

        <div className="w-full max-w-3xl mx-auto">
          {/* Step indicator */}
          <div className="flex justify-between items-center mb-3 w-full max-w-2xl mx-auto">
            <h3 className="text-lg font-bold" style={{ color: p.textPrimary }}>
              Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep]}
            </h3>
            <span className="text-sm font-medium" style={{ color: p.textSecondary }}>
              {progressPercent}% Completed
            </span>
          </div>

          {/* Progress bar */}
          <div className="grid gap-1.5 mb-1.5 w-full max-w-2xl mx-auto" style={{ gridTemplateColumns: `repeat(${STEPS.length}, 1fr)` }}>
            {STEPS.map((_, i) => (
              <div key={i} className="h-1.5 rounded-full transition-colors duration-300"
                style={{ background: i <= currentStep ? p.primary : p.border }}/>
            ))}
          </div>
          <div className="grid gap-1.5 mb-6 w-full max-w-2xl mx-auto" style={{ gridTemplateColumns: `repeat(${STEPS.length}, 1fr)` }}>
            {STEPS.map((label, i) => (
              <span key={i} className="text-xs text-center font-medium"
                style={{ color: i === currentStep ? p.primary : p.textMuted }}>{label}</span>
            ))}
          </div>

          {/* ── Card ── */}
          <Card className="rounded-2xl w-full max-w-2xl mx-auto"
            style={{ background: p.cardBg ?? "#fff", border: `1px solid ${p.border}`, boxShadow: theme.shadow?.card }}>
            <CardContent className="p-7">

              {/* Section header */}
              <div className="flex justify-between items-start pb-5 mb-5"
                style={{ borderBottom: `1px solid ${p.border}` }}>
                <div>
                  <h2 className="text-base font-bold" style={{ color: p.textPrimary }}>Student Documents</h2>
                  <p className="text-sm mt-0.5" style={{ color: p.textMuted }}>
                    {isEditMode ? "Update documents for this student." : "Upload required documents for admission."}
                  </p>
                </div>
                {/* Upload progress pill */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px",
                  borderRadius: 99, background: allRequiredDone ? "#DCFCE7" : "#FFF7ED",
                  border: `1px solid ${allRequiredDone ? "#BBF7D0" : "#FED7AA"}`, flexShrink: 0 }}>
                  {allRequiredDone
                    ? <CheckCircle2 style={{ width: 13, height: 13, color: p.success }}/>
                    : <AlertCircle  style={{ width: 13, height: 13, color: p.warning }}/>}
                  <span style={{ fontSize: 11, fontWeight: 700, color: allRequiredDone ? "#15803D" : "#92400E" }}>
                    {uploadedCount} / {DOCUMENT_TYPES.length} uploaded
                  </span>
                </div>
              </div>

              {/* Required section */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span style={{ fontSize: 11, fontWeight: 700, color: p.textMuted, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                    Required Documents
                  </span>
                  <div style={{ flex: 1, height: 1, background: p.border }}/>
                  <span style={{ fontSize: 11, fontWeight: 600, color: allRequiredDone ? p.success : p.danger }}>
                    {requiredUploaded}/{requiredCount}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {DOCUMENT_TYPES.filter(d => d.required).map(docType => (
                    <div key={docType.id}>
                      <DocumentSlot
                        docType={docType}
                        document={docs[docType.id]}
                        onUpload={handleUpload}
                        onRemove={handleRemove}
                        onPreview={setPreviewDoc}
                      />
                      {errors[docType.id] && (
                        <div className="flex items-center gap-1.5 mt-1.5" style={{ color: p.danger, fontSize: 11 }}>
                          <AlertCircle style={{ width: 12, height: 12 }}/> {errors[docType.id]}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Optional section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span style={{ fontSize: 11, fontWeight: 700, color: p.textMuted, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                    Optional Documents
                  </span>
                  <div style={{ flex: 1, height: 1, background: p.border }}/>
                </div>
                <div className="flex flex-col gap-3">
                  {DOCUMENT_TYPES.filter(d => !d.required).map(docType => (
                    <DocumentSlot
                      key={docType.id}
                      docType={docType}
                      document={docs[docType.id]}
                      onUpload={handleUpload}
                      onRemove={handleRemove}
                      onPreview={setPreviewDoc}
                    />
                  ))}
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Footer nav */}
          <div className="flex justify-between items-center mt-6 w-full max-w-2xl mx-auto">
            <Button variant="outline" onClick={onBack}
              className="flex items-center gap-2 rounded-xl"
              style={{ color: p.textSecondary, borderColor: p.border, fontFamily: theme.typography.fontFamily }}>
              <ArrowLeft className="w-4 h-4"/> Back
            </Button>
            <div className="flex items-center gap-3">
              <Button variant="ghost"
                style={{ color: p.textSecondary, fontFamily: theme.typography.fontFamily }}
                onClick={onNext}>
                Skip for now
              </Button>
              <Button onClick={handleNext}
                className="text-white font-semibold px-6 py-2.5 rounded-xl flex items-center gap-2"
                style={{ background: p.primary, fontFamily: theme.typography.fontFamily }}>
                {isEditMode ? "Save & Continue" : "Next Step"} <ArrowRight className="w-4 h-4"/>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadDocuments;