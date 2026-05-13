import { useState, useMemo, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

import {
  Users,
  UserCheck,
  AlertTriangle,
  UserPlus,
  Download,
  Plus,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  MoreVertical,
} from "lucide-react";

import { theme } from "../../../theme/theme";
import { useOutletContext } from "react-router-dom";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
} from "recharts";
import StudentDrawer from "./StudentDrawer";
import { useNavigate } from "react-router-dom";


// ── Sample Data ──────────────────────────────────────────────────────────────
const STUDENTS = [
  {
    id: 1,
    name: "Sarah Jenkins",
    email: "sarah.j@student.edu",
    admNo: "#ST-2024-089",
    grade: "10 - A",
    guardian: "Robert Jenkins",
    guardianPhone: "+1 (555) 019-2834",
    attendance: 96,
    status: "Active",
    feeDue: true,
    avatar: "https://i.pravatar.cc/40?img=47",
  },
  {
    id: 2,
    name: "Michael Chang",
    email: "m.chang@student.edu",
    admNo: "#ST-2024-092",
    grade: "10 - A",
    guardian: "David Chang",
    guardianPhone: "+1 (555) 837-1120",
    attendance: 82,
    status: "Active",
    feeDue: false,
    avatar: "https://i.pravatar.cc/40?img=11",
  },
  {
    id: 3,
    name: "Emma Davis",
    email: "emma.d@student.edu",
    admNo: "#ST-2024-105",
    grade: "10 - A",
    guardian: "Sarah Davis",
    guardianPhone: "+1 (555) 442-9901",
    attendance: 98,
    status: "Active",
    feeDue: false,
    avatar: "https://i.pravatar.cc/40?img=5",
  },
  {
    id: 4,
    name: "James Doe",
    email: "j.doe@student.edu",
    admNo: "#ST-2024-118",
    grade: "10 - A",
    guardian: "John Doe",
    guardianPhone: "+1 (555) 221-5543",
    attendance: 65,
    status: "Active",
    feeDue: true,
    avatar: null,
  },
];

// ── Avatar ──────────────────────────────────────────────────────────────────
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

// ── Attendance Bar ──────────────────────────────────────────────────────────
function AttendanceBar({ value }) {
  const color =
    value >= 90
      ? theme.colors.success
      : value >= 75
        ? theme.colors.warning
        : theme.colors.danger;

  return (
    <div className="flex items-center gap-2">
      <span
        className="text-sm font-medium w-9"
        style={{
          color: theme.colors.textPrimary,
        }}
      >
        {value}%
      </span>

      <div
        className="h-2 w-24 rounded-full overflow-hidden"
        style={{
          background: theme.colors.border,
        }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${value}%`,
            background: color,
          }}
        />
      </div>
    </div>
  );
}

// ── Badge ───────────────────────────────────────────────────────────────────
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

// ── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({
  icon: Icon,
  label,
  value,
  iconBg,
  iconColor,
}) {
  return (
    <div
      className="rounded-2xl p-5 flex items-center justify-between transition-all"
      style={{
        background: theme.colors.cardBg,
        border: `1px solid ${theme.colors.border}`,
        boxShadow: theme.shadow.card,
      }}
    >
      <div>
        <p
          className="text-sm mb-1"
          style={{
            color: theme.colors.textSecondary,
          }}
        >
          {label}
        </p>

        <p
          className="text-3xl font-bold"
          style={{
            color: theme.colors.textPrimary,
          }}
        >
          {value}
        </p>
      </div>

      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{
          background: iconBg,
        }}
      >
        <Icon size={22} color={iconColor} />
      </div>
    </div>
  );
}

// ── Select ──────────────────────────────────────────────────────────────────
function Select({
  value,
  onChange,
  options,
  placeholder,
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none px-4 py-2.5 pr-9 rounded-xl text-sm font-medium outline-none transition-all"
        style={{
          background: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`,
          color: theme.colors.textPrimary,
        }}
      >
        <option value="">{placeholder}</option>

        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <ChevronDown
        size={15}
        className="absolute right-3 top-1/2 -translate-y-1/2"
        color={theme.colors.textMuted}
      />
    </div>
  );
}


// ── Main Component ──────────────────────────────────────────────────────────
export default function StudentList() {
  const navigate = useNavigate();
  const [globalFilter, setGlobalFilter] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // ── Filtered Data ────────────────────────────────────────────────────────
  const filteredData = useMemo(() => {
    return STUDENTS.filter((s) => {
      const matchGrade =
        !gradeFilter || s.grade.startsWith(gradeFilter);

      const matchSection =
        !sectionFilter || s.grade.endsWith(sectionFilter);

      const matchStatus =
        !statusFilter || s.status === statusFilter;

      const q = globalFilter.toLowerCase();

      const matchSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.admNo.toLowerCase().includes(q);

      return (
        matchGrade &&
        matchSection &&
        matchStatus &&
        matchSearch
      );
    });
  }, [
    globalFilter,
    gradeFilter,
    sectionFilter,
    statusFilter,
  ]);

  const attendanceTrend = selectedStudent?.attendanceTrend || [
    { month: "Jan", value: 92 },
    { month: "Feb", value: 88 },
    { month: "Mar", value: 95 },
    { month: "Apr", value: 90 },
    { month: "May", value: selectedStudent?.attendance || 0 },
  ];

  // ── Columns ──────────────────────────────────────────────────────────────
  const columns = useMemo(
    () => [
      {
        id: "srNo",
        header: "Sr No.",
        cell: ({ row }) => (
          <span
            className="text-sm font-medium"
            style={{ color: theme.colors.textPrimary }}
          >
            {row.index + 1}
          </span>
        ),
      },
      {
        accessorKey: "name",

        header: "Student",

        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar
              src={row.original.avatar}
              name={row.original.name}
            />

            <div>
              <button
                onClick={() => setSelectedStudent(row.original)}
                className="text-sm font-semibold text-left hover:underline"
                style={{
                  color: theme.colors.textPrimary,
                }}
              >
                {row.original.name}
              </button>

              <p
                className="text-xs"
                style={{
                  color: theme.colors.textMuted,
                }}
              >
                {row.original.email}
              </p>
            </div>
          </div>
        ),
      },

      {
        accessorKey: "admNo",

        header: "Adm No.",
      },

      {
        accessorKey: "grade",

        header: "Grade/Sec",
      },

      {
        accessorKey: "guardian",

        header: "Guardian",

        cell: ({ row }) => (
          <div>
            <p
              className="text-sm"
              style={{
                color: theme.colors.textPrimary,
              }}
            >
              {row.original.guardian}
            </p>

            <p
              className="text-xs"
              style={{
                color: theme.colors.info,
              }}
            >
              {row.original.guardianPhone}
            </p>
          </div>
        ),
      },

      {
        accessorKey: "attendance",

        header: "Attendance",

        cell: ({ row }) => (
          <AttendanceBar value={row.original.attendance} />
        ),
      },

      {
        accessorKey: "status",

        header: "Status",

        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Badge
              variant={
                row.original.status === "Active"
                  ? "active"
                  : "inactive"
              }
            >
              {row.original.status}
            </Badge>

            {row.original.feeDue && (
              <Badge variant="due">Fee Due</Badge>
            )}
          </div>
        ),
      },

      {
        id: "actions",

        header: "Actions",

        cell: ({ row }) => (
          <div className="relative">
            <button
              onClick={() =>
                setOpenMenu(
                  openMenu === row.id ? null : row.id
                )
              }
              className="p-2 rounded-lg transition-all"
            >
              <MoreVertical
                size={16}
                color={theme.colors.textMuted}
              />
            </button>

            {openMenu === row.id && (
              <div
                className="absolute right-0 top-9 z-20 w-40 rounded-xl overflow-hidden"
                style={{
                  background: theme.colors.surface,
                  border: `1px solid ${theme.colors.border}`,
                  boxShadow: theme.shadow.modal,
                }}
              >
                {[
                  "View Profile",
                  "Edit",
                  "Fee Details",
                  "Deactivate",
                ].map((action) => (
                  <button
                    key={action}
                    onClick={() => {
                      if (action === "View Profile") {
                        setSelectedStudent(row.original);
                      }

                      setOpenMenu(null);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                    style={{
                      color: theme.colors.textPrimary,
                    }}
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}
          </div>
        ),
      },
    ],
    [openMenu]
  );

  // ── Table ────────────────────────────────────────────────────────────────
  const table = useReactTable({
    data: filteredData,
    columns,

    state: {
      sorting,
    },

    onSortingChange: setSorting,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),

    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  const paginationRange = useMemo(() => {
    const totalPages = table.getPageCount();
    const current = table.getState().pagination.pageIndex + 1;

    const delta = 1; // how many pages around current

    const range = [];
    const rangeWithDots = [];

    let left = Math.max(2, current - delta);
    let right = Math.min(totalPages - 1, current + delta);

    range.push(1);

    if (left > 2) {
      range.push("...");
    }

    for (let i = left; i <= right; i++) {
      range.push(i);
    }

    if (right < totalPages - 1) {
      range.push("...");
    }

    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  }, [table.getState().pagination.pageIndex, filteredData.length]);


  return (
    <div
      className="min-h-screen"
      style={{
        background: theme.colors.background,
        fontFamily: theme.typography.fontFamily,
        padding: theme.layout.contentPadding,
      }}
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
        <div className="flex flex-col gap-2">
          <h1
            style={{
              fontSize: "1.7rem",
              fontWeight: 700,
              color: theme.colors.textPrimary,
              margin: 0,
            }}
          >
            Student List
          </h1>

          <p
            className="text-sm"
            style={{
              color: theme.colors.textSecondary,
              margin: 0,
            }}
          >
            Manage enrollments, attendance, and academic records.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
            style={{
              background: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
              color: theme.colors.textPrimary,
            }}
          >
            <Download size={16} />
            Export
          </button>

          <button
            onClick={() => navigate("/s-admin/add-student")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{
              background: theme.colors.primary,
            }}
          >
            <Plus size={16} />
            Add Student
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={Users}
          label="Total Enrolled"
          value="1,248"
          iconBg="#EEF2FF"
          iconColor={theme.colors.info}
        />

        <StatCard
          icon={UserCheck}
          label="Active Today"
          value="1,180"
          iconBg="#ECFDF3"
          iconColor={theme.colors.success}
        />

        <StatCard
          icon={AlertTriangle}
          label="Fee Defaulters"
          value="42"
          iconBg="#FEF2F2"
          iconColor={theme.colors.danger}
        />

        <StatCard
          icon={UserPlus}
          label="New Admissions"
          value="12"
          iconBg="#F5F3FF"
          iconColor="#8B5CF6"
        />
      </div>

      {/* Main Layout */}
      <div className="w-full">

        {/* LEFT SIDE */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: theme.colors.cardBg,
            border: `1px solid ${theme.colors.border}`,
            boxShadow: theme.shadow.card,
          }}
        >
          {/* Filters */}
          <div
            className="flex flex-col xl:flex-row xl:items-center gap-3 p-4"
            style={{
              borderBottom: `1px solid ${theme.colors.tableBorder}`,
            }}
          >
            {/* Search */}
            <div className="relative w-full xl:max-w-sm">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                color={theme.colors.textMuted}
              />

              <input
                type="text"
                placeholder="Search by name, ID..."
                value={globalFilter}
                onChange={(e) =>
                  setGlobalFilter(e.target.value)
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
                style={{
                  background: theme.colors.background,
                  border: `1px solid ${theme.colors.border}`,
                  color: theme.colors.textPrimary,
                }}
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <Select
                value={gradeFilter}
                onChange={setGradeFilter}
                placeholder="Grade"
                options={[
                  {
                    value: "10",
                    label: "Grade 10",
                  },
                ]}
              />

              <Select
                value={sectionFilter}
                onChange={setSectionFilter}
                placeholder="Section"
                options={[
                  {
                    value: "A",
                    label: "Section A",
                  },
                ]}
              />

              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                placeholder="Status"
                options={[
                  {
                    value: "Active",
                    label: "Active",
                  },
                  {
                    value: "Inactive",
                    label: "Inactive",
                  },
                ]}
              />
            </div>

            <button
              className="xl:ml-auto p-2.5 rounded-xl"
              style={{
                border: `1px solid ${theme.colors.border}`,
              }}
            >
              <SlidersHorizontal
                size={16}
                color={theme.colors.textMuted}
              />
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead
                style={{
                  background: theme.colors.tableHeader,
                }}
              >
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id}>
                    {hg.headers.map((header) => (
                      <th
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        className="text-left px-4 py-4 text-xs uppercase font-semibold cursor-pointer"
                        style={{
                          color: theme.colors.textMuted,
                          borderBottom: `1px solid ${theme.colors.tableBorder}`,
                        }}
                      >
                        <div className="flex items-center gap-1">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}

                          {header.column.getIsSorted() ===
                            "asc" && <ChevronUp size={14} />}

                          {header.column.getIsSorted() ===
                            "desc" && (
                              <ChevronDown size={14} />
                            )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody>
                {table.getRowModel().rows.map((row) => {
                  const isSelected =
                    selectedStudent?.id === row.original.id;

                  return (
                    <tr
                      key={row.id}
                      className="transition-all cursor-pointer hover:bg-gray-50"
                      style={{
                        borderBottom: `1px solid ${theme.colors.tableBorder}`,
                        background: isSelected
                          ? "#F8FAFC"
                          : "transparent",
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-4 py-4"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div
            className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-4"
            style={{
              borderTop: `1px solid ${theme.colors.tableBorder}`,
            }}
          >
            <p
              className="text-sm"
              style={{
                color: theme.colors.textSecondary,
              }}
            >
              Showing{" "}
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}{" "}
              to{" "}
              {Math.min(
                (table.getState().pagination.pageIndex +
                  1) *
                table.getState().pagination.pageSize,
                filteredData.length
              )}{" "}
              of {filteredData.length} entries
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="p-2 rounded-lg"
                style={{
                  border: `1px solid ${theme.colors.border}`,
                }}
              >
                <ChevronLeft size={16} />
              </button>

              {paginationRange.map((page, index) =>
                page === "..." ? (
                  <span
                    key={index}
                    className="px-2 text-sm"
                    style={{
                      color: theme.colors.textMuted,
                    }}
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={index}
                    onClick={() =>
                      table.setPageIndex(page - 1)
                    }
                    className="w-9 h-9 rounded-lg text-sm font-semibold"
                    style={{
                      background:
                        table.getState().pagination
                          .pageIndex ===
                          page - 1
                          ? theme.colors.primary
                          : "transparent",
                      color:
                        table.getState().pagination
                          .pageIndex ===
                          page - 1
                          ? "#fff"
                          : theme.colors.textPrimary,
                      border: `1px solid ${theme.colors.border}`,
                    }}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="p-2 rounded-lg"
                style={{
                  border: `1px solid ${theme.colors.border}`,
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE DRAWER */}
        <StudentDrawer
          selectedStudent={selectedStudent}
          setSelectedStudent={setSelectedStudent}
        />
      </div>
    </div>
  );
}