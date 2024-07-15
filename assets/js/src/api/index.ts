import { ApiFormError } from "../errors";
import {
  CreateInvoiceRequest,
  CurrentUser,
  Invoice,
  Paginated,
  SummaryData,
  Transaction,
  UserSessionRequest,
} from "../types";
import { clearCookies, mapInvoiceDTO, mapTransactionDTO } from "../utils";

export async function getTransactions() {
  const resp = await fetch("/api/transactions");
  const data = await resp.json();

  return mapTransactionDTO(data.transactions) as Transaction[];
}

export async function getInvoices({
  startCursor,
  endCursor,
  direction,
  pageSize,
}: {
  startCursor: string;
  endCursor: string;
  direction: "forward" | "backward";
  pageSize: number;
}) {
  const url = new URLSearchParams();
  const pageSizeString = String(pageSize ?? 10);
  if (direction === "forward") {
    url.set("first", pageSizeString);
    url.set("after", endCursor);
  } else {
    url.set("last", pageSizeString);
    url.set("before", startCursor);
  }
  const resp = await fetch(`/api/invoices?${url.toString()}`);
  if (resp.status !== 200) {
    if (resp.status === 401) {
      clearCookies();
    }
    throw new Error("unauthenticated");
  }
  const { data, pagination } = await resp.json();

  return { data: mapInvoiceDTO(data), pagination } as Paginated<Invoice>;
}

export async function loginUser({ email, password }: UserSessionRequest) {
  const resp = await fetch("/auth/login", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    referrerPolicy: "no-referrer",
    body: JSON.stringify({ user: { email, password } }),
  });
  const json = await resp.json();

  if (!resp.ok) {
    throw new Error(`${json?.error}`);
  }

  return json as CurrentUser;
}

export async function registerUser({ email, password }: UserSessionRequest) {
  const resp = await fetch("/auth/register", {
    method: "POST",
    mode: "same-origin",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    referrerPolicy: "no-referrer",
    body: JSON.stringify({ user: { email, password } }),
  });
  const json = await resp.json();
  if (!resp.ok) {
    throw new ApiFormError(json?.errors[0]);
  }
  return json as CurrentUser;
}

export async function postInvoice({
  clientName,
  date,
  amount,
}: CreateInvoiceRequest) {
  const res = await fetch("/api/invoice", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json; chartset=utf-8",
    },
    body: JSON.stringify({ clientName, date, amount }),
  });

  return (await res.json()) as { success: boolean };
}

export async function postTransaction(invoice: Invoice) {
  const res = await fetch(`/api/invoices/${invoice.refNo}/transaction`, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });

  return await res.json();
}

export async function logoutUser() {
  const resp = await fetch("/auth/logout", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    referrerPolicy: "no-referrer",
  });
  return await resp.json();
}

export async function getSummary(): Promise<SummaryData> {
  const resp = await fetch("/api/summary", {
    method: "GET",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    referrerPolicy: "no-referrer",
  });

  return await resp.json();
}
