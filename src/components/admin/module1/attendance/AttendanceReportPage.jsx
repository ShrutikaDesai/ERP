import React, { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  Users,
  CheckCircle2,
  XCircle,
  Clock3,
  ChevronDown,
  CalendarDays,
  Search,
  Download,
} from "lucide-react";

import DataTable from "@/components/common-ui/DataTable";
import { theme } from "@/theme/theme";

const classOptions = [
  "6th Standard",
  "7th Standard",
  "8th Standard",
  "9th Standard",
  "10th Standard",
  "11th Standard",
  "12th Standard"
];

const sectionOptions = ["A", "B", "C", "D"];

const attendanceData = [
  // 6th Standard - A
  { id: 1, studentName: "Aarav Sharma", class: "6th Standard", section: "A", present: 25, absent: 1, late: 1, date: "2026-08-05" },
  { id: 2, studentName: "Ananya Gupta", class: "6th Standard", section: "A", present: 26, absent: 0, late: 1, date: "2026-08-05" },
  { id: 3, studentName: "Kabir Agarwal", class: "6th Standard", section: "A", present: 23, absent: 3, late: 0, date: "2026-08-12" },

  // 6th Standard - B
  { id: 4, studentName: "Diya Kulkarni", class: "6th Standard", section: "B", present: 24, absent: 2, late: 1, date: "2026-08-05" },
  { id: 5, studentName: "Dev Kulkarni", class: "6th Standard", section: "B", present: 21, absent: 4, late: 2, date: "2026-08-12" },

  // 7th Standard - A
  { id: 6, studentName: "Amit Sharma", class: "7th Standard", section: "A", present: 24, absent: 2, late: 1, date: "2026-08-15" },
  { id: 7, studentName: "Priya Patil", class: "7th Standard", section: "A", present: 22, absent: 3, late: 2, date: "2026-08-15" },
  { id: 8, studentName: "Rahul Desai", class: "7th Standard", section: "A", present: 26, absent: 1, late: 0, date: "2026-08-20" },
  { id: 9, studentName: "Sneha Joshi", class: "7th Standard", section: "A", present: 21, absent: 4, late: 1, date: "2026-08-20" },

  // 7th Standard - B
  { id: 10, studentName: "Ishita Iyer", class: "7th Standard", section: "B", present: 25, absent: 1, late: 0, date: "2026-08-15" },
  { id: 11, studentName: "Rohan Mehta", class: "7th Standard", section: "B", present: 20, absent: 5, late: 2, date: "2026-08-20" },

  // 7th Standard - C
  { id: 12, studentName: "Zoya Sheikh", class: "7th Standard", section: "C", present: 27, absent: 0, late: 0, date: "2026-08-15" },
  { id: 13, studentName: "Kabir Malhotra", class: "7th Standard", section: "C", present: 18, absent: 6, late: 3, date: "2026-08-20" },

  // 8th Standard - A
  { id: 14, studentName: "Vivaan Shah", class: "8th Standard", section: "A", present: 24, absent: 2, late: 1, date: "2026-08-08" },
  { id: 15, studentName: "Aisha Sheikh", class: "8th Standard", section: "A", present: 19, absent: 6, late: 2, date: "2026-08-18" },

  // 8th Standard - B
  { id: 16, studentName: "Yash Patil", class: "8th Standard", section: "B", present: 23, absent: 3, late: 1, date: "2026-08-08" },
  { id: 17, studentName: "Arjun Rao", class: "8th Standard", section: "B", present: 25, absent: 1, late: 0, date: "2026-08-18" },

  // 9th Standard - A
  { id: 18, studentName: "Myra Joshi", class: "9th Standard", section: "A", present: 20, absent: 5, late: 2, date: "2026-08-10" },
  { id: 19, studentName: "Vihaan Chavan", class: "9th Standard", section: "A", present: 17, absent: 7, late: 3, date: "2026-08-22" },

  // 9th Standard - B
  { id: 20, studentName: "Anika Deshmukh", class: "9th Standard", section: "B", present: 26, absent: 0, late: 1, date: "2026-08-10" },

  // 10th Standard - A
  { id: 21, studentName: "Ishaan Verma", class: "10th Standard", section: "A", present: 27, absent: 0, late: 0, date: "2026-08-06" },
  { id: 22, studentName: "Saanvi Reddy", class: "10th Standard", section: "A", present: 22, absent: 3, late: 2, date: "2026-08-19" },

  // 10th Standard - B
  { id: 23, studentName: "Aarav Bhatt", class: "10th Standard", section: "B", present: 25, absent: 1, late: 1, date: "2026-08-06" },

  // 10th Standard - C
  { id: 24, studentName: "Neha Malhotra", class: "10th Standard", section: "C", present: 21, absent: 4, late: 2, date: "2026-08-19" },

  // 10th Standard - D
  { id: 25, studentName: "Prakash Chavan", class: "10th Standard", section: "D", present: 24, absent: 2, late: 1, date: "2026-08-06" },

  // 11th Standard - A
  { id: 26, studentName: "Reema Bhatt", class: "11th Standard", section: "A", present: 23, absent: 3, late: 1, date: "2026-08-14" },
  { id: 27, studentName: "Krishna Reddy", class: "11th Standard", section: "A", present: 26, absent: 1, late: 0, date: "2026-08-25" },

  // 11th Standard - B
  { id: 28, studentName: "Swati Deshmukh", class: "11th Standard", section: "B", present: 20, absent: 5, late: 2, date: "2026-08-14" },

  // 12th Standard - A
  { id: 29, studentName: "Nikhil Shah", class: "12th Standard", section: "A", present: 25, absent: 1, late: 0, date: "2026-08-04" },
  { id: 30, studentName: "Meena Kulkarni", class: "12th Standard", section: "A", present: 18, absent: 7, late: 2, date: "2026-08-26" },

  // 12th Standard - B
  { id: 31, studentName: "Sunita Patil", class: "12th Standard", section: "B", present: 22, absent: 4, late: 1, date: "2026-08-04" },
];

export default function AttendanceReportPage() {
  const [selectedClass, setSelectedClass] = useState("");

  const [selectedSection, setSelectedSection] = useState("");

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 5;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedClass, selectedSection, startDate, endDate, search]);

  const filteredData = useMemo(() => {
    return attendanceData.filter((student) => {
      const matchClass = selectedClass
        ? student.class === selectedClass
        : false;

      const matchSection = selectedSection
        ? student.section === selectedSection
        : false;

      const matchSearch = student.studentName
        .toLowerCase()
        .includes(search.toLowerCase());

      const studentDate = new Date(student.date);
      const start = startDate ? new Date(startDate) : null;

      const end = endDate ? new Date(endDate) : null;

      const matchDate =
        start && end && studentDate >= start && studentDate <= end;

      return matchClass && matchSection && matchSearch && matchDate;
    });
  }, [selectedClass, selectedSection, startDate, endDate, search]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const stats = useMemo(() => {
    const totalStudents = filteredData.length;

    const totalPresent = filteredData.reduce(
      (acc, item) => acc + item.present,
      0,
    );

    const totalAbsent = filteredData.reduce(
      (acc, item) => acc + item.absent,
      0,
    );

    const totalLate = filteredData.reduce((acc, item) => acc + item.late, 0);

    const totalDays = totalPresent + totalAbsent;

    const attendancePercentage =
      totalDays > 0 ? ((totalPresent / totalDays) * 100).toFixed(0) : 0;

    const absencePercentage =
      totalDays > 0 ? ((totalAbsent / totalDays) * 100).toFixed(0) : 0;

    return {
      totalStudents,
      attendancePercentage,
      absencePercentage,
      totalLate,
    };
  }, [filteredData]);

  const columns = [
    {
      accessorKey: "srNo",
      header: "Sr No",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "studentName",
      header: "Student Name",
    },
    {
      accessorKey: "class",
      header: "Class",
    },
    {
      accessorKey: "section",
      header: "Section",
    },
    {
      accessorKey: "present",
      header: "Present",
    },
    {
      accessorKey: "absent",
      header: "Absent",
    },
    {
      accessorKey: "late",
      header: "Late",
    },
    {
      accessorKey: "attendance",
      header: "Attendance %",
      cell: ({ row }) => {
        const { present, absent } = row.original;

        const percentage = ((present / (present + absent)) * 100).toFixed(0);

        return (
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              backgroundColor: "#ECFDF3",
              color: theme.colors.success,
            }}
          >
            {percentage}%
          </span>
        );
      },
    },
  ];

  const StatCard = ({ title, value, icon, bg, iconColor }) => {
    return (
      <div
        className="p-6 border"
        style={{
          borderRadius: theme.radius.lg,
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.tableBorder,
          boxShadow: theme.shadow.card,
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="h-16 w-16 rounded-2xl flex items-center justify-center"
            style={{
              backgroundColor: bg,
            }}
          >
            <div style={{ color: iconColor }}>{icon}</div>
          </div>

          <div>
            <h2
              className="text-4xl font-bold"
              style={{
                color: theme.colors.textPrimary,
              }}
            >
              {value}
            </h2>

            <p
              className="mt-1"
              style={{
                color: theme.colors.textSecondary,
              }}
            >
              {title}
            </p>
          </div>
        </div>
      </div>
    );
  };
  const showReport = selectedClass && selectedSection && startDate && endDate;

  const handleExportExcel = () => {
    const exportData = filteredData.map((item, index) => ({
      "Sr No": index + 1,
      "Student Name": item.studentName,
      Class: item.class,
      Section: item.section,
      Present: item.present,
      Absent: item.absent,
      Late: item.late,
      "Attendance %": `${(
        (item.present / (item.present + item.absent)) *
        100
      ).toFixed(0)}%`,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Report");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(fileData, "attendance-report.xlsx");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);

    doc.text("Attendance Report", 14, 20);

    const tableColumn = [
      "Sr No",
      "Student Name",
      "Class",
      "Section",
      "Present",
      "Absent",
      "Late",
      "Attendance %",
    ];

    const tableRows = filteredData.map((item, index) => [
      index + 1,
      item.studentName,
      item.class,
      item.section,
      item.present,
      item.absent,
      item.late,
      `${((item.present / (item.present + item.absent)) * 100).toFixed(0)}%`,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    doc.save("attendance-report.pdf");
  };

  return (
    <div
      className="w-full"
      style={{
        background: theme.colors.background,
        fontFamily: theme.typography.fontFamily,
      }}
    >
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2
            className="text-xl font-bold"
            style={{
              color: theme.colors.textPrimary,
              fontSize: "1.7rem",
              fontWeight: 700,
            }}
          >
            Attendance Report
          </h2>

          <p
            className="mt-1 text-sm"
            style={{
              color: theme.colors.textSecondary,
            }}
          >
            Student attendance overview
          </p>
        </div>
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
            Class / Grade
          </label>

          <div className="relative">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full h-12 rounded-xl border appearance-none px-4 pr-10 outline-none"
              style={{
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.surface,
                color: theme.colors.textPrimary,
              }}
            >
              <option value="">Select Class</option>

              {classOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <ChevronDown
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
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
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full h-12 rounded-xl border appearance-none px-4 pr-10 outline-none"
              style={{
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.surface,
                color: theme.colors.textPrimary,
              }}
            >
              <option value="">Select Section</option>

              {sectionOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <ChevronDown
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                color: theme.colors.textMuted,
              }}
            />
          </div>
        </div>

        {/* Date Range */}
        <div>
          <label
            className="text-sm mb-2 block font-medium"
            style={{
              color: theme.colors.textSecondary,
            }}
          >
            Date Range
          </label>

          <div
            className="flex items-center h-12 rounded-xl border px-4 gap-3"
            style={{
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.surface,
            }}
          >
            {/* Start Date */}
            <div className="relative flex-1">
              <input
                type={startDate ? "date" : "text"}
                placeholder="Start Date"
                value={startDate}
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => {
                  if (!startDate) {
                    e.target.type = "text";
                  }
                }}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-transparent outline-none cursor-pointer"
                style={{
                  color: theme.colors.textPrimary,
                }}
              />

              {/* Hidden native calendar */}
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

              {/* Calendar Icon */}
              <CalendarDays
                size={16}
                className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{
                  color: theme.colors.textMuted,
                }}
              />
            </div>

            {/* Divider */}
            <span
              style={{
                color: theme.colors.textMuted,
              }}
            >
              →
            </span>

            {/* End Date */}
            <div className="relative flex-1">
              <input
                type={endDate ? "date" : "text"}
                placeholder="End Date"
                value={endDate}
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => {
                  if (!endDate) {
                    e.target.type = "text";
                  }
                }}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-transparent outline-none cursor-pointer"
                style={{
                  color: theme.colors.textPrimary,
                }}
              />

              {/* Calendar Icon */}
              <CalendarDays
                size={16}
                className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{
                  color: theme.colors.textMuted,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {!showReport && (
        <div
          className="flex flex-col items-center justify-center text-center py-16 px-6 border border-dashed"
          style={{
            borderRadius: theme.radius.lg,
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.surface,
          }}
        >
          <div
            className="h-12 w-12 rounded-full flex items-center justify-center mb-4"
            style={{
              backgroundColor: theme.colors.background,
            }}
          >
            <CalendarDays
              size={22}
              style={{ color: theme.colors.textMuted }}
            />
          </div>

          <p
            className="font-semibold"
            style={{
              color: theme.colors.textPrimary,
              fontSize: "1rem",
            }}
          >
            Please select class, section and date range
          </p>

          <p
            className="mt-1 text-sm"
            style={{
              color: theme.colors.textSecondary,
            }}
          >
            Choose all filters above to view the attendance report
          </p>
        </div>
      )}

      {/* Show cards and table only after selecting all filters */}
      {showReport && (
        <>
          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
            <StatCard
              title="Total Students"
              value={stats.totalStudents}
              icon={<Users size={30} />}
              bg="#E0F2FE"
              iconColor={theme.colors.info}
            />

            <StatCard
              title="Avg Attendance"
              value={`${stats.attendancePercentage}%`}
              icon={<CheckCircle2 size={30} />}
              bg="#DCFCE7"
              iconColor={theme.colors.success}
            />

            <StatCard
              title="Avg Absence"
              value={`${stats.absencePercentage}%`}
              icon={<XCircle size={30} />}
              bg="#FEE2E2"
              iconColor={theme.colors.danger}
            />

            <StatCard
              title="Total Late"
              value={stats.totalLate}
              icon={<Clock3 size={30} />}
              bg="#FEF3C7"
              iconColor={theme.colors.warning}
            />
          </div>

          {/* Table Card */}
          <div
            className="border p-5"
            style={{
              borderRadius: theme.radius.lg,
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.tableBorder,
              boxShadow: theme.shadow.card,
            }}
          >
            {/* Top */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
              <h2
                className="text-2xl font-semibold"
                style={{
                  color: theme.colors.textPrimary,
                }}
              >
                Student Attendance
              </h2>

              <div className="flex items-center gap-3 flex-wrap">
                {/* Search */}
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{
                      color: theme.colors.textMuted,
                    }}
                  />

                  <input
                    type="text"
                    placeholder="Search student"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-[260px] h-11 rounded-xl border pl-10 pr-4 outline-none"
                    style={{
                      borderColor: theme.colors.border,
                      color: theme.colors.textPrimary,
                    }}
                  />
                </div>

                {/* Excel */}
                <button
                  onClick={handleExportExcel}
                  className="h-11 px-5 rounded-xl border flex items-center gap-2 font-medium"
                  style={{
                    borderColor: theme.colors.border,
                    color: theme.colors.info,
                  }}
                >
                  <Download size={18} />
                  Excel
                </button>

                {/* PDF */}
                <button
                  onClick={handleExportPDF}
                  className="h-11 px-5 rounded-xl border flex items-center gap-2 font-medium"
                  style={{
                    borderColor: theme.colors.border,
                    color: theme.colors.info,
                  }}
                >
                  <Download size={18} />
                  PDF
                </button>
              </div>
            </div>

            {/* Table */}
            <DataTable columns={columns} data={paginatedData} />
            {/* Pagination */}
            <div
              className="flex items-center justify-between mt-5 pt-4 border-t"
              style={{
                borderColor: theme.colors.tableBorder,
              }}
            >
              <p
                className="text-sm"
                style={{
                  color: theme.colors.textSecondary,
                }}
              >
                Showing{" "}
                {filteredData.length === 0
                  ? 0
                  : (currentPage - 1) * rowsPerPage + 1}{" "}
                to {Math.min(currentPage * rowsPerPage, filteredData.length)} of{" "}
                {filteredData.length} entries
              </p>

              <div className="flex items-center gap-2">
                {/* Previous */}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="h-10 px-4 rounded-lg border text-sm font-medium"
                  style={{
                    borderColor: theme.colors.border,
                    color:
                      currentPage === 1
                        ? theme.colors.textMuted
                        : theme.colors.textPrimary,
                    opacity: currentPage === 1 ? 0.6 : 1,
                  }}
                >
                  Previous
                </button>

                {/* Page Numbers */}
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;

                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className="h-10 w-10 rounded-lg text-sm font-semibold"
                      style={{
                        backgroundColor:
                          currentPage === page
                            ? theme.colors.primary
                            : "transparent",
                        color:
                          currentPage === page
                            ? "#fff"
                            : theme.colors.textPrimary,
                        border:
                          currentPage === page
                            ? "none"
                            : `1px solid ${theme.colors.border}`,
                      }}
                    >
                      {page}
                    </button>
                  );
                })}

                {/* Next */}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="h-10 px-4 rounded-lg border text-sm font-medium"
                  style={{
                    borderColor: theme.colors.border,
                    color:
                      currentPage === totalPages
                        ? theme.colors.textMuted
                        : theme.colors.textPrimary,
                    opacity: currentPage === totalPages ? 0.6 : 1,
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
