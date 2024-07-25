import dayjs from "dayjs";
import { Invoice, InvoiceDTO, Transaction, TransactionDTO } from "../types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    useGrouping: true,
  }).format(value / 100);
}
