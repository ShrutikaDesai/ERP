import React, { useMemo, useState } from "react";
import {
  CalendarDays,
  AlertCircle,
  BarChart3,
  Plus,
  Search,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import AddExamModal from "../modals/AddExamModal";

import DataTable from "@/components/common-ui/DataTable";
import { theme } from "@/theme/theme";

const examsData = [
  {
    examName: "Mid-Term Mathematics",
    grade: "Grade 1",
    subject: "Mathematics",
    date: "Oct 25, 2026",
    time: "09:00 AM - 11:00 AM",
    status: "Upcoming",
    marks: 100,
  },
  {
    examName: "Science Assessment",
    grade: "Grade 5",
    subject: "Science",
    date: "Oct 27, 2026",
    time: "10:00 AM - 12:00 PM",
    status: "Completed",
    marks: 100,
  },
  {
    examName: "English Grammar Test",
    grade: "Grade 8",
    subject: "English",
    date: "Nov 02, 2026",
    time: "08:30 AM - 10:00 AM",
    status: "Pending",
    marks: 50,
  },
  {
    examName: "Final Physics",
    grade: "Grade 10",
    subject: "Physics",
    date: "Dec 12, 2026",
    time: "10:00 AM - 01:00 PM",
    status: "Upcoming",
    marks: 100,
  },
];

const chartData = [
  { range: "<40", students: 8 },
  { range: "40-60", students: 18 },
  { range: "60-80", students: 42 },
  { range: "80-100", students: 35 },
];

function StatsCard({ title, value, subtitle, icon, color }) {
  return (
    <div
      className="flex justify-between items-start p-5 border"
      style={{
        backgroundColor: theme.colors.cardBg,
        borderRadius: theme.radius.lg,
        borderColor: theme.colors.border,
        boxShadow: theme.shadow.card,
      }}
    >
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
        <p className="text-xs mt-2" style={{ color: theme.colors.textMuted }}>
          {subtitle}
        </p>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
    </div>
  );
}

const ExamsResults = () => {
  const [search, setSearch] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("All Grades");

  const [examList, setExamList] = useState(examsData);

  const [openModal, setOpenModal] = useState(false);

  const filteredData = useMemo(() => {
    return examList.filter((exam) => {
      const matchesSearch = exam.examName
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesGrade =
        selectedGrade === "All Grades" || exam.grade === selectedGrade;

      return matchesSearch && matchesGrade;
    });
  }, [search, selectedGrade]);

  const columns = [
    {
      accessorKey: "examName",
      header: "Exam Name",
      cell: ({ row }) => (
        <div>
          <p
            className="font-semibold"
            style={{ color: theme.colors.textPrimary }}
          >
            {row.original.examName}
          </p>
          <p className="text-xs" style={{ color: theme.colors.textMuted }}>
            Max Marks: {row.original.marks}
          </p>
        </div>
      ),
    },
    { accessorKey: "grade", header: "Grade" },
    { accessorKey: "subject", header: "Subject" },
    {
      accessorKey: "date",
      header: "Date & Time",
      cell: ({ row }) => (
        <div>
          <p>{row.original.date}</p>
          <p className="text-xs" style={{ color: theme.colors.textMuted }}>
            {row.original.time}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;

        const statusClasses =
          status === "Upcoming"
            ? "bg-blue-100 text-blue-600"
            : status === "Completed"
              ? "bg-green-100 text-green-600"
              : "bg-yellow-100 text-yellow-700";

        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${statusClasses}`}
          >
            {status}
          </span>
        );
      },
    },
  ];

  const handleAddExam = (exam) => {
    setExamList((prev) => [exam, ...prev]);
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: theme.colors.background,
        padding: theme.layout.contentPadding,
        fontFamily: theme.typography.fontFamily,
      }}
    >
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mb-8">
        <div>
          <h3
            className="text-3xl font-bold"
            style={{
              color: theme.colors.textPrimary,
                         }}
          >
            Exams & Results
          </h3>

          <p
            className="text-xs md:text-sm mt-1"
            style={{ color: theme.colors.textSecondary }}
          >
            Manage exam schedules, definitions, and track student performance.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <select className="border rounded-xl px-4 py-2 bg-white text-sm">
            <option>Mid-Term 2026</option>
            <option>Final Term 2026</option>
          </select>

          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="border rounded-xl px-4 py-2 bg-white text-sm"
          >
            <option>All Grades</option>
            <option>Grade 1</option>
            <option>Grade 5</option>
            <option>Grade 8</option>
            <option>Grade 10</option>
          </select>

          <button
            onClick={() => setOpenModal(true)}
            className="text-white rounded-xl px-4 py-2 flex items-center gap-2 text-sm font-medium"
            style={{ backgroundColor: theme.colors.primary }}
          >
            <Plus size={16} /> Add Exam
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Upcoming Exams"
          value="12"
          subtitle="Next: Mathematics in 2 days"
          icon={<CalendarDays className="text-blue-600" />}
          color="bg-blue-100"
        />

        <StatsCard
          title="Results Pending"
          value="5"
          subtitle="2 overdue"
          icon={<AlertCircle className="text-yellow-600" />}
          color="bg-yellow-100"
        />

        <StatsCard
          title="Average Score"
          value="82.5%"
          subtitle="+4.2% vs last term"
          icon={<BarChart3 className="text-green-600" />}
          color="bg-green-100"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div
          className="xl:col-span-2 border p-6"
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.lg,
            borderColor: theme.colors.border,
            boxShadow: theme.shadow.card,
          }}
        >
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
            <h2
              className={theme.typography.h3}
              style={{ color: theme.colors.textPrimary }}
            >
              Exam Definitions
            </h2>

            <div className="relative w-full md:w-72">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search exams..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border rounded-xl pl-10 pr-4 py-2 text-sm"
              />
            </div>
          </div>

          <DataTable columns={columns} data={filteredData} />
        </div>

        <div
          className="border p-6"
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.lg,
            borderColor: theme.colors.border,
            boxShadow: theme.shadow.card,
          }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2
              className={theme.typography.h3}
              style={{ color: theme.colors.textPrimary }}
            >
              Results Distribution
            </h2>

            <select className="border rounded-xl px-3 py-2 text-sm bg-white">
              <option>All Grades</option>
              <option>Grade 10</option>
            </select>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="students"
                fill={theme.colors.primary}
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <AddExamModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onAdd={handleAddExam}
      />
    </div>
  );
};

export default ExamsResults;
