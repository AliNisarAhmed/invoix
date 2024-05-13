import React from "react";
import dayjs from "dayjs";
import { Invoice, Transaction } from "../types";
import {
  invoicesAfterDate,
  totalRevenue,
} from "../utils";
import { useInvoices } from "../hooks/useInvoices";
import { useTransactions } from "../hooks/useTransactions";

export function Summary() {
  const {
    data: invoicesData,
    isPending: isInvoicesPending,
    isError: isInvoicesError,
  } = useInvoices();

  const {
    data: transactionsData,
    isPending: isTransactionsPending,
    isError: isTransactionsError,
  } = useTransactions();

  const filteredInvoices = isInvoicesPending
    ? []
    : invoicesAfterDate(invoicesData as Invoice[], dayjs().subtract(30, "day"));
  const total = isInvoicesPending ? 0 : totalRevenue(filteredInvoices);

  if (isInvoicesPending || isTransactionsPending) {
    return <div>Loading...</div>;
  }

  if (isInvoicesError || isTransactionsError) {
    return <div>Error fetching Transactions</div>;
  }

  return (
    <div className="bg-gray-300 border-black border-1 px-10">
      <div className="flex flex-col items-center">
        <h2 className="w-max border-black border-1 text-5xl">${total / 100}</h2>
        <span className="text-sm">Total Revenue in the last 30 days</span>
      </div>
      <div className="flex flex-col items-center">
        <h2 className="text-3xl">{filteredInvoices.length}</h2>
        <span className="text-sm">Invoices in the last 30 days</span>
      </div>
    </div>
  );
}
