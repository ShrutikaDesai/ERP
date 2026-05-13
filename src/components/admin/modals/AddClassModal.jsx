import React, { useEffect,useState } from "react";

import { X } from "lucide-react";

import { theme } from "../../../theme/theme";

const AddClassModal = ({
  open,
  onClose,
  onSave,
  initialData,
  mode,
}) => {
  const [formData, setFormData] = useState({
    className: "",
    sections: "",
    sectionCount: "",
    students: "",
    capacity: "",
    teacher: "",
    status: "Active",
  });


  useEffect(() => {
  if (initialData) {
    setFormData({
      ...initialData,
      sections:
        initialData.sections?.join(", ") || "",
    });
  }
}, [initialData]);

  if (!open) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

 const handleSubmit = () => {
  const sectionsArray = formData.sections
    .split(",")
    .map((s) => s.trim());

  const updatedClass = {
    ...formData,
    sections: sectionsArray,
    sectionCount: sectionsArray.length,
  };

  onSave(updatedClass);

  onClose();
};

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40"
        style={{
          background:
            theme.colors.drawerOverlay,
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-2xl rounded-3xl overflow-hidden"
          style={{
            background:
              theme.colors.cardBg,
            boxShadow: theme.shadow.modal,
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-5"
            style={{
              borderBottom: `1px solid ${theme.colors.border}`,
            }}
          >
            <div>
              <h2
                className="text-xl font-bold"
                style={{
                  color:
                    theme.colors.textPrimary,
                }}
              >
              {mode === "edit"
  ? "Edit Class"
  : mode === "view"
  ? "View Class"
  : "Add New Class"}
              </h2>

              <p
                className="text-sm mt-1"
                style={{
                  color:
                    theme.colors.textSecondary,
                }}
              >
                Create a new class and assign
                coordinator
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background:
                  theme.colors.background,
              }}
            >
              <X
                size={18}
                color={theme.colors.textPrimary}
              />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Class Name */}
            <div>
              <label
                className="text-sm font-medium block mb-2"
                style={{
                  color:
                    theme.colors.textPrimary,
                }}
              >
                Class Name
              </label>

              <input
                type="text"
                disabled={mode === "view"}
                placeholder="Enter class name"
                value={formData.className}
                onChange={(e) =>
                  handleChange(
                    "className",
                    e.target.value
                  )
                }
                className="w-full h-11 rounded-2xl px-4 outline-none"
                style={{
                  background:
                    theme.colors.background,
                  border: `1px solid ${theme.colors.border}`,
                }}
              />
            </div>

            {/* Coordinator */}
            <div>
              <label
                className="text-sm font-medium block mb-2"
                style={{
                  color:
                    theme.colors.textPrimary,
                }}
              >
                Coordinator
              </label>

              <input
                type="text"
                disabled={mode === "view"}
                placeholder="Enter coordinator"
                value={formData.teacher}
                onChange={(e) =>
                  handleChange(
                    "teacher",
                    e.target.value
                  )
                }
                className="w-full h-11 rounded-2xl px-4 outline-none"
                style={{
                  background:
                    theme.colors.background,
                  border: `1px solid ${theme.colors.border}`,
                }}
              />
            </div>

            {/* Sections */}
            <div>
              <label
                className="text-sm font-medium block mb-2"
                style={{
                  color:
                    theme.colors.textPrimary,
                }}
              >
                Sections
              </label>

              <input
                type="text"
                disabled={mode === "view"}
                placeholder="A, B, C"
                value={formData.sections}
                onChange={(e) =>
                  handleChange(
                    "sections",
                    e.target.value
                  )
                }
                className="w-full h-11 rounded-2xl px-4 outline-none"
                style={{
                  background:
                    theme.colors.background,
                  border: `1px solid ${theme.colors.border}`,
                }}
              />
            </div>

         
            {/* Students */}
            <div>
              <label
                className="text-sm font-medium block mb-2"
                style={{
                  color:
                    theme.colors.textPrimary,
                }}
              >
                Student Count
              </label>

              <input
                type="number"
                disabled={mode === "view"}
                placeholder="Enter students"
                value={formData.students}
                onChange={(e) =>
                  handleChange(
                    "students",
                    e.target.value
                  )
                }
                className="w-full h-11 rounded-2xl px-4 outline-none"
                style={{
                  background:
                    theme.colors.background,
                  border: `1px solid ${theme.colors.border}`,
                }}
              />
            </div>

            {/* Capacity */}
            <div>
              <label
                className="text-sm font-medium block mb-2"
                style={{
                  color:
                    theme.colors.textPrimary,
                }}
              >
                Capacity
              </label>

              <input
                type="number"
                disabled={mode === "view"}
                placeholder="Enter capacity"
                value={formData.capacity}
                onChange={(e) =>
                  handleChange(
                    "capacity",
                    e.target.value
                  )
                }
                className="w-full h-11 rounded-2xl px-4 outline-none"
                style={{
                  background:
                    theme.colors.background,
                  border: `1px solid ${theme.colors.border}`,
                }}
              />
            </div>

          
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-end gap-3 px-6 py-5"
            style={{
              borderTop: `1px solid ${theme.colors.border}`,
            }}
          >
            <button
              onClick={onClose}
              className="px-5 h-11 rounded-2xl text-sm font-medium"
              style={{
                border: `1px solid ${theme.colors.border}`,
                color:
                  theme.colors.textPrimary,
              }}
            >
              Cancel
            </button>

           {mode !== "view" && (
  <button
    onClick={handleSubmit}
    className="px-5 h-11 rounded-2xl text-sm font-semibold text-white"
    style={{
      background: theme.colors.primary,
    }}
  >
    {mode === "edit"
      ? "Update Class"
      : "Save Class"}
  </button>
)}
          </div>
        </div>
      </div>
    </>
  );
};

export default AddClassModal;