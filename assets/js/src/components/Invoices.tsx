import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ClientPagination, Invoice } from "../types";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postTransaction } from "../api";

export function Invoices() {
  const [clientPagination, setClientPagination] = useState<ClientPagination>({
    pageIndex: 0,
    direction: "forward",
    pageSize: 10,
  });
  const { data, isFetching, isError, isPending } =
    useInvoices(clientPagination);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: postTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });

  const columns = React.useMemo<ColumnDef<Invoice>[]>(
    () => [
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
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
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
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
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
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
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
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
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
                {invoice.status === "paid" ? (
                  <DropdownMenuItem>View Transaction</DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={async () => await mutation.mutateAsync(invoice)}
                  >
                    Mark as paid
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [],
  );

  if (isError) {
    return <div>Error fetching invoices</div>;
  }

  if (isPending || isFetching) {
    // TODO: change to skeleton
    return null;
  }

  return (
    <div>
      <DataTable
        columns={columns}
        data={data.data}
        pagination={{
          endCursor: data?.pagination?.endCursor ?? "",
          startCursor: data?.pagination?.startCursor ?? "",
          hasNextPage: data?.pagination?.hasNextPage ?? false,
          hasPreviousPage: data?.pagination?.hasPreviousPage ?? false,
          pageIndex: clientPagination.pageIndex,
          pageSize: clientPagination.pageSize,
          direction: clientPagination.direction,
        }}
        setPagination={setClientPagination}
      />
    </div>
  );
}
