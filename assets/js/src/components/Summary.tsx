import React from "react";
import dayjs from "dayjs";
import { Invoice, Transaction } from "../types";
import { invoicesAfterDate, totalRevenue } from "../utils";
import { useInvoices } from "../hooks/useInvoices";
import { useTransactions } from "../hooks/useTransactions";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import {
  BadgeDollarSign,
  CreditCard,
  DollarSign,
  Receipt,
  ReceiptText,
} from "lucide-react";

export function Summary() {
  // const {
  //   data: paginatedInvoices,
  //   isPending: isInvoicesPending,
  //   isError: isInvoicesError,
  // } = useInvoices({pageSize: 10, });

  let isInvoicesPending = false;
  let isInvoicesError = false;
  const { data: invoicesData } = { data: [] };

  const {
    data: transactionsData,
    isPending: isTransactionsPending,
    isError: isTransactionsError,
  } = useTransactions();

  const filteredInvoices = isInvoicesPending
    ? []
    : invoicesAfterDate(invoicesData as Invoice[], dayjs().subtract(30, "day"));
  const total = isInvoicesPending ? 0 : totalRevenue(filteredInvoices);
  const totalString = new Intl.NumberFormat("en-us", {
    style: "currency",
    currency: "USD",
    useGrouping: true,
  }).format(total / 100);

  if (isInvoicesPending || isTransactionsPending) {
    return <div>Loading...</div>;
  }

  if (isInvoicesError || isTransactionsError) {
    return <div>Error fetching Transactions</div>;
  }

  return (
    <>
      <h3>This month so far...</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalString}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Invoices
            </CardTitle>
            <ReceiptText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredInvoices.length}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Transactions
            </CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{0}</div>
            <p className="text-xs text-muted-foreground">
              No change from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Number of Clients</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{0}</div>
            <p className="text-xs text-muted-foreground">
              No change from last month
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
