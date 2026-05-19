import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ArrowRight, Camera } from "lucide-react";
import { theme } from "../../../theme/theme";

import ContactDetails  from "./ContactDetails";
import GuardianDetails from "./Guardiandetails ";
import FeesDetails     from "./FeesDetails";
import ReviewAdmission from "./ReviewAdmission";

const STEPS = ["Basic Info", "Contact", "Guardian", "Fees"];

// ─── Default / empty form states ────────────────────────────────────
const defaultBasic = {
  firstName: "", lastName: "", gender: "", dob: "",
  admissionDate: "", grade: "", section: "", previousSchool: "", photo: null,
};
const defaultContact = {
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  zip: "",
  country: "United States",
  studentEmail: "",
  studentPhone: "",
  emergencyName: "",
  emergencyPhone: "",
  commPref: "email",
};
const defaultGuardianPerson = {
  name: "",
  relationship: "",
  phone: "",
  email: "",
  occupation: "",
  employer: "",
  idType: "",
  idNumber: "",
  sameAddress: false,
};
const defaultGuardian = {
  primary: { ...defaultGuardianPerson },
  secondary: { ...defaultGuardianPerson },
  consent: false,
};
const defaultFees = {
  academicYear: "2024 - 2025",
  feeGroup: "Standard Grade 10",
  discount: "No Discount",
  addon: "None",
  installments: [
    { id: 1, name: "Term 1 Fee", dueDate: "2024-08-01", amount: 1500, status: "Planned" },
    { id: 2, name: "Term 2 Fee", dueDate: "2024-12-01", amount: 1500, status: "Planned" },
    { id: 3, name: "Term 3 Fee", dueDate: "2025-04-01", amount: 1500, status: "Planned" },
  ],
};

// ════════════════════════════════════════════════════════════════════
//  Root controller  –  owns ALL shared state
// ════════════════════════════════════════════════════════════════════
const AddStudent = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);

  // ── Lifted form data (add more slices as ContactDetails / GuardianDetails expose their state) ──
  const [basicData, setBasicData] = useState(defaultBasic);
  const [contactData, setContactData] = useState(defaultContact);
  const [guardianData, setGuardianData] = useState(defaultGuardian);
  const [feesData, setFeesData] = useState(defaultFees);

  const goNext   = () => setCurrentStep((s) => Math.min(s + 1, STEPS.length));
  const goBack   = () => setCurrentStep((s) => Math.max(s - 1, 0));
  const goToStep = (step) => {
    setIsEditMode(true);
    setCurrentStep(step);
  };

  if (currentStep === 1) {
    return (
      <ContactDetails
        onBack={goBack}
        onNext={goNext}
        isEditMode={isEditMode}
        formData={contactData}
        setFormData={setContactData}
      />
    );
  }
  if (currentStep === 2) {
    return (
      <GuardianDetails
        onBack={goBack}
        onNext={goNext}
        isEditMode={isEditMode}
        formData={guardianData}
        setFormData={setGuardianData}
      />
    );
  }
  if (currentStep === 3) {
    return (
      <FeesDetails
        onBack={goBack}
        onNext={goNext}
        isEditMode={isEditMode}
        formData={feesData}
        setFormData={setFeesData}
      />
    );
  }
  if (currentStep === 4)
    return (
      <ReviewAdmission
        basicData={basicData}
        contactData={contactData}
        guardianData={guardianData}
        feesData={feesData}
        onBack={goBack}
        onConfirm={() => {}}
        onEditBasic={()    => goToStep(0)}
        onEditContact={()  => goToStep(1)}
        onEditGuardian={() => goToStep(2)}
        onEditFees={()     => goToStep(3)}
      />
    );

  // Step 0 — pass data + setter so BasicInfo can read & update shared state
  return (
    <BasicInfo
      onNext={goNext}
      isEditMode={isEditMode}
      formData={basicData}
      setFormData={setBasicData}
    />
  );
};

// ════════════════════════════════════════════════════════════════════
//  Step 1 – Basic Info   (now receives prefilled formData + setter)
// ════════════════════════════════════════════════════════════════════
const BasicInfo = ({ onNext, isEditMode, formData, setFormData }) => {
  const currentStep    = 0;
  const progressPercent = ((currentStep + 1) / STEPS.length) * 100;

  // local errors only — data lives in parent
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) handleChange("photo", URL.createObjectURL(file));
  };

  const validate = () => {
    const e = {};
    if (!formData.firstName.trim())  e.firstName    = "First name is required";
    if (!formData.lastName.trim())   e.lastName     = "Last name is required";
    if (!formData.gender)            e.gender       = "Gender is required";
    if (!formData.dob)               e.dob          = "Date of birth is required";
    if (!formData.admissionDate)     e.admissionDate = "Admission date is required";
    if (!formData.grade)             e.grade        = "Grade is required";
    if (!formData.section)           e.section      = "Section is required";
    return e;
  };

  const handleNext = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setErrors({});
    onNext();
  };

  return (
    <div
      className="min-h-screen flex flex-col py-10 px-4"
      style={{ background: theme.colors.background, fontFamily: theme.typography.fontFamily, padding: theme.layout?.contentPadding }}
    >
      <div className="w-full max-w-5xl">
        <div className="flex flex-col gap-2 mb-6">
          {/* Title changes based on mode */}
          <h1 style={{ fontSize: "1.7rem", fontWeight: 700, color: theme.colors.textPrimary, margin: 0 }}>
            {isEditMode ? "Edit Student" : "Add Student"}
          </h1>
          <p className="text-sm" style={{ color: theme.colors.textSecondary, margin: 0 }}>
            {isEditMode
              ? "Update the student's basic information below."
              : "Register new students and manage admission records."}
          </p>
        </div>
      </div>

      <div className="w-full max-w-3xl mx-auto">
        {/* Step header */}
        <div className="flex justify-between items-center mb-3 w-full max-w-2xl mx-auto">
          <h3 className="text-lg font-bold" style={{ color: theme.colors.textPrimary }}>
            Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep]}
          </h3>
          <span className="text-sm font-medium" style={{ color: theme.colors.textSecondary }}>
            {progressPercent}% Completed
          </span>
        </div>

        {/* Progress bar */}
        <div className="grid grid-cols-4 gap-1.5 mb-1.5 w-full max-w-2xl mx-auto">
          {STEPS.map((_, i) => (
            <div key={i} className="h-1.5 rounded-full transition-colors duration-300"
              style={{ background: i <= currentStep ? theme.colors.primary : theme.colors.border }} />
          ))}
        </div>

        {/* Step labels */}
        <div className="grid grid-cols-4 gap-1.5 mb-6 w-full max-w-2xl mx-auto">
          {STEPS.map((label, i) => (
            <span key={i} className="text-xs text-center font-medium"
              style={{ color: i === currentStep ? theme.colors.primary : theme.colors.textMuted }}>
              {label}
            </span>
          ))}
        </div>

        <Card className="rounded-2xl w-full max-w-2xl mx-auto"
          style={{ background: theme.colors.cardBg, border: `1px solid ${theme.colors.border}`, boxShadow: theme.shadow?.card }}>
          <CardContent className="p-7">
            <div className="flex justify-between items-start pb-5 mb-6"
              style={{ borderBottom: `1px solid ${theme.colors.border}` }}>
              <div>
                <h2 className="text-base font-bold" style={{ color: theme.colors.textPrimary }}>
                  Student Details
                </h2>
                <p className="text-sm mt-0.5" style={{ color: theme.colors.textMuted }}>
                  {isEditMode ? "Edit the primary information for the student." : "Provide the primary information for the student."}
                </p>
              </div>

              {/* Photo upload */}
              <label className="flex flex-col items-center gap-1.5 cursor-pointer group">
                <div className="w-16 h-16 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden transition-colors"
                  style={{ borderColor: theme.colors.border, background: theme.colors.background }}>
                  {formData.photo
                    ? <img src={formData.photo} alt="Student" className="w-full h-full object-cover" />
                    : <Camera className="w-5 h-5" color={theme.colors.textMuted} />}
                </div>
                <span className="text-[11px]" style={{ color: theme.colors.textMuted }}>
                  {formData.photo ? "Change Photo" : "Upload Photo (Opt)"}
                </span>
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
              <FormField label="First Name" required error={errors.firstName}>
                <Input placeholder="e.g. John" value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  className={`rounded-lg text-sm ${errors.firstName ? "border-red-400" : ""}`} />
              </FormField>

              <FormField label="Last Name" required error={errors.lastName}>
                <Input placeholder="e.g. Doe" value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  className={`rounded-lg text-sm ${errors.lastName ? "border-red-400" : ""}`} />
              </FormField>

              <FormField label="Gender" required error={errors.gender}>
                <Select value={formData.gender} onValueChange={(v) => handleChange("gender", v)}>
                  <SelectTrigger className={`rounded-lg text-sm ${errors.gender ? "border-red-400" : ""}`}>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Date of Birth" required error={errors.dob}>
                <Input type="date" value={formData.dob}
                  onChange={(e) => handleChange("dob", e.target.value)}
                  className={`rounded-lg text-sm ${errors.dob ? "border-red-400" : ""}`} />
              </FormField>

              <FormField label="Admission Date" required error={errors.admissionDate}>
                <Input type="date" value={formData.admissionDate}
                  onChange={(e) => handleChange("admissionDate", e.target.value)}
                  className={`rounded-lg text-sm ${errors.admissionDate ? "border-red-400" : ""}`} />
              </FormField>

              <FormField label="Grade / Class" required error={errors.grade}>
                <Select value={formData.grade} onValueChange={(v) => handleChange("grade", v)}>
                  <SelectTrigger className={`rounded-lg text-sm ${errors.grade ? "border-red-400" : ""}`}>
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => (
                      <SelectItem key={i + 1} value={`grade-${i + 1}`}>Grade {i + 1}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Section" required error={errors.section}>
                <Select value={formData.section} onValueChange={(v) => handleChange("section", v)}>
                  <SelectTrigger className={`rounded-lg text-sm ${errors.section ? "border-red-400" : ""}`}>
                    <SelectValue placeholder="Select Section" />
                  </SelectTrigger>
                  <SelectContent>
                    {["A", "B", "C", "D"].map((s) => (
                      <SelectItem key={s} value={s}>Section {s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Previous School" optional>
                <Input placeholder="Name of previous institution" value={formData.previousSchool}
                  onChange={(e) => handleChange("previousSchool", e.target.value)}
                  className="rounded-lg text-sm" />
              </FormField>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center mt-6 w-full max-w-2xl mx-auto">
          <Button variant="ghost" style={{ color: theme.colors.textSecondary }}>Cancel</Button>
          <Button onClick={handleNext}
            className="text-white font-semibold px-6 py-2.5 rounded-xl flex items-center gap-2"
            style={{ background: theme.colors.primary }}>
            {isEditMode ? "Save & Continue" : "Next Step"} <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// ── Shared helpers ──────────────────────────────────────────────────
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
  <div className="flex items-center gap-1.5 text-xs mt-0.5" style={{ color: "#ef4444" }}>
    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
    <span>{msg}</span>
  </div>
);

export default AddStudent;
