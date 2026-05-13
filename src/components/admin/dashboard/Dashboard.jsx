import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Users,
  Wallet,
  BadgeCheck,
  PencilLine,
} from "lucide-react";

import { theme } from "../../../theme/theme";
import RecentActivityTable from "@/components/common-ui/RecentActivityTable";

// ── Data ─────────────────────────────────────────────────────────────────────
const feeData = [
  { month: "Jan", value: 13000 },
  { month: "Feb", value: 19500 },
  { month: "Mar", value: 16000 },
  { month: "Apr", value: 21500 },
  { month: "May", value: 18500 },
  { month: "Jun", value: 28000 },
];

const attendanceData = [
  { day: "Mon", rate: 92.1 },
  { day: "Tue", rate: 93.8 },
  { day: "Wed", rate: 90.5 },
  { day: "Thu", rate: 94.9 },
  { day: "Fri", rate: 93.2 },
];

// ── Reusable Card ────────────────────────────────────────────────────────────
const Card = ({ children, style = {} }) => (
  <div
    style={{
      backgroundColor: theme.colors.cardBg,
      borderRadius: theme.radius.lg,
      boxShadow: theme.shadow.card,
      border: `1px solid ${theme.colors.border}`,
      width: "100%",
      ...style,
    }}
  >
    {children}
  </div>
);

// ── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  value,
  badge,
  badgeColor,
  accentColor,
}) => (
  <Card
    style={{
      padding: "20px 20px 0",
      overflow: "hidden",
      minWidth: 0,
      height: "100%",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "10px",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: "52px",
          height: "52px",
          minWidth: "52px",
          borderRadius: "16px",
          background: iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={24} color={iconColor} strokeWidth={2.2} />
      </div>

      {/* Badge */}
      <span
        style={{
          fontSize: "0.75rem",
          fontWeight: 600,
          color: badgeColor,
          backgroundColor: badgeColor + "15",
          padding: "5px 10px",
          borderRadius: "999px",
          whiteSpace: "nowrap",
        }}
      >
        {badge}
      </span>
    </div>

    <p
      style={{
        color: theme.colors.textSecondary,
        fontSize: "0.8125rem",
        margin: "16px 0 6px",
        fontWeight: 500,
      }}
    >
      {label}
    </p>

    <p
      style={{
        color: theme.colors.textPrimary,
        fontSize: "1.4rem",
        fontWeight: 700,
        margin: "0 0 18px",
        wordBreak: "break-word",
      }}
    >
      {value}
    </p>

    <div
      style={{
        height: "4px",
        backgroundColor: accentColor,
        borderRadius: "999px",
        margin: "0 -20px",
      }}
    />
  </Card>
);

// ── Custom Dot ───────────────────────────────────────────────────────────────
const CustomDot = (props) => {
  const { cx, cy, stroke } = props;

  return (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      fill="#fff"
      stroke={stroke}
      strokeWidth={2}
    />
  );
};

// ── Dashboard ────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("Today");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const tabs = ["Today", "This Week", "This Month"];

  // ── Responsive Handler ────────────────────────────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      style={{
        backgroundColor: theme.colors.background,
        minHeight: "100vh",
        fontFamily: theme.typography.fontFamily,
        padding: isMobile ? "14px" : theme.layout.contentPadding,
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "stretch" : "flex-start",
          justifyContent: "space-between",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {/* Left */}
        <div className="flex flex-col gap-2">
  <h1
    style={{
      fontSize: isMobile ? "1.35rem" : "1.7rem",
      fontWeight: 700,
      color: theme.colors.textPrimary,
      fontFamily: theme.typography.fontFamily,
      margin: 0,
    }}
  >
    Overview
  </h1>

  <p
    style={{
      color: theme.colors.textSecondary,
      fontSize: "0.875rem",
      margin: 0,
      lineHeight: 1.5,
    }}
  >
    Here's what's happening at Bright Hill today.
  </p>
</div>

        {/* Right */}
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "stretch" : "center",
            gap: "10px",
            width: isMobile ? "100%" : "auto",
          }}
        >
          {/* Tabs */}
          <div
            style={{
              display: "flex",
              width: isMobile ? "100%" : "auto",
              overflowX: "auto",
              backgroundColor: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radius.lg,
              padding: "4px",
              gap: "4px",
              boxShadow: theme.shadow.card,
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: isMobile ? 1 : "unset",
                  padding: isMobile ? "8px 10px" : "6px 16px",
                  borderRadius: theme.radius.md,
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: activeTab === tab ? 700 : 500,
                  backgroundColor:
                    activeTab === tab
                      ? theme.colors.textPrimary
                      : "transparent",
                  color:
                    activeTab === tab
                      ? "#fff"
                      : theme.colors.textSecondary,
                  transition: "all 0.15s",
                  fontFamily: theme.typography.fontFamily,
                  whiteSpace: "nowrap",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Quick Action */}
          <button
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              backgroundColor: theme.colors.primary,
              color: "#fff",
              border: "none",
              borderRadius: theme.radius.md,
              padding: isMobile ? "11px 14px" : "9px 18px",
              fontWeight: 600,
              fontSize: "0.875rem",
              cursor: "pointer",
              fontFamily: theme.typography.fontFamily,
              width: isMobile ? "100%" : "auto",
            }}
          >
            <span style={{ fontSize: "1.1em" }}>+</span>
            Quick Action
          </button>
        </div>
      </div>

      {/* ── Stat Cards ─────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1fr"
            : "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        <StatCard
          icon={Users}
          iconBg="#EEF4FF"
          iconColor="#4F7CFF"
          label="Total Students"
          value="1,248"
          badge="↗ 2.4%"
          badgeColor={theme.colors.success}
          accentColor="#4F7CFF"
        />

        <StatCard
          icon={Wallet}
          iconBg="#FFF1F0"
          iconColor="#E66A61"
          label="Fee Due (This Month)"
          value="$42,500"
          badge="↘ 5.1%"
          badgeColor={theme.colors.danger}
          accentColor="#E66A61"
        />

        <StatCard
          icon={BadgeCheck}
          iconBg="#EEF9F0"
          iconColor="#58A66B"
          label="Attendance Today"
          value="94.2%"
          badge="Today"
          badgeColor={theme.colors.textMuted}
          accentColor="#58A66B"
        />

        <StatCard
          icon={PencilLine}
          iconBg="#F4EEFF"
          iconColor="#9B6BFF"
          label="Upcoming Exams"
          value="12"
          badge="Next 7 Days"
          badgeColor="#8B5CF6"
          accentColor="#9B6BFF"
        />
      </div>

      {/* ── Charts ─────────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        {/* Fee Collection */}
        <Card
          style={{
            padding: isMobile ? "18px 16px" : "22px 24px 16px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "10px",
            }}
          >
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: theme.colors.textPrimary,
                }}
              >
                Fee Collection
              </h3>

              <p
                style={{
                  margin: "2px 0 0",
                  fontSize: "0.8125rem",
                  color: theme.colors.textSecondary,
                }}
              >
                Monthly comparison (Last 6 months)
              </p>
            </div>

            <span
              style={{
                color: theme.colors.textMuted,
                fontSize: "1.2rem",
                cursor: "pointer",
              }}
            >
              ⋯
            </span>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <AreaChart
              data={feeData}
              margin={{ top: 10, right: 4, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="feeGrad" x1="0" y1="0" x2="0" y2="1">
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

              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme.colors.tableBorder}
                vertical={false}
              />

              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: theme.colors.textMuted }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{ fontSize: 12, fill: theme.colors.textMuted }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) =>
                  v === 0 ? "$0" : `$${v / 1000}k`
                }
              />

              <Tooltip
                formatter={(v) => [`$${v.toLocaleString()}`, "Fee"]}
                contentStyle={{
                  borderRadius: theme.radius.md,
                  border: `1px solid ${theme.colors.border}`,
                  fontSize: "0.8125rem",
                  fontFamily: theme.typography.fontFamily,
                }}
              />

              <Area
                type="monotone"
                dataKey="value"
                stroke={theme.colors.primary}
                strokeWidth={2.5}
                fill="url(#feeGrad)"
                dot={false}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Attendance Trend */}
        <Card
          style={{
            padding: isMobile ? "18px 16px" : "22px 24px 16px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "10px",
            }}
          >
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: theme.colors.textPrimary,
                }}
              >
                Attendance Trend
              </h3>

              <p
                style={{
                  margin: "2px 0 0",
                  fontSize: "0.8125rem",
                  color: theme.colors.textSecondary,
                }}
              >
                Average daily attendance rate
              </p>
            </div>

            <span
              style={{
                color: theme.colors.textMuted,
                fontSize: "1.2rem",
                cursor: "pointer",
              }}
            >
              ⋯
            </span>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={attendanceData}
              margin={{ top: 10, right: 4, left: -20, bottom: 0 }}
            >
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
                domain={[80, 100]}
                tick={{ fontSize: 12, fill: theme.colors.textMuted }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
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

              <Line
                type="monotone"
                dataKey="rate"
                stroke={theme.colors.info}
                strokeWidth={2.5}
                dot={<CustomDot stroke={theme.colors.info} />}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* ── Recent Activity Table ──────────────────────────────────────────── */}
      <div
        style={{
          width: "100%",
          overflowX: "auto",
        }}
      >
        <RecentActivityTable />
      </div>
    </div>
  );
};

export default Dashboard;