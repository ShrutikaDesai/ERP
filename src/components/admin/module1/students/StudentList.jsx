import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useLocation } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Users, UserCheck, AlertTriangle, UserPlus,
  Download, Plus, Search, SlidersHorizontal,
  ChevronLeft, ChevronRight, ChevronUp, ChevronDown,
  MoreVertical, FileText, Trash2, Eye, SquarePen, BadgePlus,
  CreditCard, ArrowUpCircle, UserX, Banknote, ReceiptIndianRupee,
  Wallet,
  ArrowUpRight,
  UserRoundX,
  TriangleAlert
} from "lucide-react";
import { theme } from "../../../../theme/theme";
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from "recharts";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import StudentDrawer from "./StudentDrawer";

// ── Sample Data ───────────────────────────────────────────────────────────────
const STUDENTS = [
  { id: 1, name: "Priya Nair", email: "priya.n@student.edu", admNo: "#ST-2024-089", grade: "6 - A", guardian: "Rajesh Sharma", guardianPhone: "+91 98220 19283", attendance: 96, status: "Active", feeDue: true, avatar: "https://i.pravatar.cc/40?img=47" },
  { id: 2, name: "Kabir Agarwal", email: "kabir.a@student.edu", admNo: "#ST-2024-092", grade: "6 - A", guardian: "Manoj Agarwal", guardianPhone: "+91 98837 11205", attendance: 82, status: "Active", feeDue: false, avatar: "https://i.pravatar.cc/40?img=11" },
  { id: 3, name: "Ananya Gupta", email: "ananya.g@student.edu", admNo: "#ST-2024-105", grade: "6 - B", guardian: "Vikas Gupta", guardianPhone: "+91 98442 99011", attendance: 98, status: "Active", feeDue: false, avatar: "https://i.pravatar.cc/40?img=5" },
  { id: 4, name: "Dev Kulkarni", email: "dev.k@student.edu", admNo: "#ST-2024-118", grade: "6 - B", guardian: "Sanjay Kulkarni", guardianPhone: "+91 98221 55432", attendance: 65, status: "Active", feeDue: true, avatar: null },
  { id: 5, name: "Ishita Iyer", email: "ishita.i@student.edu", admNo: "#ST-2024-121", grade: "6 - A", guardian: "Suresh Iyer", guardianPhone: "+91 99204 55871", attendance: 91, status: "Active", feeDue: false, avatar: "https://i.pravatar.cc/40?img=32" },
  { id: 6, name: "Rohan Mehta", email: "rohan.m@student.edu", admNo: "#ST-2024-124", grade: "7 - A", guardian: "Kavita Mehta", guardianPhone: "+91 99887 20134", attendance: 74, status: "Active", feeDue: true, avatar: "https://i.pravatar.cc/40?img=13" },
  { id: 7, name: "Aarav Sharma", email: "aarav.s@student.edu", admNo: "#ST-2024-130", grade: "7 - B", guardian: "Ramesh Nair", guardianPhone: "+91 98123 44556", attendance: 88, status: "Active", feeDue: false, avatar: "https://i.pravatar.cc/40?img=9" },
  { id: 8, name: "Arjun Rao", email: "arjun.r@student.edu", admNo: "#ST-2024-133", grade: "7 - B", guardian: "Lakshmi Rao", guardianPhone: "+91 97654 32109", attendance: 79, status: "Inactive", feeDue: true, avatar: null },
  { id: 9, name: "Zoya Sheikh", email: "zoya.s@student.edu", admNo: "#ST-2024-140", grade: "7 - C", guardian: "Imran Sheikh", guardianPhone: "+91 96543 21870", attendance: 95, status: "Active", feeDue: false, avatar: "https://i.pravatar.cc/40?img=25" },
  { id: 10, name: "Kabir Malhotra", email: "kabir.mal@student.edu", admNo: "#ST-2024-142", grade: "7 - C", guardian: "Neha Malhotra", guardianPhone: "+91 95432 10987", attendance: 60, status: "Active", feeDue: true, avatar: "https://i.pravatar.cc/40?img=15" },
  { id: 11, name: "Diya Kulkarni", email: "diya.k@student.edu", admNo: "#ST-2024-150", grade: "8 - A", guardian: "Meena Kulkarni", guardianPhone: "+91 94321 09876", attendance: 93, status: "Active", feeDue: false, avatar: "https://i.pravatar.cc/40?img=20" },
  { id: 12, name: "Vivaan Shah", email: "vivaan.s@student.edu", admNo: "#ST-2024-153", grade: "8 - A", guardian: "Nikhil Shah", guardianPhone: "+91 93210 98765", attendance: 85, status: "Active", feeDue: false, avatar: "https://i.pravatar.cc/40?img=18" },
  { id: 13, name: "Aisha Sheikh", email: "aisha.s@student.edu", admNo: "#ST-2024-158", grade: "8 - B", guardian: "Farah Sheikh", guardianPhone: "+91 92109 87654", attendance: 71, status: "Active", feeDue: true, avatar: "https://i.pravatar.cc/40?img=29" },
  { id: 14, name: "Yash Patil", email: "yash.p@student.edu", admNo: "#ST-2024-161", grade: "8 - B", guardian: "Sunita Patil", guardianPhone: "+91 91098 76543", attendance: 89, status: "Inactive", feeDue: false, avatar: null },
  { id: 15, name: "Ishaan Verma", email: "ishaan.v@student.edu", admNo: "#ST-2024-170", grade: "10 - A", guardian: "Deepak Verma", guardianPhone: "+91 90987 65432", attendance: 97, status: "Active", feeDue: false, avatar: "https://i.pravatar.cc/40?img=33" },
  { id: 16, name: "Myra Joshi", email: "myra.j@student.edu", admNo: "#ST-2024-173", grade: "10 - A", guardian: "Anil Joshi", guardianPhone: "+91 89876 54321", attendance: 68, status: "Active", feeDue: true, avatar: "https://i.pravatar.cc/40?img=41" },
  { id: 17, name: "Aarav Bhatt", email: "aarav.b@student.edu", admNo: "#ST-2024-178", grade: "10 - B", guardian: "Reema Bhatt", guardianPhone: "+91 88765 43210", attendance: 92, status: "Active", feeDue: false, avatar: "https://i.pravatar.cc/40?img=52" },
  { id: 18, name: "Saanvi Reddy", email: "saanvi.r@student.edu", admNo: "#ST-2024-182", grade: "10 - C", guardian: "Krishna Reddy", guardianPhone: "+91 87654 32198", attendance: 80, status: "Active", feeDue: true, avatar: "https://i.pravatar.cc/40?img=44" },
  { id: 19, name: "Vihaan Chavan", email: "vihaan.c@student.edu", admNo: "#ST-2024-185", grade: "10 - D", guardian: "Prakash Chavan", guardianPhone: "+91 86543 21987", attendance: 55, status: "Inactive", feeDue: true, avatar: null },
  { id: 20, name: "Anika Deshmukh", email: "anika.d@student.edu", admNo: "#ST-2024-190", grade: "10 - D", guardian: "Swati Deshmukh", guardianPhone: "+91 85432 19876", attendance: 90, status: "Active", feeDue: false, avatar: "https://i.pravatar.cc/40?img=48" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function Avatar({ src, name, size = 40 }) {
  const initials = name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  if (src) return <img src={src} alt={name} className="rounded-full object-cover" style={{ width: size, height: size }} />;
  return (
    <div className="rounded-full flex items-center justify-center text-xs font-semibold"
      style={{ width: size, height: size, background: theme.colors.sidebarActive, color: theme.colors.primary }}>
      {initials}
    </div>
  );
}

function AttendanceBar({ value }) {
  const color = value >= 90 ? theme.colors.success : value >= 75 ? theme.colors.warning : theme.colors.danger;
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium w-9" style={{ color: theme.colors.textPrimary }}>{value}%</span>
      <div className="h-2 w-24 rounded-full overflow-hidden" style={{ background: theme.colors.border }}>
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

function Badge({ children, variant = "default" }) {
  const variants = {
    active: { bg: "#ECFDF3", color: theme.colors.success, border: "#BBF7D0" },
    inactive: { bg: "#F3F4F6", color: theme.colors.textSecondary, border: "#E5E7EB" },
    due: { bg: "#FEF2F2", color: theme.colors.danger, border: "#FECACA" },
  };
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border"
      style={{ background: variants[variant].bg, color: variants[variant].color, borderColor: variants[variant].border }}>
      {children}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, iconBg, iconColor }) {
  return (
    <div className="rounded-2xl p-5 flex items-center justify-between"
      style={{ background: theme.colors.cardBg, border: `1px solid ${theme.colors.border}`, boxShadow: theme.shadow.card }}>
      <div>
        <p className="text-sm mb-1" style={{ color: theme.colors.textSecondary }}>{label}</p>
        <p className="text-3xl font-bold" style={{ color: theme.colors.textPrimary }}>{value}</p>
      </div>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: iconBg }}>
        <Icon size={22} color={iconColor} />
      </div>
    </div>
  );
}

