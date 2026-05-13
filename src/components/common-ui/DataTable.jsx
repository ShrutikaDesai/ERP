import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { theme } from "@/theme/theme";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DataTable({ columns, data }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div
      className="overflow-hidden bg-white border"
      style={{
        borderRadius: theme.radius.lg,
        borderColor: theme.colors.tableBorder,
      }}
    >
      <Table className="w-full border-separate border-spacing-0">
        <TableHeader
          className="border-0 !border-0"
          style={{
            backgroundColor: theme.colors.tableHeader,
          }}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-0 !border-0">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="border-0 !border-0"
                  style={{
                    color: theme.colors.textSecondary,
                    padding: "16px 18px",
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, index) => (
              <TableRow
                key={row.id}
                className="border-0 !border-0 hover:bg-red-50 transition"
                style={{
                  backgroundColor:
                    index % 2 === 0
                      ? theme.colors.surface
                      : "#FCFCFD",
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="border-none"
                    style={{
                      padding: "18px",
                      color: theme.colors.textPrimary,
                    }}
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="border-none">
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center border-none"
                style={{
                  color: theme.colors.textMuted,
                }}
              >
                No data found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}