import { Invoice, Transaction } from "../types";
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
