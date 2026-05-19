import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  PieChart,
  Award,
  BarChart2,
  Star,
  Search,
  FileText,
  Eye,
  Download,
  TrendingUp,
  Target,
  Maximize2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { theme } from "../../../../theme/theme";

/* ─── Static Data ─────────────────────────────────────────────── */
const trendData = [
  { exam: "Term 1 Mid",   student: 82, classAvg: 75 },
  { exam: "Term 1 Final", student: 85, classAvg: 76 },
  { exam: "Term 2 Mid",   student: 83, classAvg: 76 },
  { exam: "Term 2 Final", student: 88, classAvg: 77 },
];

const radarData = [
  { subject: "Physics",  score: 88 },
  { subject: "Chem",     score: 85 },
  { subject: "English",  score: 95 },
  { subject: "Math",     score: 92 },
  { subject: "History",  score: 78 },
  { subject: "Comp Sci", score: 82 },
];

const exams = [
  {
    id: 1,
    name: "Term 2 Final Examination",
    date: "Mar 15, 2024",
    total: 500,
    obtained: 438,
    grade: "A",
    status: "Published",
    subjects: [
      { name: "Mathematics",        max: 100, score: 92, grade: "A+", remark: "Excellent problem-solving skills." },
      { name: "Physics",            max: 100, score: 88, grade: "A",  remark: "Strong theoretical understanding." },
      { name: "Chemistry",          max: 100, score: 85, grade: "A",  remark: "Good laboratory work." },
      { name: "English Literature", max: 100, score: 95, grade: "A+", remark: "Outstanding analytical essays." },
      { name: "History",            max: 100, score: 78, grade: "B+", remark: "Needs more focus on dates.", low: true },
    ],
  },
  {
    id: 2,
    name: "Mid-Term 2 Assessment",
    date: "Jan 20, 2024",
    total: 250,
    obtained: 215,
    grade: "A",
    status: "Published",
    subjects: [],
  },
  {
    id: 3,
    name: "Term 1 Final Examination",
    date: "Nov 10, 2023",
    total: 500,
    obtained: 412,
    grade: "A-",
    status: "Published",
    subjects: [],
  },
];

const gradeColor = {
  "A+": { bg: "#DCFCE7", text: "#16A34A" },
  "A":  { bg: "#D1FAE5", text: "#059669" },
  "A-": { bg: "#E0F2FE", text: "#0284C7" },
  "B+": { bg: "#FEF3C7", text: "#D97706" },
};

const COL = "2fr 1.2fr 1fr 1fr 0.8fr 1fr";
const SUB_COL = "2fr 0.8fr 0.8fr 0.8fr 3fr";

