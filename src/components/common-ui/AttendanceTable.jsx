import React, { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Search, Filter, MoreVertical } from "lucide-react";
import { theme } from "@/theme/theme";

const AttendanceTable = ({ data }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const rowsPerPage = 5;

  // filter
  const filteredData = useMemo(() => {
    return data.filter((item) =>
      item.student.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, data]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [page, filteredData]);

  // columns
  const columns = useMemo(
    () => [
      {
        accessorKey: "student",
        header: "Student",
        cell: ({ row }) => (
          <div>
            <p className="font-semibold">
              {row.original.student}
            </p>
            <p
              className="text-xs"
              style={{ color: theme.colors.textMuted }}
            >
              {row.original.email}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "id",
        header: "ID / Roll",
        cell: ({ row }) => (
          <div>
            <p>{row.original.id}</p>
            <p className="text-xs text-gray-400">
              Roll: {row.original.roll}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;

          return (
            <div className="flex gap-2">
              <button
                className={`w-8 h-8 rounded border text-xs ${
                  status === "Present"
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-50"
                }`}
              >
                P
              </button>

              <button
                className={`w-8 h-8 rounded border text-xs ${
                  status === "Absent"
                    ? "bg-red-100 text-red-600"
                    : "bg-gray-50"
                }`}
              >
                A
              </button>

              <button
                className={`w-8 h-8 rounded border text-xs ${
                  status === "Late"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-gray-50"
                }`}
              >
                L
              </button>
            </div>
          );
        },
      },
      {
        accessorKey: "note",
        header: "Notes",
      },
      {
        id: "actions",
        header: "",
        cell: () => (
          <button className="text-gray-400 hover:text-gray-600">
            <MoreVertical size={16} />
          </button>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div
      className="border p-4"
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.lg,
        borderColor: theme.colors.border,
        boxShadow: theme.shadow.card,
      }}
    >
      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold">
          Student Attendance
        </h2>

        <div className="flex gap-3">
          <div className="relative">
            <Search
              className="absolute left-2 top-2 text-gray-400"
              size={16}
            />
            <input
              className="border pl-8 pr-3 py-1 rounded text-sm"
              placeholder="Search student..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button className="border px-3 py-1 rounded text-sm flex gap-2 items-center">
            <Filter size={14} />
            Filter
          </button>
        </div>
      </div>

      {/* TABLE */}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((h) => (
                <TableHead key={h.id}>
                  {flexRender(
                    h.column.columnDef.header,
                    h.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.map((row, i) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* PAGINATION */}
      <div className="flex justify-between mt-4 text-sm">
        <p>
          Page {page} of {totalPages}
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="border px-3 py-1 rounded"
          >
            Prev
          </button>

          <button
            onClick={() =>
              setPage((p) => Math.min(p + 1, totalPages))
            }
            className="border px-3 py-1 rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTable;