import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { AlertCircle, Check, Mail, Phone, X } from "lucide-react";
import { theme } from "../../../../theme/theme";

const RELATIONSHIPS = [
  "Father", "Mother", "Brother", "Sister",
  "Uncle", "Aunt", "Grandfather", "Grandmother", "Legal Guardian", "Other",
];

const ID_TYPES = [
  "Passport", "Driver's License", "National ID", "Aadhaar Card",
  "PAN Card", "Voter ID", "Other",
];

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

const FormField = ({ label, required, optional, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <Label className="text-xs font-semibold" style={{ color: theme.colors.textPrimary }}>
      {label}{" "}
      {required && <span style={{ color: "#ef4444" }}>*</span>}
      {optional && (
        <span style={{ color: "#9ca3af", fontWeight: 400, fontSize: "0.75rem" }}>
          (Optional)
        </span>
      )}
    </Label>
    {children}
    {error && (
      <div className="flex items-center gap-1.5 text-xs mt-1" style={{ color: "#ef4444" }}>
        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
        <span>{error}</span>
      </div>
    )}
  </div>
);

const AddGuardianModal = ({ open, onOpenChange, onSave }) => {
  const [guardian, setGuardian] = useState(emptyGuardian());
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setGuardian((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!guardian.name.trim()) e.name = "Guardian name is required";
    if (!guardian.relationship) e.relationship = "Relationship is required";
    if (!guardian.phone.trim()) e.phone = "Phone number is required";
    return e;
  };

  const handleClose = () => {
    setGuardian(emptyGuardian());
    setErrors({});
    onOpenChange?.(false);
  };

  const handleSave = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSave?.(guardian);
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? onOpenChange?.(true) : handleClose())}>
      <style>{`
        .ag-scroll::-webkit-scrollbar { width: 8px; }
        .ag-scroll::-webkit-scrollbar-track { background: transparent; }
        .ag-scroll::-webkit-scrollbar-thumb {
          background-color: ${theme.colors.border};
          border-radius: 999px;
        }
        .ag-scroll:hover::-webkit-scrollbar-thumb { background-color: ${theme.colors.primary}; }
        .ag-scroll { scrollbar-width: thin; scrollbar-color: ${theme.colors.border} transparent; }
      `}</style>

      <DialogContent
        className="max-w-2xl p-0 gap-0 overflow-hidden rounded-[18px] max-h-[90vh] flex flex-col z-[100]"
        style={{ fontFamily: theme.typography.fontFamily }}
      >
        {/* Header - fixed */}
        <DialogHeader
          className="px-6 py-5 border-b shrink-0"
          style={{ borderColor: theme.colors.border }}
        >
          <DialogTitle className={theme.typography.h3} style={{ color: theme.colors.textPrimary }}>
            Add Guardian
          </DialogTitle>
          <p className={theme.typography.body} style={{ color: theme.colors.textSecondary }}>
            Add primary or secondary guardian details.
          </p>
        </DialogHeader>

        {/* Body - scrollable */}
        <div className="ag-scroll flex-1 min-h-0 overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label="Guardian Name" required error={errors.name}>
              <Input
                placeholder="e.g. John Doe"
                value={guardian.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={`rounded-lg text-sm ${errors.name ? "border-red-400" : ""}`}
              />
            </FormField>

            <FormField label="Relationship" required error={errors.relationship}>
              <Select
                value={guardian.relationship}
                onValueChange={(v) => handleChange("relationship", v)}
              >
                <SelectTrigger className={`rounded-lg text-sm ${errors.relationship ? "border-red-400" : ""}`}>
                  <SelectValue placeholder="Select Relationship" />
                </SelectTrigger>
                <SelectContent>
                  {RELATIONSHIPS.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Phone Number" required error={errors.phone}>
              <div className="relative">
                <Phone
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: theme.colors.textMuted }}
                />
                <Input
                  placeholder="+91 9876543210"
                  value={guardian.phone}
                  maxLength={10}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className={`pl-9 rounded-lg text-sm ${errors.phone ? "border-red-400" : ""}`}
                />
              </div>
            </FormField>

            <FormField label="Email Address" optional>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: theme.colors.textMuted }}
                />
                <Input
                  placeholder="guardian@example.com"
                  value={guardian.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="pl-9 rounded-lg text-sm"
                />
              </div>
            </FormField>

            <FormField label="Occupation">
              <Input
                placeholder="e.g. Software Engineer"
                value={guardian.occupation}
                onChange={(e) => handleChange("occupation", e.target.value)}
                className="rounded-lg text-sm"
              />
            </FormField>

            <FormField label="Employer / Company">
              <Input
                placeholder="e.g. Acme Corp"
                value={guardian.employer}
                onChange={(e) => handleChange("employer", e.target.value)}
                className="rounded-lg text-sm"
              />
            </FormField>

            <FormField label="ID Proof Type" optional>
              <Select value={guardian.idType} onValueChange={(v) => handleChange("idType", v)}>
                <SelectTrigger className="rounded-lg text-sm">
                  <SelectValue placeholder="Select ID Type" />
                </SelectTrigger>
                <SelectContent>
                  {ID_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="ID Number">
              <Input
                placeholder="ID Number"
                value={guardian.idNumber}
                onChange={(e) => handleChange("idNumber", e.target.value)}
                className="rounded-lg text-sm"
              />
            </FormField>
          </div>

          {/* Same Address Checkbox */}
          <div className="mt-5">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div
                onClick={() => handleChange("sameAddress", !guardian.sameAddress)}
                className="w-5 h-5 rounded flex items-center justify-center shrink-0 transition-colors"
                style={{
                  background: guardian.sameAddress ? theme.colors.primary : "#fff",
                  border: `2px solid ${guardian.sameAddress ? theme.colors.primary : theme.colors.border}`,
                }}
              >
                {guardian.sameAddress && (
                  <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                    <path
                      d="M1 4L4 7L10 1"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <span className="text-sm" style={{ color: theme.colors.textPrimary }}>
                Address is same as student's residential address
              </span>
            </label>
          </div>
        </div>

        {/* Footer - fixed */}
        <DialogFooter
          className="px-6 pt-5 pb-4 border-t flex-row justify-end gap-3 shrink-0"
          style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.surface }}
        >
          <Button
            variant="outline"
            onClick={handleClose}
            className="rounded-[10px] h-10"
            style={{ borderColor: theme.colors.border, color: theme.colors.textPrimary }}
          >
            <X className="h-4 w-4 mr-1.5" />
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="rounded-[10px] h-10 text-white"
            style={{ backgroundColor: theme.colors.primary }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.colors.primaryHover)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = theme.colors.primary)}
          >
            <Check className="h-4 w-4 mr-1.5" />
            Save Guardian
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddGuardianModal;