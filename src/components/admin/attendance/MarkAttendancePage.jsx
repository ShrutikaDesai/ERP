import React, { useMemo, useState } from "react";
import {
  Check,
  X,
  Clock3,
  CalendarDays,
  ChevronDown,
} from "lucide-react";

import DataTable from "@/components/common-ui/DataTable";
import { theme } from "@/theme/theme";

const classOptions = [
  "1st Standard",
  "2nd Standard",
  "3rd Standard",
  "4th Standard",
  "5th Standard",
  "6th Standard",
  "7th Standard",
  "8th Standard",
];

const sectionOptions = ["A", "B", "C"];

const initialStudents = [
  {
    id: 1,
    rollNo: 101,
    name: "Amit Sharma",
    gender: "Male",
    status: "present",
  },
  {
    id: 2,
    rollNo: 102,
    name: "Priya Patil",
    gender: "Female",
    status: "present",
  },
  {
    id: 3,
    rollNo: 103,
    name: "Rahul Desai",
    gender: "Male",
    status: "present",
  },
  {
    id: 4,
    rollNo: 104,
    name: "Sneha Joshi",
    gender: "Female",
    status: "present",
  },
];

export default function MarkAttendancePage() {
    const [currentPage, setCurrentPage] = useState(1);
const rowsPerPage = 5;
  const [selectedClass, setSelectedClass] = useState("");
const [selectedSection, setSelectedSection] = useState("");
const [selectedDate, setSelectedDate] = useState("");

  const [students, setStudents] = useState(initialStudents);
  
  const [markAllPresent, setMarkAllPresent] = useState(true);

//   const handleShowAttendance = () => {
//     if (selectedClass && selectedSection && selectedDate) {
//       setShowTable(true);
//     }
//   };

  const updateStatus = (id, status) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, status } : student
      )
    );
  };

  const handleMarkAllPresent = (checked) => {
    setMarkAllPresent(checked);

    if (checked) {
      setStudents((prev) =>
        prev.map((student) => ({
          ...student,
          status: "present",
        }))
      );
    }
  };

  const counts = useMemo(() => {
    return {
      present: students.filter((s) => s.status === "present").length,
      absent: students.filter((s) => s.status === "absent").length,
      late: students.filter((s) => s.status === "late").length,
    };
  }, [students]);

  const AttendanceButton = ({
    type,
    active,
    onClick,
    icon,
  }) => {
    const activeColors = {
      present: {
        border: theme.colors.success,
        bg: "#ECFDF3",
        iconBg: theme.colors.success,
      },
      absent: {
        border: theme.colors.danger,
        bg: "#FEF2F2",
        iconBg: theme.colors.danger,
      },
      late: {
        border: theme.colors.warning,
        bg: "#FFF7ED",
        iconBg: theme.colors.warning,
      },
    };

    const colorSet = activeColors[type];

    

    return (
      <button
        onClick={onClick}
        className="h-12 w-12 rounded-full flex items-center justify-center transition-all duration-200"
        style={{
          border: `1.5px solid ${
            active
              ? colorSet.border
              : theme.colors.border
          }`,
          backgroundColor: active
            ? colorSet.bg
            : theme.colors.surface,
        }}
      >
        <div
          className="h-6 w-6 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: active
              ? colorSet.iconBg
              : theme.colors.border,
            color: active
              ? "white"
              : theme.colors.textMuted,
          }}
        >
          {icon}
        </div>
      </button>
    );
  };

  const columns = [
    {
      accessorKey: "srNo",
      header: "Sr No",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "rollNo",
      header: "Roll No",
    },
    {
      accessorKey: "name",
      header: "Student Name",
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell: ({ row }) => {
        const gender = row.original.gender;

        return (
          <span
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor:
                gender === "Male"
                  ? "#E0F2FE"
                  : "#FCE7F3",
              color:
                gender === "Male"
                  ? theme.colors.info
                  : "#DB2777",
            }}
          >
            {gender}
          </span>
        );
      },
    },
    {
      accessorKey: "present",
      header: () => (
        <div className="text-center w-full">
          Present
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          <AttendanceButton
            type="present"
            active={
              row.original.status === "present"
            }
            onClick={() =>
              updateStatus(
                row.original.id,
                "present"
              )
            }
            icon={<Check size={14} />}
          />
        </div>
      ),
    },
    {
      accessorKey: "absent",
      header: () => (
        <div className="text-center w-full">
          Absent
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          <AttendanceButton
            type="absent"
            active={
              row.original.status === "absent"
            }
            onClick={() =>
              updateStatus(
                row.original.id,
                "absent"
              )
            }
            icon={<X size={14} />}
          />
        </div>
      ),
    },
    {
      accessorKey: "late",
      header: () => (
        <div className="text-center w-full">
          Late
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          <AttendanceButton
            type="late"
            active={row.original.status === "late"}
            onClick={() =>
              updateStatus(
                row.original.id,
                "late"
              )
            }
            icon={<Clock3 size={14} />}
          />
        </div>
      ),
    },
  ];
  const totalPages = Math.ceil(
    students.length / rowsPerPage
    );

    const paginatedStudents = students.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
    );

  return (
    <div
      className="min-h-screen p-6"
      style={{
        backgroundColor: theme.colors.background,
        fontFamily: theme.typography.fontFamily,
          padding: theme.layout.contentPadding,
      }}
    >
      {/* Header */}
      <div className="mb-6">
        <h3
          className="text-3xl font-bold"
          style={{
            color: theme.colors.textPrimary,
          }}
        >
          Mark Attendance
        </h3>

        <p
          className="mt-1 text-sm"
          style={{
            color: theme.colors.textSecondary,
          }}
        >
          Track student attendance
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {/* Class */}
        <div>
          <label
            className="text-sm mb-2 block font-medium"
            style={{
              color: theme.colors.textSecondary,
            }}
          >
            Class
          </label>

          <div className="relative">
            <select
              value={selectedClass}
              onChange={(e) =>
                setSelectedClass(e.target.value)
              }
              className="w-full h-12 rounded-xl border appearance-none px-4 pr-10 outline-none"
              style={{
                borderColor: theme.colors.border,
                backgroundColor:
                  theme.colors.surface,
                color: theme.colors.textPrimary,
              }}
            >
              <option value="">
                Select Class
              </option>

              {classOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <ChevronDown
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2"
              style={{
                color: theme.colors.textMuted,
              }}
            />
          </div>
        </div>

        {/* Section */}
        <div>
          <label
            className="text-sm mb-2 block font-medium"
            style={{
              color: theme.colors.textSecondary,
            }}
          >
            Section
          </label>

          <div className="relative">
            <select
              value={selectedSection}
              onChange={(e) =>
                setSelectedSection(e.target.value)
              }
              className="w-full h-12 rounded-xl border appearance-none px-4 pr-10 outline-none"
              style={{
                borderColor: theme.colors.border,
                backgroundColor:
                  theme.colors.surface,
                color: theme.colors.textPrimary,
              }}
            >
              <option value="">
                Select Section
              </option>

              {sectionOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <ChevronDown
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2"
              style={{
                color: theme.colors.textMuted,
              }}
            />
          </div>
        </div>

       {/* Date */}
        <div>
        <label
            className="text-sm mb-2 block font-medium"
            style={{
            color: theme.colors.textSecondary,
            }}
        >
            Date
        </label>

        <div className="relative">
            <input
            type="date"
            value={selectedDate}
            onChange={(e) =>
                setSelectedDate(e.target.value)
            }
            className="w-full h-12 rounded-xl border px-4 outline-none cursor-pointer"
            style={{
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.surface,
                color: theme.colors.textPrimary,
            }}
            />

            {/* Native calendar clickable area */}
            <style>
            {`
                input[type="date"]::-webkit-calendar-picker-indicator {
                opacity: 0;
                position: absolute;
                right: 0;
                width: 100%;
                height: 100%;
                cursor: pointer;
                }
            `}
            </style>

            {/* Custom Icon */}
            <CalendarDays
            size={18}
            className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{
                color: theme.colors.textMuted,
            }}
            />
        </div>
        </div>

        {/* Show Button */}
        {/* <div className="flex items-end">
          <button
            onClick={handleShowAttendance}
            className="w-full h-12 rounded-xl text-white font-semibold transition-all duration-200"
            style={{
              backgroundColor: theme.colors.primary,
            }}
          >
            Show Attendance
          </button>
        </div> */}
      </div>

      {/* Table */}
      {selectedClass &&
        selectedSection &&
        selectedDate && (
        <div
          className="border overflow-hidden"
          style={{
            borderRadius: theme.radius.lg,
            borderColor:
              theme.colors.tableBorder,
            backgroundColor:
              theme.colors.surface,
            boxShadow: theme.shadow.card,
          }}
        >
          {/* Mark All */}
          <div className="px-5 pt-5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={markAllPresent}
                onChange={(e) =>
                  handleMarkAllPresent(
                    e.target.checked
                  )
                }
                className="h-4 w-4"
                accentColor={theme.colors.primary}
              />

              <span
                className="font-medium"
                style={{
                  color:
                    theme.colors.textPrimary,
                }}
              >
                Mark All Present
              </span>
            </label>
          </div>

          <div className="mt-4">
            <DataTable
              columns={columns}
              data={paginatedStudents}
            />
          </div>
          {/* Pagination */}
<div
  className="flex items-center justify-between px-5 py-4 border-t"
  style={{
    borderColor: theme.colors.tableBorder,
  }}
>
  <div
    className="text-sm"
    style={{
      color: theme.colors.textSecondary,
    }}
  >
    Showing page{" "}
    <span
      className="font-semibold"
      style={{
        color: theme.colors.textPrimary,
      }}
    >
      {currentPage}
    </span>{" "}
    of{" "}
    <span
      className="font-semibold"
      style={{
        color: theme.colors.textPrimary,
      }}
    >
      {totalPages}
    </span>
  </div>

  <div className="flex items-center gap-2">
    <button
      disabled={currentPage === 1}
      onClick={() =>
        setCurrentPage((prev) => prev - 1)
      }
      className="px-4 h-10 rounded-xl border disabled:opacity-50"
      style={{
        borderColor: theme.colors.border,
        color: theme.colors.textPrimary,
      }}
    >
      Prev
    </button>

    {[...Array(totalPages)].map((_, index) => (
      <button
        key={index}
        onClick={() =>
          setCurrentPage(index + 1)
        }
        className="h-10 w-10 rounded-xl text-sm font-medium"
        style={{
          backgroundColor:
            currentPage === index + 1
              ? theme.colors.primary
              : theme.colors.surface,
          color:
            currentPage === index + 1
              ? "#fff"
              : theme.colors.textPrimary,
          border: `1px solid ${theme.colors.border}`,
        }}
      >
        {index + 1}
      </button>
    ))}

    <button
      disabled={currentPage === totalPages}
      onClick={() =>
        setCurrentPage((prev) => prev + 1)
      }
      className="px-4 h-10 rounded-xl border disabled:opacity-50"
      style={{
        borderColor: theme.colors.border,
        color: theme.colors.textPrimary,
      }}
    >
      Next
    </button>
  </div>
</div>

          {/* Footer */}
          <div
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-5 py-4 border-t"
            style={{
              borderColor:
                theme.colors.tableBorder,
            }}
          >
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2 text-sm font-medium">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor:
                      theme.colors.success,
                  }}
                />

                <span
                  style={{
                    color:
                      theme.colors.textPrimary,
                  }}
                >
                  Present: {counts.present}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm font-medium">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor:
                      theme.colors.danger,
                  }}
                />

                <span
                  style={{
                    color:
                      theme.colors.textPrimary,
                  }}
                >
                  Absent: {counts.absent}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm font-medium">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor:
                      theme.colors.warning,
                  }}
                />

                <span
                  style={{
                    color:
                      theme.colors.textPrimary,
                  }}
                >
                  Late: {counts.late}
                </span>
              </div>
            </div>

            <button
              className="px-6 h-11 rounded-xl text-white font-medium transition-all duration-200"
              style={{
                backgroundColor:
                  theme.colors.primary,
              }}
            >
              Save Attendance
            </button>
          </div>
        </div>
      )}
    </div>
  );
}