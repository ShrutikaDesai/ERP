import React, { useState } from "react";
import {
    TrendingUp,
    Clock,
    AlertCircle,
    MoreHorizontal,
    Search,
    SlidersHorizontal,
    CheckCircle2,
    ChevronDown,
    CalendarDays,
    Plus,
    Maximize2,
    Wallet,
} from "lucide-react";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { theme } from "../../../../theme/theme";

/* ──────────────────────────────────────────────────────────────
   Static Data
────────────────────────────────────────────────────────────── */

const feeBreakdown = [
    {
        title: "Tuition Fee",
        amount: "$8,500.00",
        percent: 65,
        color: "#5B7BE9",
    },
    {
        title: "Transport Fee",
        amount: "$2,400.00",
        percent: 18,
        color: "#6D67E4",
    },
    {
        title: "Extracurricular",
        amount: "$1,200.00",
        percent: 9,
        color: "#5BAE7D",
    },
    {
        title: "Lab & Library",
        amount: "$1,050.00",
        percent: 8,
        color: "#D89A35",
    },
];

/* ─── Custom Donut Label ──────────────────────────────────────── */
const CustomDonutLabel = ({ cx, cy }) => (
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
        <tspan x={cx} dy="-8" fontSize="14" fontWeight="700" fill="#111827">Total</tspan>
        <tspan x={cx} dy="20" fontSize="14" fontWeight="700" fill="#111827">Methods</tspan>
    </text>
);

const paymentMethods = [
    {
        name: "Bank Transfer",
        value: 45,
        color: theme.colors.primary,
    },
    {
        name: "Credit Card",
        value: 28,
        color: "#8B5CF6",
    },
    {
        name: "Cash",
        value: 17,
        color: theme.colors.success,
    },
    {
        name: "Cheque",
        value: 10,
        color: theme.colors.warning,
    },
];

const transactions = [
    {
        receipt: "#RCP-24-0891",
        date: "08 Sep 2024",
        time: "2:48 PM",
        type: "Tuition Fee",
        method: "Bank Transfer",
        amount: "$2,500.00",
        status: "Success",
    },
    {
        receipt: "#RCP-24-0752",
        date: "02 Sep 2024",
        time: "11:54 AM",
        type: "Transport Fee",
        method: "Credit Card",
        amount: "$400.00",
        status: "Success",
    },
    {
        receipt: "#RCP-24-0610",
        date: "30 Aug 2024",
        time: "8:32 AM",
        type: "Extracurricular",
        method: "Cash",
        amount: "$150.00",
        status: "Processing",
    },
    {
        receipt: "#RCP-24-0544",
        date: "27 Aug 2024",
        time: "11:32 AM",
        type: "Lab Fee",
        method: "Online Payment",
        amount: "$250.00",
        status: "Failed",
    },
];

const installments = [
    {
        title: "Term 1 Fee",
        due: "Due: Aug 15, 2024",
        amount: "$4,200.00",
        status: "Paid",
        overdue: null,
        icon: (
            <CheckCircle2
                size={18}
                color={theme.colors.success}
            />
        ),
    },
    {
        title: "Lab & Activity Fee",
        due: "Due: Oct 15, 2024",
        amount: "$450.00",
        status: "Unpaid",
        overdue: "Overdue by 12 days",
        icon: (
            <AlertCircle
                size={18}
                color={theme.colors.danger}
            />
        ),
        payNow: true,
    },
    {
        title: "Term 2 Fee",
        due: "Due: Nov 15, 2024",
        amount: "$4,200.00",
        status: "Upcoming",
        overdue: null,
        icon: (
            <div
                className="w-[18px] h-[18px] rounded-full"
                style={{
                    background: theme.colors.border,
                }}
            />
        ),
    },
    {
        title: "Term 3 Fee",
        due: "Due: Mar 15, 2025",
        amount: "$4,200.00",
        status: "Upcoming",
        overdue: null,
        icon: (
            <div
                className="w-[18px] h-[18px] rounded-full"
                style={{
                    background: theme.colors.border,
                }}
            />
        ),
    },
];

/* ──────────────────────────────────────────────────────────────
   Helpers
────────────────────────────────────────────────────────────── */

const statusStyle = {
    Success: {
        background: "#DCFCE7",
        color: theme.colors.success,
    },

    Processing: {
        background: "#FEF3C7",
        color: theme.colors.warning,
    },

    Failed: {
        background: "#FEE2E2",
        color: theme.colors.danger,
    },
};

/* ──────────────────────────────────────────────────────────────
   Component
────────────────────────────────────────────────────────────── */

const FeesTab = () => {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [academicYear, setAcademicYear] = useState("2023-2024");


    const filteredTx = transactions.filter(
        (t) =>
            t.receipt
                .toLowerCase()
                .includes(search.toLowerCase()) ||
            t.type
                .toLowerCase()
                .includes(search.toLowerCase())
    );


    const itemsPerPage = 4;

    const totalPages = Math.ceil(
        filteredTx.length / itemsPerPage
    );

    const paginatedTx = filteredTx.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    return (
        <div
            className="space-y-5 pb-10"
            style={{
                fontFamily: theme.typography.fontFamily,
                margin: "0 24px",
            }}
        >
            {/* ───────────────── Header ───────────────── */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div>
                    <h2
                        className="text-[20px] font-bold"
                        style={{
                            color: theme.colors.textPrimary,
                        }}
                    >
                        Financial Overview
                    </h2>

                    <p
                        className="text-[13px] mt-1"
                        style={{
                            color: theme.colors.textMuted,
                        }}
                    >
                        Manage fee collections, view payment history,
                        and monitor installment timelines.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Select
                        value={academicYear}
                        onValueChange={setAcademicYear}
                    >
                        <SelectTrigger
                            className="w-[150px] h-[40px] rounded-lg text-[13px] font-medium border"
                            style={{
                                borderColor: theme.colors.border,
                                background: theme.colors.surface,
                                color: theme.colors.textSecondary,
                            }}
                        >
                            <SelectValue placeholder="Select Year" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="2023-2024">
                                2023–2024
                            </SelectItem>

                            <SelectItem value="2024-2025">
                                2024–2025
                            </SelectItem>

                            <SelectItem value="2025-2026">
                                2025–2026
                            </SelectItem>

                            <SelectItem value="2026-2027">
                                2026–2027
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    <button
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-[13px] font-medium"
                        style={{
                            borderColor: theme.colors.border,
                            background: theme.colors.surface,
                            color: theme.colors.textSecondary,
                        }}
                    >
                        <CalendarDays size={13} />
                        This Term
                    </button>

                    <button
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold"
                        style={{
                            background: theme.colors.primary,
                            color: "#fff",
                        }}
                    >
                        <Plus size={14} />
                        Collect Payment
                    </button>
                </div>
            </div>

            {/* ───────────────── Stat Cards ───────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {/* Card 1 */}
                <div
                    className="rounded-2xl p-5"
                    style={{
                        background: theme.colors.cardBg,
                        border: `1px solid ${theme.colors.border}`,
                        boxShadow: theme.shadow.card,
                    }}
                >
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p
                                className="text-[13px] font-medium"
                                style={{
                                    color: theme.colors.textMuted,
                                }}
                            >
                                Total Paid
                            </p>

                            <h2
                                className="text-[28px] font-bold mt-2"
                                style={{
                                    color: theme.colors.textPrimary,
                                }}
                            >
                                $12,450
                            </h2>
                        </div>

                        <div
                            className="w-11 h-11 rounded-2xl flex items-center justify-center"
                            style={{
                                background: "#FDECEC",
                            }}
                        >
                            <Wallet
                                size={20}
                                color={theme.colors.primary}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span
                            className="text-[11px] px-2 py-1 rounded-full font-semibold"
                            style={{
                                background: "#DCFCE7",
                                color: theme.colors.success,
                            }}
                        >
                            +15%
                        </span>

                        <span
                            className="text-[12px]"
                            style={{
                                color: theme.colors.textMuted,
                            }}
                        >
                            Compared to last year
                        </span>
                    </div>
                </div>

                {/* Card 2 */}
                <div
                    className="rounded-2xl p-5"
                    style={{
                        background: theme.colors.cardBg,
                        border: `1px solid ${theme.colors.border}`,
                        boxShadow: theme.shadow.card,
                    }}
                >
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p
                                className="text-[13px] font-medium"
                                style={{
                                    color: theme.colors.textMuted,
                                }}
                            >
                                Pending Balance
                            </p>

                            <h2
                                className="text-[28px] font-bold mt-2"
                                style={{
                                    color: theme.colors.textPrimary,
                                }}
                            >
                                $3,200
                            </h2>
                        </div>

                        <div
                            className="w-11 h-11 rounded-2xl flex items-center justify-center"
                            style={{
                                background: "#FEF3C7",
                            }}
                        >
                            <Clock
                                size={20}
                                color={theme.colors.warning}
                            />
                        </div>
                    </div>

                    <div
                        className="w-full h-2 rounded-full overflow-hidden"
                        style={{
                            background: theme.colors.sidebarHover,
                        }}
                    >
                        <div
                            className="h-full rounded-full"
                            style={{
                                width: "75%",
                                background: theme.colors.warning,
                            }}
                        />
                    </div>
                </div>

                {/* Card 3 */}
                <div
                    className="rounded-2xl p-5"
                    style={{
                        background: theme.colors.cardBg,
                        border: `1px solid ${theme.colors.border}`,
                        boxShadow: theme.shadow.card,
                    }}
                >
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p
                                className="text-[13px] font-medium"
                                style={{
                                    color: theme.colors.textMuted,
                                }}
                            >
                                Overdue Amount
                            </p>

                            <h2
                                className="text-[28px] font-bold mt-2"
                                style={{
                                    color: theme.colors.danger,
                                }}
                            >
                                $450
                            </h2>
                        </div>

                        <div
                            className="w-11 h-11 rounded-2xl flex items-center justify-center"
                            style={{
                                background: "#FEE2E2",
                            }}
                        >
                            <AlertCircle
                                size={20}
                                color={theme.colors.danger}
                            />
                        </div>
                    </div>

                    <p
                        className="text-[12px] font-medium"
                        style={{
                            color: theme.colors.textMuted,
                        }}
                    >
                        1 installment overdue
                    </p>
                </div>

                {/* Card 4 */}
                <div
                    className="rounded-2xl p-5"
                    style={{
                        background: theme.colors.cardBg,
                        border: `1px solid ${theme.colors.border}`,
                        boxShadow: theme.shadow.card,
                    }}
                >
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p
                                className="text-[13px] font-medium"
                                style={{
                                    color: theme.colors.textMuted,
                                }}
                            >
                                Collection Growth
                            </p>

                            <h2
                                className="text-[28px] font-bold mt-2"
                                style={{
                                    color: theme.colors.textPrimary,
                                }}
                            >
                                84%
                            </h2>
                        </div>

                        <div
                            className="w-11 h-11 rounded-2xl flex items-center justify-center"
                            style={{
                                background: "#E0F2FE",
                            }}
                        >
                            <TrendingUp
                                size={20}
                                color={theme.colors.info}
                            />
                        </div>
                    </div>

                    <p
                        className="text-[12px]"
                        style={{
                            color: theme.colors.textMuted,
                        }}
                    >
                        Increased monthly collection
                    </p>
                </div>
            </div>

            {/* ───────────────── Charts ───────────────── */}

            {/* ── Fee Breakdown + Donut ── */}
            <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_1fr] gap-4">

                {/* Fee Head Breakdown */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex justify-between items-center mb-5">
                        <h3 className="text-[15px] font-bold text-gray-900">Fee Head Breakdown</h3>
                        <button className="text-gray-400 hover:text-gray-600">
                            <MoreHorizontal size={18} />
                        </button>
                    </div>
                    <div className="space-y-5">
                        <div className="space-y-5">
                            {feeBreakdown.map((f, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2.5">
                                            <span
                                                className="w-2 h-2 rounded-full flex-shrink-0"
                                                style={{
                                                    background: f.color,
                                                }}
                                            />

                                            <span className="text-[13px] font-medium text-gray-700">
                                                {f.title}
                                            </span>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-[13px] font-bold text-gray-900">
                                                {f.amount}
                                            </p>

                                            <p className="text-[11px] text-gray-400">
                                                {f.percent}% of total
                                            </p>
                                        </div>
                                    </div>

                                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{
                                                width: `${f.percent}%`,
                                                background: f.color,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Payment Method Distribution */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-[15px] font-bold text-gray-900">Payment Method Distribution</h3>
                        <button className="flex items-center gap-1 text-[12px] text-gray-400 hover:text-gray-600">
                            All Time <ChevronDown size={12} />
                        </button>
                    </div>
                    <div className="flex items-center gap-6">
                        <div style={{ width: 220, height: 220 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={paymentMethods}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={65}
                                        outerRadius={100}
                                        dataKey="value"
                                        strokeWidth={2}
                                        stroke="#fff"
                                        labelLine={false}
                                        label={CustomDonutLabel}
                                    >
                                        {paymentMethods.map((entry, index) => (
                                            <Cell key={index} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(v) => [`${v}%`, ""]}
                                        contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="space-y-3 flex-1">
                            {paymentMethods.map((m, i) => (
                                <div key={i} className="flex items-center gap-2.5">
                                    <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: m.color }} />
                                    <span className="text-[13px] text-gray-600">{m.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ───────────────── Transactions + Installments ───────────────── */}
            <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-4">
                {/* Transactions */}
                <div
                    className="rounded-2xl p-5 overflow-hidden"
                    style={{
                        background: theme.colors.cardBg,
                        border: `1px solid ${theme.colors.border}`,
                        boxShadow: theme.shadow.card,
                    }}
                >
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                        <div className="flex items-center gap-2.5">
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{
                                    background: theme.colors.sidebarActive,
                                }}
                            >
                                <Clock
                                    size={15}
                                    color={theme.colors.primary}
                                />
                            </div>

                            <h3
                                className="text-[15px] font-bold"
                                style={{
                                    color: theme.colors.textPrimary,
                                }}
                            >
                                Recent Transactions
                            </h3>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <div className="relative">
                                <Search
                                    size={13}
                                    className="absolute left-3 top-1/2 -translate-y-1/2"
                                    color={theme.colors.textMuted}
                                />

                                <input
                                    type="text"
                                    placeholder="Search transaction..."
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setPage(1);
                                    }}
                                    className="pl-8 pr-3 py-2 text-[12px] rounded-lg w-full sm:w-48 focus:outline-none"
                                    style={{
                                        border: `1px solid ${theme.colors.border}`,
                                        background: theme.colors.drawerCard,
                                        color: theme.colors.textPrimary,
                                    }}
                                />
                            </div>

                            {/* <button
          className="p-2 rounded-lg"
          style={{
            border: `1px solid ${theme.colors.border}`,
            color: theme.colors.textMuted,
          }}
        >
          <SlidersHorizontal size={14} />
        </button> */}
                        </div>
                    </div>



                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[250px]">
                            <thead>
                                <tr
                                    style={{
                                        borderBottom: `1px solid ${theme.colors.tableBorder}`,
                                    }}
                                >
                                    {[
                                        "Receipt No.",
                                        "Date",
                                        "Type / Method",
                                        "Amount",
                                        "Status",
                                        "Actions",
                                    ].map((h) => (
                                        <th
                                            key={h}
                                            className="text-left text-[10px] font-bold uppercase tracking-wider pb-3 pr-3"
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
                                {paginatedTx.map((tx, i) => (
                                    <tr
                                        key={i}
                                        className="transition-all duration-200 hover:bg-gray-50"
                                        style={{
                                            borderBottom:
                                                i !== paginatedTx.length - 1
                                                    ? `1px solid ${theme.colors.tableBorder}`
                                                    : "none",
                                        }}
                                    >
                                        <td
                                            className="py-4 pr-3 text-[13px] font-semibold"
                                            style={{
                                                color: theme.colors.textPrimary,
                                            }}
                                        >
                                            {tx.receipt}
                                        </td>

                                        <td className="py-4 pr-3">
                                            <p
                                                className="text-[13px]"
                                                style={{
                                                    color: theme.colors.textSecondary,
                                                }}
                                            >
                                                {tx.date}
                                            </p>

                                            <p
                                                className="text-[11px]"
                                                style={{
                                                    color: theme.colors.textMuted,
                                                }}
                                            >
                                                {tx.time}
                                            </p>
                                        </td>

                                        <td className="py-4 pr-3">
                                            <p
                                                className="text-[13px] font-medium"
                                                style={{
                                                    color: theme.colors.textSecondary,
                                                }}
                                            >
                                                {tx.type}
                                            </p>

                                            <p
                                                className="text-[11px]"
                                                style={{
                                                    color: theme.colors.textMuted,
                                                }}
                                            >
                                                {tx.method}
                                            </p>
                                        </td>

                                        <td
                                            className="py-4 pr-3 text-[13px] font-bold"
                                            style={{
                                                color: theme.colors.textPrimary,
                                            }}
                                        >
                                            {tx.amount}
                                        </td>

                                        <td className="py-4 pr-3">
                                            <span
                                                className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                                                style={statusStyle[tx.status]}
                                            >
                                                {tx.status}
                                            </span>
                                        </td>

                                        <td className="py-4">
                                            <button
                                                className="transition-all duration-200 hover:scale-105"
                                                style={{
                                                    color: theme.colors.textMuted,
                                                }}
                                            >
                                                <MoreHorizontal size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div
                        className="flex flex-col md:flex-row items-center justify-between gap-4 mt-5 pt-4"
                        style={{
                            borderTop: `1px solid ${theme.colors.tableBorder}`,
                        }}
                    >
                        <p
                            className="text-[12px]"
                            style={{
                                color: theme.colors.textMuted,
                            }}
                        >
                            Showing{" "}
                            {(page - 1) * itemsPerPage + 1}
                            {" "}to{" "}
                            {Math.min(
                                page * itemsPerPage,
                                filteredTx.length
                            )}{" "}
                            of {filteredTx.length} entries
                        </p>

                        <div className="flex items-center gap-2">
                            {/* Prev */}
                            <button
                                onClick={() =>
                                    setPage((prev) =>
                                        Math.max(prev - 1, 1)
                                    )
                                }
                                disabled={page === 1}
                                className="px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-200 disabled:opacity-40"
                                style={{
                                    border: `1px solid ${theme.colors.border}`,
                                    color: theme.colors.textSecondary,
                                    background: theme.colors.surface,
                                }}
                            >
                                Prev
                            </button>

                            {/* Page Numbers */}
                            {Array.from(
                                { length: totalPages },
                                (_, index) => (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            setPage(index + 1)
                                        }
                                        className="w-8 h-8 rounded-lg text-[12px] font-semibold transition-all duration-200"
                                        style={{
                                            background:
                                                page === index + 1
                                                    ? theme.colors.primary
                                                    : theme.colors.surface,

                                            color:
                                                page === index + 1
                                                    ? "#fff"
                                                    : theme.colors.textSecondary,

                                            border:
                                                page === index + 1
                                                    ? "none"
                                                    : `1px solid ${theme.colors.border}`,
                                        }}
                                    >
                                        {index + 1}
                                    </button>
                                )
                            )}

                            {/* Next */}
                            <button
                                onClick={() =>
                                    setPage((prev) =>
                                        Math.min(prev + 1, totalPages)
                                    )
                                }
                                disabled={page === totalPages}
                                className="px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-200 disabled:opacity-40"
                                style={{
                                    border: `1px solid ${theme.colors.border}`,
                                    color: theme.colors.textSecondary,
                                    background: theme.colors.surface,
                                }}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>

                {/* Installment Schedule */}
                <div
                    className="rounded-2xl p-5"
                    style={{
                        background: theme.colors.cardBg,
                        border: `1px solid ${theme.colors.border}`,
                        boxShadow: theme.shadow.card,
                    }}
                >
                    <div className="flex justify-between items-center mb-5">
                        <h3
                            className="text-[15px] font-bold"
                            style={{
                                color: theme.colors.textPrimary,
                            }}
                        >
                            Installment Schedule
                        </h3>

                        <button
                            style={{
                                color: theme.colors.textMuted,
                            }}
                        >
                            <Maximize2 size={15} />
                        </button>
                    </div>

                    <div className="space-y-5">
                        {installments.map((inst, i) => (
                            <div
                                key={i}
                                className="flex gap-3 pb-4"
                                style={{
                                    borderBottom:
                                        i !== installments.length - 1
                                            ? `1px solid ${theme.colors.tableBorder}`
                                            : "none",
                                }}
                            >
                                <div className="flex-shrink-0 mt-0.5">
                                    {inst.icon}
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-start gap-3">
                                        <div>
                                            <p
                                                className="text-[13px] font-bold"
                                                style={{
                                                    color:
                                                        theme.colors.textPrimary,
                                                }}
                                            >
                                                {inst.title}
                                            </p>

                                            {inst.overdue ? (
                                                <p
                                                    className="text-[11px] font-semibold mt-0.5"
                                                    style={{
                                                        color:
                                                            theme.colors.danger,
                                                    }}
                                                >
                                                    {inst.overdue}
                                                </p>
                                            ) : (
                                                <p
                                                    className="text-[11px] mt-0.5"
                                                    style={{
                                                        color:
                                                            theme.colors.textMuted,
                                                    }}
                                                >
                                                    {inst.due}
                                                </p>
                                            )}
                                        </div>

                                        {inst.status === "Paid" && (
                                            <span
                                                className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                                                style={{
                                                    background: "#DCFCE7",
                                                    color:
                                                        theme.colors.success,
                                                }}
                                            >
                                                Paid
                                            </span>
                                        )}

                                        {inst.status === "Unpaid" && (
                                            <span
                                                className="text-[12px] font-bold"
                                                style={{
                                                    color:
                                                        theme.colors.danger,
                                                }}
                                            >
                                                Unpaid
                                            </span>
                                        )}

                                        {inst.status === "Upcoming" && (
                                            <span
                                                className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                                                style={{
                                                    background:
                                                        theme.colors.sidebarHover,
                                                    color:
                                                        theme.colors.textMuted,
                                                }}
                                            >
                                                Upcoming
                                            </span>
                                        )}
                                    </div>

                                    <p
                                        className="text-[14px] font-bold mt-2"
                                        style={{
                                            color:
                                                theme.colors.textPrimary,
                                        }}
                                    >
                                        {inst.amount}
                                    </p>

                                    {inst.payNow && (
                                        <button
                                            className="text-[12px] font-semibold mt-2"
                                            style={{
                                                color:
                                                    theme.colors.primary,
                                            }}
                                        >
                                            Pay Now →
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeesTab;