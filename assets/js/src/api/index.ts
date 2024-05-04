import { Transaction } from "../types";
import { mapTransactionDTO } from "../utils";

export async function getTransactions() {
  const resp = await fetch("/api/transactions");
  const data = await resp.json();

  return mapTransactionDTO(data.transactions) as Transaction[];
}
