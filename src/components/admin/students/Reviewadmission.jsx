import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  User, BookOpen, Users, DollarSign, Pencil,
  CheckCircle2, AlertCircle, Lock, X, FileText,
} from "lucide-react";
import { theme } from "../../../theme/theme";
import { useNavigate } from "react-router-dom";

const MOCK_DATA = {
  student: { initials: "AW", fullName: "Alexander Wright", grade: "Grade 10", academicYear: "2024-2025" },
  basic: { fullName: "Alexander James Wright", dob: "15 May 2008 (16 yrs)", gender: "Male", applyingFor: "Grade 10", academicYear: "2024 - 2025", previousSchool: "Lincoln Middle School" },
  contact: { address: "124 Maple Street, Springfield, IL 62704", city: "Springfield", stateZip: "Illinois, 62704", phone: "+1 (555) 123-4567", email: "alex.wright@email.com" },
  guardian: {
    primary:   { label: "Primary Contact (Father)",   name: "Robert Wright", phone: null, email: "robert.w@company.com", occupation: "Software Engineer" },
    secondary: { label: "Secondary Contact (Mother)",  name: "Sarah Wright",  phone: "+1 (555) 987-6543" },
  },
  fees: {
    feeGroup: "Standard Grade 10", totalPayable: "$4,500.00",
    installments: [
      { name: "Term 1 Fee", dueDate: "Aug 01, 2024", amount: "$1,500.00" },
      { name: "Term 2 Fee", dueDate: "Dec 01, 2024", amount: "$1,500.00" },
      { name: "Term 3 Fee", dueDate: "Apr 01, 2025", amount: "$1,500.00" },
    ],
  },
};

const CHECKLIST = [
  { key: "basic",    label: "Basic Information", ok: true  },
  { key: "contact",  label: "Contact Details",   ok: true  },
  { key: "guardian", label: "Guardian Details",  ok: false },
  { key: "fees",     label: "Fees Setup",        ok: true  },
];

const hasErrors = CHECKLIST.some((c) => !c.ok);

const formatDisplayDate = (date) => {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ════════════════════════════════════════════════════════════════════
const ReviewAdmission = ({
  basicData,
  contactData,
  guardianData,
  feesData,
  onBack,
  onConfirm,
  onEditBasic    = () => {},  // → goToStep(0)
  onEditContact  = () => {},  // → goToStep(1)
  onEditGuardian = () => {},  // → goToStep(2)
  onEditFees     = () => {},  // → goToStep(3)
}) => {
  const [alertDismissed, setAlertDismissed] = useState(false);
  const fullName = [basicData?.firstName, basicData?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  const applyingFor = basicData?.grade
    ? `Grade ${basicData.grade.replace("grade-", "")}`
    : "";
  const contactAddress = [
    contactData?.addressLine1,
    contactData?.addressLine2,
  ]
    .filter(Boolean)
    .join(", ");
  const contactStateZip = [
    contactData?.state,
    contactData?.zip,
  ]
    .filter(Boolean)
    .join(", ");
  const primaryGuardianLabel = guardianData?.primary?.relationship
    ? `Primary Contact (${guardianData.primary.relationship})`
    : MOCK_DATA.guardian.primary.label;
  const secondaryGuardianLabel = guardianData?.secondary?.relationship
    ? `Secondary Contact (${guardianData.secondary.relationship})`
    : MOCK_DATA.guardian.secondary.label;
  const d = {
    ...MOCK_DATA,
    student: {
      ...MOCK_DATA.student,
      fullName: fullName || MOCK_DATA.student.fullName,
      grade: applyingFor || MOCK_DATA.student.grade,
    },
    basic: {
      ...MOCK_DATA.basic,
      fullName: fullName || MOCK_DATA.basic.fullName,
      dob: formatDisplayDate(basicData?.dob) || MOCK_DATA.basic.dob,
      gender: basicData?.gender || MOCK_DATA.basic.gender,
      applyingFor: applyingFor || MOCK_DATA.basic.applyingFor,
      previousSchool:
        basicData?.previousSchool || MOCK_DATA.basic.previousSchool,
    },
    contact: {
      ...MOCK_DATA.contact,
      address: contactAddress || MOCK_DATA.contact.address,
      city: contactData?.city || MOCK_DATA.contact.city,
      stateZip: contactStateZip || MOCK_DATA.contact.stateZip,
      phone:
        contactData?.studentPhone || MOCK_DATA.contact.phone,
      email:
        contactData?.studentEmail || MOCK_DATA.contact.email,
    },
    guardian: {
      primary: {
        ...MOCK_DATA.guardian.primary,
        label: primaryGuardianLabel,
        name: guardianData?.primary?.name || MOCK_DATA.guardian.primary.name,
        phone: guardianData?.primary?.phone || MOCK_DATA.guardian.primary.phone,
        email: guardianData?.primary?.email || MOCK_DATA.guardian.primary.email,
        occupation: guardianData?.primary?.occupation || MOCK_DATA.guardian.primary.occupation,
      },
      secondary: {
        ...MOCK_DATA.guardian.secondary,
        label: secondaryGuardianLabel,
        name: guardianData?.secondary?.name || MOCK_DATA.guardian.secondary.name,
        phone: guardianData?.secondary?.phone || MOCK_DATA.guardian.secondary.phone,
      },
    },
    fees: {
      ...MOCK_DATA.fees,
      feeGroup: feesData?.feeGroup || MOCK_DATA.fees.feeGroup,
      totalPayable: feesData
        ? `$${(
            4500 +
            (feesData.addon === "Transport Only (+$500)" ? 500 : 0) +
            (feesData.addon === "Hostel Only (+$1,200)" ? 1200 : 0) +
            (feesData.addon === "Transport + Hostel (+$1,700)" ? 1700 : 0) -
            ((feesData.discount?.match(/\((\d+)%\)/)?.[1]
              ? ((
                  4500 +
                  (feesData.addon === "Transport Only (+$500)" ? 500 : 0) +
                  (feesData.addon === "Hostel Only (+$1,200)" ? 1200 : 0) +
                  (feesData.addon === "Transport + Hostel (+$1,700)" ? 1700 : 0)
                ) * parseInt(feesData.discount.match(/\((\d+)%\)/)[1], 10)) / 100
              : 0))
          ).toFixed(2)}`
        : MOCK_DATA.fees.totalPayable,
      installments: feesData?.installments?.length
        ? feesData.installments.map((row) => ({
            name: row.name || "—",
            dueDate: row.dueDate ? new Date(row.dueDate).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            }) : "—",
            amount: `$${(parseFloat(row.amount) || 0).toFixed(2)}`,
          }))
        : MOCK_DATA.fees.installments,
    },
  };

  return (
    <div
      className="min-h-screen py-10"
      style={{ background: theme.colors.background, fontFamily: theme.typography.fontFamily, padding: theme.layout?.contentPadding }}
    >
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
                <p className="text-sm mt-0.5" style={{ color: "#b91c1c" }}>
                  Please complete the Guardian Details section before confirming admission. The primary contact phone number is missing.
                </p>
              </div>
              <button onClick={() => setAlertDismissed(true)}>
                <X className="w-4 h-4" style={{ color: "#dc2626" }} />
              </button>
            </div>
          )}

          {/* Basic Information */}
          <SectionCard icon={<User className="w-4 h-4" />} title="Basic Information" onEdit={onEditBasic}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 mt-4">
              <InfoField label="FULL NAME"       value={d.basic.fullName} />
              <InfoField label="DATE OF BIRTH"   value={d.basic.dob} />
              <InfoField label="GENDER"          value={d.basic.gender} />
              <InfoField label="APPLYING FOR">
                <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-md mt-0.5"
                  style={{ background: `${theme.colors.primary}15`, color: theme.colors.primary, border: `1px solid ${theme.colors.primary}25` }}>
                  {d.basic.applyingFor}
                </span>
              </InfoField>
              <InfoField label="ACADEMIC YEAR"   value={d.basic.academicYear} />
              <InfoField label="PREVIOUS SCHOOL" value={d.basic.previousSchool} />
            </div>
          </SectionCard>

          {/* Contact Details */}
          <SectionCard icon={<BookOpen className="w-4 h-4" />} title="Contact Details" onEdit={onEditContact}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 mt-4">
              <InfoField label="RESIDENTIAL ADDRESS" value={d.contact.address} />
              <div />
              <InfoField label="CITY"          value={d.contact.city} />
              <InfoField label="STATE / ZIP"   value={d.contact.stateZip} />
              <InfoField label="STUDENT PHONE" value={d.contact.phone} />
              <InfoField label="STUDENT EMAIL" value={d.contact.email} />
            </div>
          </SectionCard>

          {/* Guardian Details */}
          <SectionCard icon={<Users className="w-4 h-4" />} title="Guardian Details" onEdit={onEditGuardian} hasError>
            <div className="mt-4">
              <span className="inline-block text-xs font-semibold px-3 py-1 rounded-lg mb-3"
                style={{ background: theme.colors.background, border: `1px solid ${theme.colors.border}`, color: theme.colors.textPrimary }}>
                {d.guardian.primary.label}
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
                <InfoField label="FULL NAME" value={d.guardian.primary.name} />
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold tracking-widest flex items-center gap-1" style={{ color: "#dc2626" }}>
                    PHONE NUMBER <AlertCircle className="w-3 h-3" />
                  </span>
                  <span className="text-sm font-semibold italic" style={{ color: "#dc2626" }}>Missing Required Field</span>
                </div>
                <InfoField label="EMAIL ADDRESS" value={d.guardian.primary.email} />
                <InfoField label="OCCUPATION"    value={d.guardian.primary.occupation} />
              </div>
            </div>
            <div className="my-4" style={{ borderTop: `1px solid ${theme.colors.border}` }} />
            <div>
              <span className="inline-block text-xs font-semibold px-3 py-1 rounded-lg mb-3"
                style={{ background: theme.colors.background, border: `1px solid ${theme.colors.border}`, color: theme.colors.textPrimary }}>
                {d.guardian.secondary.label}
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
                <InfoField label="FULL NAME"    value={d.guardian.secondary.name} />
                <InfoField label="PHONE NUMBER" value={d.guardian.secondary.phone} />
              </div>
            </div>
          </SectionCard>

          {/* Fees Setup */}
          <SectionCard icon={<DollarSign className="w-4 h-4" />} title="Fees Setup" onEdit={onEditFees}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="rounded-xl p-4" style={{ background: theme.colors.background, border: `1px solid ${theme.colors.border}` }}>
                <p className="text-[10px] font-bold tracking-widest mb-1" style={{ color: theme.colors.textMuted }}>FEE GROUP</p>
                <p className="text-sm font-bold" style={{ color: theme.colors.textPrimary }}>{d.fees.feeGroup}</p>
              </div>
              <div className="rounded-xl p-4" style={{ background: theme.colors.background, border: `1px solid ${theme.colors.border}` }}>
                <p className="text-[10px] font-bold tracking-widest mb-1" style={{ color: theme.colors.textMuted }}>TOTAL PAYABLE</p>
                <p className="text-lg font-bold" style={{ color: theme.colors.primary }}>{d.fees.totalPayable}</p>
              </div>
            </div>
            <div className="mt-4 rounded-xl overflow-hidden" style={{ border: `1px solid ${theme.colors.border}` }}>
              <div className="grid px-4 py-2.5"
                style={{ gridTemplateColumns: "2fr 1.5fr 1fr", background: theme.colors.background, borderBottom: `1px solid ${theme.colors.border}` }}>
                {["INSTALLMENT", "DUE DATE", "AMOUNT"].map((h) => (
                  <span key={h} className="text-[10px] font-bold tracking-widest" style={{ color: theme.colors.textMuted }}>{h}</span>
                ))}
              </div>
              {d.fees.installments.map((row, i) => (
                <div key={i} className="grid px-4 py-3 items-center"
                  style={{ gridTemplateColumns: "2fr 1.5fr 1fr", borderBottom: i < d.fees.installments.length - 1 ? `1px solid ${theme.colors.border}` : "none" }}>
                  <span className="text-sm" style={{ color: theme.colors.textPrimary }}>{row.name}</span>
                  <span className="text-sm" style={{ color: theme.colors.textSecondary }}>{row.dueDate}</span>
                  <span className="text-sm font-semibold" style={{ color: theme.colors.textPrimary }}>{row.amount}</span>
                </div>
              ))}
            </div>
          </SectionCard>

        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div className="w-full lg:w-72 shrink-0 flex flex-col gap-4 lg:sticky lg:top-6">
          <Card className="rounded-2xl" style={{ background: theme.colors.cardBg, border: `1px solid ${theme.colors.border}`, boxShadow: theme.shadow?.card }}>
            <CardContent className="p-5 flex flex-col items-center text-center gap-3">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold"
                style={{ background: `${theme.colors.primary}20`, color: theme.colors.primary }}>
                {d.student.initials}
              </div>
              <div>
                <p className="font-bold text-base" style={{ color: theme.colors.textPrimary }}>{d.student.fullName}</p>
                <p className="text-sm mt-0.5" style={{ color: theme.colors.textSecondary }}>
                  Applying for {d.student.grade} &bull; {d.student.academicYear}
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
                  {CHECKLIST.map((item) => (
                    <div key={item.key} className="flex items-center gap-2.5">
                      {item.ok
                        ? <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "#16a34a" }} />
                        : <AlertCircle  className="w-4 h-4 shrink-0" style={{ color: "#dc2626" }} />}
                      <span className="text-sm font-medium" style={{ color: item.ok ? theme.colors.textPrimary : "#dc2626" }}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full" style={{ borderTop: `1px solid ${theme.colors.border}` }} />

              <div className="w-full flex flex-col gap-2.5">
                <Button
                  disabled={hasErrors}
                  onClick={!hasErrors ? onConfirm : undefined}
                  className="w-full rounded-xl font-semibold flex items-center justify-center gap-2"
                  style={{ background: hasErrors ? theme.colors.border : theme.colors.primary, color: hasErrors ? theme.colors.textMuted : "#fff", cursor: hasErrors ? "not-allowed" : "pointer" }}
                >
                  <Lock className="w-3.5 h-3.5" /> Confirm Admission
                </Button>
                {hasErrors && (
                  <p className="text-xs text-center" style={{ color: "#dc2626" }}>Fix errors above to confirm admission</p>
                )}
                <Button variant="outline" className="w-full rounded-xl font-semibold flex items-center justify-center gap-2"
                  style={{ border: `1px solid ${theme.colors.border}`, color: theme.colors.textPrimary, background: theme.colors.cardBg }}>
                  <FileText className="w-3.5 h-3.5" /> Save as Draft
                </Button>
                <button className="text-sm font-medium" style={{ color: theme.colors.textSecondary }}>
                  Cancel &amp; Return to List
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};

// ── Section Card ─────────────────────────────────────────────────
const SectionCard = ({ icon, title, onEdit, hasError, children }) => (
  <Card className="rounded-2xl overflow-hidden"
    style={{ background: "white", border: hasError ? "1.5px solid #fca5a5" : `1px solid ${theme.colors.border}`, boxShadow: theme.shadow?.card, borderLeft: hasError ? "4px solid #ef4444" : undefined }}>
    <CardContent className="p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span style={{ color: theme.colors.textMuted }}>{icon}</span>
          <h2 className="text-base font-bold" style={{ color: theme.colors.textPrimary }}>{title}</h2>
        </div>
        <button type="button" onClick={onEdit}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors hover:opacity-80"
          style={{ color: theme.colors.primary, background: `${theme.colors.primary}10`, border: `1px solid ${theme.colors.primary}25` }}>
          <Pencil className="w-3 h-3" /> Edit
        </button>
      </div>
      {children}
    </CardContent>
  </Card>
);

// ── Info Field ───────────────────────────────────────────────────
const InfoField = ({ label, value, children }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] font-bold tracking-widest" style={{ color: theme.colors.textMuted }}>{label}</span>
    {children ?? <span className="text-sm font-semibold" style={{ color: theme.colors.textPrimary }}>{value || "—"}</span>}
  </div>
);

export default ReviewAdmission;
