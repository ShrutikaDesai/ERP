import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    Tooltip,
} from "recharts";

import { Users } from "lucide-react";
import { theme } from "../../../theme/theme";
import { useNavigate } from "react-router-dom";



function Avatar({ src, name, size = 40 }) {
    const initials = name
        ?.split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    if (src) {
        return (
            <img
                src={src}
                alt={name}
                className="rounded-full object-cover"
                style={{
                    width: size,
                    height: size,
                }}
            />
        );
    }

    

    return (
        <div
            className="rounded-full flex items-center justify-center text-xs font-semibold"
            style={{
                width: size,
                height: size,
                background: theme.colors.sidebarActive,
                color: theme.colors.primary,
            }}
        >
            {initials}
        </div>
    );
}

function Badge({ children, variant = "default" }) {
    const variants = {
        active: {
            bg: "#ECFDF3",
            color: theme.colors.success,
            border: "#BBF7D0",
        },

        inactive: {
            bg: "#F3F4F6",
            color: theme.colors.textSecondary,
            border: "#E5E7EB",
        },

        due: {
            bg: "#FEF2F2",
            color: theme.colors.danger,
            border: "#FECACA",
        },
    };

    return (
        <span
            className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border"
            style={{
                background: variants[variant].bg,
                color: variants[variant].color,
                borderColor: variants[variant].border,
            }}
        >
            {children}
        </span>
    );
}

