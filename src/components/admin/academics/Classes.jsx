import React, { useMemo, useState } from "react";

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Plus,
  Search,
  MoreHorizontal,
  Users,
  GraduationCap,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { theme } from "../../../theme/theme";
import AddClassModal from "../modals/AddClassModal";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


// ─────────────────────────────────────────────
// Stat Card
// ─────────────────────────────────────────────
const StatCard = ({
  title,
  value,
  icon: Icon,
  iconBg,
  iconColor,
}) => {
  return (
    <div
      className="rounded-3xl p-5 transition-all"
      style={{
        background: theme.colors.cardBg,
        border: `1px solid ${theme.colors.border}`,
        boxShadow: theme.shadow.card,
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p
            className="text-sm"
            style={{
              color: theme.colors.textSecondary,
            }}
          >
            {title}
          </p>

          <h2
            className="text-3xl font-bold mt-2"
            style={{
              color: theme.colors.textPrimary,
            }}
          >
            {value}
          </h2>
        </div>

        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{
            background: iconBg,
          }}
        >
          <Icon
            className="w-6 h-6"
            color={iconColor}
          />
        </div>
      </div>
    </div>
  );
};
// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
const Classes = () => {
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openAction, setOpenAction] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [modalMode, setModalMode] = useState("add");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
const [deleteItem, setDeleteItem] = useState(null);
const [statusFilter, setStatusFilter] = useState("");

  const [classes, setClasses] = useState([
    {
      id: 1,
      srNo: 1,
      className: "5th Standard",
      sections: ["A", "B"],
      sectionCount: 2,
      students: 120,
      capacity: 40,
      teacher: "M. Kulkarni",
      status: "Active",
    },

    {
      id: 2,
      srNo: 2,
      className: "7th Standard",
      sections: ["A", "B", "C"],
      sectionCount: 3,
      students: 130,
      capacity: 45,
      teacher: "K. Mehta",
      status: "Active",
    },

    {
      id: 3,
      srNo: 3,
      className: "8th Standard",
      sections: ["A", "B"],
      sectionCount: 2,
      students: 100,
      capacity: 45,
      teacher: "D. Verma",
      status: "Active",
    },

    {
      id: 4,
      srNo: 4,
      className: "10th Standard",
      sections: ["A", "B", "C", "D"],
      sectionCount: 4,
      students: 180,
      capacity: 50,
      teacher: "V. Chavan",
      status: "Inactive",
    },
  ]);

const filteredData = useMemo(() => {
  return classes.filter((item) => {
    const matchesSearch =
      item.className
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === ""
        ? true
        : item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
}, [search, statusFilter, classes]);


const exportToExcel = () => {
  const now = new Date(),
    formattedDate = now.toLocaleDateString("en-IN"),
    formattedTime = now.toLocaleTimeString("en-IN"),
    excelData = classes.map((item) => ({
      "Sr No": item.srNo,
      "Class Name": item.className,
      Sections: item.sections.join(", "),
      "Section Count": item.sectionCount,
      "Student Count": item.students,
      Capacity: item.capacity,
      Coordinator: item.teacher,
      Status: item.status,
    })),
    worksheet = XLSX.utils.json_to_sheet([]);

  XLSX.utils.sheet_add_aoa(
    worksheet,
    [
      ["Class Management Report"],
      [`Export Date: ${formattedDate}`],
      [`Export Time: ${formattedTime}`],
      [],
    ],
    { origin: "A1" }
  );

  XLSX.utils.sheet_add_json(worksheet, excelData, {
    origin: "A5",
    skipHeader: false,
  });

  worksheet["!cols"] = [
    { wch: 10 },
    { wch: 25 },
    { wch: 20 },
    { wch: 18 },
    { wch: 18 },
    { wch: 15 },
    { wch: 25 },
    { wch: 15 },
  ];

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Classes"
  );

  const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    }),
    fileData = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

  saveAs(
    fileData,
    `Classes_Report_${formattedDate}.xlsx`
  );
};

  const columns = [
    {
      accessorKey: "srNo",
      header: "Sr No",
    },

    {
      accessorKey: "className",
      header: "Class",
    },

    {
      accessorKey: "sections",
      header: "Sections",

      cell: ({ row }) => (
        <div className="flex gap-1 flex-wrap">
          {row.original.sections.map((sec) => (
            <span
              key={sec}
              className="px-2.5 py-1 rounded-lg text-xs font-medium"
              style={{
                background: theme.colors.sidebarActive,
                color: theme.colors.primary,
              }}
            >
              {sec}
            </span>
          ))}
        </div>
      ),
    },

    {
      accessorKey: "sectionCount",
      header: "Section Count",
    },

    {
      accessorKey: "students",
      header: "Student Count",
    },

    {
      accessorKey: "capacity",
      header: "Capacity",

      cell: ({ row }) => (
        <span
          className="font-medium"
          style={{
            color: theme.colors.textPrimary,
          }}
        >
          {row.original.capacity}
        </span>
      ),
    },

    {
      accessorKey: "teacher",
      header: "Coordinator",
    },

    {
      accessorKey: "status",
      header: "Status",

      cell: ({ row }) => {
        const status = row.original.status;

        return (
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              background:
                status === "Active"
                  ? "#ECFDF3"
                  : "#FEF2F2",

              color:
                status === "Active"
                  ? theme.colors.success
                  : theme.colors.danger,
            }}
          >
            {status}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",

      cell: ({ row }) => {
        const rowId = row.original.id;

        return (
          <div className="relative">
            {/* 3 Dot Button */}
            <button
              onClick={() =>
                setOpenAction(
                  openAction === rowId ? null : rowId
                )
              }
              className="p-2 rounded-xl transition-all hover:bg-gray-100"
            >
              <MoreHorizontal
                className="w-4 h-4"
                color={theme.colors.textMuted}
              />
            </button>

            {/* Dropdown */}
            {openAction === rowId && (
              <div
                className="absolute right-0 top-12 w-44 rounded-2xl z-50 overflow-hidden"
                style={{
                  background: theme.colors.cardBg,
                  border: `1px solid ${theme.colors.border}`,
                  boxShadow: theme.shadow.modal,
                }}
              >
                {/* View */}
                <button
                  onClick={() => {
                    setModalMode("view");
                    setSelectedClass(row.original);
                    setOpenModal(true);
                    setOpenAction(null);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-all hover:bg-gray-50"
                  style={{
                    color: theme.colors.textPrimary,
                  }}
                >
                  <Eye size={16} />
                  View
                </button>

                {/* Edit */}
                <button
                  onClick={() => {
                    setModalMode("edit");
                    setSelectedClass(row.original);
                    setOpenModal(true);
                    setOpenAction(null);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-all hover:bg-gray-50"
                  style={{
                    color: theme.colors.textPrimary,
                  }}
                >
                  <Pencil size={16} />
                  Edit
                </button>

               {/* Delete */}
<button
  onClick={() => {
    setDeleteItem(row.original);
    setDeleteModalOpen(true);
    setOpenAction(null);
  }}
  className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-all hover:bg-red-50"
  style={{
    color: theme.colors.danger,
  }}
>
  <Trash2 size={16} />
  Delete
</button>
              </div>
            )}
          </div>
        );
      },
    }
  ];

  // ─────────────────────────────────────────
  // Table
  // ─────────────────────────────────────────
  const table = useReactTable({
    data: filteredData,
    columns,

    getCoreRowModel: getCoreRowModel(),

    getPaginationRowModel:
      getPaginationRowModel(),

    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  return (
    <div
      className="min-h-screen"
      style={{
        background: theme.colors.background,
        padding: theme.layout.contentPadding,
        fontFamily: theme.typography.fontFamily,
      }}
    >
      {/* ───────────────────────── HEADER ───────────────────────── */}
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
            Class Management
          </h1>

          <p
            className="text-sm"
            style={{
              color: theme.colors.textSecondary,
              margin: 0,
            }}
          >
            Manage class groups and faculty assignments
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
         <button
  onClick={exportToExcel}
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
            onClick={() => {
              setModalMode("add");
              setSelectedClass(null);
              setOpenModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{
              background: theme.colors.primary,
            }}
          >
            <Plus size={16} />
            Add Class
          </button>
        </div>
      </div>

      {/* ───────────────────────── STATS ───────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
        <StatCard
          title="Total Classes"
          value="24"
          icon={GraduationCap}
          iconBg="#EEF2FF"
          iconColor="#4F46E5"
        />

        <StatCard
          title="Total Students"
          value="860"
          icon={Users}
          iconBg="#ECFDF3"
          iconColor="#16A34A"
        />

        <StatCard
          title="Total Subjects"
          value="48"
          icon={BookOpen}
          iconBg="#FEF3C7"
          iconColor="#D97706"
        />
      </div>

      {/* ───────────────────────── TABLE CARD ───────────────────────── */}
      <div
        className="rounded-3xl overflow-hidden"
        style={{
          background: theme.colors.cardBg,
          border: `1px solid ${theme.colors.border}`,
          boxShadow: theme.shadow.card,
        }}
      >
    
      {/* ───────────────────── TABLE HEADER ───────────────────── */}
<div
  className="p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
  style={{
    borderBottom: `1px solid ${theme.colors.tableBorder}`,
  }}
>
  {/* Left Side */}
  <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
    
    {/* Search */}
    <div className="relative w-full sm:w-80">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
        color={theme.colors.textMuted}
      />

      <Input
        placeholder="Search classes..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="pl-10 rounded-2xl h-11 border-0 focus-visible:ring-0"
        style={{
          background: theme.colors.background,
          color: theme.colors.textPrimary,
        }}
      />
    </div>

<div className="relative min-w-[180px]">
  <select
    value={statusFilter}
    onChange={(e) =>
      setStatusFilter(e.target.value)
    }
    className="w-full h-11 pl-4 pr-16 rounded-2xl text-sm font-medium appearance-none cursor-pointer transition-all"
    style={{
      background: theme.colors.cardBg,
      border: `1px solid ${theme.colors.border}`,
      color: theme.colors.textPrimary,
      boxShadow: theme.shadow.card,
    }}
  >
    <option value="" disabled>
      Filter by Status
    </option>

    <option value="Active">
      Active
    </option>

    <option value="Inactive">
      Inactive
    </option>
  </select>

  {/* Clear Button */}
  {statusFilter && (
    <button
      onClick={() => setStatusFilter("")}
      className="absolute right-9 top-1/2 -translate-y-1/2"
    >
      <X
        size={15}
        color={theme.colors.textMuted}
      />
    </button>
  )}

  {/* Custom Arrow */}
  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
    <ChevronRight
      className="w-4 h-4 rotate-90"
      color={theme.colors.textMuted}
    />
  </div>
</div>
  </div>
</div>

        {/* ───────────────────── TABLE ───────────────────── */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead
              style={{
                background: theme.colors.tableHeader,
              }}
            >
              {table
                .getHeaderGroups()
                .map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(
                      (header) => (
                        <th
                          key={header.id}
                          className="text-left px-6 py-4 text-xs uppercase font-semibold"
                          style={{
                            color:
                              theme.colors
                                .textMuted,

                            borderBottom: `1px solid ${theme.colors.tableBorder}`,
                          }}
                        >
                          {flexRender(
                            header.column
                              .columnDef.header,
                            header.getContext()
                          )}
                        </th>
                      )
                    )}
                  </tr>
                ))}
            </thead>

            <tbody>
              {table
                .getRowModel()
                .rows.map((row) => (
                  <tr
                    key={row.id}
                    className="transition-all"
                    style={{
                      borderBottom: `1px solid ${theme.colors.tableBorder}`,
                    }}
                  >
                    {row
                      .getVisibleCells()
                      .map((cell) => (
                        <td
                          key={cell.id}
                          className="px-6 py-4 text-sm"
                          style={{
                            color:
                              theme.colors
                                .textSecondary,
                          }}
                        >
                          {flexRender(
                            cell.column
                              .columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* ───────────────────── PAGINATION ───────────────────── */}
        <div
          className="p-5 flex items-center justify-between"
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
            {table.getRowModel().rows.length}{" "}
            entries
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                table.previousPage()
              }
              disabled={
                !table.getCanPreviousPage()
              }
              className="rounded-xl"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="rounded-xl"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      <AddClassModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelectedClass(null);
        }}
        mode={modalMode}
        initialData={selectedClass}
        onSave={(data) => {
          if (modalMode === "edit") {
            setClasses((prev) =>
              prev.map((item) =>
                item.id === data.id ? data : item
              )
            );
          } else {
            setClasses((prev) => [
              ...prev,
              {
                ...data,
                srNo: prev.length + 1,
              },
            ]);
          }
        }}
      />


      {/* ───────────────── DELETE CONFIRM MODAL ───────────────── */}
{deleteModalOpen && (
  <>
    {/* Overlay */}
    <div
      className="fixed inset-0 z-40"
      style={{
        background: theme.colors.drawerOverlay,
      }}
      onClick={() => {
        setDeleteModalOpen(false);
        setDeleteItem(null);
      }}
    />

    {/* Modal */}
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="w-full max-w-md rounded-3xl overflow-hidden"
        style={{
          background: theme.colors.cardBg,
          boxShadow: theme.shadow.modal,
        }}
      >
        {/* Header */}
        <div
          className="px-6 py-5"
          style={{
            borderBottom: `1px solid ${theme.colors.border}`,
          }}
        >
          <h2
            className="text-xl font-bold"
            style={{
              color: theme.colors.textPrimary,
            }}
          >
            Delete Class
          </h2>

         <p
  className="text-sm mt-2"
  style={{
    color: theme.colors.textSecondary,
  }}
>
  Are you sure you want to delete{" "}
  <span
    style={{
      fontWeight: 600,
      color: theme.colors.textPrimary,
    }}
  >
    {deleteItem?.className}
  </span>{" "}
  class?
</p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-5">
          <button
            onClick={() => {
              setDeleteModalOpen(false);
              setDeleteItem(null);
            }}
            className="px-5 h-11 rounded-2xl text-sm font-medium"
            style={{
              border: `1px solid ${theme.colors.border}`,
              color: theme.colors.textPrimary,
            }}
          >
            Cancel
          </button>

          <button
            onClick={() => {
              setClasses((prev) =>
                prev.filter(
                  (item) => item.id !== deleteItem.id
                )
              );

              setDeleteModalOpen(false);
              setDeleteItem(null);
            }}
            className="px-5 h-11 rounded-2xl text-sm font-semibold text-white"
            style={{
              background: theme.colors.danger,
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </>
)}
    </div>
  );
};

export default Classes;