/* ─── Component ───────────────────────────────────────────────── */
const ExamTab = () => {
  const [expandedExam, setExpandedExam] = useState(1);
  const [search, setSearch] = useState("");

  const toggle = (id) => setExpandedExam((prev) => (prev === id ? null : id));

  return (
    <div
      style={{ fontFamily: theme.typography.fontFamily, color: theme.colors.textPrimary }}
      className="space-y-5 pb-10 mx-3 md:mx-6"
    >
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h2 className="text-[17px] font-bold" style={{ color: theme.colors.textPrimary }}>
            Academic Performance
          </h2>
          <p className="text-[12px] md:text-[13px] mt-0.5" style={{ color: theme.colors.textMuted }}>
            Comprehensive overview of examination results and academic standing.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {["Academic Year 2023-2024", "All Terms"].map((label, i) => (
            <button
              key={i}
              className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium rounded-lg border hover:bg-gray-50 transition-colors"
              style={{
                borderColor: theme.colors.border,
                color: theme.colors.textSecondary,
                background: theme.colors.surface,
                borderRadius: theme.radius.sm,
              }}
            >
              {label} <ChevronDown size={13} />
            </button>
          ))}
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Overall Score */}
        <div
          className="p-5 rounded-2xl border"
          style={{ background: theme.colors.cardBg, borderColor: theme.colors.border, boxShadow: theme.shadow.card }}
        >
          <div className="flex justify-between items-start mb-3">
            <p className="text-[13px] font-medium" style={{ color: theme.colors.textSecondary }}>Overall Score</p>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#EEF2FF" }}>
              <PieChart size={18} color="#6366F1" />
            </div>
          </div>
          <p className="text-[26px] font-extrabold tracking-tight" style={{ color: theme.colors.textPrimary }}>
            87.5<span className="text-[16px] font-bold">%</span>
          </p>
          <div className="flex items-center gap-2 mt-3">
            <span className="flex items-center gap-0.5 text-[11px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              ↑ 3.2%
            </span>
            <span className="text-[12px]" style={{ color: theme.colors.textMuted }}>vs Last Term</span>
          </div>
        </div>

        {/* Cumulative GPA */}
        <div
          className="p-5 rounded-2xl border"
          style={{ background: theme.colors.cardBg, borderColor: theme.colors.border, boxShadow: theme.shadow.card }}
        >
          <div className="flex justify-between items-start mb-3">
            <p className="text-[13px] font-medium" style={{ color: theme.colors.textSecondary }}>Cumulative GPA</p>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#F0FDF4" }}>
              <Award size={18} color="#22C55E" />
            </div>
          </div>
          <p className="text-[26px] font-extrabold tracking-tight" style={{ color: theme.colors.textPrimary }}>
            3.8<span className="text-[16px] font-semibold text-gray-400">/4.0</span>
          </p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[11px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Excellent</span>
            <span className="text-[12px]" style={{ color: theme.colors.textMuted }}>Top 10% of class</span>
          </div>
        </div>

        {/* Class Rank */}
        <div
          className="p-5 rounded-2xl border"
          style={{ background: theme.colors.cardBg, borderColor: theme.colors.border, boxShadow: theme.shadow.card }}
        >
          <div className="flex justify-between items-start mb-3">
            <p className="text-[13px] font-medium" style={{ color: theme.colors.textSecondary }}>Class Rank</p>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#FFFBEB" }}>
              <BarChart2 size={18} color="#F59E0B" />
            </div>
          </div>
          <p className="text-[26px] font-extrabold tracking-tight" style={{ color: theme.colors.textPrimary }}>
            4<span className="text-[16px] font-semibold text-gray-400">th</span>
          </p>
          <p className="text-[12px] mt-3" style={{ color: theme.colors.textMuted }}>Out of 42 students</p>
        </div>

        {/* Credits Earned */}
        <div
          className="p-5 rounded-2xl border"
          style={{ background: theme.colors.cardBg, borderColor: theme.colors.border, boxShadow: theme.shadow.card }}
        >
          <div className="flex justify-between items-start mb-3">
            <p className="text-[13px] font-medium" style={{ color: theme.colors.textSecondary }}>Credits Earned</p>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#F5F3FF" }}>
              <Star size={18} color="#8B5CF6" fill="#8B5CF6" />
            </div>
          </div>
          <p className="text-[26px] font-extrabold tracking-tight" style={{ color: theme.colors.textPrimary }}>
            24<span className="text-[16px] font-semibold text-gray-400">/24</span>
          </p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[11px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">On Track</span>
            <span className="text-[12px]" style={{ color: theme.colors.textMuted }}>For graduation</span>
          </div>
        </div>
      </div>

      {/* ── Trend Chart + Radar ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-4">

        {/* Performance Trend */}
        <div
          className="rounded-2xl border p-5"
          style={{ background: theme.colors.cardBg, borderColor: theme.colors.border, boxShadow: theme.shadow.card }}
        >
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-[15px] font-bold" style={{ color: theme.colors.textPrimary }}>
              Performance Trend Across Exams
            </h3>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-[12px]" style={{ color: theme.colors.textSecondary }}>
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" /> Student Score
              </span>
              <span className="flex items-center gap-1.5 text-[12px]" style={{ color: theme.colors.textMuted }}>
                <span className="w-2.5 h-2.5 rounded-full bg-gray-300 inline-block" /> Class Average
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={trendData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="examGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366F1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} vertical={false} />
              <XAxis dataKey="exam" tick={{ fontSize: 11, fill: theme.colors.textMuted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: theme.colors.textMuted }} axisLine={false} tickLine={false} domain={[60, 100]} />
              <Tooltip
                contentStyle={{
                  borderRadius: theme.radius.sm,
                  border: `1px solid ${theme.colors.border}`,
                  fontSize: 12,
                  fontFamily: theme.typography.fontFamily,
                }}
              />
              <Area
                type="monotone"
                dataKey="student"
                stroke="#6366F1"
                strokeWidth={2.5}
                fill="url(#examGrad)"
                dot={{ r: 4, fill: "#6366F1", strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="classAvg"
                stroke="#D1D5DB"
                strokeWidth={1.5}
                strokeDasharray="5 4"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Subject Proficiency Radar */}
        <div
          className="rounded-2xl border p-5"
          style={{ background: theme.colors.cardBg, borderColor: theme.colors.border, boxShadow: theme.shadow.card }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[15px] font-bold" style={{ color: theme.colors.textPrimary }}>Subject Proficiency</h3>
            <button style={{ color: theme.colors.textMuted }} className="hover:text-gray-600">
              <Maximize2 size={15} />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
              <PolarGrid stroke={theme.colors.border} />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: theme.colors.textSecondary, fontWeight: 600 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: theme.colors.textMuted }} tickCount={6} />
              <Radar name="Score" dataKey="score" stroke="#6366F1" fill="#6366F1" fillOpacity={0.18} strokeWidth={2} />
              <Tooltip
                contentStyle={{
                  borderRadius: theme.radius.sm,
                  border: `1px solid ${theme.colors.border}`,
                  fontSize: 12,
                  fontFamily: theme.typography.fontFamily,
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Exam History + Reports ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-4">

        {/* Examination History */}
        <div
          className="rounded-2xl border p-5"
          style={{ background: theme.colors.cardBg, borderColor: theme.colors.border, boxShadow: theme.shadow.card }}
        >
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#EEF2FF" }}>
                <FileText size={15} color="#6366F1" />
              </div>
              <h3 className="text-[15px] font-bold" style={{ color: theme.colors.textPrimary }}>Examination History</h3>
            </div>
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search exams..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-44 pl-8 pr-3 py-2 text-[12px] border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-100 placeholder:text-gray-400"
                style={{ borderColor: theme.colors.border, borderRadius: theme.radius.sm }}
              />
            </div>
          </div>

          {/* Scrollable Table */}
          <div className="overflow-x-auto">
            <div style={{ minWidth: 640 }}>

              {/* Table Head */}
              <div
                className="grid px-1 pb-2 text-[11px] font-semibold uppercase tracking-wide"
                style={{
                  gridTemplateColumns: COL,
                  color: theme.colors.textMuted,
                  borderBottom: `1px solid ${theme.colors.tableBorder}`,
                }}
              >
                <span>Exam Name</span>
                <span>Date</span>
                <span className="text-center">Total</span>
                <span className="text-center">Obtained</span>
                <span className="text-center">Grade</span>
                <span className="text-center">Status</span>
              </div>

              {/* Exam Rows */}
              {exams
                .filter((e) => e.name.toLowerCase().includes(search.toLowerCase()))
                .map((exam) => {
                  const isOpen = expandedExam === exam.id;
                  const gc = gradeColor[exam.grade] || { bg: "#F3F4F6", text: "#6B7280" };
                  return (
                    <div key={exam.id}>
                      {/* Row */}
                      <div
                        className="grid items-center py-3.5 px-1 cursor-pointer hover:bg-gray-50/60 rounded-lg transition-colors"
                        style={{
                          gridTemplateColumns: COL,
                          borderBottom: `1px solid ${theme.colors.tableBorder}`,
                        }}
                        onClick={() => toggle(exam.id)}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span style={{ color: theme.colors.textMuted, flexShrink: 0 }}>
                            {isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                          </span>
                          <span className="text-[13px] font-semibold truncate" style={{ color: theme.colors.textPrimary }}>
                            {exam.name}
                          </span>
                        </div>
                        <span className="text-[12px]" style={{ color: theme.colors.textMuted }}>{exam.date}</span>
                        <span className="text-[13px] text-center" style={{ color: theme.colors.textSecondary }}>{exam.total}</span>
                        <span className="text-[14px] font-bold text-center" style={{ color: theme.colors.textPrimary }}>{exam.obtained}</span>
                        <div className="flex justify-center">
                          <span
                            className="w-8 h-8 flex items-center justify-center rounded-full text-[12px] font-bold"
                            style={{ background: gc.bg, color: gc.text }}
                          >
                            {exam.grade}
                          </span>
                        </div>
                        <div className="flex justify-center">
                          <span
                            className="text-[11px] font-semibold px-3 py-1 rounded-full border"
                            style={{ color: "#22C55E", borderColor: "#BBF7D0", background: "#F0FDF4" }}
                          >
                            {exam.status}
                          </span>
                        </div>
                      </div>

                      {/* Expanded Subjects */}
                      {isOpen && exam.subjects.length > 0 && (
                        <div
                          className="mx-1 mb-2 rounded-xl overflow-hidden"
                          style={{ background: theme.colors.tableHeader, border: `1px solid ${theme.colors.tableBorder}` }}
                        >
                          {/* Sub-header */}
                          <div
                            className="grid px-4 py-2 text-[10px] font-bold uppercase tracking-wider"
                            style={{ gridTemplateColumns: SUB_COL, color: theme.colors.textMuted }}
                          >
                            <span>Subject</span>
                            <span className="text-center">Max</span>
                            <span className="text-center">Score</span>
                            <span className="text-center">Grade</span>
                            <span>Remarks</span>
                          </div>

                          {exam.subjects.map((sub, si) => {
                            const sgc = gradeColor[sub.grade] || { bg: "#F3F4F6", text: "#6B7280" };
                            return (
                              <div
                                key={si}
                                className="grid px-4 py-3 items-center"
                                style={{
                                  gridTemplateColumns: SUB_COL,
                                  borderTop: `1px solid ${theme.colors.tableBorder}`,
                                  background: "#FFFFFF",
                                }}
                              >
                                <span className="text-[13px] font-medium" style={{ color: theme.colors.textPrimary }}>{sub.name}</span>
                                <span className="text-[12px] text-center" style={{ color: theme.colors.textMuted }}>{sub.max}</span>
                                <span
                                  className="text-[13px] font-bold text-center"
                                  style={{ color: sub.low ? theme.colors.warning : theme.colors.textPrimary }}
                                >
                                  {sub.score}
                                </span>
                                <div className="flex justify-center">
                                  <span
                                    className="text-[11px] font-bold px-2 py-0.5 rounded"
                                    style={{ background: sgc.bg, color: sgc.text }}
                                  >
                                    {sub.grade}
                                  </span>
                                </div>
                                <span className="text-[12px]" style={{ color: theme.colors.textMuted }}>{sub.remark}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: `1px solid ${theme.colors.border}` }}>
            <p className="text-[12px]" style={{ color: theme.colors.textMuted }}>Showing 3 of 8 exams</p>
            <button
              className="text-[13px] font-semibold hover:opacity-80 transition-opacity"
              style={{ color: theme.colors.info }}
            >
              View All Exams
            </button>
          </div>
        </div>

        {/* Reports & Insights */}
        <div className="flex flex-col gap-4">

          {/* Report Card */}
          <div
            className="rounded-2xl border p-5"
            style={{ background: theme.colors.cardBg, borderColor: theme.colors.border, boxShadow: theme.shadow.card }}
          >
            <h3 className="text-[15px] font-bold mb-4" style={{ color: theme.colors.textPrimary }}>Report & Insights</h3>
            <div
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: theme.colors.tableHeader, border: `1px solid ${theme.colors.tableBorder}` }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#FEE2E2" }}>
                <FileText size={18} color="#EF4444" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold truncate" style={{ color: theme.colors.textPrimary }}>
                  Term 2 Report Card.pdf
                </p>
                <p className="text-[11px]" style={{ color: theme.colors.textMuted }}>
                  Generated Mar 20, 2024 • 1.2 MB
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-3">
              <button
                className="flex items-center gap-1.5 text-[12px] font-semibold hover:opacity-80 transition-opacity"
                style={{ color: theme.colors.info }}
              >
                <Eye size={13} /> Preview
              </button>
              <button
                className="flex items-center gap-1.5 text-[12px] font-semibold hover:opacity-80 transition-opacity"
                style={{ color: theme.colors.info }}
              >
                <Download size={13} /> Download
              </button>
            </div>
          </div>

          {/* Academic Insights */}
          <div
            className="rounded-2xl border p-5"
            style={{ background: theme.colors.cardBg, borderColor: theme.colors.border, boxShadow: theme.shadow.card }}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: theme.colors.textMuted }}>
              Academic Insights
            </p>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <TrendingUp size={14} color="#22C55E" />
                </div>
                <div>
                  <p className="text-[13px] font-bold" style={{ color: theme.colors.textPrimary }}>Strong Subjects</p>
                  <p className="text-[12px] mt-0.5" style={{ color: theme.colors.textSecondary }}>
                    Exceptional performance in English Literature and Mathematics consistently over the last 3 terms.
                  </p>
                </div>
              </div>

              <div style={{ borderTop: `1px solid ${theme.colors.border}` }} />

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Target size={14} color="#F59E0B" />
                </div>
                <div>
                  <p className="text-[13px] font-bold" style={{ color: theme.colors.textPrimary }}>Areas for Improvement</p>
                  <p className="text-[12px] mt-0.5" style={{ color: theme.colors.textSecondary }}>
                    History scores show a slight dip. Recommended focus on historical timelines and essay structuring.
                  </p>
                </div>
              </div>
            </div>

            {/* Teacher Comment */}
            <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${theme.colors.border}` }}>
              <div className="flex items-center gap-2.5 mb-3">
                <img src="https://i.pravatar.cc/40?img=32" alt="Teacher" className="w-8 h-8 rounded-full object-cover" />
                <p className="text-[13px] font-semibold" style={{ color: theme.colors.textPrimary }}>
                  Mrs. Davis (Class Teacher)
                </p>
              </div>
              <blockquote className="text-[12px] italic leading-relaxed" style={{ color: theme.colors.textSecondary }}>
                "Sarah is a dedicated student who actively participates in class. Her analytical skills in literature are
                particularly impressive. Keep up the excellent work!"
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamTab;