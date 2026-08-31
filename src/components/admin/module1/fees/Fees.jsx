import React, { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import {
  Plus, Search, Filter, Download,
  ChevronDown, ChevronLeft, ChevronRight, MoreVertical, Eye, FileDown,
  BellRing, CheckCircle2, Trash2,
  Wallet, Banknote, AlertTriangle, FileText,
  TrendingUp, TrendingDown, Minus,
} from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { theme } from "../../../../theme/theme";
import CollectFeesModal from "../modals/CollectFeesModal";
import * as XLSX from "xlsx";

// ── Mock data ─────────────────────────────────────────────────────────────
const STATS = [
  {
    icon: Wallet, iconBg: "#EEF2FF", iconColor: theme.colors.info,
    label: "Total Due (Term 1)", value: "₹12,45,000", change: "12.5%", trend: "up", trendColor: "danger", note: "vs last term"
  },
  {
    icon: Banknote, iconBg: "#ECFDF3", iconColor: theme.colors.success,
    label: "Collected This Month", value: "₹8,52,000", change: "8.2%", trend: "up", trendColor: "success", note: "vs last month"
  },
  {
    icon: AlertTriangle, iconBg: "#FEF2F2", iconColor: theme.colors.danger,
    label: "Overdue Accounts", value: "42", change: "5.1%", trend: "up", trendColor: "danger", note: "vs last month"
  },
  {
    icon: FileText, iconBg: "#F5F3FF", iconColor: "#8B5CF6",
    label: "Pending Invoices", value: "156", change: "0.0%", trend: "flat", trendColor: "muted", note: "vs last month"
  },
];

const REVENUE_THIS_YEAR = [
  { month: "Jan", value: 120000 }, { month: "Feb", value: 190000 }, { month: "Mar", value: 155000 },
  { month: "Apr", value: 240000 }, { month: "May", value: 210000 }, { month: "Jun", value: 305000 },
  { month: "Jul", value: 275000 }, { month: "Aug", value: 340000 }, { month: "Sep", value: 320000 },
  { month: "Oct", value: 410000 }, { month: "Nov", value: 395000 }, { month: "Dec", value: 470000 },
];

const REVENUE_LAST_YEAR = [
  { month: "Jan", value: 90000 }, { month: "Feb", value: 140000 }, { month: "Mar", value: 125000 },
  { month: "Apr", value: 180000 }, { month: "May", value: 170000 }, { month: "Jun", value: 230000 },
  { month: "Jul", value: 210000 }, { month: "Aug", value: 260000 }, { month: "Sep", value: 255000 },
  { month: "Oct", value: 310000 }, { month: "Nov", value: 300000 }, { month: "Dec", value: 360000 },
];

const TRANSACTIONS = [
  { id: "#INV-2024-001", student: "Aarav Sharma", grade: "Grade 6", amount: 12500.0, status: "Paid", date: "Nov 12, 2024" },
  { id: "#INV-2024-002", student: "Kabir Agarwal", grade: "Grade 7", amount: 13500.0, status: "Overdue", date: "Oct 15, 2024" },
  { id: "#INV-2024-003", student: "Ananya Gupta", grade: "Grade 8", amount: 14200.0, status: "Pending", date: "Nov 20, 2024" },
  { id: "#INV-2024-004", student: "Vivaan Shah", grade: "Grade 12", amount: 18500.0, status: "Paid", date: "Nov 10, 2024" },
  { id: "#INV-2024-005", student: "Diya Kulkarni", grade: "Grade 9", amount: 15200.0, status: "Pending", date: "Nov 22, 2024" },
  { id: "#INV-2024-006", student: "Ishaan Verma", grade: "Grade 10", amount: 16800.0, status: "Overdue", date: "Sep 30, 2024" },
];

const money = (n) => `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// ── Small helpers ────────────────────────────────────────────────────────
const TrendIcon = ({ trend }) => {
  if (trend === "up") return <TrendingUp size={13} />;
  if (trend === "down") return <TrendingDown size={13} />;
  return <Minus size={13} />;
};

const StatCard = ({ icon: Icon, label, value, iconBg, iconColor, change, trend, trendColor, note }) => {
  const trendTextColor =
    trendColor === "success" ? theme.colors.success :
      trendColor === "danger" ? theme.colors.danger :
        theme.colors.textMuted;

  return (
    <div
      className="rounded-xl p-3.5"
      style={{ background: theme.colors.cardBg, border: `1px solid ${theme.colors.border}`, boxShadow: theme.shadow.card }}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs" style={{ color: theme.colors.textSecondary }}>{label}</p>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: iconBg }}>
          <Icon size={15} color={iconColor} />
        </div>
      </div>
      <p className="text-xl sm:text-2xl font-bold mb-1" style={{ color: theme.colors.textPrimary }}>{value}</p>
      <div className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: trendTextColor }}>
        <TrendIcon trend={trend} />
        <span>{change}</span>
        <span className="font-normal" style={{ color: theme.colors.textMuted }}>{note}</span>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const variants = {
    Paid: { bg: "#ECFDF3", color: theme.colors.success, border: "#BBF7D0" },
    Overdue: { bg: "#FEF2F2", color: theme.colors.danger, border: "#FECACA" },
    Pending: { bg: "#FFFBEB", color: theme.colors.warning, border: "#FDE68A" },
  };
  const v = variants[status] ?? variants.Pending;
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border whitespace-nowrap"
      style={{ background: v.bg, color: v.color, borderColor: v.border }}
    >
      {status}
    </span>
  );
};

const CustomCheckbox = ({ checked, onChange }) => {
  return (
    <div
      onClick={onChange}
      className="w-[18px] h-[18px] rounded flex items-center justify-center shrink-0 cursor-pointer transition-colors"
      style={{
        background: checked ? theme.colors.primary : "#fff",
        border: `2px solid ${checked ? theme.colors.primary : theme.colors.border}`,
      }}
    >
      {checked && (
        <svg width="10" height="8" viewBox="0 0 11 8" fill="none">
          <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
};

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg px-3 py-2 text-xs font-semibold"
      style={{ background: theme.colors.textPrimary, color: "#fff", boxShadow: theme.shadow.modal }}
    >
      {label}: {money(payload[0].value)}
    </div>
  );
};

// ── Row action menu — portal-based, positioned by trigger rect (avoids
// clipping/scroll issues inside the scrollable table container) ───────────
const MENU_WIDTH = 208;
const MENU_HEIGHT_ESTIMATE = 220;

const RowActionMenu = ({ row, position, onClose, onView, onDownload, onRemind, onMarkPaid, onDelete }) => {
  if (!row || !position) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-[999]" onClick={onClose} />
      <div
        className="fixed z-[1000] w-52 rounded-xl bg-white shadow-xl border overflow-hidden"
        style={{ top: position.top, left: position.left, borderColor: theme.colors.border }}
      >
        <button onClick={() => { onView(row); onClose(); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-gray-50 transition">
          <Eye size={16} style={{ color: theme.colors.textMuted }} />
          <span style={{ color: theme.colors.textPrimary }}>View Invoice</span>
        </button>
        <button onClick={() => { onDownload(row); onClose(); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-gray-50 transition">
          <FileDown size={16} style={{ color: theme.colors.textMuted }} />
          <span style={{ color: theme.colors.textPrimary }}>Download Receipt</span>
        </button>
        {row.status !== "Paid" && (
          <>
            <button onClick={() => { onRemind(row); onClose(); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-gray-50 transition">
              <BellRing size={16} style={{ color: theme.colors.textMuted }} />
              <span style={{ color: theme.colors.textPrimary }}>Send Reminder</span>
            </button>
            <button onClick={() => { onMarkPaid(row); onClose(); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-gray-50 transition">
              <CheckCircle2 size={16} style={{ color: theme.colors.success }} />
              <span style={{ color: theme.colors.textPrimary }}>Mark as Paid</span>
            </button>
          </>
        )}
        <div className="border-t my-1" style={{ borderColor: theme.colors.border }} />
        <button onClick={() => { onDelete(row); onClose(); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-red-50 transition">
          <Trash2 size={16} style={{ color: theme.colors.danger }} />
          <span style={{ color: theme.colors.danger }}>Delete Invoice</span>
        </button>
      </div>
    </>,
    document.body
  );
};

// ════════════════════════════════════════════════════════════════════
const Fees = () => {
  const [period, setPeriod] = useState("this-year");
  const [search, setSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [collectOpen, setCollectOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 4;

  const [menuRow, setMenuRow] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);
  const closeMenu = () => { setMenuRow(null); setMenuPosition(null); };

  const handleMenuToggle = (e, row) => {
    e.stopPropagation();
    if (menuRow?.id === row.id) { closeMenu(); return; }
    const rect = e.currentTarget.getBoundingClientRect();
    const left = Math.min(rect.right - MENU_WIDTH, window.innerWidth - MENU_WIDTH - 8);
    const spaceBelow = window.innerHeight - rect.bottom;
    const top = spaceBelow < MENU_HEIGHT_ESTIMATE + 12
      ? Math.max(rect.top - MENU_HEIGHT_ESTIMATE - 6, 8)
      : rect.bottom + 6;
    setMenuPosition({ top, left: Math.max(left, 8) });
    setMenuRow(row);
  };

  const chartData = period === "this-year" ? REVENUE_THIS_YEAR : REVENUE_LAST_YEAR;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return TRANSACTIONS;
    return TRANSACTIONS.filter(
      (t) => t.id.toLowerCase().includes(q) || t.student.toLowerCase().includes(q)
    );
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggleRow = (id) =>
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]));

  const allChecked = pageRows.length > 0 && pageRows.every((r) => selectedRows.includes(r.id));
  const toggleAll = () =>
    setSelectedRows((prev) =>
      allChecked
        ? prev.filter((id) => !pageRows.some((r) => r.id === id))
        : [...new Set([...prev, ...pageRows.map((r) => r.id)])]
    );

  const handleExport = () => {
    const rowsToExport = selectedRows.length > 0
      ? filtered.filter((r) => selectedRows.includes(r.id))
      : filtered;

    if (rowsToExport.length === 0) {
      alert("No transactions to export.");
      return;
    }

    const exportData = rowsToExport.map((row) => ({
      "Invoice ID": row.id,
      "Student": row.student,
      "Grade": row.grade,
      "Amount": row.amount,
      "Status": row.status,
      "Date": row.date,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Optional: set nicer column widths
    worksheet["!cols"] = [
      { wch: 16 }, // Invoice ID
      { wch: 20 }, // Student
      { wch: 10 }, // Grade
      { wch: 12 }, // Amount
      { wch: 10 }, // Status
      { wch: 14 }, // Date
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

    const dateStr = new Date().toISOString().split("T")[0];
    XLSX.writeFile(workbook, `transactions_${dateStr}.xlsx`);
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
            Fees &amp; Billing
          </h2>
          <p className="text-sm mt-1" style={{ color: theme.colors.textSecondary }}>
            Manage student payments, invoices, and revenue.
          </p>
        </div>

        <Button
          onClick={() => setCollectOpen(true)}
          className="flex items-center gap-2 rounded-xl px-5 h-11 text-sm font-semibold text-white w-full sm:w-auto"
          style={{ background: theme.colors.primary }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.colors.primaryHover)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = theme.colors.primary)}
        >
          <Plus size={16} />
          Collect Payment
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {STATS.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Revenue Trend */}
      <div
        className="rounded-2xl p-4 sm:p-6 mb-6"
        style={{ background: theme.colors.cardBg, border: `1px solid ${theme.colors.border}`, boxShadow: theme.shadow.card }}
      >
        <div className="flex items-center justify-between mb-6 gap-3">
          <h3 className="text-base sm:text-lg font-bold" style={{ color: theme.colors.textPrimary }}>
            Revenue Trend
          </h3>

          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger
              className="w-[130px] h-9 rounded-lg text-sm"
              style={{ borderColor: theme.colors.border, color: theme.colors.textPrimary }}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-year">This Year</SelectItem>
              <SelectItem value="last-year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="h-[260px] sm:h-[320px] -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={theme.colors.info} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={theme.colors.info} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke={theme.colors.tableBorder} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: theme.colors.textMuted, fontSize: 12 }}
                dy={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: theme.colors.textMuted, fontSize: 12 }}
                tickFormatter={(v) => `$${v / 1000}k`}
                width={44}
              />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke={theme.colors.info}
                strokeWidth={2.5}
                fill="url(#revenueFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: theme.colors.cardBg, border: `1px solid ${theme.colors.border}`, boxShadow: theme.shadow.card }}
      >
        {/* Toolbar */}
        <div
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-4 sm:p-5"
          style={{ borderBottom: `1px solid ${theme.colors.tableBorder}` }}
        >
          <h3 className="text-base sm:text-lg font-bold" style={{ color: theme.colors.textPrimary }}>
            Recent Transactions
          </h3>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" color={theme.colors.textMuted} />
              <input
                type="text"
                placeholder="Search ID, Student..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-9 pr-4 h-10 rounded-xl text-sm outline-none"
                style={{ background: theme.colors.background, border: `1px solid ${theme.colors.border}`, color: theme.colors.textPrimary }}
              />
            </div>
            <div className="flex gap-3">
              <button
                className="flex items-center gap-2 px-4 h-10 rounded-xl text-sm font-medium shrink-0"
                style={{ background: theme.colors.surface, border: `1px solid ${theme.colors.border}`, color: theme.colors.textPrimary }}
              >
                <Filter size={15} /> Filter
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 h-10 rounded-xl text-sm font-medium shrink-0"
                style={{ background: theme.colors.surface, border: `1px solid ${theme.colors.border}`, color: theme.colors.textPrimary }}
              >
                <Download size={15} /> Export
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px]">
            <thead style={{ background: theme.colors.tableHeader }}>
              <tr>
                <th className="px-4 py-3.5 w-10" style={{ borderBottom: `1px solid ${theme.colors.tableBorder}` }}>
                  <CustomCheckbox checked={allChecked} onChange={toggleAll} />
                </th>
                {["Invoice ID", "Student", "Grade", "Amount", "Status", "Date", "Action"].map((h) => (
                  <th
                    key={h}
                    className={`text-left px-4 py-3.5 ${theme.typography.tableHeader}`}
                    style={{ color: theme.colors.textMuted, borderBottom: `1px solid ${theme.colors.tableBorder}` }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50 transition-all"
                  style={{ borderBottom: `1px solid ${theme.colors.tableBorder}` }}
                >
                  <td className="px-4 py-4">
                    <CustomCheckbox checked={selectedRows.includes(row.id)} onChange={() => toggleRow(row.id)} />
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-semibold" style={{ color: theme.colors.textPrimary }}>{row.id}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm" style={{ color: theme.colors.textPrimary }}>{row.student}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm" style={{ color: theme.colors.textSecondary }}>{row.grade}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-semibold" style={{ color: theme.colors.textPrimary }}>{money(row.amount)}</span>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm" style={{ color: theme.colors.textSecondary }}>{row.date}</span>
                  </td>
                  <td className="px-4 py-4">
                    <button onClick={(e) => handleMenuToggle(e, row)} className="p-2 rounded-lg hover:bg-gray-100">
                      <MoreVertical size={16} color={theme.colors.textMuted} />
                    </button>
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-sm" style={{ color: theme.colors.textMuted }}>
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-5 py-4"
          style={{ borderTop: `1px solid ${theme.colors.tableBorder}` }}
        >
          <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
            Showing {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1} to{" "}
            {Math.min(page * pageSize, filtered.length)} of {filtered.length} entries
          </p>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 h-9 rounded-lg text-sm font-medium disabled:opacity-40"
              style={{ border: `1px solid ${theme.colors.border}`, color: theme.colors.textPrimary }}
            >
              <ChevronLeft size={15} /> Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className="w-9 h-9 rounded-lg text-sm font-semibold"
                style={{
                  background: page === p ? theme.colors.primary : "transparent",
                  color: page === p ? "#fff" : theme.colors.textPrimary,
                  border: `1px solid ${page === p ? theme.colors.primary : theme.colors.border}`,
                }}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-3 h-9 rounded-lg text-sm font-medium disabled:opacity-40"
              style={{ border: `1px solid ${theme.colors.border}`, color: theme.colors.textPrimary }}
            >
              Next <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      <RowActionMenu
        row={menuRow}
        position={menuPosition}
        onClose={closeMenu}
        onView={() => { }}
        onDownload={() => { }}
        onRemind={() => { }}
        onMarkPaid={() => { }}
        onDelete={() => { }}
      />

      <CollectFeesModal open={collectOpen} onOpenChange={setCollectOpen} />
    </div>
  );
};

export default Fees;