function SelectFilter({ value, onChange, options, placeholder }) {
  return (
    <div className="relative">
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="appearance-none px-4 py-2.5 pr-9 rounded-xl text-sm font-medium outline-none"
        style={{ background: theme.colors.surface, border: `1px solid ${theme.colors.border}`, color: theme.colors.textPrimary }}>
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2" color={theme.colors.textMuted} />
    </div>
  );
}

// ── Row action menu, rendered via portal so it's never clipped by the
// scrollable table container and never adds its own scrollbar. ─────────────
const MENU_WIDTH = 240;
const MENU_HEIGHT_ESTIMATE = 272; // 5 items + divider; used to flip the menu above the trigger when it won't fit below

function RowActionMenu({ student, position, onClose, onViewProfile, onEdit, onCollectFee, onPromote, onDeactivate }) {
  if (!student || !position) return null;

  return createPortal(
    <>
      {/* click-outside catcher */}
      <div className="fixed inset-0 z-[999]" onClick={onClose} />

      <div
        className="fixed z-[1000] w-60 rounded-xl bg-white shadow-xl border overflow-hidden"
        style={{ top: position.top, left: position.left, borderColor: theme.colors.border }}
      >
        <button
          onClick={() => { onViewProfile(student); onClose(); }}
          className="w-full flex items-center gap-3 px-5 py-3 text-[16px] hover:bg-gray-50 transition"
        >
          <Eye size={22} strokeWidth={1.8} className="text-gray-500" />
          <span className="text-gray-700 font-medium">View Profile</span>
        </button>

        <button
          onClick={() => { onEdit(student); onClose(); }}
          className="w-full flex items-center gap-3 px-5 py-3 text-[16px] hover:bg-gray-50 transition"
        >
          <SquarePen size={22} strokeWidth={1.8} className="text-gray-500" />
          <span className="text-gray-700 font-medium">Edit Details</span>
        </button>

        <button
          onClick={() => { onCollectFee(student); onClose(); }}
          className="w-full flex items-center gap-3 px-5 py-3 text-[16px] hover:bg-gray-50 transition"
        >
          <ReceiptIndianRupee size={22} strokeWidth={1.8} className="text-gray-500" />
          <span className="text-gray-700 font-medium">Collect Fee</span>
        </button>

        <button
          onClick={() => { onPromote(student); onClose(); }}
          className="w-full flex items-center gap-3 px-5 py-3 text-[16px] hover:bg-gray-50 transition"
        >
          <ArrowUpRight size={22} strokeWidth={1.8} className="text-gray-500" />
          <span className="text-gray-700 font-medium">Promote</span>
        </button>

        <div className="border-t border-gray-200 my-1" />

        <button
          onClick={() => { onDeactivate(student); onClose(); }}
          className="w-full flex items-center gap-3 px-5 py-3 text-[16px] hover:bg-red-50 transition"
        >
          <UserRoundX size={22} strokeWidth={1.8} className="text-red-500" />
          <span className="text-red-600 font-medium">Deactivate</span>
        </button>
      </div>
    </>,
    document.body
  );
}

// ════════════════════════════════════════════════════════════════════
//  Main Component
// ════════════════════════════════════════════════════════════════════
export default function StudentList() {
  const navigate = useNavigate();

  // ── Students tab state ────────────────────────────────────────────
  const [globalFilter, setGlobalFilter] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sorting, setSorting] = useState([]);

  // row action menu — portal-based, position computed from the trigger button
  const [menuRow, setMenuRow] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);

  const closeMenu = () => {
    setMenuRow(null);
    setMenuPosition(null);
  };

  const handleMenuToggle = (e, student) => {
    e.stopPropagation();
    if (menuRow?.id === student.id) {
      closeMenu();
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const left = Math.min(rect.right - MENU_WIDTH, window.innerWidth - MENU_WIDTH - 8);
    const spaceBelow = window.innerHeight - rect.bottom;
    const top =
      spaceBelow < MENU_HEIGHT_ESTIMATE + 12
        ? Math.max(rect.top - MENU_HEIGHT_ESTIMATE - 6, 8)
        : rect.bottom + 6;
    setMenuPosition({ top, left: Math.max(left, 8) });
    setMenuRow(student);
  };

  // close the menu on scroll/resize so it never drifts from its trigger
  useEffect(() => {
    if (!menuRow) return;
    window.addEventListener("scroll", closeMenu, true);
    window.addEventListener("resize", closeMenu);
    return () => {
      window.removeEventListener("scroll", closeMenu, true);
      window.removeEventListener("resize", closeMenu);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuRow]);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [deactivateStudent, setDeactivateStudent] = useState(null);
  const location = useLocation();
  const [savedStudents, setSavedStudents] = useState(() => {
    try { return JSON.parse(localStorage.getItem("studentAdmissions") || "[]"); }
    catch { return []; }
  });

  // ── Tab state ─────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("students");

  // ── Drafts state (loaded from localStorage) ───────────────────────
  const [drafts, setDrafts] = useState(() => {
    try { return JSON.parse(localStorage.getItem("studentDrafts") || "[]"); }
    catch { return []; }
  });

  const handleTabChange = (tab) => {
    if (tab === "drafts") {
      try { setDrafts(JSON.parse(localStorage.getItem("studentDrafts") || "[]")); }
      catch { setDrafts([]); }
    }
    setActiveTab(tab);
  };

  const handleDeactivateConfirm = () => {
    setShowDeactivateModal(false);
    setDeactivateStudent(null);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab === "drafts" || tab === "students") {
      setActiveTab(tab);
    }
    try { setDrafts(JSON.parse(localStorage.getItem("studentDrafts") || "[]")); }
    catch { setDrafts([]); }
    try { setSavedStudents(JSON.parse(localStorage.getItem("studentAdmissions") || "[]")); }
    catch { setSavedStudents([]); }
  }, [location.search]);

  const deleteDraft = (draftId) => {
    const updated = drafts.filter((d) => d.id !== draftId);
    setDrafts(updated);
    localStorage.setItem("studentDrafts", JSON.stringify(updated));
  };

  // ── Filtered data ─────────────────────────────────────────────────
  const allStudents = useMemo(() => [...STUDENTS, ...savedStudents], [savedStudents]);

  const filteredData = useMemo(() => {
    return allStudents.filter((s) => {
      const matchGrade = !gradeFilter || s.grade.startsWith(gradeFilter);
      const matchSection = !sectionFilter || s.grade.endsWith(sectionFilter);
      const matchStatus = !statusFilter || s.status === statusFilter;
      const q = globalFilter.toLowerCase();
      const matchSearch = !q || s.name.toLowerCase().includes(q) || s.admNo.toLowerCase().includes(q);
      return matchGrade && matchSection && matchStatus && matchSearch;
    });
  }, [allStudents, globalFilter, gradeFilter, sectionFilter, statusFilter]);

  // ── Columns ───────────────────────────────────────────────────────
  const columns = useMemo(() => [
    {
      id: "srNo",
      header: "Sr No.",
      cell: ({ row }) => <span className="text-sm font-medium" style={{ color: theme.colors.textPrimary }}>{row.index + 1}</span>,
    },
    {
      accessorKey: "name",
      header: "Student",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar src={row.original.avatar} name={row.original.name} />
          <div>
            <button onClick={() => setSelectedStudent(row.original)}
              className="text-sm font-semibold text-left hover:underline" style={{ color: theme.colors.textPrimary }}>
              {row.original.name}
            </button>
            <p className="text-xs" style={{ color: theme.colors.textMuted }}>{row.original.email}</p>
          </div>
        </div>
      ),
    },
    { accessorKey: "admNo", header: "Adm No." },
    { accessorKey: "grade", header: "Grade/Sec" },
    {
      accessorKey: "guardian",
      header: "Guardian",
      cell: ({ row }) => (
        <div>
          <p className="text-sm" style={{ color: theme.colors.textPrimary }}>{row.original.guardian}</p>
          <p className="text-xs" style={{ color: theme.colors.info }}>{row.original.guardianPhone}</p>
        </div>
      ),
    },
    {
      accessorKey: "attendance",
      header: "Attendance",
      cell: ({ row }) => <AttendanceBar value={row.original.attendance} />,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Badge variant={row.original.status === "Active" ? "active" : "inactive"}>{row.original.status}</Badge>
          {row.original.feeDue && <Badge variant="due">Fee Due</Badge>}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <button onClick={(e) => handleMenuToggle(e, row.original)} className="p-2 rounded-lg">
          <MoreVertical size={16} color={theme.colors.textMuted} />
        </button>
      ),
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  // ── Table ─────────────────────────────────────────────────────────
  const table = useReactTable({
    data: filteredData, columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageSize: 5 } },
  });

  const paginationRange = useMemo(() => {
    const totalPages = table.getPageCount();
    const current = table.getState().pagination.pageIndex + 1;
    const delta = 1;
    const range = [];
    const left = Math.max(2, current - delta);
    const right = Math.min(totalPages - 1, current + delta);
    range.push(1);
    if (left > 2) range.push("...");
    for (let i = left; i <= right; i++) range.push(i);
    if (right < totalPages - 1) range.push("...");
    if (totalPages > 1) range.push(totalPages);
    return range;
  }, [table.getState().pagination.pageIndex, filteredData.length]);

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen"
      style={{ background: theme.colors.background, fontFamily: theme.typography.fontFamily, padding: theme.layout.contentPadding }}>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
        <div className="flex flex-col gap-2">
          <h1 style={{ fontSize: "1.7rem", fontWeight: 700, color: theme.colors.textPrimary, margin: 0 }}>Student List</h1>
          <p className="text-sm" style={{ color: theme.colors.textSecondary, margin: 0 }}>
            Manage enrollments, attendance, and academic records.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
            style={{ background: theme.colors.surface, border: `1px solid ${theme.colors.border}`, color: theme.colors.textPrimary }}>
            <Download size={16} /> Export
          </button>
          <button onClick={() => navigate("/s-admin/add-student")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: theme.colors.primary }}>
            <Plus size={16} /> Add Student
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Users} label="Total Enrolled" value="1,248" iconBg="#EEF2FF" iconColor={theme.colors.info} />
        <StatCard icon={UserCheck} label="Active Today" value="1,180" iconBg="#ECFDF3" iconColor={theme.colors.success} />
        <StatCard icon={AlertTriangle} label="Fee Defaulters" value="42" iconBg="#FEF2F2" iconColor={theme.colors.danger} />
        <StatCard icon={UserPlus} label="New Admissions" value="12" iconBg="#F5F3FF" iconColor="#8B5CF6" />
      </div>

      {/* ── Tab Bar ── */}
      <div className="flex items-center gap-1 mb-5 p-1 rounded-xl w-fit"
        style={{ background: theme.colors.surface, border: `1px solid ${theme.colors.border}` }}>
        {[
          { key: "students", label: "Students", count: null },
          { key: "drafts", label: "Drafts", count: drafts.length },
        ].map(({ key, label, count }) => {
          const active = activeTab === key;
          return (
            <button key={key} onClick={() => handleTabChange(key)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: active ? theme.colors.cardBg : "transparent",
                color: active ? theme.colors.textPrimary : theme.colors.textMuted,
                boxShadow: active ? theme.shadow?.card : "none",
                border: active ? `1px solid ${theme.colors.border}` : "1px solid transparent",
              }}>
              {label}
              {count != null && count > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                  style={{
                    background: active ? "#FEF9C3" : theme.colors.background,
                    color: active ? "#92400E" : theme.colors.textMuted,
                    border: `1px solid ${active ? "#FDE68A" : theme.colors.border}`,
                  }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ══════════════ STUDENTS TAB ══════════════ */}
      {activeTab === "students" && (
        <div className="w-full">
          <div className="rounded-2xl overflow-hidden"
            style={{ background: theme.colors.cardBg, border: `1px solid ${theme.colors.border}`, boxShadow: theme.shadow.card }}>

            {/* Filters */}
            <div className="flex flex-col xl:flex-row xl:items-center gap-3 p-4"
              style={{ borderBottom: `1px solid ${theme.colors.tableBorder}` }}>
              <div className="relative w-full xl:max-w-sm">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" color={theme.colors.textMuted} />
                <input type="text" placeholder="Search by name, ID..." value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: theme.colors.background, border: `1px solid ${theme.colors.border}`, color: theme.colors.textPrimary }} />
              </div>
              <div className="flex flex-wrap gap-3">
                <SelectFilter
                  value={gradeFilter}
                  onChange={setGradeFilter}
                  placeholder="Grade"
                  options={[
                    { value: "6", label: "Grade 6" },
                    { value: "7", label: "Grade 7" },
                    { value: "8", label: "Grade 8" },
                    { value: "9", label: "Grade 9" },
                    { value: "10", label: "Grade 10" },
                    { value: "11", label: "Grade 11" },
                    { value: "12", label: "Grade 12" },
                  ]}
                />
                <SelectFilter
                  value={sectionFilter}
                  onChange={setSectionFilter}
                  placeholder="Section"
                  options={[
                    { value: "A", label: "Section A" },
                    { value: "B", label: "Section B" },
                    { value: "C", label: "Section C" },
                    { value: "D", label: "Section D" },
                  ]}
                />
                <SelectFilter value={statusFilter} onChange={setStatusFilter} placeholder="Status" options={[{ value: "Active", label: "Active" }, { value: "Inactive", label: "Inactive" }]} />

              </div>
              <button className="xl:ml-auto p-2.5 rounded-xl" style={{ border: `1px solid ${theme.colors.border}` }}>
                <SlidersHorizontal size={16} color={theme.colors.textMuted} />
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead style={{ background: theme.colors.tableHeader }}>
                  {table.getHeaderGroups().map((hg) => (
                    <tr key={hg.id}>
                      {hg.headers.map((header) => (
                        <th key={header.id} onClick={header.column.getToggleSortingHandler()}
                          className="text-left px-4 py-4 text-xs uppercase font-semibold cursor-pointer"
                          style={{ color: theme.colors.textMuted, borderBottom: `1px solid ${theme.colors.tableBorder}` }}>
                          <div className="flex items-center gap-1">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getIsSorted() === "asc" && <ChevronUp size={14} />}
                            {header.column.getIsSorted() === "desc" && <ChevronDown size={14} />}
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => {
                    const isSelected = selectedStudent?.id === row.original.id;
                    return (
                      <tr key={row.id} className="transition-all cursor-pointer hover:bg-gray-50"
                        style={{ borderBottom: `1px solid ${theme.colors.tableBorder}`, background: isSelected ? "#F8FAFC" : "transparent" }}>
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="px-4 py-4">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-4"
              style={{ borderTop: `1px solid ${theme.colors.tableBorder}` }}>
              <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
                {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, filteredData.length)} of {filteredData.length} entries
              </p>
              <div className="flex items-center gap-2">
                <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}
                  className="p-2 rounded-lg" style={{ border: `1px solid ${theme.colors.border}` }}>
                  <ChevronLeft size={16} />
                </button>
                {paginationRange.map((page, index) =>
                  page === "..." ? (
                    <span key={index} className="px-2 text-sm" style={{ color: theme.colors.textMuted }}>...</span>
                  ) : (
                    <button key={index} onClick={() => table.setPageIndex(page - 1)}
                      className="w-9 h-9 rounded-lg text-sm font-semibold"
                      style={{
                        background: table.getState().pagination.pageIndex === page - 1 ? theme.colors.primary : "transparent",
                        color: table.getState().pagination.pageIndex === page - 1 ? "#fff" : theme.colors.textPrimary,
                        border: `1px solid ${theme.colors.border}`,
                      }}>
                      {page}
                    </button>
                  )
                )}
                <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}
                  className="p-2 rounded-lg" style={{ border: `1px solid ${theme.colors.border}` }}>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          <StudentDrawer selectedStudent={selectedStudent} setSelectedStudent={setSelectedStudent} />

          <Dialog open={showDeactivateModal} onOpenChange={setShowDeactivateModal}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle
                  className="flex items-center gap-2 text-xl font-semibold"
                  style={{ color: theme.colors.danger }}
                >
                  <TriangleAlert size={22} />
                  Confirm Deactivation
                </DialogTitle>
              </DialogHeader>
              <DialogDescription>
                Are you sure you want to deactivate {deactivateStudent?.name || "this student"}? This action can be reversed later.
              </DialogDescription>
              <DialogFooter>
                <button
                  type="button"
                  onClick={() => setShowDeactivateModal(false)}
                  className="rounded-lg px-4 py-2 text-sm font-semibold"
                  style={{ background: theme.colors.surface, color: theme.colors.textPrimary, border: `1px solid ${theme.colors.border}` }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeactivateConfirm}
                  className="rounded-lg px-4 py-2 text-sm font-semibold"
                  style={{ background: theme.colors.danger, color: "#fff" }}
                >
                  Confirm Deactivate
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* ══════════════ DRAFTS TAB ══════════════ */}
      {activeTab === "drafts" && (
        <div className="rounded-2xl overflow-hidden"
          style={{ background: theme.colors.cardBg, border: `1px solid ${theme.colors.border}`, boxShadow: theme.shadow.card }}>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: `1px solid ${theme.colors.tableBorder}` }}>
            <div>
              <p className="text-sm font-bold" style={{ color: theme.colors.textPrimary }}>Saved Drafts</p>
              <p className="text-xs mt-0.5" style={{ color: theme.colors.textMuted }}>
                {drafts.length} draft{drafts.length !== 1 ? "s" : ""} — incomplete admissions saved for later
              </p>
            </div>
          </div>

          {/* Empty state */}
          {drafts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: theme.colors.background, border: `1px solid ${theme.colors.border}` }}>
                <FileText size={24} color={theme.colors.textMuted} />
              </div>
              <p className="text-sm font-semibold" style={{ color: theme.colors.textPrimary }}>No drafts yet</p>
              <p className="text-xs" style={{ color: theme.colors.textMuted }}>
                Save an admission form as a draft and it'll appear here.
              </p>
              <button onClick={() => navigate("/s-admin/add-student")}
                className="mt-2 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: theme.colors.primary }}>
                <Plus size={15} /> Start New Admission
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px]">
                <thead style={{ background: theme.colors.tableHeader }}>
                  <tr>
                    {["Sr No.", "Student Name", "Grade", "Guardian", "Saved On", "Completeness", "Actions"].map((h) => (
                      <th key={h} className="text-left px-4 py-3.5 text-xs uppercase font-semibold"
                        style={{ color: theme.colors.textMuted, borderBottom: `1px solid ${theme.colors.tableBorder}` }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {drafts.map((draft, i) => {
                    const name = [draft.basicData?.firstName, draft.basicData?.lastName].filter(Boolean).join(" ") || "—";
                    const initials = [draft.basicData?.firstName?.[0], draft.basicData?.lastName?.[0]].filter(Boolean).join("").toUpperCase() || "?";
                    const grade = draft.basicData?.grade ? `Grade ${draft.basicData.grade.replace("grade-", "")}` : "—";
                    const guardian = draft.guardianData?.primary?.name || "—";
                    const savedOn = new Date(draft.savedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

                    // Completeness: 5 sections
                    const checks = [
                      !!(draft.basicData?.firstName && draft.basicData?.lastName),
                      !!(draft.contactData?.addressLine1),
                      !!(draft.guardianData?.primary?.name && draft.guardianData?.primary?.phone),
                      Object.keys(draft.docsData || {}).length > 0,
                      !!(draft.feesData?.feeGroup),
                    ];
                    const filledCount = checks.filter(Boolean).length;
                    const pct = Math.round((filledCount / checks.length) * 100);
                    const pctColor = pct === 100 ? theme.colors.success : pct >= 60 ? theme.colors.warning : theme.colors.danger;

                    return (
                      <tr key={draft.id} className="hover:bg-gray-50 transition-all"
                        style={{ borderBottom: `1px solid ${theme.colors.tableBorder}` }}>
                        {/* Sr No */}
                        <td className="px-4 py-4">
                          <span className="text-sm font-medium" style={{ color: theme.colors.textPrimary }}>{i + 1}</span>
                        </td>
                        {/* Name */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                              style={{ background: `${theme.colors.primary}20`, color: theme.colors.primary }}>
                              {initials}
                            </div>
                            <div>
                              <p className="text-sm font-semibold" style={{ color: theme.colors.textPrimary }}>{name}</p>
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5"
                                style={{ background: "#FEF9C3", color: "#92400E", border: "1px solid #FDE68A" }}>
                                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 inline-block" /> Draft
                              </span>
                            </div>
                          </div>
                        </td>
                        {/* Grade */}
                        <td className="px-4 py-4">
                          <span className="text-sm" style={{ color: theme.colors.textSecondary }}>{grade}</span>
                        </td>
                        {/* Guardian */}
                        <td className="px-4 py-4">
                          <span className="text-sm" style={{ color: theme.colors.textSecondary }}>{guardian}</span>
                        </td>
                        {/* Saved On */}
                        <td className="px-4 py-4">
                          <span className="text-sm" style={{ color: theme.colors.textSecondary }}>{savedOn}</span>
                        </td>
                        {/* Completeness */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 rounded-full overflow-hidden" style={{ background: theme.colors.border }}>
                              <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: pctColor }} />
                            </div>
                            <span className="text-xs font-semibold" style={{ color: theme.colors.textSecondary }}>{pct}%</span>
                          </div>
                          <p className="text-[10px] mt-1" style={{ color: theme.colors.textMuted }}>
                            {filledCount} of {checks.length} sections filled
                          </p>
                        </td>
                        {/* Actions */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => navigate(`/s-admin/add-student?draftId=${draft.id}&step=5`)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                              style={{ background: `${theme.colors.primary}15`, color: theme.colors.primary, border: `1px solid ${theme.colors.primary}30` }}>
                              Edit
                            </button>
                            <button onClick={() => deleteDraft(draft.id)}
                              className="p-1.5 rounded-lg"
                              style={{ background: "#FEF2F2", color: theme.colors.danger, border: "1px solid #FECACA" }}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <RowActionMenu
        student={menuRow}
        position={menuPosition}
        onClose={closeMenu}
        onViewProfile={(s) => setSelectedStudent(s)}
        onEdit={(s) => navigate(`/s-admin/student-details/${s.id}`)}
        onCollectFee={(s) => navigate(`/s-admin/student-details/${s.id}?tab=fees`)}
        onPromote={() => { }}
        onDeactivate={(s) => {
          setDeactivateStudent(s);
          setShowDeactivateModal(true);
        }}
      />
    </div>
  );
}