import {
  CreateInvoiceRequest,
  CurrentUser,
  Invoice,
  Transaction,
  UserSessionRequest,
} from "../types";
import { mapInvoiceDTO, mapTransactionDTO } from "../utils";

export async function getTransactions() {
  const resp = await fetch("/api/transactions");
  const data = await resp.json();

  return mapTransactionDTO(data.transactions) as Transaction[];
}

export async function getInvoices() {
  const resp = await fetch("/api/invoices");
  const data = await resp.json();

  return mapInvoiceDTO(data.invoices) as Invoice[];
}

export async function getCurrentUser() {
  const resp = await fetch("/auth/users/current-user");
  const data = await resp.json();

  return data.currentUser as CurrentUser;
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
  return (await resp.json()) as CurrentUser;
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
  return (await resp.json()) as CurrentUser;
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
