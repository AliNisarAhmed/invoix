import dayjs from "dayjs";
import {
  Invoice,
  InvoiceDTO,
  SummaryPeriod,
  Transaction,
  TransactionDTO,
} from "../types";
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
  period,
}: {
  previous: number;
  current: number;
  period: SummaryPeriod;
}): string {
  const change = calcPercentageChange({ previous, current });
  if (change === 0) {
    return `No change from last ${period}`;
  }

  if (!Number.isFinite(change)) {
    return `No data for last ${period}`;
  }

  if (change >= 0) {
    return `+${change.toFixed(2)}% from last ${period}`;
  } else {
    return `${change.toFixed(2)}% from last ${period}`;
  }
}

export function calcPercentageChange({
  previous,
  current,
}: {
  previous: number;
  current: number;
}): number {
  if (previous === 0 && current === 0) {
    return 0;
  }

  if (previous === 0) {
    return Infinity;
  }

  return ((current - previous) / previous) * 100;
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    useGrouping: true,
  }).format(value / 100);
}

export const fakeData: Invoice[] = [
  {
    status: "not_paid",
    date: dayjs(),
    refNo: "INV-04943",
    amount: "500000",
    clientName: "Ronaldo",
  },
  {
    status: "paid",
    date: dayjs(),
    amount: "500000",
    clientName: "MVL",
    refNo: "INV-04939",
  },
  {
    status: "paid",
    date: dayjs(),
    amount: "100000",
    clientName: "Danya",
    refNo: "INV-04940",
  },
  {
    status: "paid",
    date: dayjs(),
    amount: "200000",
    clientName: "Destiny",
    refNo: "INV-04942",
  },
  {
    status: "paid",
    date: dayjs(),
    amount: "100000",
    clientName: "Biden",
    refNo: "INV-04941",
  },
  {
    status: "paid",
    date: dayjs(),
    amount: "100000",
    clientName: "Harris",
    refNo: "INV-04938",
  },
  {
    status: "not_paid",
    date: dayjs(),
    amount: "300000",
    clientName: "Azlan",
    refNo: "INV-04935",
  },
  {
    status: "paid",
    date: dayjs(),
    amount: "500000",
    clientName: "Ali",
    refNo: "INV-04936",
  },
  {
    status: "paid",
    date: dayjs(),
    amount: "500000",
    clientName: "Azlan Ali",
    refNo: "INV-04937",
  },
  {
    status: "not_paid",
    date: dayjs(),
    amount: "200000",
    clientName: "Azlan Ali",
    refNo: "INV-04929",
  },
];
