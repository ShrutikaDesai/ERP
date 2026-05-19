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

const attendanceData = [
  {
    id: 1,
    studentName: "Amit Sharma",
    class: "7th Standard",
    section: "A",
    present: 24,
    absent: 2,
    late: 1,
    date: "2026-05-15",
  },
  {
    id: 2,
    studentName: "Priya Patil",
    class: "7th Standard",
    section: "A",
    present: 22,
    absent: 3,
    late: 2,
    date: "2026-05-15",
  },
  {
    id: 3,
    studentName: "Rahul Desai",
    class: "7th Standard",
    section: "A",
    present: 26,
    absent: 1,
    late: 0,
    date: "2026-05-20",
  },
  {
    id: 4,
    studentName: "Sneha Joshi",
    class: "7th Standard",
    section: "A",
    present: 21,
    absent: 4,
    late: 1,
    date: "2026-05-20",
  },
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
          Attendance Report
        </h3>

        <p
          className="mt-1 text-sm"
          style={{
            color: theme.colors.textSecondary,
          }}
        >
          Student attendance overview
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
