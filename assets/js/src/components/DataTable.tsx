import React, { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/Table";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/Sheet";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/Form";
import { Calendar } from "./ui/Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";
import { cn } from "../utils";
import { format } from "date-fns";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postInvoice } from "../api";
import { ClientPagination, Invoice } from "../types";
import * as Pagination from "../utils/pagination";
import { useToast } from "../hooks/use-toast";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination: ClientPagination;
  setPagination: React.Dispatch<React.SetStateAction<ClientPagination>>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination,
  setPagination,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sheetOpen, setSheetOpen] = useState<boolean>(false);

  const { toast } = useToast();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
  });

  const formSchema = z.object({
    clientName: z.string().min(2).max(50),
    amount: z.coerce.number().gte(1),
    date: z.date({ required_error: "A Date of Invoice is required" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      clientName: "",
    },
  });

  const queryClient = useQueryClient();
  const postInvoiceMutation = useMutation({
    mutationFn: postInvoice,
    onSuccess: async (data: Invoice) => {
      console.log({ invoiceData: data });
      toast({
        title: `Success: Invoice created.`,
        description: `${data.refNo} - client: ${data.clientName} - amount: ${Number(data.amount) / 100}`,
      });
      setSheetOpen(false);
      form.reset();
      setPagination(Pagination.resetPagination);
      queryClient.invalidateQueries({
        queryKey: ["invoices"],
      });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
      postInvoiceMutation.reset();
    },
  });

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter Clients..."
          value={
            (table.getColumn("clientName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("clientName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger className="ml-auto bg-green-600 py-2 px-4 rounded text-white">
            Create Invoice
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Create Invoice</SheetTitle>
              <SheetDescription>Create a new invoice</SheetDescription>
            </SheetHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(
                  async (data) => await onSubmit(data),
                )}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Client name" {...field} />
                      </FormControl>
                      <FormDescription>Client Name</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder="Invoice Amount"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Invoice Amount</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Invoice</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml=auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>Date of Invoice</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
              </form>
            </Form>
            <SheetFooter>
              {postInvoiceMutation.status === "idle" ? (
                <Button onClick={form.handleSubmit(onSubmit)}>Save</Button>
              ) : postInvoiceMutation.status === "pending" ? (
                <Button disabled>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </Button>
              ) : null}
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
              setPagination((prev: ClientPagination) => ({
                ...prev,
                pageSize: Number(value),
              }));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {pagination.pageIndex + 1}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              if (Pagination.hasPreviousPage(pagination)) {
                setPagination(Pagination.getPreviousPage);
              }
            }}
            disabled={!Pagination.hasPreviousPage(pagination)}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              if (Pagination.hasNextPage(pagination)) {
                setPagination(Pagination.getNextPage);
              }
            }}
            disabled={!Pagination.hasNextPage(pagination)}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await postInvoiceMutation.mutateAsync(values);
  }
}
