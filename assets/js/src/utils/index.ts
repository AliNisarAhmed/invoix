import dayjs, { Dayjs } from "dayjs";
import { Invoice, InvoiceDTO, Transaction, TransactionDTO } from "../types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function invoicesAfterDate(invoices: Invoice[], date: Dayjs): Invoice[] {
  return invoices.filter((inv) => inv.date.isAfter(date));
}

export function transactionsBeforeDate(
  transactions: Transaction[],
  date: Dayjs,
): Transaction[] {
  return transactions.filter((tr) => tr.date.isAfter(date));
}

export function totalRevenue(invoices: Invoice[]): number {
  return invoices
    .map((inv) => Number(inv.amount))
    .reduce((acc, x) => acc + x, 0);
}

export function totalAmount(transactions: Transaction[]): number {
  return transactions
    .map((tr) => Number(tr.amount))
    .reduce((acc, x) => acc + x, 0);
}

export function mapTransactionDTO(
  transactions: TransactionDTO[],
): Transaction[] {
  return transactions.map((tr) => ({
    ...tr,
    date: dayjs(tr.date, "YYYY-MM-DD"),
  }));
}

export function mapInvoiceDTO(invoices: InvoiceDTO[]): Invoice[] {
  return invoices.map((inv) => ({
    ...inv,
    date: dayjs(inv.date, "YYYY-MM-DD"),
    clientName: inv.client_name,
    refNo: inv.ref_no,
  }));
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