export default function StudentDrawer({
    selectedStudent,
    setSelectedStudent,
}) {

    const navigate = useNavigate();

    if (!selectedStudent) return null;

    const attendanceTrend = [
        { month: "Jan", value: 92 },
        { month: "Feb", value: 88 },
        { month: "Mar", value: 95 },
        { month: "Apr", value: 90 },
        { month: "May", value: selectedStudent?.attendance || 0 },
    ];

    return (
        <>
            {/* OVERLAY */}
            <div
                onClick={() => setSelectedStudent(null)}
                className="fixed inset-0 z-40"
                style={{
                    background: "rgba(15, 23, 42, 0.45)",
                    backdropFilter: "blur(3px)",
                }}
            />

            {/* DRAWER */}
            <div
                className="fixed top-0 right-0 h-screen z-50 flex flex-col overflow-hidden transition-all duration-300"
                style={{
                    width: "min(380px, 100%)",
                    background: theme.colors.drawerBg,
                    boxShadow: theme.shadow.drawer,
                    borderLeft: `1px solid ${theme.colors.border}`,
                }}
            >
                {/* HEADER */}
                <div
                    className="sticky top-0 px-5 py-2 flex items-center justify-between"
                    style={{
                        background: theme.colors.drawerHeader,
                        borderBottom: `1px solid ${theme.colors.border}`,
                        zIndex: 10,
                    }}
                >
                    <div>
                        <h2
                            className="text-base font-semibold"
                            style={{
                                color: theme.colors.textPrimary,
                            }}
                        >
                            Student Details
                        </h2>
                    </div>


                    <button
                        onClick={() => setSelectedStudent(null)}
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                        style={{
                            background: theme.colors.surface,
                            border: `1px solid ${theme.colors.border}`,
                        }}
                    >
                        ✕
                    </button>
                </div><br></br>

                {/* BODY */}
                <div className="flex-1 overflow-y-auto px-4" style={{ marginTop: "0" }}>
                    {/* PROFILE */}
                    <div className="flex flex-col items-center text-center">
                        <div className="relative">
                            <Avatar
                                src={selectedStudent?.avatar}
                                name={selectedStudent?.name}
                                size={56}
                            />

                            <div
                                className="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2"
                                style={{
                                    background:
                                        selectedStudent?.status === "Active"
                                            ? theme.colors.success
                                            : theme.colors.danger,
                                    borderColor: theme.colors.drawerBg,
                                }}
                            />
                        </div>

                        <h2
                            className="mt-1 text-base font-semibold"
                            style={{
                                color: theme.colors.textPrimary,
                                lineHeight: "1.2",
                            }}
                        >
                            {selectedStudent?.name}
                        </h2>

                        <p
                            className="text-xs mt-0.5"
                            style={{
                                color: theme.colors.textSecondary,
                            }}
                        >
                            {selectedStudent?.admNo}
                        </p>

                        <div className="mt-1 flex gap-1.5 flex-wrap justify-center">
                            <Badge
                                variant={
                                    selectedStudent?.status === "Active"
                                        ? "active"
                                        : "inactive"
                                }
                            >
                                {selectedStudent?.status}
                            </Badge>

                            {selectedStudent?.feeDue && (
                                <Badge variant="due">
                                    Fee Due
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* QUICK STATS */}
                    <div className="grid grid-cols-2 gap-3 mt-4">
                        <div
                            className="rounded-2xl p-4"
                            style={{
                                background: theme.colors.drawerCard,
                                border: `1px solid ${theme.colors.border}`,
                            }}
                        >
                            <p
                                className="text-xs uppercase font-semibold mb-2"
                                style={{
                                    color: theme.colors.textMuted,
                                }}
                            >
                                Attendance
                            </p>

                            <h3
                                className="text-base font-bold"
                                style={{
                                    color: theme.colors.textPrimary,
                                }}
                            >
                                {selectedStudent?.attendance}%
                            </h3>

                        </div>

                        <div
                            className="rounded-2xl p-3"
                            style={{
                                background: theme.colors.drawerCard,
                                border: `1px solid ${theme.colors.border}`,
                            }}
                        >
                            <p
                                className="text-xs uppercase font-semibold mb-2"
                                style={{
                                    color: theme.colors.textMuted,
                                }}
                            >
                                Grade
                            </p>

                            <h3
                                className="text-base font-bold"
                                style={{
                                    color: theme.colors.primary,
                                }}
                            >
                                {selectedStudent?.grade}
                            </h3>
                        </div>
                    </div>

                    {/* DETAILS */}
                    {/* DETAILS */}
                    <div className="mt-3 flex flex-col gap-3">

                        {/* SECTION TITLE */}
                        <h3
                            className="text-xs font-semibold tracking-[2px] uppercase"
                            style={{
                                color: theme.colors.textPrimary,
                            }}
                        >
                            Guardian Information
                        </h3>

                        {/* GUARDIAN CARD */}
                        <div
                            className="rounded-[24px] p-3 flex items-center gap-3"
                            style={{
                                background: "#FFFFFF",
                                border: "1px solid #E5E7EB",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                            }}
                        >
                            {/* ICON */}
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center"
                                style={{
                                    background: "#EEF2FF",
                                }}
                            >
                                <Users
                                    size={20}
                                    color="#4F6FD9"
                                />
                            </div>

                            {/* CONTENT */}
                            <div className="flex flex-col">
                                <h4
                                    className="text-sm font-semibold"
                                    style={{
                                        color: "#1F2937",
                                    }}
                                >
                                    {selectedStudent?.guardian}
                                </h4>

                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-sm">📞</span>

                                    <p
                                        className="text-sm"
                                        style={{
                                            color: "#4B5563",
                                        }}
                                    >
                                        {selectedStudent?.guardianPhone}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* EMAIL CARD */}
                        <div
                            className="rounded-[24px] p-3 flex items-center gap-3"
                            style={{
                                background: "#FFFFFF",
                                border: "1px solid #E5E7EB",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                            }}
                        >
                            {/* ICON */}
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center"
                                style={{
                                    background: "#FFF7ED",
                                }}
                            >
                                <span className="text-xl">✉️</span>
                            </div>

                            {/* CONTENT */}
                            <div className="flex flex-col">
                                <h4
                                    className="text-sm font-medium"
                                    style={{
                                        color: "#1F2937",
                                    }}
                                >
                                    Primary Email
                                </h4>

                                <p
                                    className="text-sm mt-1"
                                    style={{
                                        color: "#4B5563",
                                    }}
                                >
                                    {selectedStudent?.email || "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* ATTENDANCE CHART */}
                    <div
                        className="rounded-2xl p-4 mt-2"
                        style={{
                            background: theme.colors.drawerCard,
                            border: `1px solid ${theme.colors.border}`,
                        }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <p
                                className="text-xs uppercase font-semibold"
                                style={{ color: theme.colors.textMuted }}
                            >
                                Attendance Trend
                            </p>

                            <span
                                className="text-xs font-semibold"
                                style={{ color: theme.colors.primary }}
                            >
                                Last 5 Months
                            </span>
                        </div>

                        <ResponsiveContainer width="100%" height={90}>
                            <AreaChart data={attendanceTrend}>
                                <defs>
                                    <linearGradient id="attColor" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={theme.colors.primary} stopOpacity={0.4} />
                                        <stop offset="95%" stopColor={theme.colors.primary} stopOpacity={0} />
                                    </linearGradient>
                                </defs>

                                <XAxis
                                    dataKey="month"
                                    tick={{ fill: theme.colors.textMuted, fontSize: 12 }}
                                />

                                <Tooltip />

                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke={theme.colors.primary}
                                    fill="url(#attColor)"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                </div>

                {/* FOOTER */}
                <div
                    className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
                    style={{
                        background: theme.colors.surface,
                        borderTop: `1px solid ${theme.colors.border}`,
                    }}
                >
                    <button
    onClick={() =>
        navigate(`/s-admin/student-details/${selectedStudent?.id}`)
    }
    className="flex-1 py-2 rounded-2xl text-sm font-semibold transition-all"
    style={{
        background: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        color: theme.colors.textPrimary,
    }}
>
    View Profile
</button>

                    <button
                        className="flex-1 py-2 rounded-2xl text-sm font-semibold text-white transition-all"
                        style={{
                            background: theme.colors.primary,
                        }}
                    >
                        Edit Student
                    </button>
                </div>
            </div>
        </>
    );
}