import React from "react";
import { getInvoices } from "../api";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Invoice } from "../types";
import { DataTable } from "./DataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "./Button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { DropdownMenuItem, DropdownMenuSeparator } from "./Dropdown";
import { useInvoices } from "../hooks/useInvoices";

const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "refNo",
    header: "Ref #",
  },
  {
    accessorKey: "clientName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Client Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <div className="flex justify-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.date.format("YYYY-MM-DD")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <div className="flex justify-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.status === "paid" ? "Paid" : "Not Paid"}
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <div className="flex justify-end">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount")) / 100;
      const formatted = new Intl.NumberFormat("en-us", {
        style: "currency",
        currency: "USD",
        useGrouping: true,
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const invoice = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open Menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-white border-2 border-gray-100 p-4 rounded"
          >
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(invoice.refNo)}
            >
              Copy Invoice Ref No.
            </DropdownMenuItem>
            <DropdownMenuItem>View Transactions</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function Invoices() {
  const { data, isError, isPending } = useInvoices();

  if (isError) {
    return <div>Error fetching invoices</div>;
  }

  if (isPending) {
    // TODO: change to skeleton
    return null;
  }

  return (
    <div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
