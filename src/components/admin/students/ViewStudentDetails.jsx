import { useState } from "react";
import {
  ArrowLeft,
  MessageSquare,
  Calendar,
  CreditCard,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  TrendingUp,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { theme } from "../../../theme/theme"; 

/* ─── Static Data ─────────────────────────────────────────────── */
const attendanceData = [
  { date: "Sep 1",  value: 100 },
  { date: "Sep 8",  value: 82  },
  { date: "Sep 15", value: 78  },
  { date: "Sep 22", value: 100 },
  { date: "Sep 29", value: 100 },
  { date: "Oct 6",  value: 98  },
  { date: "Oct 13", value: 62  },
  { date: "Oct 21", value: 98  },
];

const subjects = [
  { name: "Mathematics",        score: "92/100", grade: "A",  avg: 78 },
  { name: "Science",            score: "88/100", grade: "A-", avg: 75 },
  { name: "English Literature", score: "95/100", grade: "A+", avg: 82 },
];

const gradeStyle = {
  "A+": { bg: "#DCFCE7", text: "#16A34A" },
  "A":  { bg: "#D1FAE5", text: "#059669" },
  "A-": { bg: "#E0F2FE", text: "#0284C7" },
};

const recentActivity = [
  { label: "Term 1 Result Published", date: "Oct 24, 2024 • 10:00 AM",        dot: theme.colors.info    },
  { label: "Absent - Sick Leave",     date: "Oct 12, 2024",                    dot: theme.colors.warning },
  { label: "Fee Payment Received",    date: "Sep 01, 2024 • $450.00 via Card", dot: theme.colors.success },
  { label: "Enrollment Updated",      date: "Aug 15, 2024",                    dot: theme.colors.textMuted },
];

const tabs = ["Overview", "Guardians", "Fees & Payments", "Attendance", "Exams"];

/* ─── Style Helpers ───────────────────────────────────────────── */
const card = {
  background: theme.colors.cardBg,
  borderRadius: theme.radius.lg,
  boxShadow: theme.shadow.card,
  border: `1px solid ${theme.colors.border}`,
  padding: "20px",
};

const btnOutline = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "8px 16px",
  borderRadius: theme.radius.sm,
  border: `1px solid ${theme.colors.border}`,
  background: theme.colors.surface,
  color: theme.colors.textSecondary,
  fontSize: "13px",
  fontFamily: theme.typography.fontFamily,
  cursor: "pointer",
};

/* ─── Component ───────────────────────────────────────────────── */
export default function ViewStudentDetails() {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.colors.background,
        fontFamily: theme.typography.fontFamily,
        color: theme.colors.textPrimary,
        paddingBottom: "72px",
      }}
    >
      {/* ── Back Nav ── */}
      <div style={{ padding: "20px 24px 8px" }}>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "13px",
            color: theme.colors.textSecondary,
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: theme.typography.fontFamily,
          }}
        >
          <ArrowLeft size={14} /> Back to Students
        </button>
      </div>

      {/* ── Student Header Card ── */}
      <div style={{ margin: "0 24px 16px" }}>
        <div style={{ ...card, borderRadius: theme.radius.xl }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
            }}
          >
            {/* Avatar + Info */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ position: "relative" }}>
                <img
                  src="https://i.pravatar.cc/72?img=47"
                  alt="Sarah Jenkins"
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    objectFit: "cover",
                    boxShadow: `0 0 0 3px #fff, 0 0 0 4px ${theme.colors.border}`,
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    bottom: 2,
                    right: 2,
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: theme.colors.success,
                    border: "2px solid #fff",
                  }}
                />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <h1
                    style={{
                      fontSize: "20px",
                      fontWeight: 700,
                      margin: 0,
                      color: theme.colors.textPrimary,
                    }}
                  >
                    Sarah Jenkins
                  </h1>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      padding: "2px 10px",
                      borderRadius: "999px",
                      background: "#DCFCE7",
                      color: "#16A34A",
                      border: "1px solid #BBF7D0",
                    }}
                  >
                    Active
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "12px",
                    color: theme.colors.textMuted,
                    margin: "3px 0 4px",
                  }}
                >
                  #ST-2024-089 | Grade 10 – Section A
                </p>
                <div style={{ display: "flex", gap: "12px" }}>
                  {[
                    { icon: <Mail size={11} />, text: "sarah.j@student.edu" },
                    { icon: <Phone size={11} />, text: "+1 (555) 019-2834" },
                  ].map((item, i) => (
                    <span
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "12px",
                        color: theme.colors.textMuted,
                      }}
                    >
                      {item.icon} {item.text}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              <button style={btnOutline}>
                <MessageSquare size={14} /> Message Guardian
              </button>
              <button style={btnOutline}>
                <Calendar size={14} /> Record Attendance
              </button>
              <button
                style={{
                  ...btnOutline,
                  background: theme.colors.primary,
                  border: "none",
                  color: "#fff",
                  fontWeight: 600,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = theme.colors.primaryHover)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = theme.colors.primary)
                }
              >
                <CreditCard size={14} /> Collect Fee
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div
        style={{
          margin: "0 24px 16px",
          borderBottom: `1px solid ${theme.colors.border}`,
          display: "flex",
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "10px 16px",
                fontSize: "13px",
                fontWeight: isActive ? 600 : 500,
                fontFamily: theme.typography.fontFamily,
                color: isActive ? theme.colors.primary : theme.colors.textSecondary,
                background: "none",
                border: "none",
                borderBottom: isActive
                  ? `2px solid ${theme.colors.primary}`
                  : "2px solid transparent",
                cursor: "pointer",
                marginBottom: "-1px",
                transition: "color 0.15s",
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* ── Main Grid ── */}
      <div
        style={{
          margin: "0 24px",
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "16px",
        }}
      >
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Attendance Snapshot */}
          <div style={card}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h2 style={{ fontSize: "20px", fontWeight: 600, margin: 0, color: theme.colors.textPrimary }}>
                Attendance Snapshot
              </h2>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: theme.colors.success,
                }}
              >
                <TrendingUp size={14} /> 96% Overall
              </span>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart
                data={attendanceData}
                margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={theme.colors.primary}
                      stopOpacity={0.18}
                    />
                    <stop
                      offset="95%"
                      stopColor={theme.colors.primary}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: theme.colors.textMuted }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: theme.colors.textMuted }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: theme.radius.sm,
                    border: `1px solid ${theme.colors.border}`,
                    fontSize: 12,
                    fontFamily: theme.typography.fontFamily,
                  }}
                  itemStyle={{ color: theme.colors.primary }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={theme.colors.primary}
                  strokeWidth={2.5}
                  fill="url(#attGrad)"
                  dot={false}
                  activeDot={{ r: 4, fill: theme.colors.primary }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Academic Performance */}
          <div style={card}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h2 style={{ fontSize: "20px", fontWeight: 600, margin: 0, color: theme.colors.textPrimary }}>
                Academic Performance
              </h2>
              <select
                style={{
                  fontSize: "12px",
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.radius.sm,
                  padding: "6px 10px",
                  color: theme.colors.textSecondary,
                  background: theme.colors.surface,
                  fontFamily: theme.typography.fontFamily,
                  outline: "none",
                }}
              >
                <option>Term 1 (2024)</option>
                <option>Term 2 (2024)</option>
              </select>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    background: theme.colors.tableHeader,
                    borderBottom: `1px solid ${theme.colors.tableBorder}`,
                  }}
                >
                  {["Subject", "Score", "Grade", "Class Avg"].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        fontSize: "11px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: theme.colors.textMuted,
                        padding: "8px 10px",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subjects.map((s, i) => (
                  <tr
                    key={i}
                    style={{
                      borderBottom:
                        i < subjects.length - 1
                          ? `1px solid ${theme.colors.tableBorder}`
                          : "none",
                    }}
                  >
                    <td
                      style={{
                        padding: "12px 10px",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: theme.colors.textPrimary,
                      }}
                    >
                      {s.name}
                    </td>
                    <td
                      style={{
                        padding: "12px 10px",
                        fontSize: "13px",
                        color: theme.colors.textSecondary,
                      }}
                    >
                      {s.score}
                    </td>
                    <td style={{ padding: "12px 10px" }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: theme.radius.sm,
                          background: gradeStyle[s.grade]?.bg ?? "#F3F4F6",
                          color: gradeStyle[s.grade]?.text ?? theme.colors.textSecondary,
                        }}
                      >
                        {s.grade}
                      </span>
                    </td>
                   <td style={{ padding: "12px 10px", minWidth: "140px" }}>
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
    }}
  >
    {/* Progress Bar */}
    <div
      style={{
        flex: 1,
        height: "7px",
        background: theme.colors.border,
        borderRadius: "999px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${s.avg}%`,
          height: "100%",
          borderRadius: "999px",
          background:theme.colors.gray,
         transition: "width 0.3s ease",
        }}
      />
    </div>

    {/* Percentage */}
    <span
      style={{
        fontSize: "12px",
        fontWeight: 600,
        minWidth: "32px",
        color: theme.colors.textMuted,
      }}
    >
      {s.avg}%
    </span>
  </div>
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Fees Summary */}
          <div style={card}>
            <h2 style={{ fontSize: "20px", fontWeight: 600, margin: "0 0 12px" , color: theme.colors.textPrimary}}>
              Fees Summary
            </h2>

            {/* Overdue */}
            <div
              style={{
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                borderRadius: theme.radius.md,
                padding: "14px",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "4px",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: theme.colors.danger,
                  }}
                >
                  Overdue Amount
                </span>
                <AlertCircle size={15} color={theme.colors.danger} />
              </div>
              <p
                style={{
                  fontSize: "24px",
                  fontWeight: 800,
                  color: theme.colors.danger,
                  margin: 0,
                }}
              >
                $450.00
              </p>
              <p style={{ fontSize: "11px", color: "#F87171", margin: "3px 0 0" }}>
                Tuition Fee – Term 1 (Due Oct 15)
              </p>
            </div>

            {[
              { label: "Total Paid (YTD)", value: "$1,200.00" },
              { label: "Upcoming Due",     value: "$450.00 (Dec 1)" },
            ].map((row, i, arr) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom:
                    i < arr.length - 1
                      ? `1px solid ${theme.colors.border}`
                      : "none",
                }}
              >
                <span style={{ fontSize: "13px", color: theme.colors.textSecondary }}>
                  {row.label}
                </span>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: theme.colors.textPrimary,
                  }}
                >
                  {row.value}
                </span>
              </div>
            ))}

            <button
              style={{
                ...btnOutline,
                width: "100%",
                justifyContent: "center",
                marginTop: "12px",
              }}
            >
              View Fee History
            </button>
          </div>

          {/* Recent Activity */}
          <div style={card}>
            <h2 style={{ fontSize: "20px", fontWeight: 600, margin: "0 0 16px" , color: theme.colors.textPrimary}}>
              Recent Activity
            </h2>
            <ol
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                paddingLeft: "20px",
                position: "relative",
                borderLeft: `2px solid ${theme.colors.border}`,
              }}
            >
              {recentActivity.map((item, i) => (
                <li
                  key={i}
                  style={{
                    position: "relative",
                    marginBottom: i < recentActivity.length - 1 ? "18px" : 0,
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: "-27px",
                      top: "4px",
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: item.dot,
                      border: "2px solid #fff",
                      display: "block",
                    }}
                  />
                  <p
                    style={{
                      margin: 0,
                      fontSize: "13px",
                      fontWeight: 600,
                      color: theme.colors.textPrimary,
                      lineHeight: 1.4,
                    }}
                  >
                    {item.label}
                  </p>
                  <p
                    style={{
                      margin: "2px 0 0",
                      fontSize: "11px",
                      color: theme.colors.textMuted,
                    }}
                  >
                    {item.date}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

    
    </div>
  );
}
