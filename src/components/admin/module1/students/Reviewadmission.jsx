import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  User, BookOpen, Users, DollarSign, Pencil,
  CheckCircle2, AlertCircle, Lock, X, FileText,
  Phone, Mail, MapPin, Camera, Plus, CalendarDays,
  CloudUpload, FileImage, File, Trash2, Eye, FolderOpen,
} from "lucide-react";
import { theme } from "../../../../theme/theme";

// ── Constants ────────────────────────────────────────────────────────
const RELATIONSHIPS = ["Father","Mother","Brother","Sister","Uncle","Aunt","Grandfather","Grandmother","Legal Guardian","Other"];
const ID_TYPES = ["Passport","Driver's License","National ID","Aadhaar Card","PAN Card","Voter ID","Other"];
const US_STATES = ["Alabama","Alaska","Arizona","California","Florida","Georgia","Illinois","New York","Texas"];
const COUNTRIES = ["United States","Canada","India","Australia","Germany"];
const COMM_OPTIONS = [
  { key: "email", label: "Email", icon: <Mail className="w-4 h-4" /> },
  { key: "sms",   label: "SMS",   icon: <Phone className="w-4 h-4" /> },
  { key: "whatsapp", label: "WhatsApp", icon: <Phone className="w-4 h-4" /> },
];
const ACADEMIC_YEARS = ["2023 - 2024","2024 - 2025","2025 - 2026"];
const FEE_GROUPS = ["Standard Grade 1","Standard Grade 2","Standard Grade 3","Standard Grade 4","Standard Grade 5","Standard Grade 6","Standard Grade 7","Standard Grade 8","Standard Grade 9","Standard Grade 10"];
const DISCOUNTS = ["No Discount","Sibling Discount (10%)","Merit Scholarship (15%)","Need-based Aid (20%)","Staff Ward (25%)"];
const ADDONS = ["None","Transport Only (+$500)","Hostel Only (+$1,200)","Transport + Hostel (+$1,700)"];
const BASE_FEE = 4500;

// ── Document types ───────────────────────────────────────────────────
const DOCUMENT_TYPES = [
  { id: "birth_certificate",    label: "Birth Certificate",    required: true,  accept: ".pdf,.jpg,.jpeg,.png", icon: "📄" },
  { id: "transfer_certificate", label: "Transfer Certificate", required: false, accept: ".pdf,.jpg,.jpeg,.png", icon: "📋" },
  { id: "aadhar_card",          label: "Aadhar Card",          required: true,  accept: ".pdf,.jpg,.jpeg,.png", icon: "🆔" },
  { id: "medical_certificate",  label: "Medical Certificate",  required: false, accept: ".pdf,.jpg,.jpeg,.png", icon: "🏥" },
];

const CHECKLIST = [
  { key: "basic",     label: "Basic Information" },
  { key: "contact",   label: "Contact Details"   },
  { key: "guardian",  label: "Guardian Details"  },
  { key: "documents", label: "Documents"         },
  { key: "fees",      label: "Fees Setup"        },
];

// ── Fee helpers ───────────────────────────────────────────────────────
const getAddonAmount = (addon) => {
  if (!addon || addon === "None") return 0;
  if (addon === "Transport Only (+$500)") return 500;
  if (addon === "Hostel Only (+$1,200)") return 1200;
  if (addon === "Transport + Hostel (+$1,700)") return 1700;
  return 0;
};
const getDiscountAmount = (discount, base) => {
  if (!discount || discount === "No Discount") return 0;
  const match = discount.match(/\((\d+)%\)/);
  return match ? (base * parseInt(match[1])) / 100 : 0;
};
const emptyInstallment = (name = "", date = "", amount = 0) => ({
  id: Date.now() + Math.random(), name, dueDate: date, amount, status: "Planned",
});

const emptyGuardianPerson = () => ({
  name: "",
  relationship: "",
  phone: "",
  email: "",
  occupation: "",
  employer: "",
  idType: "",
  idNumber: "",
  sameAddress: false,
});

const createGuardianDraft = (guardianData) => ({
  primary: {
    ...emptyGuardianPerson(),
    ...(guardianData?.primary || {}),
  },
  secondary: {
    ...emptyGuardianPerson(),
    ...(guardianData?.secondary || {}),
  },
  consent: Boolean(guardianData?.consent),
});

const formatDisplayDate = (date) => {
  if (!date) return "";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const fmtSize = (bytes) => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileIcon = (file) => {
  if (!file) return <File className="w-4 h-4" />;
  if (file.type?.startsWith("image/")) return <FileImage className="w-4 h-4" />;
  if (file.type === "application/pdf")  return <FileText  className="w-4 h-4" />;
  return <File className="w-4 h-4" />;
};

// ── Inline document slot for modal ───────────────────────────────────
const DocumentSlot = ({ docType, document: doc, onUpload, onRemove, onPreview }) => {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);
  const p = theme.colors;

  const handleDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onUpload(docType.id, file);
  }, [docType.id, onUpload]);

  return (
    <div style={{
      borderRadius: 10, border: `1px solid ${doc ? p.success + "55" : p.border}`,
      background: doc ? "#F0FDF4" : p.surface, transition: "all .2s", overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        padding: "10px 14px", display: "flex", alignItems: "center", gap: 8,
        borderBottom: `1px solid ${doc ? p.success + "33" : p.border}`,
        background: doc ? "#F0FDF4" : p.tableHeader ?? p.background,
      }}>
        <span style={{ fontSize: 16 }}>{docType.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: p.textPrimary }}>{docType.label}</span>
            {docType.required
              ? <span style={{ fontSize: 10, fontWeight: 700, color: p.danger, background: "#FEE2E2", padding: "1px 6px", borderRadius: 99 }}>Required</span>
              : <span style={{ fontSize: 10, color: p.textMuted, background: p.background, padding: "1px 6px", borderRadius: 99 }}>Optional</span>}
          </div>
          {doc && (
            <div style={{ fontSize: 11, color: p.success, fontWeight: 500, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
              <CheckCircle2 style={{ width: 11, height: 11 }} /> Uploaded
            </div>
          )}
        </div>
        {doc && (
          <div style={{ display: "flex", gap: 4 }}>
            <button onClick={() => onPreview(doc)}
              style={{ padding: "4px 8px", borderRadius: 6, border: `1px solid ${p.border}`, background: "#fff", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: p.textSecondary, fontFamily: theme.typography.fontFamily }}>
              <Eye style={{ width: 11, height: 11 }} /> View
            </button>
            <button onClick={() => onRemove(docType.id)}
              style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #FECACA", background: "#FFF5F5", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: p.danger, fontFamily: theme.typography.fontFamily }}>
              <Trash2 style={{ width: 11, height: 11 }} /> Remove
            </button>
          </div>
        )}
      </div>

      {/* Body */}
      {doc ? (
        <div style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 7, background: "#DCFCE7",
            display: "flex", alignItems: "center", justifyContent: "center", color: p.success, flexShrink: 0 }}>
            {doc.preview && doc.file?.type?.startsWith("image/")
              ? <img src={doc.preview} alt="" style={{ width: 32, height: 32, borderRadius: 7, objectFit: "cover" }} />
              : getFileIcon(doc.file)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: p.textPrimary,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.file?.name}</p>
            <p style={{ margin: "2px 0 0", fontSize: 11, color: p.textMuted }}>
              {fmtSize(doc.file?.size)} · {doc.file?.type?.split("/")[1]?.toUpperCase()}
            </p>
          </div>
          <CheckCircle2 style={{ width: 16, height: 16, color: p.success, flexShrink: 0 }} />
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          style={{
            padding: "16px 14px", textAlign: "center", cursor: "pointer",
            background: dragging ? "#EEF2FF" : "transparent",
            border: dragging ? `1.5px dashed ${p.primary}` : "1.5px dashed transparent",
            transition: "all .2s", margin: 6, borderRadius: 8,
          }}>
          <input ref={inputRef} type="file" accept={docType.accept} style={{ display: "none" }}
            onChange={(e) => { const f = e.target.files[0]; if (f) onUpload(docType.id, f); }} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#EEF2FF",
              display: "flex", alignItems: "center", justifyContent: "center", color: p.info ?? p.primary }}>
              <CloudUpload style={{ width: 16, height: 16 }} />
            </div>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: p.textPrimary }}>
              Click to upload <span style={{ color: p.textMuted, fontWeight: 400 }}>or drag & drop</span>
            </p>
            <p style={{ margin: 0, fontSize: 11, color: p.textMuted }}>PDF, JPG, PNG (Max 5MB)</p>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Preview modal ─────────────────────────────────────────────────────
