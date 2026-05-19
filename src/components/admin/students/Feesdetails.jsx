import React, { useState, useEffect } from "react";
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
  CheckCircle2,
  CalendarDays,
  Plus,
  Check,
} from "lucide-react";
import { theme } from "../../../theme/theme";
import { useNavigate } from "react-router-dom";

const STEPS = ["Basic Info", "Contact", "Guardian", "Fees"];

const ACADEMIC_YEARS = ["2023 - 2024", "2024 - 2025", "2025 - 2026"];
const FEE_GROUPS = [
  "Standard Grade 1",
  "Standard Grade 2",
  "Standard Grade 3",
  "Standard Grade 4",
  "Standard Grade 5",
  "Standard Grade 6",
  "Standard Grade 7",
  "Standard Grade 8",
  "Standard Grade 9",
  "Standard Grade 10",
];
const DISCOUNTS = [
  "No Discount",
  "Sibling Discount (10%)",
  "Merit Scholarship (15%)",
  "Need-based Aid (20%)",
  "Staff Ward (25%)",
];
const ADDONS = [
  "None",
  "Transport Only (+$500)",
  "Hostel Only (+$1,200)",
  "Transport + Hostel (+$1,700)",
];

const BASE_FEE = 4500;

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
  if (match) return (base * parseInt(match[1])) / 100;
  return 0;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
};

const emptyInstallment = (name = "", date = "", amount = 0) => ({
  id: Date.now() + Math.random(),
  name,
  dueDate: date,
  amount,
  status: "Planned",
});

// ════════════════════════════════════════════════════════════════════
const FeesDetails = ({
  onBack,
  onNext,
  isEditMode,
  formData,
  setFormData,
}) => {
    const navigate = useNavigate();
  const currentStep = 3;
  const progressPercent = ((currentStep + 1) / STEPS.length) * 100;

  const [errors, setErrors] = useState({});
  const { academicYear, feeGroup, discount, addon, installments } = formData;
  const addonAmt = getAddonAmount(addon);
  const discountAmt = getDiscountAmount(discount, BASE_FEE + addonAmt);
  const netPayable = BASE_FEE + addonAmt - discountAmt;
  const allocatedTotal = installments.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0);
  const totalsMatch = Math.abs(allocatedTotal - netPayable) < 0.01;

  // Auto-split: divide netPayable equally across 3 installments
  const handleAutoSplit = () => {
    const count = 3;
    const base = Math.floor((netPayable / count) * 100) / 100;
    const remainder = parseFloat((netPayable - base * (count - 1)).toFixed(2));
    const dates = ["2024-08-01", "2024-12-01", "2025-04-01"];
    const names = ["Term 1 Fee", "Term 2 Fee", "Term 3 Fee"];
    setFormData((prev) => ({
      ...prev,
      installments:
      Array.from({ length: count }, (_, i) =>
        emptyInstallment(names[i], dates[i], i === count - 1 ? remainder : base)
      ),
    }));
  };

  const handleAddRow = () => {
    setFormData((prev) => ({
      ...prev,
      installments: [...prev.installments, emptyInstallment(`Installment ${prev.installments.length + 1}`, "", 0)],
    }));
  };

  const handleRowChange = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      installments: prev.installments.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    }));
  };

const handleNext = () => {
  setErrors({});

  if (onNext) {
    onNext();
    return;
  }

  navigate("/s-admin/review-admission");
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
          {isEditMode ? "Update the student's fees setup below." : "Register new students and manage admission records."}
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
            <div
              key={i}
              className="h-1.5 rounded-full"
              style={{ background: i <= currentStep ? theme.colors.primary : theme.colors.border }}
            />
          ))}
        </div>

        {/* STEP LABELS */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {STEPS.map((label, i) => (
            <span
              key={i}
              className="text-xs text-center font-medium"
              style={{ color: i === currentStep ? theme.colors.primary : theme.colors.textMuted }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* CARD */}
        <Card
          className="rounded-2xl"
          style={{
            background: theme.colors.cardBg,
            border: `1px solid ${theme.colors.border}`,
            boxShadow: theme.shadow?.card,
          }}
        >
          <CardContent className="p-7">
            {/* CARD HEADER */}
            <div className="pb-5 mb-6" style={{ borderBottom: `1px solid ${theme.colors.border}` }}>
              <h2 className="text-base font-bold" style={{ color: theme.colors.textPrimary }}>
                Fees Plan Configuration
              </h2>
              <p className="text-sm mt-1" style={{ color: theme.colors.textMuted }}>
                Set up the academic year fees and installment plan.
              </p>
            </div>

            {/* ROW 1: Academic Year + Fee Group */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <FormField label="Academic Year" required error={errors.academicYear}>
                <Select value={academicYear} onValueChange={(value) => setFormData((prev) => ({ ...prev, academicYear: value }))}>
                  <SelectTrigger className={`rounded-lg text-sm ${errors.academicYear ? "border-red-400" : ""}`}>
                    <SelectValue placeholder="Select Academic Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACADEMIC_YEARS.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Fee Group" required error={errors.feeGroup}>
                <Select value={feeGroup} onValueChange={(value) => setFormData((prev) => ({ ...prev, feeGroup: value }))}>
                  <SelectTrigger className={`rounded-lg text-sm ${errors.feeGroup ? "border-red-400" : ""}`}>
                    <SelectValue placeholder="Select Fee Group" />
                  </SelectTrigger>
                  <SelectContent>
                    {FEE_GROUPS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormField>
            </div>

            {/* ROW 2: Discount + Add-ons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-7">
              <FormField label="Discount / Scholarship">
                <Select value={discount} onValueChange={(value) => setFormData((prev) => ({ ...prev, discount: value }))}>
                  <SelectTrigger className="rounded-lg text-sm">
                    <SelectValue placeholder="Select Discount" />
                  </SelectTrigger>
                  <SelectContent>
                    {DISCOUNTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Add-ons (Transport/Hostel)">
                <Select value={addon} onValueChange={(value) => setFormData((prev) => ({ ...prev, addon: value }))}>
                  <SelectTrigger className="rounded-lg text-sm">
                    <SelectValue placeholder="Select Add-on" />
                  </SelectTrigger>
                  <SelectContent>
                    {ADDONS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormField>
            </div>

            {/* INSTALLMENT PLAN TABLE */}
            <div
              className="rounded-xl overflow-hidden mb-5"
              style={{ border: `1px solid ${theme.colors.border}` }}
            >
              {/* Table header row */}
              <div
                className="flex items-center justify-between px-5 py-3.5"
                style={{ borderBottom: `1px solid ${theme.colors.border}` }}
              >
                <span className="text-sm font-bold" style={{ color: theme.colors.textPrimary }}>
                  Installment Plan
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAutoSplit}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                    style={{
                      color: theme.colors.primary,
                      background: `${theme.colors.primary}15`,
                      border: `1px solid ${theme.colors.primary}30`,
                    }}
                  >
                    Auto-Split (3)
                  </button>
                  <button
                    type="button"
                    onClick={handleAddRow}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                    style={{
                      color: theme.colors.textPrimary,
                      background: theme.colors.background,
                      border: `1px solid ${theme.colors.border}`,
                    }}
                  >
                    <Plus className="w-3 h-3" /> Add Row
                  </button>
                </div>
              </div>

              {/* Column headers */}
              <div
                className="grid px-5 py-2.5"
                style={{
                  gridTemplateColumns: "2fr 1.6fr 1.4fr 1fr",
                  background: theme.colors.background,
                  borderBottom: `1px solid ${theme.colors.border}`,
                }}
              >
                {["INSTALLMENT NAME", "DUE DATE", "AMOUNT", "STATUS"].map((h) => (
                  <span key={h} className="text-[10px] font-bold tracking-wide" style={{ color: theme.colors.textMuted }}>
                    {h}
                  </span>
                ))}
              </div>

              {/* Rows */}
              {installments.map((row, idx) => (
                <div
                  key={row.id}
                  className="grid items-center px-5 py-3"
                  style={{
                    gridTemplateColumns: "2fr 1.6fr 1.4fr 1fr",
                    borderBottom: idx < installments.length - 1 ? `1px solid ${theme.colors.border}` : "none",
                  }}
                >
                  {/* Name */}
                  <Input
                    value={row.name}
                    onChange={(e) => handleRowChange(row.id, "name", e.target.value)}
                    className="rounded-lg text-sm h-8 border-0 bg-transparent p-0 focus:ring-0 focus-visible:ring-0"
                    style={{ color: theme.colors.textPrimary, boxShadow: "none" }}
                  />

                  {/* Due Date */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm" style={{ color: theme.colors.textPrimary }}>
                      {row.dueDate
                        ? new Date(row.dueDate).toLocaleDateString("en-US", {
                            month: "2-digit",
                            day: "2-digit",
                            year: "numeric",
                          })
                        : "—"}
                    </span>
                    <label className="cursor-pointer">
                      <CalendarDays className="w-4 h-4" style={{ color: theme.colors.textMuted }} />
                      <input
                        type="date"
                        className="hidden"
                        value={row.dueDate}
                        onChange={(e) => handleRowChange(row.id, "dueDate", e.target.value)}
                      />
                    </label>
                  </div>

                  {/* Amount */}
                  <div className="flex items-center gap-1">
                    <span className="text-sm" style={{ color: theme.colors.textMuted }}>$</span>
                    <Input
                      type="number"
                      value={row.amount}
                      onChange={(e) => handleRowChange(row.id, "amount", e.target.value)}
                      className="rounded-lg text-sm h-8 w-24 text-right"
                      style={{ color: theme.colors.textPrimary }}
                    />
                  </div>

                  {/* Status */}
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg w-fit"
                    style={{
                      background: `${theme.colors.primary}12`,
                      color: theme.colors.primary,
                      border: `1px solid ${theme.colors.primary}25`,
                    }}
                  >
                    Planned
                  </span>
                </div>
              ))}

              {/* Allocated Total row */}
              <div
                className="flex items-center justify-end gap-3 px-5 py-3.5"
                style={{ borderTop: `1px solid ${theme.colors.border}`, background: theme.colors.background }}
              >
                <span className="text-sm" style={{ color: theme.colors.textMuted }}>Allocated Total:</span>
                <span className="text-sm font-bold" style={{ color: theme.colors.textPrimary }}>
                  ${allocatedTotal.toFixed(2)}
                </span>
              </div>

              {/* Match / mismatch banner */}
              <div
                className="flex items-center gap-2 px-5 py-3"
                style={{
                  background: totalsMatch ? "#f0fdf4" : "#fef2f2",
                  borderTop: `1px solid ${totalsMatch ? "#bbf7d0" : "#fecaca"}`,
                }}
              >
                {totalsMatch ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "#16a34a" }} />
                    <span className="text-sm font-medium" style={{ color: "#16a34a" }}>
                      Installment totals match the Net Payable amount.
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 shrink-0" style={{ color: "#dc2626" }} />
                    <span className="text-sm font-medium" style={{ color: "#dc2626" }}>
                      Installment totals (${allocatedTotal.toFixed(2)}) do not match Net Payable (${netPayable.toFixed(2)}).
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* FINANCIAL SUMMARY */}
            <div
              className="rounded-xl p-5"
              style={{ border: `1px solid ${theme.colors.border}`, background: theme.colors.cardBg }}
            >
              <h3 className="text-sm font-bold mb-4" style={{ color: theme.colors.textPrimary }}>
                Financial Summary
              </h3>
              <div className="flex flex-col gap-3">
                <SummaryRow label="Base Tuition Fee" value={`$${BASE_FEE.toFixed(2)}`} />
                <SummaryRow label="Add-ons Total" value={`$${addonAmt.toFixed(2)}`} />
                <SummaryRow
                  label="Discount Applied"
                  value={`-$${discountAmt.toFixed(2)}`}
                  valueColor="#16a34a"
                  labelColor="#16a34a"
                />
                <div
                  className="flex justify-between items-center pt-3 mt-1"
                  style={{ borderTop: `1px solid ${theme.colors.border}` }}
                >
                  <span className="text-sm font-bold" style={{ color: theme.colors.textPrimary }}>
                    Net Payable
                  </span>
                  <span className="text-base font-bold" style={{ color: theme.colors.primary }}>
                    ${netPayable.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* FOOTER */}
        <div className="flex justify-between items-center mt-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2"
            style={{ color: theme.colors.textSecondary }}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>

          <div className="flex items-center gap-3">
          
            <Button
              onClick={handleNext}
              className="text-white font-semibold px-6 py-2.5 rounded-xl flex items-center gap-2"
              style={{ background: theme.colors.primary }}
            >
              Review Admission <Check className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

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

const SummaryRow = ({ label, value, labelColor, valueColor }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm" style={{ color: labelColor || theme.colors.textSecondary }}>
      {label}
    </span>
    <span className="text-sm font-medium" style={{ color: valueColor || theme.colors.textPrimary }}>
      {value}
    </span>
  </div>
);

export default FeesDetails;
