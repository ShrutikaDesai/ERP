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
  Layers3,
  Users,
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
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import AddSectionModal from "../modals/AddSectionModal";

const StatCard = ({
  title,
  value,
  icon: Icon,
  iconBg,
  iconColor,
}) => {
  return (
    <div
      className="rounded-3xl p-5"
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

const Sections = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [openAction, setOpenAction] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [modalMode, setModalMode] = useState("add");
  const [classFilter, setClassFilter] = useState("");

  const classOptions = [
    "5th Standard",
    "6th Standard",
    "7th Standard",
    "8th Standard",
    "9th Standard",
    "10th Standard",
  ];

  const [sections, setSections] = useState([
    {
      id: 1,
      srNo: 1,
      sectionName: "A",
      className: "5th Standard",
      students: 40,
      classTeacher: "M. Kulkarni",
      roomNo: "101",
      status: "Active",
    },

    {
      id: 2,
      srNo: 2,
      sectionName: "B",
      className: "5th Standard",
      students: 38,
      classTeacher: "P. Sharma",
      roomNo: "102",
      status: "Active",
    },

    {
      id: 3,
      srNo: 3,
      sectionName: "A",
      className: "7th Standard",
      students: 45,
      classTeacher: "K. Mehta",
      roomNo: "203",
      status: "Active",
    },

    {
      id: 4,
      srNo: 4,
      sectionName: "C",
      className: "10th Standard",
      students: 50,
      classTeacher: "D. Verma",
      roomNo: "305",
      status: "Inactive",
    },
  ]);

const filteredData = useMemo(() => {
  return sections.filter((item) => {
    const matchesSearch =
      item.sectionName
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      item.className
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === ""
        ? true
        : item.status === statusFilter;

    const matchesClass =
      classFilter === ""
        ? true
        : item.className
            .toLowerCase()
            .includes(classFilter.toLowerCase());

    return (
      matchesSearch &&
      matchesStatus &&
      matchesClass
    );
  });
}, [
  search,
  statusFilter,
  classFilter,
  sections,
]);

const exportToExcel = () => {
  const now = new Date();

  const formattedDate = now.toLocaleDateString("en-IN");
  const formattedTime = now.toLocaleTimeString("en-IN");

  const excelData = sections.map((item) => ({
    "Sr No": item.srNo,
    Section: item.sectionName,
    Class: item.className,
    Students: item.students,
    "Class Teacher": item.classTeacher,
    "Room No": item.roomNo,
    Status: item.status,
  }));

  const worksheet = XLSX.utils.json_to_sheet([]);

  // ✅ HEADER (TITLE + DATE + TIME)
  XLSX.utils.sheet_add_aoa(
    worksheet,
    [
      ["Section Management Report"],
      [`Export Date: ${formattedDate}`],
      [`Export Time: ${formattedTime}`],
      [],
    ],
    { origin: "A1" }
  );

  // ✅ DATA START FROM A5
  XLSX.utils.sheet_add_json(worksheet, excelData, {
    origin: "A5",
    skipHeader: false,
  });

  // ✅ COLUMN WIDTHS
  worksheet["!cols"] = [
    { wch: 10 }, // Sr No
    { wch: 25 }, // Section
    { wch: 25 }, // Class
    { wch: 15 }, // Students
    { wch: 25 }, // Class Teacher
    { wch: 15 }, // Room No
    { wch: 15 }, // Status
  ];

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Sections");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const fileData = new Blob([excelBuffer], {
    type:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });

  saveAs(
    fileData,
    `Sections_Report_${formattedDate}.xlsx`
  );
};

  const columns = [
    {
      accessorKey: "srNo",
      header: "Sr No",
    },

    {
      accessorKey: "sectionName",
      header: "Section",

      cell: ({ row }) => (
        <span
          className="px-3 py-1 rounded-xl text-xs font-semibold"
          style={{
            background:
              theme.colors.sidebarActive,
            color: theme.colors.primary,
          }}
        >
          Section {row.original.sectionName}
        </span>
      ),
    },

    {
      accessorKey: "className",
      header: "Class",
    },

    {
      accessorKey: "students",
      header: "Students",
    },

    {
      accessorKey: "classTeacher",
      header: "Class Teacher",
    },

    {
      accessorKey: "roomNo",
      header: "Room No",
    },

    {
      id: "actions",
      header: "Actions",

      cell: ({ row }) => {
        const rowId = row.original.id;

        return (
          <div className="relative">
            <button
              onClick={() =>
                setOpenAction(
                  openAction === rowId
                    ? null
                    : rowId
                )
              }
              className="p-2 rounded-xl hover:bg-gray-100"
            >
              <MoreHorizontal
                className="w-4 h-4"
                color={theme.colors.textMuted}
              />
            </button>

            {openAction === rowId && (
              <div
                className="absolute right-0 top-12 w-44 rounded-2xl z-50 overflow-hidden"
                style={{
                  background:
                    theme.colors.cardBg,
                  border: `1px solid ${theme.colors.border}`,
                  boxShadow:
                    theme.shadow.modal,
                }}
              >
                {/* View */}
<button
  onClick={() => {
    setSelectedSection(row.original);
    setModalMode("view");
    setOpenModal(true);
    setOpenAction(null);
  }}
  className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50"
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
    setSelectedSection(row.original);
    setModalMode("edit");
    setOpenModal(true);
    setOpenAction(null);
  }}
  className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50"
  style={{
    color: theme.colors.textPrimary,
  }}
>
  <Pencil size={16} />
  Edit
</button>
                <button
                  onClick={() => {
                    setDeleteItem(
                      row.original
                    );

                    setDeleteModalOpen(true);

                    setOpenAction(null);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-red-50"
                  style={{
                    color:
                      theme.colors.danger,
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
    },
  ];

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
        fontFamily:
          theme.typography.fontFamily,
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
            Section Management
          </h1>

          <p
            className="text-sm"
            style={{
              color:
                theme.colors.textSecondary,
              margin: 0,
            }}
          >
            Manage sections and class-wise student allocation
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
            style={{
              background:
                theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
              color:
                theme.colors.textPrimary,
            }}
          >
            <Download size={16} />
            Export
          </button>

          <button
            onClick={() => {
              setModalMode("add");
              setSelectedSection(null);
              setOpenModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{
              background: theme.colors.primary,
            }}
          >
            <Plus size={16} />
            Add Section
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
        <StatCard
          title="Total Sections"
          value="18"
          icon={Layers3}
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
          title="Active Sections"
          value="15"
          icon={Layers3}
          iconBg="#FEF3C7"
          iconColor="#D97706"
        />
      </div>

      {/* Table Card */}
      <div
        className="rounded-3xl overflow-hidden"
        style={{
          background: theme.colors.cardBg,
          border: `1px solid ${theme.colors.border}`,
          boxShadow: theme.shadow.card,
        }}
      >
        {/* Table Header */}
        <div
          className="p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
          style={{
            borderBottom: `1px solid ${theme.colors.tableBorder}`,
          }}
        >
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">

  {/* Search */}
  <div className="relative w-full sm:w-80">
    <Search
      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
      color={theme.colors.textMuted}
    />

    <Input
      placeholder="Search sections..."
      value={search}
      onChange={(e) =>
        setSearch(e.target.value)
      }
      className="pl-10 rounded-2xl h-11 border-0 focus-visible:ring-0"
      style={{
        background:
          theme.colors.background,
        color:
          theme.colors.textPrimary,
      }}
    />
  </div>

  {/* Class Filter */}
  <div className="relative min-w-[200px]">
    <Input
      placeholder="Filter classes"
      value={classFilter}
      onChange={(e) =>
        setClassFilter(e.target.value)
      }
      list="classOptions"
      className="w-full h-11 pl-4 pr-12 rounded-2xl text-sm font-medium"
      style={{
        background:
          theme.colors.cardBg,
        border: `1px solid ${theme.colors.border}`,
        color:
          theme.colors.textPrimary,
      }}
    />

    <datalist id="classOptions">
      <option value="" />
      {classOptions.map((option) => (
        <option key={option} value={option} />
      ))}
    </datalist>

    {/* Clear */}
    {classFilter && (
      <button
        onClick={() =>
          setClassFilter("")
        }
        className="absolute right-9 top-1/2 -translate-y-1/2"
      >
        <X
          size={15}
          color={
            theme.colors.textMuted
          }
        />
      </button>
    )}

    {/* Arrow */}
    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
      <ChevronRight
        className="w-4 h-4 rotate-90"
        color={
          theme.colors.textMuted
        }
      />
    </div>
  </div>

  {/* Status Filter */}
  <div className="relative min-w-[160px]">
    <select
      value={statusFilter}
      onChange={(e) =>
        setStatusFilter(e.target.value)
      }
      className="w-full h-11 pl-4 pr-10 rounded-2xl text-sm font-medium appearance-none"
      style={{
        background: theme.colors.cardBg,
        border: `1px solid ${theme.colors.border}`,
        color: theme.colors.textPrimary,
      }}
    >
      <option value="">All Status</option>
      <option value="Active">Active</option>
      <option value="Inactive">Inactive</option>
    </select>

    {/* Clear */}
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

    {/* Arrow */}
    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
      <ChevronRight
        className="w-4 h-4 rotate-90"
        color={theme.colors.textMuted}
      />
    </div>
  </div>

</div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead
              style={{
                background:
                  theme.colors.tableHeader,
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

        {/* Pagination */}
        <div
          className="p-5 flex items-center justify-between"
          style={{
            borderTop: `1px solid ${theme.colors.tableBorder}`,
          }}
        >
          <p
            className="text-sm"
            style={{
              color:
                theme.colors.textSecondary,
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

      {/* Delete Modal */}
      {deleteModalOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            style={{
              background:
                theme.colors.drawerOverlay,
            }}
            onClick={() => {
              setDeleteModalOpen(false);
              setDeleteItem(null);
            }}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="w-full max-w-md rounded-3xl overflow-hidden"
              style={{
                background:
                  theme.colors.cardBg,
                boxShadow:
                  theme.shadow.modal,
              }}
            >
              <div
                className="px-6 py-5"
                style={{
                  borderBottom: `1px solid ${theme.colors.border}`,
                }}
              >
                <h2
                  className="text-xl font-bold"
                  style={{
                    color:
                      theme.colors.textPrimary,
                  }}
                >
                  Delete Section
                </h2>

                <p
                  className="text-sm mt-2"
                  style={{
                    color:
                      theme.colors
                        .textSecondary,
                  }}
                >
                  Are you sure you want to
                  delete section{" "}
                  <span
                    style={{
                      fontWeight: 600,
                      color:
                        theme.colors
                          .textPrimary,
                    }}
                  >
                    {
                      deleteItem?.sectionName
                    }
                  </span>
                  ?
                </p>
              </div>

              <div className="flex justify-end gap-3 px-6 py-5">
                <button
                  onClick={() => {
                    setDeleteModalOpen(false);
                    setDeleteItem(null);
                  }}
                  className="px-5 h-11 rounded-2xl text-sm font-medium"
                  style={{
                    border: `1px solid ${theme.colors.border}`,
                    color:
                      theme.colors.textPrimary,
                  }}
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    setSections((prev) =>
                      prev.filter(
                        (item) =>
                          item.id !==
                          deleteItem.id
                      )
                    );

                    setDeleteModalOpen(false);
                    setDeleteItem(null);
                  }}
                  className="px-5 h-11 rounded-2xl text-sm font-semibold text-white"
                  style={{
                    background:
                      theme.colors.danger,
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <AddSectionModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelectedSection(null);
        }}
        mode={modalMode}
        initialData={selectedSection}
        onSave={(data) => {
          if (modalMode === "edit") {
            setSections((prev) =>
              prev.map((item) =>
                item.id === data.id
                  ? {
                    ...data,
                    srNo: item.srNo,
                  }
                  : item
              )
            );
          } else {
            const newSection = {
              ...data,
              id: Date.now(),
              srNo: sections.length + 1,
            };

            setSections((prev) => [
              ...prev,
              newSection,
            ]);
          }
        }}
      />
    </div>
  );
};

export default Sections;