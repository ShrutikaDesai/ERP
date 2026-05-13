import React, { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock3,
  TrendingUp,
  Search,
  Filter,
  MoreVertical,
} from "lucide-react";

import {
  ResponsiveContainer,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";


import { theme } from "@/theme/theme";
import DataTable from "@/components/common-ui/DataTable";

const attendanceData = [
  {
    student: "Alex Morgan",
    email: "alex@example.com",
    id: "STU-089",
    roll: "01",
    status: "Present",
    note: "-",
  },
  {
    student: "Emma Thompson",
    email: "emma@example.com",
    id: "STU-092",
    roll: "02",
    status: "Absent",
    note: "Medical",
  },
  {
    student: "James Wilson",
    email: "james@example.com",
    id: "STU-105",
    roll: "03",
    status: "Late",
    note: "Arr: 09:15 AM",
  },
  {
    student: "Sarah Jenkins",
    email: "sarah@example.com",
    id: "STU-112",
    roll: "04",
    status: "Present",
    note: "-",
  },
];

const trendData = [
  { day: "Mon", attendance: 96 },
  { day: "Tue", attendance: 93 },
  { day: "Wed", attendance: 88 },
  { day: "Thu", attendance: 95 },
  { day: "Fri", attendance: 84 },
];

const exceptionsData = [
  {
    name: "Michael Chang",
    issue: "3 Days Absent",
    note: "Consecutive absence. No note provided.",
  },
  {
    name: "Chloe Smith",
    issue: "Frequent Late",
    note: "Late 4 times this month.",
  },
  {
    name: "Chloe Smith",
    issue: "Frequent Late",
    note: "Late 4 times this month.",
  },
];

function StatsCard({ title, value, subtitle, icon, color, progress }) {
  return (
    <div
      className="p-5 border"
      style={{
        backgroundColor: theme.colors.cardBg,
        borderRadius: theme.radius.lg,
        borderColor: theme.colors.border,
        boxShadow: theme.shadow.card,
      }}
    >
      <div className="flex justify-between items-start">
        <div>
          <p
            className="text-sm font-medium"
            style={{ color: theme.colors.textSecondary }}
          >
            {title}
          </p>

          <h3
            className="text-3xl font-bold mt-2"
            style={{ color: theme.colors.textPrimary }}
          >
            {value}
          </h3>

          <p
            className="text-xs mt-2"
            style={{ color: theme.colors.textMuted }}
          >
            {subtitle}
          </p>
        </div>

        <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
      </div>

      {progress && (
        <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: progress,
              backgroundColor: theme.colors.info,
            }}
          />
        </div>
      )}
    </div>
  );
}


const AttendanceManagement = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const filteredData = useMemo(() => {
    return attendanceData.filter((student) =>
      student.student.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

   const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  const currentRows = filteredData.slice(
    indexOfFirstRow,
    indexOfLastRow
  );

  const columns = [
    {
      accessorKey: "student",
      header: "Student",
      cell: ({ row }) => (
        <div>
          <p
            className="font-semibold"
            style={{ color: theme.colors.textPrimary }}
          >
            {row.original.student}
          </p>
          <p
            className="text-xs"
            style={{ color: theme.colors.textMuted }}
          >
            {row.original.email}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "id",
      header: "ID / Roll",
      cell: ({ row }) => (
        <div>
          <p>{row.original.id}</p>
          <p
            className="text-xs"
            style={{ color: theme.colors.textMuted }}
          >
            Roll: {row.original.roll}
          </p>
        </div>
      ),
    },
    {
  accessorKey: "status",
  header: "Status",
  cell: ({ row }) => {
    const status = row.original.status;

    return (
      <div className="flex items-center gap-2">
        {/* Present */}
        <button
          className={`w-8 h-8 rounded-lg text-xs font-semibold border transition ${
            status === "Present"
              ? "bg-green-100 text-green-600 border-green-200"
              : "bg-gray-50 text-gray-400 border-gray-200"
          }`}
        >
          P
        </button>

        {/* Absent */}
        <button
          className={`w-8 h-8 rounded-lg text-xs font-semibold border transition ${
            status === "Absent"
              ? "bg-red-100 text-red-600 border-red-200"
              : "bg-gray-50 text-gray-400 border-gray-200"
          }`}
        >
          A
        </button>

        {/* Late */}
        <button
          className={`w-8 h-8 rounded-lg text-xs font-semibold border transition ${
            status === "Late"
              ? "bg-yellow-100 text-yellow-700 border-yellow-200"
              : "bg-gray-50 text-gray-400 border-gray-200"
          }`}
        >
          L
        </button>
      </div>
    );
  },
},
    {
      accessorKey: "note",
      header: "Notes",
    },
    {
      accessorKey: "actions",
      header: "",
      cell: () => (
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical size={16} />
        </button>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mb-8">
        <div>
          <h1
            className="font-bold"
            style={{
              color: theme.colors.textPrimary,
              fontSize: "40px",
              letterSpacing: "-1.68px",
              margin: "16px 0",
            }}
          >
            Attendance Management
          </h1>

          <p
            className="text-sm"
            style={{ color: theme.colors.textSecondary }}
          >
            Manage daily attendance and view insights.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <select className="border rounded-xl px-4 py-2 bg-white text-sm">
            <option>Oct 24, 2026</option>
          </select>

          <select className="border rounded-xl px-4 py-2 bg-white text-sm">
            <option>Grade 10 - Sec A</option>
          </select>

          <select className="border rounded-xl px-4 py-2 bg-white text-sm">
            <option>Full Day</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Present"
          value="38"
          subtitle="2.4% vs yesterday"
          icon={<CheckCircle2 className="text-green-600" />}
          color="bg-green-100"
        />

        <StatsCard
          title="Absent"
          value="4"
          subtitle="1 vs yesterday"
          icon={<XCircle className="text-red-600" />}
          color="bg-red-100"
        />

        <StatsCard
          title="Late"
          value="3"
          subtitle="0 vs yesterday"
          icon={<Clock3 className="text-yellow-600" />}
          color="bg-yellow-100"
        />

        <StatsCard
          title="Attendance Rate"
          value="84.4%"
          subtitle=""
          icon={<TrendingUp className="text-blue-600" />}
          color="bg-blue-100"
          progress="84%"
        />
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Student Roster */}
        <div
        className="xl:col-span-3 border p-0 overflow-hidden"
        style={{
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.lg,
            borderColor: theme.colors.border,
            boxShadow: theme.shadow.card,
        }}
        >
        {/* Header */}
        <div className="p-6 pb-4">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <h2
                className={theme.typography.h3}
                style={{ color: theme.colors.textPrimary }}
            >
                Student Roster
            </h2>

            <div className="flex gap-3">
                <div className="relative w-full md:w-72">
                <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                />

                <input
                    type="text"
                    placeholder="Search student..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full border rounded-xl pl-10 pr-4 py-2 text-sm bg-white"
                    style={{
                    borderColor: theme.colors.border,
                    }}
                />
                </div>

                <button
                className="border rounded-xl px-4 py-2 flex items-center gap-2 text-sm bg-white"
                style={{
                    borderColor: theme.colors.border,
                }}
                >
                <Filter size={16} />
                Filter
                </button>
            </div>
            </div>
        </div>

        {/* Selection Toolbar */}
        <div
            className="flex flex-col md:flex-row justify-between md:items-center px-6 py-4 border-y"
            style={{
            backgroundColor: "#EFF6FF",
            borderColor: theme.colors.tableBorder,
            }}
        >
            <span
            className="text-sm font-semibold"
            style={{
                color: theme.colors.info,
            }}
            >
            45 students selected
            </span>

            <div className="flex gap-4 mt-2 md:mt-0">
            <button
                className="px-3 py-1 rounded-lg text-sm font-medium"
                style={{
                backgroundColor: "#DCFCE7",
                color: theme.colors.success,
                }}
            >
                Mark All Present
            </button>

            <button
                className="px-3 py-1 rounded-lg text-sm font-medium"
                style={{
                backgroundColor: "#FEE2E2",
                color: theme.colors.danger,
                }}
            >
                Mark All Absent
            </button>
            </div>
        </div>

        {/* Table Section */}
        <div className="px-0">
            <DataTable columns={columns} data={currentRows} />
        </div>

        {/* Footer Pagination */}
        <div
            className="flex flex-col lg:flex-row justify-between lg:items-center px-6 py-4 border-t"
            style={{
            borderColor: theme.colors.tableBorder,
            backgroundColor: "#FFFFFF",
            }}
        >
            <p
            className="text-sm"
            style={{ color: theme.colors.textSecondary }}
            >
            Showing{" "}
            <span className="font-semibold">
                {indexOfFirstRow + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold">
                {Math.min(indexOfLastRow, filteredData.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold">
                {filteredData.length}
            </span>{" "}
            students
            </p>

            <div className="flex items-center gap-2 mt-4 lg:mt-0">
            <button
                onClick={() =>
                setCurrentPage((prev) => Math.max(prev - 1, 1))
                }
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-xl border text-sm font-medium disabled:opacity-50"
                style={{
                borderColor: theme.colors.border,
                color: theme.colors.textSecondary,
                }}
            >
                Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
                <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className="w-10 h-10 rounded-xl text-sm font-semibold"
                style={{
                    backgroundColor:
                    currentPage === i + 1
                        ? theme.colors.primary
                        : "#FFFFFF",
                    border:
                    currentPage === i + 1
                        ? "none"
                        : `1px solid ${theme.colors.border}`,
                    color:
                    currentPage === i + 1
                        ? "#FFFFFF"
                        : theme.colors.textPrimary,
                }}
                >
                {i + 1}
                </button>
            ))}

            <button
                onClick={() =>
                setCurrentPage((prev) =>
                    Math.min(prev + 1, totalPages)
                )
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-xl border text-sm font-medium disabled:opacity-50"
                style={{
                borderColor: theme.colors.border,
                color: theme.colors.textSecondary,
                }}
            >
                Next
            </button>
            </div>
        </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-6">
          {/* Trend */}
            <div
            className="border p-5"
            style={{
                backgroundColor: theme.colors.surface,
                borderRadius: theme.radius.lg,
                borderColor: theme.colors.border,
                boxShadow: theme.shadow.card,
            }}
            >
            <div className="flex justify-between items-center mb-4">
                <h2
                className="text-lg font-semibold"
                style={{ color: theme.colors.textPrimary }}
                >
                Attendance Trend
                </h2>

                <select className="border rounded-xl px-3 py-2 text-sm bg-white">
                <option>This Week</option>
                </select>
            </div>

            <ResponsiveContainer width="100%" height={220}>
                <AreaChart
                data={trendData}
                margin={{ top: 10, right: 4, left: -20, bottom: 0 }}
                >
                {/* GRADIENT (same style as Fee chart) */}
                <defs>
                    <linearGradient id="attendanceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop
                        offset="5%"
                        stopColor={theme.colors.info}
                        stopOpacity={0.25}
                    />
                    <stop
                        offset="95%"
                        stopColor={theme.colors.info}
                        stopOpacity={0}
                    />
                    </linearGradient>
                </defs>

                <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={theme.colors.tableBorder}
                    vertical={false}
                />

                <XAxis
                    dataKey="day"
                    tick={{ fontSize: 12, fill: theme.colors.textMuted }}
                    axisLine={false}
                    tickLine={false}
                />

                <YAxis
                    domain={[70, 100]}
                    tick={{ fontSize: 12, fill: theme.colors.textMuted }}
                    axisLine={false}
                    tickLine={false}
                />

                <Tooltip
                    formatter={(v) => [`${v}%`, "Attendance"]}
                    contentStyle={{
                    borderRadius: theme.radius.md,
                    border: `1px solid ${theme.colors.border}`,
                    fontSize: "0.8125rem",
                    fontFamily: theme.typography.fontFamily,
                    }}
                />

                {/* LINE */}
                <Line
                    type="monotone"
                    dataKey="attendance"
                    stroke={theme.colors.info}
                    strokeWidth={2.5}
                    dot={false}
                />

                {/* AREA (gradient fill under line) */}
                <Area
                    type="monotone"
                    dataKey="attendance"
                    stroke="none"
                    fill="url(#attendanceGrad)"
                />
                </AreaChart>
            </ResponsiveContainer>
            </div>

          {/* Exceptions */}
<div
  className="border p-5"
  style={{
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderColor: theme.colors.border,
    boxShadow: theme.shadow.card,
  }}
>
  <div className="flex justify-between items-center mb-4">
    <h2
      className="text-lg font-semibold"
      style={{ color: theme.colors.textPrimary }}
    >
      Exceptions
    </h2>

    <span className="text-xs text-red-500 font-medium">
      Requires Attention
    </span>
  </div>

  {/* 🔥 SCROLL AREA */}
  <div
    style={{
      maxHeight: "260px",   // adjust as per UI
      overflowY: "auto",
      paddingRight: "6px",  // prevents cut-off scrollbar overlap
    }}
    className="space-y-4 hide-scrollbar"
  >
    {exceptionsData.map((item, index) => (
      <div key={index} className="pb-4 border-b last:border-none">
        <div className="flex justify-between items-start">
          <div>
            <p
              className="font-medium"
              style={{
                color: theme.colors.textPrimary,
              }}
            >
              {item.name}
            </p>

            <p
              className="text-xs mt-1"
              style={{
                color: theme.colors.textMuted,
              }}
            >
              {item.note}
            </p>
          </div>

          <span className="text-xs text-orange-500 font-medium">
            {item.issue}
          </span>
        </div>

        <div className="flex gap-4 mt-2 text-xs">
          <button className="text-blue-600">Contact Parent</button>
          <button className="text-gray-500">Add Note</button>
        </div>
      </div>
    ))}
  </div>
</div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceManagement;