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
import { Button } from "./ui/Button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { DropdownMenuItem, DropdownMenuSeparator } from "./ui/Dropdown";
import { useInvoices } from "../hooks/useInvoices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postTransaction } from "../api";
import { useToast } from "../hooks/use-toast";
import { getFakeData, formatCurrency } from "../utils";

export function Invoices() {
  const [clientPagination, setClientPagination] = useState<ClientPagination>({
    pageIndex: 0,
    direction: "forward",
    pageSize: 10,
    pageMeta: {
      0: {
        startCursor: null,
        endCursor: null,
        hasNextPage: true,
        hasPreviousPage: false,
      },
    },
  });
  const { data, isFetching, isError, isPending } = useInvoices(
    clientPagination,
    setClientPagination,
  );

  const isLoading = isPending || isFetching;

  const { toast } = useToast();

  const queryClient = useQueryClient();
  const postTransactionMutation = useMutation({
    mutationFn: postTransaction,
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [
          "invoices",
          clientPagination.pageIndex,
          clientPagination.pageSize,
        ],
        exact: true,
        type: "active",
      });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
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
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
            >
              Amount
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ),
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue("amount"));
          const formatted = formatCurrency(amount);

          return <div className="text-right font-medium">{formatted}</div>;
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const invoice = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild disabled={isLoading}>
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
                    onClick={async () => {
                      await postTransactionMutation.mutateAsync(invoice);
                      toast({
                        title: `Success! ${invoice.refNo} marked as paid`,
                        description: `${Number(invoice.amount) / 100} added to income`,
                      });
                    }}
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
    [isLoading],
  );

  if (isError) {
    return <div>Error fetching invoices</div>;
  }

  const fakeData = getFakeData(data?.data?.length);

  if (isLoading) {
    return (
      <div className="blur-sm">
        <DataTable
          columns={columns}
          data={fakeData}
          pagination={clientPagination}
          setPagination={setClientPagination}
          isLoading={isLoading}
        />
      </div>
    );
  }

  return (
    <div>
      <DataTable
        columns={columns}
        data={data.data}
        pagination={clientPagination}
        setPagination={setClientPagination}
        isLoading={isPending}
      />
    </div>
  );
}
