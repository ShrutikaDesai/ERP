import React, { useEffect, useState } from "react";

import { ChevronDown, Search, X } from "lucide-react";

import { theme } from "../../../theme/theme";

const AddSectionModal = ({
  open,
  onClose,
  onSave,
  initialData = null,
  mode = "add",
}) => {

    const [openClassDropdown, setOpenClassDropdown] = useState(false);
    const [classSearch, setClassSearch] = useState("");
  const [formData, setFormData] = useState({
    sectionName: "",
    className: "",
    students: "",
    classTeacher: "",
    roomNo: "",
    status: "Active",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  if (!open) return null;

  const isViewMode = mode === "view";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 const handleSubmit = () => {
  const payload = {
    ...formData,
    students: Number(formData.students),
    id: initialData?.id || Date.now(),
  };

  onSave(payload);

  setFormData({
    sectionName: "",
    className: "",
    students: "",
    classTeacher: "",
    roomNo: "",
    status: "Active",
  });

  onClose();
};

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40"
        style={{
          background: theme.colors.drawerOverlay,
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-2xl rounded-3xl overflow-hidden"
          style={{
            background: theme.colors.cardBg,
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
                  color: theme.colors.textPrimary,
                }}
              >
                {mode === "edit"
                  ? "Edit Section"
                  : "Add Section"}
              </h2>

              <p
                className="text-sm mt-1"
                style={{
                  color: theme.colors.textSecondary,
                }}
              >
                Manage section information
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-100"
            >
              <X
                size={18}
                color={theme.colors.textMuted}
              />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Section Name */}
            <div>
              <label
                className="text-sm font-medium mb-2 block"
                style={{
                  color: theme.colors.textPrimary,
                }}
              >
                Section Name
              </label>

              <input
                type="text"
                name="sectionName"
                value={formData.sectionName}
                onChange={handleChange}
                placeholder="Enter section name"
                disabled={isViewMode}
                className="w-full h-11 px-4 rounded-2xl outline-none"
                style={{
                  background:
                    theme.colors.background,
                  border: `1px solid ${theme.colors.border}`,
                  color:
                    theme.colors.textPrimary,
                }}
              />
            </div>

            {/* Class Name */}
           {/* Class Name Search Dropdown */}
<div className="relative">
  <label
    className="text-sm font-medium mb-2 block"
    style={{
      color: theme.colors.textPrimary,
    }}
  >
    Class Name
  </label>

  {/* Selected Input */}
<button
  type="button"
  onClick={() =>
    setOpenClassDropdown(
      !openClassDropdown
    )
  }
  className="w-full h-11 px-4 rounded-2xl flex items-center justify-between text-sm"
  style={{
    background: theme.colors.background,
    border: `1px solid ${theme.colors.border}`,
    color: formData.className
      ? theme.colors.textPrimary
      : theme.colors.textMuted,
  }}
>
  <span>
    {formData.className ||
      "Select Class"}
  </span>

  <div className="flex items-center gap-2">
    {/* Clear Button */}
    {formData.className && (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();

          setFormData({
            ...formData,
            className: "",
          });
        }}
        className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-gray-200 transition-all"
      >
        <X
          size={12}
          color={theme.colors.textMuted}
        />
      </button>
    )}

    <ChevronDown
      size={16}
      color={theme.colors.textMuted}
    />
  </div>
</button>

  {/* Dropdown */}
  {openClassDropdown && (
    <div
      className="absolute top-16 left-0 w-full rounded-2xl z-50 overflow-hidden"
      style={{
        background: theme.colors.cardBg,
        border: `1px solid ${theme.colors.border}`,
        boxShadow: theme.shadow.modal,
      }}
    >
      {/* Search */}
      <div className="p-3 border-b border-gray-200 relative">
        <Search
          size={15}
          className="absolute left-6 top-1/2 -translate-y-1/2"
          color={theme.colors.textMuted}
        />

        <input
          type="text"
          placeholder="Search class..."
          value={classSearch}
          disabled={isViewMode}
          onChange={(e) =>
            setClassSearch(e.target.value)
          }
          className="w-full h-10 pl-10 pr-4 rounded-xl outline-none text-sm"
          style={{
            background:
              theme.colors.background,
            border: `1px solid ${theme.colors.border}`,
            color:
              theme.colors.textPrimary,
          }}
        />
      </div>

      {/* Options */}
      <div className="max-h-52 overflow-y-auto">
        {[
          "5th Standard",
          "6th Standard",
          "7th Standard",
          "8th Standard",
          "9th Standard",
          "10th Standard",
        ]
          .filter((item) =>
            item
              .toLowerCase()
              .includes(
                classSearch.toLowerCase()
              )
          )
          .map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setFormData({
                  ...formData,
                  className: item,
                });

                setOpenClassDropdown(
                  false
                );

                setClassSearch("");
              }}
              className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-all"
              style={{
                color:
                  theme.colors.textPrimary,
              }}
            >
              {item}
            </button>
          ))}
      </div>
    </div>
  )}
</div>

            {/* Students */}
            <div>
              <label
                className="text-sm font-medium mb-2 block"
                style={{
                  color: theme.colors.textPrimary,
                }}
              >
                Students
              </label>

              <input
                type="number"
                name="students"
                value={formData.students}
                onChange={handleChange}
                placeholder="Enter student count"
                disabled={isViewMode}
                className="w-full h-11 px-4 rounded-2xl outline-none"
                style={{
                  background:
                    theme.colors.background,
                  border: `1px solid ${theme.colors.border}`,
                  color:
                    theme.colors.textPrimary,
                }}
              />
            </div>

            {/* Class Teacher */}
            <div>
              <label
                className="text-sm font-medium mb-2 block"
                style={{
                  color: theme.colors.textPrimary,
                }}
              >
                Class Teacher
              </label>

              <input
                type="text"
                name="classTeacher"
                value={formData.classTeacher}
                onChange={handleChange}
                placeholder="Enter teacher name"
                disabled={isViewMode}
                className="w-full h-11 px-4 rounded-2xl outline-none"
                style={{
                  background:
                    theme.colors.background,
                  border: `1px solid ${theme.colors.border}`,
                  color:
                    theme.colors.textPrimary,
                }}
              />
            </div>

            {/* Room No */}
            <div>
              <label
                className="text-sm font-medium mb-2 block"
                style={{
                  color: theme.colors.textPrimary,
                }}
              >
                Class Room No
              </label>

              <input
                type="text"
                name="roomNo"
                disabled={isViewMode}
                value={formData.roomNo}
                onChange={handleChange}
                placeholder="Enter room number"
                className="w-full h-11 px-4 rounded-2xl outline-none"
                style={{
                  background:
                    theme.colors.background,
                  border: `1px solid ${theme.colors.border}`,
                  color:
                    theme.colors.textPrimary,
                }}
              />
            </div>

          
          </div>

          {/* Footer */}
       <div
  className="flex justify-end gap-3 px-6 py-5"
  style={{
    borderTop: `1px solid ${theme.colors.border}`,
  }}
>
  <button
    onClick={onClose}
    className="px-5 h-11 rounded-2xl text-sm font-medium"
    style={{
      border: `1px solid ${theme.colors.border}`,
      color: theme.colors.textPrimary,
    }}
  >
    {isViewMode ? "Close" : "Cancel"}
  </button>

  {!isViewMode && (
    <button
      onClick={handleSubmit}
      className="px-5 h-11 rounded-2xl text-sm font-semibold text-white"
      style={{
        background: theme.colors.primary,
      }}
    >
      {mode === "edit"
        ? "Update Section"
        : "Save Section"}
    </button>
  )}
</div>
        </div>
      </div>
    </>
  );
};

export default AddSectionModal;