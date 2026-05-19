import React, { useState } from "react";
import {
  Check,
  X,
  Clock,
  AlertTriangle,
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  History,
  Download,
  MoreHorizontal,
  Paperclip,
} from "lucide-react";

import {
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";

import { theme } from "../../../../theme/theme";

/* ─── Static Data ─────────────────────────────────────────────── */

const trendData = [
  { month: "Apr", student: 96, classAvg: 91 },
  { month: "May", student: 93, classAvg: 90 },
  { month: "Jun", student: 89, classAvg: 89 },
  { month: "Jul", student: 85, classAvg: 88 },
  { month: "Aug", student: 88, classAvg: 88 },
  { month: "Sep", student: 89, classAvg: 88 },
];

// September 2024 calendar data
const calendarDays = [
  { day: 26, cur: false, status: null },
  { day: 27, cur: false, status: null },
  { day: 28, cur: false, status: null },
  { day: 29, cur: false, status: null },
  { day: 30, cur: false, status: null },
  { day: 31, cur: false, status: null },
  { day: 1, cur: true, status: "present" },

  { day: 2, cur: true, status: "present" },
  { day: 3, cur: true, status: "absent" },
  { day: 4, cur: true, status: "present" },
  { day: 5, cur: true, status: "present" },
  { day: 6, cur: true, status: "late" },
  { day: 7, cur: true, status: null },
  { day: 8, cur: true, status: null },

  { day: 9, cur: true, status: "present" },
  { day: 10, cur: true, status: "present" },
  { day: 11, cur: true, status: "present" },
  { day: 12, cur: true, status: "present" },
  { day: 13, cur: true, status: "present" },
  { day: 14, cur: true, status: null },
  { day: 15, cur: true, status: null },
];

const historyRows = [
  {
    date: "06 Sep 2024",
    day: "Friday",
    period: "Full Day",
    status: "Late",
    reason: "Traffic delay",
    markedBy: "Mr. Roberts",
    initials: "MR",
    attachment: false,
  },
  {
    date: "03 Sep 2024",
    day: "Tuesday",
    period: "Full Day",
    status: "Absent",
    reason: "Medical - Fever",
    markedBy: "System (Parent Portal)",
    initials: "SJ",
    attachment: true,
  },
  {
    date: "28 Aug 2024",
    day: "Wednesday",
    period: "Period 4-6",
    status: "Left Early",
    reason: "Dentist Appointment",
    markedBy: "Admin Desk",
    initials: "AD",
    attachment: false,
  },
  {
    date: "15 Aug 2024",
    day: "Thursday",
    period: "Full Day",
    status: "Absent",
    reason: "Unexcused",
    reasonItalic: true,
    markedBy: "Mr. Roberts",
    initials: "MR",
    attachment: false,
  },
];

/* ─── Helpers ─────────────────────────────────────────────────── */

const statusConfig = {
  Late: {
    bg: "#FEF3C7",
    color: "#D97706",
    label: "Late",
  },

  Absent: {
    bg: "#FEE2E2",
    color: "#EF4444",
    label: "Absent",
  },

  "Left Early": {
    bg: "#FEF9C3",
    color: "#CA8A04",
    label: "Left Early",
  },
};

const calDotStyle = {
  present: { bg: "#DCFCE7", text: "#16A34A" },
  absent: { bg: "#FEE2E2", text: "#EF4444" },
  late: { bg: "#FEF3C7", text: "#D97706" },
};

const avatarColors = {
  MR: { bg: "#E5E7EB", text: "#6B7280" },
  SJ: { bg: "#EEF2FF", text: "#6366F1" },
  AD: { bg: "#F0FDF4", text: "#16A34A" },
};

/* ─── Component ───────────────────────────────────────────────── */

const AttendanceTab = () => {
  const [page, setPage] = useState(1);
  const [calMonth] = useState("September 2024");
  const [statusFilter] = useState("All Statuses");

  return (
    <div
      style={{
        fontFamily: theme.typography.fontFamily,
        color: theme.colors.textPrimary,
        margin: window.innerWidth < 768 ? "0 14px" : "0 24px",
      }}
      className="space-y-5 pb-10"
    >
      {/* ── Header ── */}

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <h2
            className="text-[17px] font-bold"
            style={{
              color: theme.colors.textPrimary,
            }}
          >
            Attendance Analytics
          </h2>

          <p
            className="text-[13px] mt-0.5"
            style={{
              color: theme.colors.textMuted,
            }}
          >
            Monitor daily presence, leaves, and overall attendance trends.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full lg:w-auto">
          <button
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-[13px] font-medium rounded-lg border transition-colors hover:bg-gray-50"
            style={{
              borderColor: theme.colors.border,
              color: theme.colors.textSecondary,
              background: theme.colors.surface,
              borderRadius: theme.radius.sm,
            }}
          >
            Term 1 (2024)
            <ChevronDown size={13} />
          </button>

          <button
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-[13px] font-semibold rounded-lg border transition-colors hover:opacity-90"
            style={{
              borderColor: "#BFDBFE",
              color: theme.colors.info,
              background: "#EFF6FF",
              borderRadius: theme.radius.sm,
            }}
          >
            <Bell size={13} />
            Alert Config
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Present % */}

        <div
          className="p-5 rounded-2xl border"
          style={{
            background: theme.colors.cardBg,
            borderColor: theme.colors.border,
            boxShadow: theme.shadow.card,
          }}
        >
          <div className="flex justify-between items-start mb-3">
            <p
              className="text-[13px] font-medium"
              style={{
                color: theme.colors.textSecondary,
              }}
            >
              Present %
            </p>

            <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
              <Check
                size={16}
                className="text-green-500"
                strokeWidth={2.5}
              />
            </div>
          </div>

          <p
            className="text-[26px] font-extrabold tracking-tight"
            style={{
              color: theme.colors.textPrimary,
            }}
          >
            88.5%
          </p>

          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="text-[11px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              +2%
            </span>

            <span
              className="text-[12px]"
              style={{
                color: theme.colors.textMuted,
              }}
            >
              vs Class Avg (86.5%)
            </span>
          </div>
        </div>

        {/* Total Absences */}

        <div
          className="p-5 rounded-2xl border"
          style={{
            background: theme.colors.cardBg,
            borderColor: theme.colors.border,
            boxShadow: theme.shadow.card,
          }}
        >
          <div className="flex justify-between items-start mb-3">
            <p
              className="text-[13px] font-medium"
              style={{
                color: theme.colors.textSecondary,
              }}
            >
              Total Absences
            </p>

            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
              <X
                size={16}
                className="text-red-500"
                strokeWidth={2.5}
              />
            </div>
          </div>

          <p
            className="text-[26px] font-extrabold tracking-tight"
            style={{
              color: theme.colors.textPrimary,
            }}
          >
            12
          </p>

          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span
              className="text-[11px] font-bold px-2 py-0.5 rounded-full"
              style={{
                background: "#FEE2E2",
                color: theme.colors.danger,
              }}
            >
              4 Unexcused
            </span>

            <span
              className="text-[12px]"
              style={{
                color: theme.colors.textMuted,
              }}
            >
              this term
            </span>
          </div>
        </div>

        {/* Late */}

        <div
          className="p-5 rounded-2xl border"
          style={{
            background: theme.colors.cardBg,
            borderColor: theme.colors.border,
            boxShadow: theme.shadow.card,
          }}
        >
          <div className="flex justify-between items-start mb-3">
            <p
              className="text-[13px] font-medium"
              style={{
                color: theme.colors.textSecondary,
              }}
            >
              Late / Left Early
            </p>

            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
              <Clock
                size={16}
                className="text-amber-500"
              />
            </div>
          </div>

          <p
            className="text-[26px] font-extrabold tracking-tight"
            style={{
              color: theme.colors.textPrimary,
            }}
          >
            5
          </p>

          <p
            className="text-[12px] mt-3"
            style={{
              color: theme.colors.textMuted,
            }}
          >
            3 Late, 2 Left Early
          </p>
        </div>

        {/* Warning */}

        <div
          className="p-5 rounded-2xl border flex flex-col items-center justify-center text-center"
          style={{
            background: "#FFF5F5",
            borderColor: "#FECACA",
            boxShadow: theme.shadow.card,
          }}
        >
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center mb-3">
            <AlertTriangle
              size={18}
              className="text-red-500"
            />
          </div>

          <p
            className="text-[13px] font-bold"
            style={{
              color: theme.colors.danger,
            }}
          >
            Low Attendance Warning
          </p>

          <p
            className="text-[12px] mt-1"
            style={{
              color: "#F87171",
            }}
          >
            Approaching 85% minimum threshold.
          </p>
        </div>
      </div>

      {/* ── Trend + Calendar ── */}

      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-4 min-w-0">
        {/* Chart */}

        <div
          className="rounded-2xl border p-5 min-w-0"
          style={{
            background: theme.colors.cardBg,
            borderColor: theme.colors.border,
            boxShadow: theme.shadow.card,
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <h3
              className="text-[15px] font-bold"
              style={{
                color: theme.colors.textPrimary,
              }}
            >
              Attendance Trend (Monthly)
            </h3>

            <div className="flex flex-wrap items-center gap-4">
              <span
                className="flex items-center gap-1.5 text-[12px]"
                style={{
                  color: theme.colors.textSecondary,
                }}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
                Student
              </span>

              <span
                className="flex items-center gap-1.5 text-[12px]"
                style={{
                  color: theme.colors.textMuted,
                }}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-gray-300 inline-block" />
                Class Avg
              </span>
            </div>
          </div>

          <div
            className="h-[240px] min-w-0"
            style={{
              width: "100%",
            }}
          >
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <AreaChart
                data={trendData}
                margin={{
                  top: 4,
                  right: 4,
                  left: -20,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id="studentGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#6366F1"
                      stopOpacity={0.15}
                    />

                    <stop
                      offset="95%"
                      stopColor="#6366F1"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme.colors.border}
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  tick={{
                    fontSize: 11,
                    fill: theme.colors.textMuted,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{
                    fontSize: 11,
                    fill: theme.colors.textMuted,
                  }}
                  axisLine={false}
                  tickLine={false}
                  domain={[70, 100]}
                />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="student"
                  stroke="#6366F1"
                  strokeWidth={2.5}
                  fill="url(#studentGrad)"
                  dot={false}
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
        </div>

        {/* Calendar */}

        <div
          className="rounded-2xl border p-5"
          style={{
            background: theme.colors.cardBg,
            borderColor: theme.colors.border,
            boxShadow: theme.shadow.card,
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3
              className="text-[15px] font-bold"
              style={{
                color: theme.colors.textPrimary,
              }}
            >
              {calMonth}
            </h3>

            <div className="flex items-center gap-1">
              <button
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                style={{
                  color: theme.colors.textSecondary,
                }}
              >
                <ChevronLeft size={16} />
              </button>

              <button
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                style={{
                  color: theme.colors.textSecondary,
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 mb-2">
            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(
              (d) => (
                <div
                  key={d}
                  className="text-center text-[11px] font-semibold py-1"
                  style={{
                    color: theme.colors.textMuted,
                  }}
                >
                  {d}
                </div>
              )
            )}
          </div>

          <div className="grid grid-cols-7 gap-y-1">
            {calendarDays.map((d, i) => {
              const style = d.status
                ? calDotStyle[d.status]
                : null;

              return (
                <div
                  key={i}
                  className="flex items-center justify-center"
                >
                  <div
                    className="w-8 h-8 flex items-center justify-center rounded-full text-[12px] font-semibold"
                    style={
                      style
                        ? {
                            background: style.bg,
                            color: style.text,
                          }
                        : {
                            color: d.cur
                              ? theme.colors.textSecondary
                              : theme.colors.textMuted,
                            opacity: d.cur ? 1 : 0.35,
                          }
                    }
                  >
                    {d.day}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── History ── */}

      <div
        className="rounded-2xl border p-5 overflow-hidden"
        style={{
          background: theme.colors.cardBg,
          borderColor: theme.colors.border,
          boxShadow: theme.shadow.card,
        }}
      >
        {/* Header */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: "#EEF2FF",
              }}
            >
              <History
                size={15}
                style={{
                  color: "#6366F1",
                }}
              />
            </div>

            <h3
              className="text-[15px] font-bold"
              style={{
                color: theme.colors.textPrimary,
              }}
            >
              Attendance History
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-[13px] font-medium rounded-lg border"
              style={{
                borderColor: theme.colors.border,
                color: theme.colors.textSecondary,
                background: theme.colors.surface,
              }}
            >
              {statusFilter}
              <ChevronDown size={13} />
            </button>

            <button
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-[13px] font-semibold rounded-lg border"
              style={{
                borderColor: theme.colors.border,
                color: theme.colors.textSecondary,
                background: theme.colors.surface,
              }}
            >
              <Download size={13} />
              Export
            </button>
          </div>
        </div>

        {/* Table */}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr
                style={{
                  borderBottom: `1px solid ${theme.colors.tableBorder}`,
                }}
              >
                {[
                  "Date",
                  "Period",
                  "Status",
                  "Reason",
                  "Marked By",
                  "Attachments",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left pb-3 pr-4 text-[11px] font-bold uppercase tracking-wider"
                    style={{
                      color: theme.colors.textMuted,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {historyRows.map((row, i) => {
                const sc =
                  statusConfig[row.status] || {};

                const av =
                  avatarColors[row.initials] || {};

                return (
                  <tr
                    key={i}
                    className="hover:bg-gray-50/50 transition-colors"
                    style={{
                      borderBottom:
                        i < historyRows.length - 1
                          ? `1px solid ${theme.colors.tableBorder}`
                          : "none",
                    }}
                  >
                    <td className="py-4 pr-4">
                      <p
                        className="text-[13px] font-semibold"
                        style={{
                          color:
                            theme.colors.textPrimary,
                        }}
                      >
                        {row.date}
                      </p>

                      <p
                        className="text-[11px]"
                        style={{
                          color:
                            theme.colors.textMuted,
                        }}
                      >
                        {row.day}
                      </p>
                    </td>

                    <td
                      className="py-4 pr-4 text-[13px]"
                      style={{
                        color:
                          theme.colors.textSecondary,
                      }}
                    >
                      {row.period}
                    </td>

                    <td className="py-4 pr-4">
                      <span
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                        style={{
                          background: sc.bg,
                          color: sc.color,
                        }}
                      >
                        {sc.label}
                      </span>
                    </td>

                    <td
                      className="py-4 pr-4 text-[13px]"
                      style={{
                        color:
                          theme.colors.textSecondary,
                      }}
                    >
                      {row.reason}
                    </td>

                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold"
                          style={{
                            background: av.bg,
                            color: av.text,
                          }}
                        >
                          {row.initials}
                        </div>

                        <span
                          className="text-[13px]"
                          style={{
                            color:
                              theme.colors.textSecondary,
                          }}
                        >
                          {row.markedBy}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 pr-4 text-center">
                      {row.attachment ? (
                        <Paperclip
                          size={15}
                          style={{
                            color: theme.colors.info,
                          }}
                        />
                      ) : (
                        <span
                          style={{
                            color:
                              theme.colors.textMuted,
                          }}
                        >
                          —
                        </span>
                      )}
                    </td>

                    <td className="py-4">
                      <button
                        style={{
                          color:
                            theme.colors.textMuted,
                        }}
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}

        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 mt-4 pt-3 border-t"
          style={{
            borderColor: theme.colors.border,
          }}
        >
          <p
            className="text-[12px]"
            style={{
              color: theme.colors.textMuted,
            }}
          >
            Showing 1 to 4 of 17 records
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() =>
                setPage((p) => Math.max(1, p - 1))
              }
              className="px-3 py-1.5 text-[12px] rounded-lg border disabled:opacity-40"
              style={{
                borderColor: theme.colors.border,
                color: theme.colors.textSecondary,
              }}
              disabled={page === 1}
            >
              Prev
            </button>

            {[1, 2].map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className="w-8 h-8 text-[12px] font-semibold rounded-lg"
                style={
                  page === n
                    ? {
                        background:
                          theme.colors.primary,
                        color: "#fff",
                      }
                    : {
                        color:
                          theme.colors.textSecondary,
                        border: `1px solid ${theme.colors.border}`,
                      }
                }
              >
                {n}
              </button>
            ))}

            <button
              onClick={() =>
                setPage((p) => Math.min(2, p + 1))
              }
              className="px-3 py-1.5 text-[12px] rounded-lg border disabled:opacity-40"
              style={{
                borderColor: theme.colors.border,
                color: theme.colors.textSecondary,
              }}
              disabled={page === 2}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTab;