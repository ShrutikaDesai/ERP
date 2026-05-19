import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
} from "lucide-react";
import { theme } from "../../../theme/theme";

const STEPS = ["Basic Info", "Contact", "Guardian", "Fees"];

const RELATIONSHIPS = [
  "Father", "Mother", "Brother", "Sister",
  "Uncle", "Aunt", "Grandfather", "Grandmother", "Legal Guardian", "Other",
];

const ID_TYPES = [
  "Passport", "Driver's License", "National ID", "Aadhaar Card",
  "PAN Card", "Voter ID", "Other",
];

// ─── empty guardian template ───────────────────────────────────────
const emptyGuardian = () => ({
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

// ════════════════════════════════════════════════════════════════════
const GuardianDetails = ({
  onBack,
  onNext,
  isEditMode,
  formData,
  setFormData,
}) => {
  const currentStep = 2;
  const progressPercent = ((currentStep + 1) / STEPS.length) * 100;

  const [primaryOpen, setPrimaryOpen] = useState(true);
  const [secondaryOpen, setSecondaryOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const primary = formData.primary;
  const secondary = formData.secondary;
  const consent = formData.consent;
  // ── field helpers ────────────────────────────────────────────────
  const handlePrimary = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      primary: { ...prev.primary, [field]: value },
    }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  };
  const handleSecondary = (field, value) =>
    setFormData((prev) => ({
      ...prev,
      secondary: { ...prev.secondary, [field]: value },
    }));

  // ── validation ───────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!primary.name.trim())         e.name         = "Guardian name is required";
    if (!primary.relationship)        e.relationship = "Relationship is required";
    if (!primary.phone.trim())        e.phone        = "Phone number is required";
    return e;
  };

  const handleNext = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    onNext?.();
  };

  return (
    <div
      className="min-h-screen py-10"
      style={{
        background: theme.colors.background,
        fontFamily: theme.typography.fontFamily,
        padding: theme.layout?.contentPadding,
      }}
    >
      {/* PAGE HEADER */}
      <div className="w-full max-w-5xl mx-auto mb-6">
        <h1 style={{ fontSize: "1.7rem", fontWeight: 700, color: theme.colors.textPrimary, margin: 0 }}>
          {isEditMode ? "Edit Student" : "Add Student"}
        </h1>
        <p className="text-sm mt-1" style={{ color: theme.colors.textSecondary }}>
          {isEditMode ? "Update guardian details below." : "Register new students and manage admission records."}
        </p>
      </div>

      <div className="w-full max-w-3xl mx-auto">
        {/* STEP HEADER */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold" style={{ color: theme.colors.textPrimary }}>
            Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep]}
          </h3>
          <span className="text-sm font-medium" style={{ color: theme.colors.textSecondary }}>
            {progressPercent}% Completed
          </span>
        </div>

        {/* PROGRESS BAR */}
        <div className="grid grid-cols-4 gap-2 mb-2">
          {STEPS.map((_, i) => (
            <div key={i} className="h-1.5 rounded-full"
              style={{ background: i <= currentStep ? theme.colors.primary : theme.colors.border }} />
          ))}
        </div>

        {/* STEP LABELS */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {STEPS.map((label, i) => (
            <span key={i} className="text-xs text-center font-medium"
              style={{ color: i === currentStep ? theme.colors.primary : theme.colors.textMuted }}>
              {label}
            </span>
          ))}
        </div>

        {/* CARD */}
        <Card className="rounded-2xl"
          style={{ background: theme.colors.cardBg, border: `1px solid ${theme.colors.border}`, boxShadow: theme.shadow?.card }}>
          <CardContent className="p-7">

            {/* CARD HEADER */}
            <div className="pb-5 mb-6" style={{ borderBottom: `1px solid ${theme.colors.border}` }}>
              <h2 className="text-base font-bold" style={{ color: theme.colors.textPrimary }}>
                Guardian Information
              </h2>
              <p className="text-sm mt-1" style={{ color: theme.colors.textMuted }}>
                Add primary and secondary guardian details.
              </p>
            </div>

            {/* ── PRIMARY GUARDIAN ── */}
            <GuardianSection
              number={1}
              title="Primary Guardian"
              badge="Primary Contact"
              badgeColor={theme.colors.primary}
              isOpen={primaryOpen}
              onToggle={() => setPrimaryOpen((v) => !v)}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                {/* Name */}
                <FormField label="Guardian Name" required error={errors.name}>
                  <Input placeholder="e.g. John Doe" value={primary.name}
                    onChange={(e) => handlePrimary("name", e.target.value)}
                    className={`rounded-lg text-sm ${errors.name ? "border-red-400" : ""}`} />
                </FormField>
 
                {/* Relationship */}
                <FormField label="Relationship" required error={errors.relationship}>
                <Select value={primary.relationship} onValueChange={(v) => handlePrimary("relationship", v)}>
                    <SelectTrigger className={`rounded-lg text-sm ${errors.relationship ? "border-red-400" : ""}`}>
                      <SelectValue placeholder="Select Relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      {RELATIONSHIPS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </FormField>
 
                {/* Phone */}
                <FormField label="Phone Number" required error={errors.phone}>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: theme.colors.textMuted }} />
                    <Input placeholder="+91 9876543210" value={primary.phone}
                      onChange={(e) => handlePrimary("phone", e.target.value)}
                      className={`pl-9 rounded-lg text-sm ${errors.phone ? "border-red-400" : ""}`} />
                  </div>
                </FormField>
 
                {/* Email */}
                <FormField label="Email Address" optional>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: theme.colors.textMuted }} />
                    <Input placeholder="guardian@example.com" value={primary.email}
                      onChange={(e) => handlePrimary("email", e.target.value)}
                      className="pl-9 rounded-lg text-sm" />
                  </div>
                </FormField>
 
                {/* Occupation */}
                <FormField label="Occupation">
                  <Input placeholder="e.g. Software Engineer" value={primary.occupation}
                    onChange={(e) => handlePrimary("occupation", e.target.value)}
                    className="rounded-lg text-sm" />
                </FormField>
 
                {/* Employer */}
                <FormField label="Employer / Company">
                  <Input placeholder="e.g. Acme Corp" value={primary.employer}
                    onChange={(e) => handlePrimary("employer", e.target.value)}
                    className="rounded-lg text-sm" />
                </FormField>
 
                {/* ID Type */}
                <FormField label="ID Proof Type" optional>
                  <Select value={primary.idType} onValueChange={(v) => handlePrimary("idType", v)}>
                    <SelectTrigger className="rounded-lg text-sm">
                      <SelectValue placeholder="Select ID Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ID_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </FormField>
 
                {/* ID Number */}
                <FormField label="ID Number">
                  <Input placeholder="ID Number" value={primary.idNumber}
                    onChange={(e) => handlePrimary("idNumber", e.target.value)}
                    className="rounded-lg text-sm" />
                </FormField>
              </div>
 
              {/* Same Address Checkbox */}
              <div className="mt-5">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <div
                    onClick={() => handlePrimary("sameAddress", !primary.sameAddress)}
                    className="w-5 h-5 rounded flex items-center justify-center shrink-0 transition-colors"
                    style={{
                      background: primary.sameAddress ? theme.colors.primary : "#fff",
                      border: `2px solid ${primary.sameAddress ? theme.colors.primary : theme.colors.border}`,
                    }}
                  >
                    {primary.sameAddress && (
                      <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                        <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm" style={{ color: theme.colors.textPrimary }}>
                    Address is same as student's residential address
                  </span>
                </label>
              </div>
            </GuardianSection>

            {/* ── SECONDARY GUARDIAN ── */}
            <div className="mt-4">
              <GuardianSection
                number={2}
                title="Secondary Guardian"
                optional
                isOpen={secondaryOpen}
                onToggle={() => setSecondaryOpen((v) => !v)}
                muted
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                  <FormField label="Guardian Name">
                  <Input placeholder="e.g. Jane Doe" value={secondary.name}
                      onChange={(e) => handleSecondary("name", e.target.value)}
                      className="rounded-lg text-sm" />
                  </FormField>

                  <FormField label="Relationship">
                    <Select value={secondary.relationship} onValueChange={(v) => handleSecondary("relationship", v)}>
                      <SelectTrigger className="rounded-lg text-sm">
                        <SelectValue placeholder="Select Relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        {RELATIONSHIPS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </FormField>

                  <FormField label="Phone Number">
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: theme.colors.textMuted }} />
                      <Input placeholder="+91 98765 43210" value={secondary.phone}
                        onChange={(e) => handleSecondary("phone", e.target.value)}
                        className="pl-9 rounded-lg text-sm" />
                    </div>
                  </FormField>

                  <FormField label="Email Address" optional>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: theme.colors.textMuted }} />
                      <Input placeholder="guardian@example.com" value={secondary.email}
                        onChange={(e) => handleSecondary("email", e.target.value)}
                        className="pl-9 rounded-lg text-sm" />
                    </div>
                  </FormField>

                 
                </div>

               <div className="mt-5 flex items-center justify-between">
  <span
    className="text-sm font-medium"
    style={{
      color: theme.colors.textPrimary,
    }}
  >
    Mark as primary contact
  </span>

  {/* Toggle Button */}
  <button
    type="button"
    onClick={() =>
      handleSecondary(
        "sameAddress",
        !secondary.sameAddress
      )
    }
    className="relative w-11 h-6 rounded-full transition-all duration-300"
    style={{
      background: secondary.sameAddress
        ? theme.colors.primary
        : theme.colors.border,
    }}
  >
    <span
      className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300"
      style={{
        transform: secondary.sameAddress
          ? "translateX(20px)"
          : "translateX(0px)",
      }}
    />
  </button>
</div>
              </GuardianSection>
            </div>

            {/* ── COMMUNICATION CONSENT ── */}
            <div className="mt-4 rounded-xl p-4"
              style={{ border: `1px solid ${theme.colors.border}`, background: theme.colors.cardBg }}>
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <div
                  onClick={() => setFormData((prev) => ({ ...prev, consent: !prev.consent }))}
                  className="w-5 h-5 rounded mt-0.5 flex items-center justify-center shrink-0 transition-colors"
                  style={{
                    background: consent ? theme.colors.primary : "#fff",
                    border: `2px solid ${consent ? theme.colors.primary : theme.colors.border}`,
                  }}
                >
                  {consent && (
                    <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                      <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: theme.colors.textPrimary }}>
                    Communication Consent
                  </p>
                  <p className="text-sm mt-0.5" style={{ color: theme.colors.textMuted }}>
                    I agree to receive academic updates, fee reminders, and emergency notifications via SMS and Email for this student.
                  </p>
                </div>
              </label>
            </div>

          </CardContent>
        </Card>

        {/* FOOTER */}
        <div className="flex justify-between items-center mt-6">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2"
            style={{ color: theme.colors.textSecondary }}>
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>

          <div className="flex items-center gap-3">
         
            <Button onClick={handleNext}
              className="text-white font-semibold px-6 py-2.5 rounded-xl flex items-center gap-2"
              style={{ background: theme.colors.primary }}>
              Next Step <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════