const PreviewModal = ({ doc, onClose }) => {
  if (!doc) return null;
  const isImage = doc.file?.type?.startsWith("image/");
  const p = theme.colors;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex", alignItems: "center",
      justifyContent: "center", background: "rgba(0,0,0,0.55)", padding: 16 }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 16, maxWidth: 580, width: "100%",
        maxHeight: "88vh", display: "flex", flexDirection: "column", overflow: "hidden" }}
        onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 16px", borderBottom: `1px solid ${p.border}` }}>
          <div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: p.textPrimary }}>{doc.file?.name}</p>
            <p style={{ margin: "2px 0 0", fontSize: 11, color: p.textMuted }}>{fmtSize(doc.file?.size)}</p>
          </div>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: "50%", border: `1px solid ${p.border}`,
            background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: p.textSecondary }}>
            <X style={{ width: 13, height: 13 }} />
          </button>
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: 16, display: "flex", alignItems: "center",
          justifyContent: "center", background: p.background }}>
          {isImage
            ? <img src={doc.preview} alt={doc.file?.name} style={{ maxWidth: "100%", maxHeight: 460, borderRadius: 8 }} />
            : <div style={{ textAlign: "center", padding: 40 }}>
                <FileText style={{ width: 44, height: 44, color: p.textMuted, margin: "0 auto 10px" }} />
                <p style={{ fontSize: 13, color: p.textSecondary, margin: 0 }}>PDF preview not available</p>
              </div>}
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════
//  ReviewAdmission
// ════════════════════════════════════════════════════════════════════
const ReviewAdmission = ({
  basicData,    setBasicData,
  contactData,  setContactData,
  guardianData, setGuardianData,
  docsData,     setDocsData,       // ← NEW
  feesData,     setFeesData,
  onBack,
  onConfirm,
  onSaveDraft,
}) => {
  const [editModal, setEditModal] = useState(null);
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);

  const [draftBasic,    setDraftBasic]    = useState(null);
  const [draftContact,  setDraftContact]  = useState(null);
  const [draftGuardian, setDraftGuardian] = useState(null);
  const [draftDocs,     setDraftDocs]     = useState(null);  // ← NEW
  const [draftFees,     setDraftFees]     = useState(null);

  const openModal = (key) => {
    if (key === "basic")    setDraftBasic({ ...(basicData || {}) });
    if (key === "contact")  setDraftContact({ ...(contactData || {}) });
    if (key === "guardian") setDraftGuardian(createGuardianDraft(guardianData));
    if (key === "documents") setDraftDocs({ ...(docsData || {}) });  // ← NEW
    if (key === "fees")     setDraftFees(feesData ? JSON.parse(JSON.stringify(feesData)) : { academicYear: "", feeGroup: "", discount: "No Discount", addon: "None", installments: [] });
    setEditModal(key);
  };

  const closeModal = () => setEditModal(null);

  const saveModal = () => {
    if (editModal === "basic")     setBasicData(draftBasic);
    if (editModal === "contact")   setContactData(draftContact);
    if (editModal === "guardian")  setGuardianData(draftGuardian);
    if (editModal === "documents") setDocsData(draftDocs);   // ← NEW
    if (editModal === "fees")      setFeesData(draftFees);
    closeModal();
  };

  // ── Draft doc handlers ────────────────────────────────────────────
  const handleDraftUpload = useCallback((docTypeId, file) => {
    if (file.size > 5 * 1024 * 1024) return;
    const preview = URL.createObjectURL(file);
    setDraftDocs((prev) => ({ ...prev, [docTypeId]: { file, preview, uploaded_at: new Date().toISOString() } }));
  }, []);

  const handleDraftRemove = useCallback((docTypeId) => {
    setDraftDocs((prev) => { const n = { ...prev }; delete n[docTypeId]; return n; });
  }, []);

  // ── Derived values ────────────────────────────────────────────────
  const fullName    = [basicData?.firstName, basicData?.lastName].filter(Boolean).join(" ");
  const initials    = [basicData?.firstName?.[0], basicData?.lastName?.[0]].filter(Boolean).join("").toUpperCase() || "AW";
  const applyingFor = basicData?.grade ? `Grade ${basicData.grade.replace("grade-", "")}` : "";

  const addonAmt    = getAddonAmount(feesData?.addon);
  const discountAmt = getDiscountAmount(feesData?.discount, BASE_FEE + addonAmt);
  const netPayable  = BASE_FEE + addonAmt - discountAmt;

  const missingGuardianPhone = !guardianData?.primary?.phone?.trim();

  // docs validation
  const docs = docsData || {};
  const requiredDocsMissing = DOCUMENT_TYPES.filter(d => d.required && !docs[d.id]);
  const uploadedCount = Object.keys(docs).length;
  const allRequiredDocsUploaded = requiredDocsMissing.length === 0;

  const hasErrors = missingGuardianPhone || !allRequiredDocsUploaded;

  const normalizeInstallments = (rows) => {
    const normalized = [...rows].slice(0, 4);
    while (normalized.length < 4) {
      normalized.push(emptyInstallment(`Installment ${normalized.length + 1}`, "", 0));
    }
    return normalized;
  };

  const getAutoSplitInstallments = (fees, rows) => {
    const installmentsToSplit = normalizeInstallments(rows);
    const count = 4;
    const addon = getAddonAmount(fees?.addon);
    const discount = getDiscountAmount(fees?.discount, BASE_FEE + addon);
    const net = BASE_FEE + addon - discount;
    const base = Math.floor((net / count) * 100) / 100;
    const remainder = parseFloat((net - base * (count - 1)).toFixed(2));
    const defaultDates = ["2024-08-01","2024-12-01","2025-04-01","2025-08-01","2025-12-01"];

    return installmentsToSplit.map((row, idx) => ({
      ...row,
      name: row.name || `Installment ${idx + 1}`,
      dueDate: row.dueDate || defaultDates[idx] || "",
      amount: idx === count - 1 ? remainder : base,
    }));
  };

  const handleAutoSplit = () => {
    setDraftFees((prev) => ({
      ...prev,
      installments: getAutoSplitInstallments(prev, prev.installments),
    }));
  };

  return (
    <>
      <PreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />

      <div className="min-h-screen py-10"
        style={{ background: theme.colors.background, fontFamily: theme.typography.fontFamily, padding: theme.layout?.contentPadding }}>

        {/* Page header */}
        <div className="w-full max-w-5xl mx-auto mb-6">
          <h1 style={{ fontSize: "1.7rem", fontWeight: 700, color: theme.colors.textPrimary, margin: 0 }}>
            Review Admission
          </h1>
          <p className="text-sm mt-1" style={{ color: theme.colors.textSecondary }}>
            Review all student information before confirming admission.
          </p>
        </div>

        <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row gap-6 items-start">

          {/* ── LEFT ── */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">

            {hasErrors && !alertDismissed && (
              <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: "#fef2f2", border: "1px solid #fecaca" }}>
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#dc2626" }} />
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: "#dc2626" }}>Missing Required Information</p>
                  <ul className="text-sm mt-0.5 list-disc list-inside" style={{ color: "#b91c1c" }}>
                    {missingGuardianPhone && <li>Guardian Details — primary contact phone number is missing.</li>}
                    {!allRequiredDocsUploaded && <li>Documents — {requiredDocsMissing.map(d => d.label).join(", ")} required.</li>}
                  </ul>
                </div>
                <button onClick={() => setAlertDismissed(true)}><X className="w-4 h-4" style={{ color: "#dc2626" }} /></button>
              </div>
            )}

            {/* Basic */}
            <SectionCard icon={<User className="w-4 h-4" />} title="Basic Information" onEdit={() => openModal("basic")}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 mt-4">
                <InfoField label="FULL NAME"       value={fullName || "—"} />
                <InfoField label="DATE OF BIRTH"   value={formatDisplayDate(basicData?.dob)} />
                <InfoField label="GENDER"          value={basicData?.gender || "—"} />
                <InfoField label="APPLYING FOR">
                  <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-md mt-0.5"
                    style={{ background: `${theme.colors.primary}15`, color: theme.colors.primary, border: `1px solid ${theme.colors.primary}25` }}>
                    {applyingFor || "—"}
                  </span>
                </InfoField>
                <InfoField label="ACADEMIC YEAR"   value={basicData?.admissionDate ? formatDisplayDate(basicData.admissionDate) : "—"} />
                <InfoField label="PREVIOUS SCHOOL" value={basicData?.previousSchool || "—"} />
              </div>
            </SectionCard>

            {/* Contact */}
            <SectionCard icon={<BookOpen className="w-4 h-4" />} title="Contact Details" onEdit={() => openModal("contact")}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 mt-4">
                <InfoField label="RESIDENTIAL ADDRESS" value={[contactData?.addressLine1, contactData?.addressLine2].filter(Boolean).join(", ") || "—"} />
                <div />
                <InfoField label="CITY"          value={contactData?.city || "—"} />
                <InfoField label="STATE / ZIP"   value={[contactData?.state, contactData?.zip].filter(Boolean).join(", ") || "—"} />
                <InfoField label="STUDENT PHONE" value={contactData?.studentPhone || "—"} />
                <InfoField label="STUDENT EMAIL" value={contactData?.studentEmail || "—"} />
              </div>
            </SectionCard>

            {/* Guardian */}
            <SectionCard icon={<Users className="w-4 h-4" />} title="Guardian Details" onEdit={() => openModal("guardian")} hasError={missingGuardianPhone}>
              <div className="mt-4">
                <span className="inline-block text-xs font-semibold px-3 py-1 rounded-lg mb-3"
                  style={{ background: theme.colors.background, border: `1px solid ${theme.colors.border}`, color: theme.colors.textPrimary }}>
                  Primary Contact {guardianData?.primary?.relationship ? `(${guardianData.primary.relationship})` : ""}
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
                  <InfoField label="FULL NAME" value={guardianData?.primary?.name || "—"} />
                  {missingGuardianPhone ? (
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold tracking-widest flex items-center gap-1" style={{ color: "#dc2626" }}>
                        PHONE NUMBER <AlertCircle className="w-3 h-3" />
                      </span>
                      <span className="text-sm font-semibold italic" style={{ color: "#dc2626" }}>Missing Required Field</span>
                    </div>
                  ) : (
                    <InfoField label="PHONE NUMBER" value={guardianData?.primary?.phone} />
                  )}
                  <InfoField label="EMAIL ADDRESS" value={guardianData?.primary?.email || "—"} />
                  <InfoField label="OCCUPATION"    value={guardianData?.primary?.occupation || "—"} />
                </div>
              </div>
              {guardianData?.secondary?.name && (
                <>
                  <div className="my-4" style={{ borderTop: `1px solid ${theme.colors.border}` }} />
                  <div>
                    <span className="inline-block text-xs font-semibold px-3 py-1 rounded-lg mb-3"
                      style={{ background: theme.colors.background, border: `1px solid ${theme.colors.border}`, color: theme.colors.textPrimary }}>
                      Secondary Contact {guardianData?.secondary?.relationship ? `(${guardianData.secondary.relationship})` : ""}
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
                      <InfoField label="FULL NAME"    value={guardianData?.secondary?.name || "—"} />
                      <InfoField label="PHONE NUMBER" value={guardianData?.secondary?.phone || "—"} />
                    </div>
                  </div>
                </>
              )}
            </SectionCard>

            {/* ── Documents Section ── NEW */}
            <SectionCard
              icon={<FolderOpen className="w-4 h-4" />}
              title="Documents"
              onEdit={() => openModal("documents")}
              hasError={!allRequiredDocsUploaded}
            >
              <div className="mt-4">
                {/* Upload summary pill */}
                <div className="flex items-center gap-2 mb-4">
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "5px 12px", borderRadius: 99,
                    background: allRequiredDocsUploaded ? "#DCFCE7" : "#FFF7ED",
                    border: `1px solid ${allRequiredDocsUploaded ? "#BBF7D0" : "#FED7AA"}`,
                  }}>
                    {allRequiredDocsUploaded
                      ? <CheckCircle2 style={{ width: 12, height: 12, color: "#16a34a" }} />
                      : <AlertCircle  style={{ width: 12, height: 12, color: "#92400E" }} />}
                    <span style={{ fontSize: 11, fontWeight: 700, color: allRequiredDocsUploaded ? "#15803D" : "#92400E" }}>
                      {uploadedCount} / {DOCUMENT_TYPES.length} uploaded
                    </span>
                  </div>
                </div>

                {/* Doc rows */}
                <div className="flex flex-col gap-2">
                  {DOCUMENT_TYPES.map((docType) => {
                    const doc = docs[docType.id];
                    return (
                      <div key={docType.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                        style={{
                          border: `1px solid ${doc ? "#BBF7D0" : (docType.required ? "#FECACA" : theme.colors.border)}`,
                          background: doc ? "#F0FDF4" : (docType.required && !doc ? "#FFF5F5" : theme.colors.background),
                        }}>
                        <span style={{ fontSize: 18, lineHeight: 1 }}>{docType.icon}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: theme.colors.textPrimary }}>{docType.label}</span>
                            {docType.required && (
                              <span style={{ fontSize: 10, fontWeight: 700, color: doc ? "#16a34a" : "#dc2626",
                                background: doc ? "#DCFCE7" : "#FEE2E2", padding: "1px 6px", borderRadius: 99 }}>
                                Required
                              </span>
                            )}
                          </div>
                          {doc
                            ? <p style={{ margin: "2px 0 0", fontSize: 11, color: "#16a34a", fontWeight: 500 }}>
                                {doc.file?.name} · {fmtSize(doc.file?.size)}
                              </p>
                            : <p style={{ margin: "2px 0 0", fontSize: 11, color: docType.required ? "#dc2626" : theme.colors.textMuted }}>
                                {docType.required ? "Not uploaded — required" : "Not uploaded"}
                              </p>}
                        </div>
                        {doc
                          ? <CheckCircle2 style={{ width: 16, height: 16, color: "#16a34a", flexShrink: 0 }} />
                          : <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${docType.required ? "#fca5a5" : theme.colors.border}`, flexShrink: 0 }} />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </SectionCard>

            {/* Fees */}
            <SectionCard icon={<DollarSign className="w-4 h-4" />} title="Fees Setup" onEdit={() => openModal("fees")}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="rounded-xl p-4" style={{ background: theme.colors.background, border: `1px solid ${theme.colors.border}` }}>
                  <p className="text-[10px] font-bold tracking-widest mb-1" style={{ color: theme.colors.textMuted }}>FEE GROUP</p>
                  <p className="text-sm font-bold" style={{ color: theme.colors.textPrimary }}>{feesData?.feeGroup || "—"}</p>
                </div>
                <div className="rounded-xl p-4" style={{ background: theme.colors.background, border: `1px solid ${theme.colors.border}` }}>
                  <p className="text-[10px] font-bold tracking-widest mb-1" style={{ color: theme.colors.textMuted }}>TOTAL PAYABLE</p>
                  <p className="text-lg font-bold" style={{ color: theme.colors.primary }}>${netPayable.toFixed(2)}</p>
                </div>
              </div>
              {feesData?.installments?.length > 0 && (
                <div className="mt-4 rounded-xl overflow-hidden" style={{ border: `1px solid ${theme.colors.border}` }}>
                  <div className="grid px-4 py-2.5"
                    style={{ gridTemplateColumns: "2fr 1.5fr 1fr", background: theme.colors.background, borderBottom: `1px solid ${theme.colors.border}` }}>
                    {["INSTALLMENT","DUE DATE","AMOUNT"].map((h) => (
                      <span key={h} className="text-[10px] font-bold tracking-widest" style={{ color: theme.colors.textMuted }}>{h}</span>
                    ))}
                  </div>
                  {feesData.installments.map((row, i) => (
                    <div key={row.id ?? i} className="grid px-4 py-3 items-center"
                      style={{ gridTemplateColumns: "2fr 1.5fr 1fr", borderBottom: i < feesData.installments.length - 1 ? `1px solid ${theme.colors.border}` : "none" }}>
                      <span className="text-sm" style={{ color: theme.colors.textPrimary }}>{row.name}</span>
                      <span className="text-sm" style={{ color: theme.colors.textSecondary }}>
                        {row.dueDate ? new Date(row.dueDate).toLocaleDateString("en-US",{month:"short",day:"2-digit",year:"numeric"}) : "—"}
                      </span>
                      <span className="text-sm font-semibold" style={{ color: theme.colors.textPrimary }}>${(parseFloat(row.amount)||0).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="w-full lg:w-72 shrink-0 flex flex-col gap-4 lg:sticky lg:top-6">
            <Card className="rounded-2xl" style={{ background: theme.colors.cardBg, border: `1px solid ${theme.colors.border}`, boxShadow: theme.shadow?.card }}>
              <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold"
                  style={{ background: `${theme.colors.primary}20`, color: theme.colors.primary }}>
                  {initials}
                </div>
                <div>
                  <p className="font-bold text-base" style={{ color: theme.colors.textPrimary }}>{fullName || "—"}</p>
                  <p className="text-sm mt-0.5" style={{ color: theme.colors.textSecondary }}>
                    {applyingFor ? `Applying for ${applyingFor}` : "—"}
                  </p>
                </div>
                <span className="text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5"
                  style={{ background: "#fef9c3", color: "#92400e", border: "1px solid #fde68a" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 inline-block" />
                  Draft Status
                </span>

                <div className="w-full" style={{ borderTop: `1px solid ${theme.colors.border}` }} />

                <div className="w-full text-left">
                  <p className="text-xs font-bold tracking-widest mb-3" style={{ color: theme.colors.textMuted }}>APPLICATION CHECKLIST</p>
                  <div className="flex flex-col gap-2.5">
                    {CHECKLIST.map((item) => {
                      const ok = item.key === "guardian"  ? !missingGuardianPhone
                               : item.key === "documents" ? allRequiredDocsUploaded
                               : true;
                      return (
                        <div key={item.key} className="flex items-center gap-2.5">
                          {ok
                            ? <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "#16a34a" }} />
                            : <AlertCircle  className="w-4 h-4 shrink-0" style={{ color: "#dc2626" }} />}
                          <span className="text-sm font-medium" style={{ color: ok ? theme.colors.textPrimary : "#dc2626" }}>
                            {item.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="w-full" style={{ borderTop: `1px solid ${theme.colors.border}` }} />

                <div className="w-full flex flex-col gap-2.5">
                  <Button
                    disabled={hasErrors}
                    onClick={!hasErrors ? onConfirm : undefined}
                    className="w-full rounded-xl font-semibold flex items-center justify-center gap-2"
                    style={{ background: hasErrors ? theme.colors.border : theme.colors.primary, color: hasErrors ? theme.colors.textMuted : "#fff", cursor: hasErrors ? "not-allowed" : "pointer" }}>
                    <Lock className="w-3.5 h-3.5" /> Confirm Admission
                  </Button>
                  {hasErrors && (
                    <p className="text-xs text-center" style={{ color: "#dc2626" }}>Fix errors above to confirm admission</p>
                  )}
                  <Button variant="outline" className="w-full rounded-xl font-semibold flex items-center justify-center gap-2"
                    onClick={onSaveDraft}
                    style={{ border: `1px solid ${theme.colors.border}`, color: theme.colors.textPrimary, background: theme.colors.cardBg }}>
                    <FileText className="w-3.5 h-3.5" /> Save as Draft
                  </Button>
                  <button className="text-sm font-medium" onClick={onBack} style={{ color: theme.colors.textSecondary }}>
                    ← Back
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>

        {/* ══════════ MODALS ══════════ */}

        {/* Basic */}
        <EditModal open={editModal === "basic"} title="Edit Basic Information" onClose={closeModal} onSave={saveModal}>
          {draftBasic && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <ModalField label="First Name" required>
                <Input value={draftBasic.firstName} onChange={(e) => setDraftBasic((p) => ({ ...p, firstName: e.target.value }))} className="rounded-lg text-sm" />
              </ModalField>
              <ModalField label="Last Name" required>
                <Input value={draftBasic.lastName} onChange={(e) => setDraftBasic((p) => ({ ...p, lastName: e.target.value }))} className="rounded-lg text-sm" />
              </ModalField>
              <ModalField label="Gender" required>
                <Select value={draftBasic.gender} onValueChange={(v) => setDraftBasic((p) => ({ ...p, gender: v }))}>
                  <SelectTrigger className="rounded-lg text-sm"><SelectValue placeholder="Select Gender" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </ModalField>
              <ModalField label="Date of Birth" required>
                <Input type="date" value={draftBasic.dob} onChange={(e) => setDraftBasic((p) => ({ ...p, dob: e.target.value }))} className="rounded-lg text-sm" />
              </ModalField>
              <ModalField label="Admission Date" required>
                <Input type="date" value={draftBasic.admissionDate} onChange={(e) => setDraftBasic((p) => ({ ...p, admissionDate: e.target.value }))} className="rounded-lg text-sm" />
              </ModalField>
              <ModalField label="Grade / Class" required>
                <Select value={draftBasic.grade} onValueChange={(v) => setDraftBasic((p) => ({ ...p, grade: v }))}>
                  <SelectTrigger className="rounded-lg text-sm"><SelectValue placeholder="Select Class" /></SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => (
                      <SelectItem key={i+1} value={`grade-${i+1}`}>Grade {i+1}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </ModalField>
              <ModalField label="Section" required>
                <Select value={draftBasic.section} onValueChange={(v) => setDraftBasic((p) => ({ ...p, section: v }))}>
                  <SelectTrigger className="rounded-lg text-sm"><SelectValue placeholder="Select Section" /></SelectTrigger>
                  <SelectContent>
                    {["A","B","C","D"].map((s) => <SelectItem key={s} value={s}>Section {s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </ModalField>
              <ModalField label="Previous School">
                <Input value={draftBasic.previousSchool} onChange={(e) => setDraftBasic((p) => ({ ...p, previousSchool: e.target.value }))} className="rounded-lg text-sm" placeholder="Name of previous institution" />
              </ModalField>
            </div>
          )}
        </EditModal>

        {/* Contact */}
        <EditModal open={editModal === "contact"} title="Edit Contact Details" onClose={closeModal} onSave={saveModal}>
          {draftContact && (
            <div className="flex flex-col gap-5">
              <SectionLabel>Residential Address</SectionLabel>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold" style={{ color: theme.colors.textPrimary }}>Address Line 1 <Req /></Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: theme.colors.textMuted }} />
                  <Input value={draftContact.addressLine1} onChange={(e) => setDraftContact((p) => ({ ...p, addressLine1: e.target.value }))} className="pl-9 rounded-lg text-sm" placeholder="Enter address" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold" style={{ color: theme.colors.textPrimary }}>Address Line 2 <Optional /></Label>
                <Input value={draftContact.addressLine2} onChange={(e) => setDraftContact((p) => ({ ...p, addressLine2: e.target.value }))} className="rounded-lg text-sm" placeholder="Apartment, Suite" />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold" style={{ color: theme.colors.textPrimary }}>City <Req /></Label>
                  <Input value={draftContact.city} onChange={(e) => setDraftContact((p) => ({ ...p, city: e.target.value }))} className="rounded-lg text-sm" placeholder="Enter city" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold" style={{ color: theme.colors.textPrimary }}>State <Req /></Label>
                  <Select value={draftContact.state} onValueChange={(v) => setDraftContact((p) => ({ ...p, state: v }))}>
                    <SelectTrigger className="rounded-lg text-sm"><SelectValue placeholder="Select State" /></SelectTrigger>
                    <SelectContent>{US_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold" style={{ color: theme.colors.textPrimary }}>ZIP Code <Req /></Label>
                  <Input value={draftContact.zip} onChange={(e) => setDraftContact((p) => ({ ...p, zip: e.target.value }))} className="rounded-lg text-sm" placeholder="ZIP Code" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold" style={{ color: theme.colors.textPrimary }}>Country <Req /></Label>
                  <Select value={draftContact.country} onValueChange={(v) => setDraftContact((p) => ({ ...p, country: v }))}>
                    <SelectTrigger className="rounded-lg text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>{COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div style={{ borderTop: `1px solid ${theme.colors.border}`, paddingTop: "16px" }}>
                <SectionLabel>Student Contact</SectionLabel>
                <div className="grid grid-cols-2 gap-5 mt-4">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-semibold" style={{ color: theme.colors.textPrimary }}>Student Email <Optional /></Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: theme.colors.textMuted }} />
                      <Input value={draftContact.studentEmail} onChange={(e) => setDraftContact((p) => ({ ...p, studentEmail: e.target.value }))} className="pl-9 rounded-lg text-sm" placeholder="student@email.com" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-semibold" style={{ color: theme.colors.textPrimary }}>Student Phone <Optional /></Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: theme.colors.textMuted }} />
                      <Input value={draftContact.studentPhone} onChange={(e) => setDraftContact((p) => ({ ...p, studentPhone: e.target.value }))} className="pl-9 rounded-lg text-sm" placeholder="+91 123456789" />
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ borderTop: `1px solid ${theme.colors.border}`, paddingTop: "16px" }}>
                <SectionLabel>Emergency Contact</SectionLabel>
                <div className="grid grid-cols-2 gap-5 mt-4">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-semibold" style={{ color: theme.colors.textPrimary }}>Contact Name <Req /></Label>
                    <Input value={draftContact.emergencyName} onChange={(e) => setDraftContact((p) => ({ ...p, emergencyName: e.target.value }))} className="rounded-lg text-sm" placeholder="Enter name" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-semibold" style={{ color: theme.colors.textPrimary }}>Contact Phone <Req /></Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: theme.colors.textMuted }} />
                      <Input value={draftContact.emergencyPhone} onChange={(e) => setDraftContact((p) => ({ ...p, emergencyPhone: e.target.value }))} className="pl-9 rounded-lg text-sm" placeholder="+91 123456789" />
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ borderTop: `1px solid ${theme.colors.border}`, paddingTop: "16px" }}>
                <SectionLabel>Communication Preference</SectionLabel>
                <div className="flex flex-wrap gap-3 mt-3">
                  {COMM_OPTIONS.map(({ key, label, icon }) => {
                    const active = draftContact.commPref === key;
                    return (
                      <button key={key} type="button" onClick={() => setDraftContact((p) => ({ ...p, commPref: key }))}
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all"
                        style={{ borderColor: active ? theme.colors.primary : theme.colors.border, background: active ? theme.colors.sidebarActive : theme.colors.surface, color: active ? theme.colors.primary : theme.colors.textSecondary }}>
                        {icon}{label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </EditModal>

        {/* Guardian */}
        <EditModal open={editModal === "guardian"} title="Edit Guardian Details" onClose={closeModal} onSave={saveModal}>
          {draftGuardian && (
            <div className="flex flex-col gap-5">
              <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${theme.colors.border}` }}>
                <div className="flex items-center gap-2 px-4 py-3" style={{ background: theme.colors.background, borderBottom: `1px solid ${theme.colors.border}` }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: theme.colors.primary, color: "#fff" }}>1</div>
                  <span className="text-sm font-semibold" style={{ color: theme.colors.textPrimary }}>Primary Guardian</span>
                  <span className="ml-auto text-xs font-semibold" style={{ color: theme.colors.primary }}>Primary Contact</span>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <ModalField label="Guardian Name" required>
                    <Input value={draftGuardian.primary.name} onChange={(e) => setDraftGuardian((p) => ({ ...p, primary: { ...p.primary, name: e.target.value } }))} className="rounded-lg text-sm" placeholder="e.g. John Doe" />
                  </ModalField>
                  <ModalField label="Relationship" required>
                    <Select value={draftGuardian.primary.relationship} onValueChange={(v) => setDraftGuardian((p) => ({ ...p, primary: { ...p.primary, relationship: v } }))}>
                      <SelectTrigger className="rounded-lg text-sm"><SelectValue placeholder="Select Relationship" /></SelectTrigger>
                      <SelectContent>{RELATIONSHIPS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                    </Select>
                  </ModalField>
                  <ModalField label="Phone Number" required>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: theme.colors.textMuted }} />
                      <Input value={draftGuardian.primary.phone} onChange={(e) => setDraftGuardian((p) => ({ ...p, primary: { ...p.primary, phone: e.target.value } }))} className="pl-9 rounded-lg text-sm" placeholder="+91 9876543210" />
                    </div>
                  </ModalField>
                  <ModalField label="Email Address" optional>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: theme.colors.textMuted }} />
                      <Input value={draftGuardian.primary.email} onChange={(e) => setDraftGuardian((p) => ({ ...p, primary: { ...p.primary, email: e.target.value } }))} className="pl-9 rounded-lg text-sm" placeholder="guardian@example.com" />
                    </div>
                  </ModalField>
                  <ModalField label="Occupation">
                    <Input value={draftGuardian.primary.occupation} onChange={(e) => setDraftGuardian((p) => ({ ...p, primary: { ...p.primary, occupation: e.target.value } }))} className="rounded-lg text-sm" placeholder="e.g. Software Engineer" />
                  </ModalField>
                  <ModalField label="Employer / Company">
                    <Input value={draftGuardian.primary.employer} onChange={(e) => setDraftGuardian((p) => ({ ...p, primary: { ...p.primary, employer: e.target.value } }))} className="rounded-lg text-sm" placeholder="e.g. Acme Corp" />
                  </ModalField>
                  <ModalField label="ID Proof Type" optional>
                    <Select value={draftGuardian.primary.idType} onValueChange={(v) => setDraftGuardian((p) => ({ ...p, primary: { ...p.primary, idType: v } }))}>
                      <SelectTrigger className="rounded-lg text-sm"><SelectValue placeholder="Select ID Type" /></SelectTrigger>
                      <SelectContent>{ID_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                    </Select>
                  </ModalField>
                  <ModalField label="ID Number">
                    <Input value={draftGuardian.primary.idNumber} onChange={(e) => setDraftGuardian((p) => ({ ...p, primary: { ...p.primary, idNumber: e.target.value } }))} className="rounded-lg text-sm" placeholder="ID Number" />
                  </ModalField>
                </div>
              </div>
              <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${theme.colors.border}` }}>
                <div className="flex items-center gap-2 px-4 py-3" style={{ background: theme.colors.background, borderBottom: `1px solid ${theme.colors.border}` }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: theme.colors.border, color: theme.colors.textMuted }}>2</div>
                  <span className="text-sm font-semibold" style={{ color: theme.colors.textPrimary }}>Secondary Guardian <span style={{ color: theme.colors.textMuted, fontWeight: 400 }}>(Optional)</span></span>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <ModalField label="Guardian Name">
                    <Input value={draftGuardian.secondary.name} onChange={(e) => setDraftGuardian((p) => ({ ...p, secondary: { ...p.secondary, name: e.target.value } }))} className="rounded-lg text-sm" placeholder="e.g. Jane Doe" />
                  </ModalField>
                  <ModalField label="Relationship">
                    <Select value={draftGuardian.secondary.relationship} onValueChange={(v) => setDraftGuardian((p) => ({ ...p, secondary: { ...p.secondary, relationship: v } }))}>
                      <SelectTrigger className="rounded-lg text-sm"><SelectValue placeholder="Select Relationship" /></SelectTrigger>
                      <SelectContent>{RELATIONSHIPS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                    </Select>
                  </ModalField>
                  <ModalField label="Phone Number">
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: theme.colors.textMuted }} />
                      <Input value={draftGuardian.secondary.phone} onChange={(e) => setDraftGuardian((p) => ({ ...p, secondary: { ...p.secondary, phone: e.target.value } }))} className="pl-9 rounded-lg text-sm" placeholder="+91 98765 43210" />
                    </div>
                  </ModalField>
                  <ModalField label="Email Address" optional>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: theme.colors.textMuted }} />
                      <Input value={draftGuardian.secondary.email} onChange={(e) => setDraftGuardian((p) => ({ ...p, secondary: { ...p.secondary, email: e.target.value } }))} className="pl-9 rounded-lg text-sm" placeholder="guardian@example.com" />
                    </div>
                  </ModalField>
                </div>
              </div>
            </div>
          )}
        </EditModal>

        {/* ── Documents Modal ── NEW */}
        <EditModal open={editModal === "documents"} title="Edit Documents" onClose={closeModal} onSave={saveModal}>
          {draftDocs && (
            <div className="flex flex-col gap-5">
              {/* Required */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span style={{ fontSize: 11, fontWeight: 700, color: theme.colors.textMuted, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                    Required Documents
                  </span>
                  <div style={{ flex: 1, height: 1, background: theme.colors.border }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: DOCUMENT_TYPES.filter(d => d.required && draftDocs[d.id]).length === DOCUMENT_TYPES.filter(d => d.required).length ? theme.colors.success ?? "#16a34a" : theme.colors.danger }}>
                    {DOCUMENT_TYPES.filter(d => d.required && draftDocs[d.id]).length}/{DOCUMENT_TYPES.filter(d => d.required).length}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {DOCUMENT_TYPES.filter(d => d.required).map((docType) => (
                    <DocumentSlot
                      key={docType.id}
                      docType={docType}
                      document={draftDocs[docType.id]}
                      onUpload={handleDraftUpload}
                      onRemove={handleDraftRemove}
                      onPreview={setPreviewDoc}
                    />
                  ))}
                </div>
              </div>

              {/* Optional */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span style={{ fontSize: 11, fontWeight: 700, color: theme.colors.textMuted, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                    Optional Documents
                  </span>
                  <div style={{ flex: 1, height: 1, background: theme.colors.border }} />
                </div>
                <div className="flex flex-col gap-3">
                  {DOCUMENT_TYPES.filter(d => !d.required).map((docType) => (
                    <DocumentSlot
                      key={docType.id}
                      docType={docType}
                      document={draftDocs[docType.id]}
                      onUpload={handleDraftUpload}
                      onRemove={handleDraftRemove}
                      onPreview={setPreviewDoc}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </EditModal>

        {/* Fees */}
        <EditModal open={editModal === "fees"} title="Edit Fees Plan" onClose={closeModal} onSave={saveModal} wide>
          {draftFees && (() => {
            const dAddon    = getAddonAmount(draftFees.addon);
            const dDiscount = getDiscountAmount(draftFees.discount, BASE_FEE + dAddon);
            const dNet      = BASE_FEE + dAddon - dDiscount;
            const dAllocated = draftFees.installments.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0);
            const dMatch    = Math.abs(dAllocated - dNet) < 0.01;
            return (
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-5">
                  <ModalField label="Academic Year" required>
                    <Select value={draftFees.academicYear} onValueChange={(v) => setDraftFees((p) => ({ ...p, academicYear: v }))}>
                      <SelectTrigger className="rounded-lg text-sm"><SelectValue placeholder="Select Year" /></SelectTrigger>
                      <SelectContent>{ACADEMIC_YEARS.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                    </Select>
                  </ModalField>
                  <ModalField label="Fee Group" required>
                    <Select value={draftFees.feeGroup} onValueChange={(v) => setDraftFees((p) => ({ ...p, feeGroup: v }))}>
                      <SelectTrigger className="rounded-lg text-sm"><SelectValue placeholder="Select Fee Group" /></SelectTrigger>
                      <SelectContent>{FEE_GROUPS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                    </Select>
                  </ModalField>
                  <ModalField label="Discount / Scholarship">
                    <Select value={draftFees.discount} onValueChange={(v) => setDraftFees((p) => ({ ...p, discount: v }))}>
                      <SelectTrigger className="rounded-lg text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>{DISCOUNTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                    </Select>
                  </ModalField>
                  <ModalField label="Add-ons">
                    <Select value={draftFees.addon} onValueChange={(v) => setDraftFees((p) => ({ ...p, addon: v }))}>
                      <SelectTrigger className="rounded-lg text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>{ADDONS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
                    </Select>
                  </ModalField>
                </div>
                <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${theme.colors.border}` }}>
                  <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${theme.colors.border}` }}>
                    <span className="text-sm font-bold" style={{ color: theme.colors.textPrimary }}>Installment Plan</span>
                    <div className="flex gap-2">
                      <button type="button" onClick={handleAutoSplit}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                        style={{ color: theme.colors.primary, background: `${theme.colors.primary}15`, border: `1px solid ${theme.colors.primary}30` }}>
                        Auto-Split ({draftFees.installments.length})
                      </button>
                      <button type="button"
                        onClick={() => setDraftFees((p) => {
                          if (p.installments.length >= 4) {
                            return p;
                          }
                          const newInstallments = [...p.installments, emptyInstallment(`Installment ${p.installments.length + 1}`, "", 0)];
                          return {
                            ...p,
                            installments: getAutoSplitInstallments(p, newInstallments),
                          };
                        })}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1"
                        style={{ color: theme.colors.textPrimary, background: theme.colors.background, border: `1px solid ${theme.colors.border}` }}>
                        <Plus className="w-3 h-3" /> Add Row
                      </button>
                    </div>
                  </div>
                  <div className="grid px-4 py-2.5" style={{ gridTemplateColumns: "2fr 1.6fr 1.4fr 1fr", background: theme.colors.background, borderBottom: `1px solid ${theme.colors.border}` }}>
                    {["INSTALLMENT NAME","DUE DATE","AMOUNT","STATUS"].map((h) => (
                      <span key={h} className="text-[10px] font-bold tracking-wide" style={{ color: theme.colors.textMuted }}>{h}</span>
                    ))}
                  </div>
                  {draftFees.installments.map((row, idx) => (
                    <div key={row.id} className="grid items-center px-4 py-3"
                      style={{ gridTemplateColumns: "2fr 1.6fr 1.4fr 1fr", borderBottom: idx < draftFees.installments.length - 1 ? `1px solid ${theme.colors.border}` : "none" }}>
                      <Input value={row.name}
                        onChange={(e) => setDraftFees((p) => ({ ...p, installments: p.installments.map((r) => r.id === row.id ? { ...r, name: e.target.value } : r) }))}
                        className="rounded-lg text-sm h-8 border-0 bg-transparent p-0 focus:ring-0 focus-visible:ring-0" style={{ color: theme.colors.textPrimary, boxShadow: "none" }} />
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm" style={{ color: theme.colors.textPrimary }}>
                          {row.dueDate ? new Date(row.dueDate).toLocaleDateString("en-US",{month:"2-digit",day:"2-digit",year:"numeric"}) : "—"}
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <CalendarDays className="w-4 h-4" style={{ color: theme.colors.textMuted }} />
                          <input type="date" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" value={row.dueDate}
                            onChange={(e) => setDraftFees((p) => ({ ...p, installments: p.installments.map((r) => r.id === row.id ? { ...r, dueDate: e.target.value } : r) }))} />
                        </label>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm" style={{ color: theme.colors.textMuted }}>$</span>
                        <Input type="number" value={row.amount}
                          onChange={(e) => setDraftFees((p) => ({ ...p, installments: p.installments.map((r) => r.id === row.id ? { ...r, amount: e.target.value } : r) }))}
                          className="rounded-lg text-sm h-8 w-20 text-right" />
                      </div>
                      <span className="text-xs font-semibold px-2 py-1 rounded-lg w-fit" style={{ background: `${theme.colors.primary}12`, color: theme.colors.primary, border: `1px solid ${theme.colors.primary}25` }}>Planned</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-end gap-3 px-4 py-3" style={{ borderTop: `1px solid ${theme.colors.border}`, background: theme.colors.background }}>
                    <span className="text-sm" style={{ color: theme.colors.textMuted }}>Allocated Total:</span>
                    <span className="text-sm font-bold" style={{ color: theme.colors.textPrimary }}>${dAllocated.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-3"
                    style={{ background: dMatch ? "#f0fdf4" : "#fef2f2", borderTop: `1px solid ${dMatch ? "#bbf7d0" : "#fecaca"}` }}>
                    {dMatch
                      ? <><CheckCircle2 className="w-4 h-4" style={{ color: "#16a34a" }} /><span className="text-sm font-medium" style={{ color: "#16a34a" }}>Totals match Net Payable.</span></>
                      : <><AlertCircle className="w-4 h-4" style={{ color: "#dc2626" }} /><span className="text-sm font-medium" style={{ color: "#dc2626" }}>Totals (${dAllocated.toFixed(2)}) don't match Net Payable (${dNet.toFixed(2)}).</span></>}
                  </div>
                </div>
                <div className="rounded-xl p-4" style={{ border: `1px solid ${theme.colors.border}`, background: theme.colors.cardBg }}>
                  <p className="text-sm font-bold mb-3" style={{ color: theme.colors.textPrimary }}>Financial Summary</p>
                  <div className="flex flex-col gap-2.5">
                    <SummaryRow label="Base Tuition Fee" value={`$${BASE_FEE.toFixed(2)}`} />
                    <SummaryRow label="Add-ons Total" value={`$${dAddon.toFixed(2)}`} />
                    <SummaryRow label="Discount Applied" value={`-$${dDiscount.toFixed(2)}`} valueColor="#16a34a" labelColor="#16a34a" />
                    <div className="flex justify-between items-center pt-2.5" style={{ borderTop: `1px solid ${theme.colors.border}` }}>
                      <span className="text-sm font-bold" style={{ color: theme.colors.textPrimary }}>Net Payable</span>
                      <span className="text-base font-bold" style={{ color: theme.colors.primary }}>${dNet.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </EditModal>

      </div>
    </>
  );
};

// ════════════════════════════════════════════════════════════════════
//  Reusable Modal Shell
// ════════════════════════════════════════════════════════════════════
const EditModal = ({ open, title, onClose, onSave, children, wide }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.45)", fontFamily: theme.typography.fontFamily }}>
      <div className="relative flex flex-col rounded-2xl w-full"
        style={{ background: theme.colors.surface, boxShadow: theme.shadow.modal, maxWidth: wide ? "760px" : "600px", maxHeight: "90vh" }}>
        <div className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ borderBottom: `1px solid ${theme.colors.border}` }}>
          <h2 className="text-base font-bold" style={{ color: theme.colors.textPrimary }}>{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:opacity-70"
            style={{ color: theme.colors.textMuted, background: theme.colors.background }}>
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5 flex-1">{children}</div>
        <div className="flex justify-end gap-3 px-6 py-4 shrink-0"
          style={{ borderTop: `1px solid ${theme.colors.border}` }}>
          <Button variant="ghost" onClick={onClose} style={{ color: theme.colors.textSecondary }}>Cancel</Button>
          <Button onClick={onSave} className="text-white font-semibold px-6 py-2.5 rounded-xl"
            style={{ background: theme.colors.primary }}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
};

// ── Shared helpers ────────────────────────────────────────────────
const SectionCard = ({ icon, title, onEdit, hasError, children }) => (
  <Card className="rounded-2xl overflow-hidden"
    style={{ background: "white", border: hasError ? "1.5px solid #fca5a5" : `1px solid ${theme.colors.border}`,
      boxShadow: theme.shadow?.card, borderLeft: hasError ? "4px solid #ef4444" : undefined }}>
    <CardContent className="p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span style={{ color: theme.colors.textMuted }}>{icon}</span>
          <h2 className="text-base font-bold" style={{ color: theme.colors.textPrimary }}>{title}</h2>
        </div>
        <button type="button" onClick={onEdit}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg hover:opacity-80"
          style={{ color: theme.colors.primary, background: `${theme.colors.primary}10`, border: `1px solid ${theme.colors.primary}25` }}>
          <Pencil className="w-3 h-3" /> Edit
        </button>
      </div>
      {children}
    </CardContent>
  </Card>
);

const InfoField = ({ label, value, children }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] font-bold tracking-widest" style={{ color: theme.colors.textMuted }}>{label}</span>
    {children ?? <span className="text-sm font-semibold" style={{ color: theme.colors.textPrimary }}>{value || "—"}</span>}
  </div>
);

const ModalField = ({ label, required, optional, children }) => (
  <div className="flex flex-col gap-1.5">
    <Label className="text-xs font-semibold" style={{ color: theme.colors.textPrimary }}>
      {label} {required && <Req />} {optional && <Optional />}
    </Label>
    {children}
  </div>
);

const SectionLabel = ({ children }) => (
  <p className="text-xs font-bold uppercase mb-1" style={{ color: theme.colors.textPrimary, letterSpacing: "0.08em" }}>{children}</p>
);

const SummaryRow = ({ label, value, labelColor, valueColor }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm" style={{ color: labelColor || theme.colors.textSecondary }}>{label}</span>
    <span className="text-sm font-medium" style={{ color: valueColor || theme.colors.textPrimary }}>{value}</span>
  </div>
);

const Req = () => <span style={{ color: theme.colors.danger }}>*</span>;
const Optional = () => <span style={{ color: theme.colors.textMuted, fontWeight: 400, fontSize: "0.75rem" }}>(Optional)</span>;

export default ReviewAdmission;
