import { CurrentUser, Invoice, Transaction } from "../types";
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