//  Collapsible Guardian Section
// ════════════════════════════════════════════════════════════════════
const GuardianSection = ({ number, title, optional, badge, badgeColor, isOpen, onToggle, muted, children }) => (
  <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${theme.colors.border}` }}>
    {/* Header row */}
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between px-5 py-4 transition-colors"
      style={{ background: theme.colors.cardBg }}
    >
      <div className="flex items-center gap-3">
        {/* Number badge */}
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
          style={{
            background: muted ? theme.colors.border : theme.colors.primary,
            color: muted ? theme.colors.textMuted : "#fff",
          }}
        >
          {number}
        </div>
        <span className="text-sm font-semibold" style={{ color: theme.colors.textPrimary }}>
          {title}
          {optional && (
            <span className="ml-1 font-normal" style={{ color: theme.colors.textMuted }}>(Optional)</span>
          )}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {badge && (
          <span className="text-xs font-semibold" style={{ color: badgeColor }}>
            {badge}
          </span>
        )}
        {isOpen
          ? <ChevronUp className="w-4 h-4" style={{ color: theme.colors.textMuted }} />
          : <ChevronDown className="w-4 h-4" style={{ color: theme.colors.textMuted }} />
        }
      </div>
    </button>

    {/* Collapsible body */}
    {isOpen && (
      <div className="px-5 pb-5" style={{ borderTop: `1px solid ${theme.colors.border}` }}>
        {children}
      </div>
    )}
  </div>
);

// ── Shared helpers ────────────────────────────────────────────────
const FormField = ({ label, required, optional, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <Label className="text-xs font-semibold" style={{ color: theme.colors.textPrimary }}>
      {label}{" "}
      {required && <span style={{ color: "#ef4444" }}>*</span>}
      {optional && <span style={{ color: "#9ca3af", fontWeight: 400, fontSize: "0.75rem" }}>(Optional)</span>}
    </Label>
    {children}
    {error && <ErrorMsg msg={error} />}
  </div>
);

const ErrorMsg = ({ msg }) => (
  <div className="flex items-center gap-1.5 text-xs mt-1" style={{ color: "#ef4444" }}>
    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
    <span>{msg}</span>
  </div>
);

export default GuardianDetails;
