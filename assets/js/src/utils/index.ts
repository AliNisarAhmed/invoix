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
  return invoices.map(mapInvoice);
}

export function mapInvoice(invoice: InvoiceDTO): Invoice {
  return {
    ...invoice,
    date: dayjs(invoice.date, "YYYY-MM-DD"),
    clientName: invoice.client_name,
    refNo: invoice.ref_no,
  };
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCookieObject() {
  return Object.fromEntries(
    document.cookie.split(/; */).map((c) => {
      const [key, ...v] = c.split("=");
      return [key, decodeURIComponent(v.join("="))];
    }),
  );
}

export function clearCookies() {
  document.cookie.split(";").forEach((c) => {
    document.cookie =
      c.trim().split("=")[0] + "=;" + "expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  });
  localStorage.clear();
}

export function showPercentageChange({
  previous,
  current,
}: {
  previous: number;
  current: number;
}): string {
  const change = calcPercentageChange({ previous, current });
  if (change >= 0) {
    return `+${change.toFixed(2)}%`;
  } else {
    return `${change.toFixed(2)}%`;
  }
}

export function calcPercentageChange({
  previous,
  current,
}: {
  previous: number;
  current: number;
}): number {
  return ((current - previous) / previous) * 100;
}
