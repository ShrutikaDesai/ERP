import React, { useState } from "react";

import { theme } from "@/theme/theme";
import { CalendarDays } from "lucide-react";

const AddExamModal = ({ open, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    examName: "",
    grade: "",
    subject: "",
    date: "",
    time: "",
    status: "Upcoming",
    marks: "",
  });

  if (!open) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    if (
      !formData.examName ||
      !formData.grade ||
      !formData.subject ||
      !formData.date ||
      !formData.time ||
      !formData.marks
    ) {
      return;
    }

    onAdd({
      ...formData,
      marks: Number(formData.marks),
    });

    setFormData({
      examName: "",
      grade: "",
      subject: "",
      date: "",
      time: "",
      status: "Upcoming",
      marks: "",
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        className="w-full max-w-2xl p-6"
        style={{
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radius.lg,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-2xl font-bold"
            style={{
              color: theme.colors.textPrimary,
            }}
          >
            Add Exam
          </h2>

          <button onClick={onClose} className="text-xl">
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Exam Name"
            value={formData.examName}
            onChange={(e) => handleChange("examName", e.target.value)}
            className="border rounded-xl px-4 py-3 outline-none"
          />

          <select
            value={formData.grade}
            onChange={(e) => handleChange("grade", e.target.value)}
            className="border rounded-xl px-4 py-3 outline-none"
          >
            <option value="">Select Grade</option>

            <option>Grade 1</option>

            <option>Grade 5</option>

            <option>Grade 8</option>

            <option>Grade 10</option>
          </select>

          <input
            type="text"
            placeholder="Subject"
            value={formData.subject}
            onChange={(e) => handleChange("subject", e.target.value)}
            className="border rounded-xl px-4 py-3 outline-none"
          />

          <input
            type="number"
            placeholder="Marks"
            value={formData.marks}
            onChange={(e) => handleChange("marks", e.target.value)}
            className="border rounded-xl px-4 py-3 outline-none"
          />

          <div className="relative">
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
              className="w-full border rounded-xl px-4 py-3 pr-10 outline-none"
            />

            <CalendarDays
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>

          <input
            type="text"
            placeholder="Time"
            value={formData.time}
            onChange={(e) => handleChange("time", e.target.value)}
            className="border rounded-xl px-4 py-3 outline-none"
          />

          <select
            value={formData.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="border rounded-xl px-4 py-3 outline-none md:col-span-2"
          >
            <option>Upcoming</option>

            <option>Completed</option>

            <option>Pending</option>
          </select>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="border rounded-xl px-5 py-2">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="text-white rounded-xl px-5 py-2"
            style={{
              backgroundColor: theme.colors.primary,
            }}
          >
            Add Exam
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddExamModal;
