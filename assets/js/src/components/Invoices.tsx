import React from "react";
import { getInvoices } from "../api";
import { useQuery } from "@tanstack/react-query";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Invoice } from "../types";

const columnHelper = createColumnHelper<Invoice>();

const columns = [
  columnHelper.accessor("refNo", {
    header: () => "Ref #",
  }),
  columnHelper.accessor("clientName", {
    header: () => "Client Name",
  }),
  columnHelper.accessor("amount", {
    header: () => "Amount",
  }),
  columnHelper.accessor("date", {
    header: () => "Date",
    cell: (props) => props.getValue().format("YYYY-MM-DD"),
  }),
  columnHelper.accessor("status", {
    header: () => "Status",
    cell: (props) => (props.getValue() === "paid" ? "Paid" : "Not Paid"),
  }),
];

export function Invoices() {
  const { data, isError, isPending } = useQuery({
    queryKey: ["invoices"],
    queryFn: getInvoices,
  });

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isError) {
    return <div>Error fetching invoices</div>;
  }

  if (isPending) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <table className="border-gray-500 border-2 mx-auto">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="border-gray-300 border-2 rounded w-40"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="text-center">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border-gray-300 border-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
