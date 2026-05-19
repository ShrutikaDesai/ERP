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
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import { theme } from "../../../theme/theme";

const STEPS = [
  "Basic Info",
  "Contact",
  "Guardian",
  "Fees",
];

const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "California",
  "Florida",
  "Georgia",
  "Illinois",
  "New York",
  "Texas",
];

const COUNTRIES = [
  "United States",
  "Canada",
  "India",
  "Australia",
  "Germany",
];

const COMM_OPTIONS = [
  {
    key: "email",
    label: "Email",
    icon: <Mail className="w-4 h-4" />,
  },
  {
    key: "sms",
    label: "SMS",
    icon: <Phone className="w-4 h-4" />,
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    icon: <Phone className="w-4 h-4" />,
  },
];

const ContactDetails = ({
  onBack,
  onNext,
  isEditMode,
  formData,
  setFormData,
}) => {
  const currentStep = 1;

  const progressPercent =
    ((currentStep + 1) /
      STEPS.length) *
    100;

  const [errors, setErrors] =
    useState({});

  const handleChange = (
    field,
    value
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleNext = () => {
    setErrors({});
    onNext?.();
  };

  return (
    <div
      className="min-h-screen py-10"
      style={{
        background:
          theme.colors.background,
        fontFamily:
          theme.typography
            .fontFamily,
        padding:
          theme.layout
            .contentPadding,
      }}
    >
      {/* PAGE HEADER */}
      <div className="w-full max-w-5xl mx-auto mb-6">
        <div className="flex flex-col gap-2">
          <h1
            style={{
              fontSize: "1.7rem",
              fontWeight: 700,
              color:
                theme.colors
                  .textPrimary,
              margin: 0,
            }}
          >
            {isEditMode
              ? "Edit Student"
              : "Add Student"}
          </h1>

          <p
            className="text-sm"
            style={{
              color:
                theme.colors
                  .textSecondary,
              margin: 0,
            }}
          >
            {isEditMode
              ? "Update the student's contact information below."
              : "Register new students and manage admission records."}
          </p>
        </div>
      </div>

      <div className="w-full max-w-3xl mx-auto">
        {/* STEP HEADER */}
        <div className="flex justify-between items-center mb-3">
          <h3
            className="text-lg font-bold"
            style={{
              color:
                theme.colors
                  .textPrimary,
            }}
          >
            Step {currentStep + 1} of{" "}
            {STEPS.length}:{" "}
            {STEPS[currentStep]}
          </h3>

          <span
            className="text-sm font-medium"
            style={{
              color:
                theme.colors
                  .textSecondary,
            }}
          >
            {progressPercent}%
            Completed
          </span>
        </div>

        {/* PROGRESS BAR */}
        <div className="grid grid-cols-4 gap-2 mb-2">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className="h-1.5 rounded-full"
              style={{
                background:
                  i <= currentStep
                    ? theme.colors
                        .primary
                    : theme.colors
                        .border,
              }}
            />
          ))}
        </div>

        {/* STEP LABELS */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {STEPS.map((label, i) => (
            <span
              key={i}
              className="text-xs text-center font-medium"
              style={{
                color:
                  i === currentStep
                    ? theme.colors
                        .primary
                    : theme.colors
                        .textMuted,
              }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* CARD */}
        <Card
          className="rounded-2xl"
          style={{
            background:
              theme.colors.cardBg,
            border: `1px solid ${theme.colors.border}`,
            boxShadow:
              theme.shadow.card,
          }}
        >
          <CardContent className="p-7">
            {/* CARD HEADER */}
            <div
              className="pb-5 mb-6"
              style={{
                borderBottom: `1px solid ${theme.colors.border}`,
              }}
            >
              <h2
                className="text-base font-bold"
                style={{
                  color:
                    theme.colors
                      .textPrimary,
                }}
              >
                Contact Information
              </h2>

              <p
                className="text-sm mt-1"
                style={{
                  color:
                    theme.colors
                      .textMuted,
                }}
              >
                Provide address and
                communication details.
              </p>
            </div>

            {/* ADDRESS */}
            <SectionLabel>
              Residential Address
            </SectionLabel>

            <div className="flex flex-col gap-5 mb-6">
              {/* Address 1 */}
              <div className="flex flex-col gap-1.5">
                <Label
                  className="text-xs font-semibold"
                  style={{
                    color:
                      theme.colors
                        .textPrimary,
                  }}
                >
                  Address Line 1{" "}
                  <Req />
                </Label>

                <div className="relative">
                  <MapPin
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{
                      color:
                        theme.colors
                          .textMuted,
                    }}
                  />

                  <Input
                    placeholder="Enter address"
                    value={
                      formData.addressLine1
                    }
                    onChange={(e) =>
                      handleChange(
                        "addressLine1",
                        e.target.value
                      )
                    }
                    className="pl-9 rounded-lg text-sm"
                    style={{
                      borderColor:
                        errors.addressLine1
                          ? theme.colors
                              .danger
                          : theme.colors
                              .border,
                    }}
                  />
                </div>

                {errors.addressLine1 && (
                  <ErrorMsg
                    msg={
                      errors.addressLine1
                    }
                  />
                )}
              </div>

              {/* Address 2 */}
              <div className="flex flex-col gap-1.5">
                <Label
                  className="text-xs font-semibold"
                  style={{
                    color:
                      theme.colors
                        .textPrimary,
                  }}
                >
                  Address Line 2{" "}
                  <Optional />
                </Label>

                <Input
                  placeholder="Apartment, Suite"
                    value={
                      formData.addressLine2
                    }
                  onChange={(e) =>
                    handleChange(
                      "addressLine2",
                      e.target.value
                    )
                  }
                  className="rounded-lg text-sm"
                />
              </div>

              {/* CITY + STATE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <Label
                    className="text-xs font-semibold"
                    style={{
                      color:
                        theme.colors
                          .textPrimary,
                    }}
                  >
                    City <Req />
                  </Label>

                  <Input
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={(e) =>
                      handleChange(
                        "city",
                        e.target.value
                      )
                    }
                    className="rounded-lg text-sm"
                    style={{
                      borderColor:
                        errors.city
                          ? theme.colors
                              .danger
                          : theme.colors
                              .border,
                    }}
                  />

                  {errors.city && (
                    <ErrorMsg
                      msg={errors.city}
                    />
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label
                    className="text-xs font-semibold"
                    style={{
                      color:
                        theme.colors
                          .textPrimary,
                    }}
                  >
                    State <Req />
                  </Label>

                  <Select
                    value={formData.state}
                    onValueChange={(v) =>
                      handleChange(
                        "state",
                        v
                      )
                    }
                  >
                    <SelectTrigger
                      className="rounded-lg text-sm"
                      style={{
                        borderColor:
                          errors.state
                            ? theme
                                .colors
                                .danger
                            : theme
                                .colors
                                .border,
                      }}
                    >
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>

                    <SelectContent>
                      {US_STATES.map(
                        (state) => (
                          <SelectItem
                            key={state}
                            value={
                              state
                            }
                          >
                            {state}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>

                  {errors.state && (
                    <ErrorMsg
                      msg={
                        errors.state
                      }
                    />
                  )}
                </div>
              </div>

              {/* ZIP + COUNTRY */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <Label
                    className="text-xs font-semibold"
                    style={{
                      color:
                        theme.colors
                          .textPrimary,
                    }}
                  >
                    ZIP Code <Req />
                  </Label>

                  <Input
                    placeholder="ZIP Code"
                    value={formData.zip}
                    onChange={(e) =>
                      handleChange(
                        "zip",
                        e.target.value
                      )
                    }
                    className="rounded-lg text-sm"
                    style={{
                      borderColor:
                        errors.zip
                          ? theme.colors
                              .danger
                          : theme.colors
                              .border,
                    }}
                  />

                  {errors.zip && (
                    <ErrorMsg
                      msg={errors.zip}
                    />
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label
                    className="text-xs font-semibold"
                    style={{
                      color:
                        theme.colors
                          .textPrimary,
                    }}
                  >
                    Country <Req />
                  </Label>

                  <Select
                    value={formData.country}
                    onValueChange={(v) =>
                      handleChange(
                        "country",
                        v
                      )
                    }
                  >
                    <SelectTrigger className="rounded-lg text-sm">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {COUNTRIES.map(
                        (country) => (
                          <SelectItem
                            key={
                              country
                            }
                            value={
                              country
                            }
                          >
                            {country}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* STUDENT CONTACT */}
            <div
              className="pt-5 mb-6"
              style={{
                borderTop: `1px solid ${theme.colors.border}`,
              }}
            >
              <SectionLabel>
                Student Contact
              </SectionLabel>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <Label
                    className="text-xs font-semibold"
                    style={{
                      color:
                        theme.colors
                          .textPrimary,
                    }}
                  >
                    Student Email{" "}
                    <Optional />
                  </Label>

                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                      style={{
                        color:
                          theme.colors
                            .textMuted,
                      }}
                    />

                    <Input
                      placeholder="student@email.com"
                      value={
                      formData.studentEmail
                      }
                      onChange={(e) =>
                        handleChange(
                          "studentEmail",
                          e.target
                            .value
                        )
                      }
                      className="pl-9 rounded-lg text-sm"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <Label
                    className="text-xs font-semibold"
                    style={{
                      color:
                        theme.colors
                          .textPrimary,
                    }}
                  >
                    Student Phone{" "}
                    <Optional />
                  </Label>

                  <div className="relative">
                    <Phone
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                      style={{
                        color:
                          theme.colors
                            .textMuted,
                      }}
                    />

                    <Input
                      placeholder="+91 123456789"
                      value={
                      formData.studentPhone
                      }
                      onChange={(e) =>
                        handleChange(
                          "studentPhone",
                          e.target
                            .value
                        )
                      }
                      className="pl-9 rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* EMERGENCY CONTACT */}
            <div
              className="pt-5"
              style={{
                borderTop: `1px solid ${theme.colors.border}`,
              }}
            >
              <SectionLabel>
                Emergency Contact
              </SectionLabel>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                <div className="flex flex-col gap-1.5">
                  <Label
                    className="text-xs font-semibold"
                    style={{
                      color:
                        theme.colors
                          .textPrimary,
                    }}
                  >
                    Contact Name{" "}
                    <Req />
                  </Label>

                  <Input
                    placeholder="Enter name"
                    value={
                      formData.emergencyName
                    }
                    onChange={(e) =>
                      handleChange(
                        "emergencyName",
                        e.target.value
                      )
                    }
                    className="rounded-lg text-sm"
                  />

                  {errors.emergencyName && (
                    <ErrorMsg
                      msg={
                        errors.emergencyName
                      }
                    />
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label
                    className="text-xs font-semibold"
                    style={{
                      color:
                        theme.colors
                          .textPrimary,
                    }}
                  >
                    Contact Phone{" "}
                    <Req />
                  </Label>

                  <div className="relative">
                    <Phone
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                      style={{
                        color:
                          theme.colors
                            .textMuted,
                      }}
                    />

                    <Input
                      placeholder="+91 123456789"
                      value={
                      formData.emergencyPhone
                      }
                      onChange={(e) =>
                        handleChange(
                          "emergencyPhone",
                          e.target
                            .value
                        )
                      }
                      className="pl-9 rounded-lg text-sm"
                    />
                  </div>

                  {errors.emergencyPhone && (
                    <ErrorMsg
                      msg={
                        errors.emergencyPhone
                      }
                    />
                  )}
                </div>
              </div>
            </div>

            {/* COMMUNICATION */}
            <div
              className="pt-5 mt-6"
              style={{
                borderTop: `1px solid ${theme.colors.border}`,
              }}
            >
              <SectionLabel>
                Communication Preference
              </SectionLabel>

                <p
                className="text-sm mt-1"
                style={{
                  color:
                    theme.colors
                      .textMuted,
                }}
              >
             How would you prefer to receive important updates?
              </p>

                     <div className="flex flex-wrap gap-3 mt-4">
                {COMM_OPTIONS.map(
                  ({
                    key,
                    label,
                    icon,
                  }) => {
                    const active =
                      formData.commPref ===
                      key;

                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() =>
                          handleChange(
                            "commPref",
                            key
                          )
                        }
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all"
                        style={{
                          borderColor:
                            active
                              ? theme
                                  .colors
                                  .primary
                              : theme
                                  .colors
                                  .border,
                          background:
                            active
                              ? theme
                                  .colors
                                  .sidebarActive
                              : theme
                                  .colors
                                  .surface,
                          color:
                            active
                              ? theme
                                  .colors
                                  .primary
                              : theme
                                  .colors
                                  .textSecondary,
                        }}
                      >
                        {icon}
                        {label}
                      </button>
                    );
                  }
                )}
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
            style={{
              color:
                theme.colors
                  .textSecondary,
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex items-center gap-3">
            {/* <Button
              variant="ghost"
              style={{
                color:
                  theme.colors
                    .textSecondary,
              }}
            >
              Cancel
            </Button> */}

            <Button
              onClick={handleNext}
              className="text-white font-semibold px-6 py-2.5 rounded-xl flex items-center gap-2"
              style={{
                background:
                  theme.colors.primary,
              }}
            >
              Next Step
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* HELPERS */

const Req = () => (
  <span
    style={{
      color: theme.colors.danger,
    }}
  >
    *
  </span>
);

const Optional = () => (
  <span
    style={{
      color:
        theme.colors.textMuted,
      fontWeight: 400,
      fontSize: "0.75rem",
    }}
  >
    (Optional)
  </span>
);

const SectionLabel = ({
  children,
}) => (
  <p
    className="text-xs font-bold uppercase mb-1"
    style={{
      color:
        theme.colors.textPrimary,
      letterSpacing: "0.08em",
    }}
  >
    {children}
  </p>
);

const ErrorMsg = ({ msg }) => (
  <div
    className="flex items-center gap-1.5 text-xs mt-1"
    style={{
      color: theme.colors.danger,
    }}
  >
    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
    <span>{msg}</span>
  </div>
);

export default ContactDetails;
