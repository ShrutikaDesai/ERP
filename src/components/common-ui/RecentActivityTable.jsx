import React, { useState, useMemo, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

import {
  CreditCard,
  Ban,
  FileText,
  UserPlus,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Search,
} from "lucide-react";

import { theme } from "../../theme/theme";

// ── Sample Data ───────────────────────────────────────────────────────────────
const defaultData = [
  {
    id: 1,
    icon: CreditCard,
    iconColor: "#3B82F6",
    iconBg: "#EFF6FF",
    activity: "Fee Payment Received",
    sub: "Term 1 Tuition - $1,200",
    avatar: "https://i.pravatar.cc/32?img=47",
    name: "Sarah Jenkins",
    date: "Today, 10:42 AM",
    ago: "2 mins ago",
    status: "Completed",
    statusColor: "#22C55E",
    statusBg: "#F0FDF4",
  },

  {
    id: 2,
    icon: Ban,
    iconColor: "#EF4444",
    iconBg: "#FEF2F2",
    activity: "Absent Alert",
    sub: "Consecutive 3 days",
    avatar: "https://i.pravatar.cc/32?img=12",
    name: "Michael Chang",
    date: "Today, 08:30 AM",
    ago: "4 hours ago",
    status: "Attention Needed",
    statusColor: "#EF4444",
    statusBg: "#FEF2F2",
  },

  {
    id: 3,
    icon: FileText,
    iconColor: "#8B5CF6",
    iconBg: "#F3E8FF",
    activity: "Exam Schedule Published",
    sub: "Mid-term Grade 10",
    initials: "MR",
    name: "Mr. Roberts",
    date: "Yesterday, 16:45 PM",
    ago: "1 day ago",
    status: "System Log",
    statusColor: "#3B82F6",
    statusBg: "#EFF6FF",
  },

  {
    id: 4,
    icon: UserPlus,
    iconColor: "#22C55E",
    iconBg: "#F0FDF4",
    activity: "New Enrollment",
    sub: "Grade 8 - Section B",
    avatar: "https://i.pravatar.cc/32?img=33",
    name: "Emma Davis",
    date: "Yesterday, 11:20 AM",
    ago: "1 day ago",
    status: "Completed",
    statusColor: "#22C55E",
    statusBg: "#F0FDF4",
  },

  {
    id: 5,
    icon: AlertTriangle,
    iconColor: "#F59E0B",
    iconBg: "#FFFBEB",
    activity: "Fee Overdue",
    sub: "Term 3 - $800 pending",
    avatar: "https://i.pravatar.cc/32?img=41",
    name: "Aisha Patel",
    date: "3 days ago, 12:30 PM",
    ago: "3 days ago",
    status: "Attention Needed",
    statusColor: "#EF4444",
    statusBg: "#FEF2F2",
  },

  {
    id: 6,
    icon: CreditCard,
    iconColor: "#3B82F6",
    iconBg: "#EFF6FF",
    activity: "Fee Payment Received",
    sub: "Sports Fee - $200",
    avatar: "https://i.pravatar.cc/32?img=15",
    name: "Jake Morrison",
    date: "4 days ago, 09:45 AM",
    ago: "4 days ago",
    status: "Completed",
    statusColor: "#22C55E",
    statusBg: "#F0FDF4",
  },
];

// ── Sort Icon ────────────────────────────────────────────────────────────────
const SortIcon = ({ sorted }) => {
  if (!sorted)
    return (
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        style={{ opacity: 0.35 }}
      >
        <path d="M7 15l5 5 5-5M7 9l5-5 5 5" />
      </svg>
    );

  return sorted === "asc" ? (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke={theme.colors.primary}
      strokeWidth={2.5}
    >
      <path d="M7 15l5 5 5-5" />
    </svg>
  ) : (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke={theme.colors.primary}
      strokeWidth={2.5}
    >
      <path d="M7 9l5-5 5 5" />
    </svg>
  );
};

// ── Main Component ───────────────────────────────────────────────────────────
const RecentActivityTable = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const columns = useMemo(
    () => [
      {
        id: "activity",
        accessorKey: "activity",
        header: "ACTIVITY",

        cell: ({ row }) => {
          const r = row.original;
          const Icon = r.icon;

          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                minWidth: "220px",
              }}
            >
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "14px",
                  backgroundColor: r.iconBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={18} color={r.iconColor} strokeWidth={2.2} />
              </div>

              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: theme.colors.textPrimary,
                  }}
                >
                  {r.activity}
                </p>

                <p
                  style={{
                    margin: "2px 0 0",
                    fontSize: "0.75rem",
                    color: theme.colors.textSecondary,
                  }}
                >
                  {r.sub}
                </p>
              </div>
            </div>
          );
        },
      },

      {
        id: "name",
        accessorKey: "name",
        header: "USER/STUDENT",

        cell: ({ row }) => {
          const r = row.original;

          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                minWidth: "180px",
              }}
            >
              {r.avatar ? (
                <img
                  src={r.avatar}
                  alt={r.name}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: theme.colors.border,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                  }}
                >
                  {r.initials}
                </div>
              )}

              <span
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: theme.colors.textPrimary,
                }}
              >
                {r.name}
              </span>
            </div>
          );
        },
      },

      {
        id: "date",
        accessorKey: "date",
        header: "DATE & TIME",

        cell: ({ row }) => {
          const r = row.original;

          return (
            <div style={{ minWidth: "170px" }}>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.875rem",
                  color: theme.colors.textPrimary,
                }}
              >
                {r.date}
              </p>

              <p
                style={{
                  margin: "2px 0 0",
                  fontSize: "0.75rem",
                  color: theme.colors.textMuted,
                }}
              >
                {r.ago}
              </p>
            </div>
          );
        },
      },

      {
        id: "status",
        accessorKey: "status",
        header: "STATUS",

        cell: ({ row }) => {
          const r = row.original;

          return (
            <span
              style={{
                display: "inline-block",
                padding: "5px 12px",
                borderRadius: "999px",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: r.statusColor,
                backgroundColor: r.statusBg,
                whiteSpace: "nowrap",
              }}
            >
              {r.status}
            </span>
          );
        },
      },

      {
        id: "action",
        header: "ACTION",

        cell: () => (
          <button
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: theme.colors.textMuted,
              padding: "4px",
            }}
          >
            <ChevronRight size={18} />
          </button>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: defaultData,
    columns,
    state: {
      globalFilter,
      sorting,
    },

    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  const { pageIndex, pageSize } = table.getState().pagination;

  const totalRows = table.getFilteredRowModel().rows.length;

  const fromRow = pageIndex * pageSize + 1;
  const toRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <div
      style={{
        backgroundColor: theme.colors.cardBg,
        borderRadius: theme.radius.lg,
        border: `1px solid ${theme.colors.border}`,
        boxShadow: theme.shadow.card,
        padding: isMobile ? "16px" : "24px",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: isMobile ? "stretch" : "flex-start",
          flexDirection: isMobile ? "column" : "row",
          gap: "16px",
          marginBottom: "22px",
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
            Recent Activity
          </h3>

          <p
            style={{
              margin: "4px 0 0",
              fontSize: "0.8125rem",
              color: theme.colors.textSecondary,
            }}
          >
            Latest transactions, updates and alerts
          </p>
        </div>

        {/* Search */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radius.md,
            padding: "10px 12px",
            backgroundColor: theme.colors.background,
            width: isMobile ? "100%" : "260px",
          }}
        >
          <Search
            size={15}
            color={theme.colors.textMuted}
            strokeWidth={2}
          />

          <input
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Filter activity..."
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "0.875rem",
              width: "100%",
              color: theme.colors.textPrimary,
              fontFamily: theme.typography.fontFamily,
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div
        style={{
          width: "100%",
          overflowX: "auto",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: "850px",
          }}
        >
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{
                      textAlign: "left",
                      padding: "12px",
                      fontSize: "0.7rem",
                      letterSpacing: "0.06em",
                      color: theme.colors.textMuted,
                      borderBottom: `1px solid ${theme.colors.tableBorder}`,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}

                      <SortIcon sorted={header.column.getIsSorted()} />
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                style={{
                  borderBottom: `1px solid ${theme.colors.tableBorder}`,
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    style={{
                      padding: "16px 12px",
                      verticalAlign: "middle",
                    }}
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: isMobile ? "stretch" : "center",
          flexDirection: isMobile ? "column" : "row",
          gap: "12px",
          marginTop: "18px",
          paddingTop: "14px",
          borderTop: `1px solid ${theme.colors.border}`,
        }}
      >
        <span
          style={{
            fontSize: "0.8125rem",
            color: theme.colors.textSecondary,
          }}
        >
          Showing {fromRow}–{toRow} of {totalRows} entries
        </span>

        <div
          style={{
            display: "flex",
            gap: "8px",
            width: isMobile ? "100%" : "auto",
          }}
        >
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            style={{
              flex: isMobile ? 1 : "unset",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
              padding: "10px 14px",
              borderRadius: theme.radius.sm,
              border: `1px solid ${theme.colors.border}`,
              backgroundColor: theme.colors.surface,
              cursor: "pointer",
            }}
          >
            <ChevronLeft size={15} />
            Prev
          </button>

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            style={{
              flex: isMobile ? 1 : "unset",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
              padding: "10px 14px",
              borderRadius: theme.radius.sm,
              border: `1px solid ${theme.colors.border}`,
              backgroundColor: theme.colors.surface,
              cursor: "pointer",
            }}
          >
            Next
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentActivityTable;