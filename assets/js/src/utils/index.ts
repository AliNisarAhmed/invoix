import dayjs, { Dayjs } from "dayjs";
import { Transaction, TransactionDTO } from "../types";

export function transactionsBeforeDate(
  transactions: Transaction[],
  date: Dayjs,
): Transaction[] {
  return transactions.filter((tr) => tr.date.isAfter(date));
}

export function totalAmount(transactions: Transaction[]): number {
  return transactions
    .map((tr) => Number(tr.amount))
    .reduce((acc, x) => acc + x);
}

export function mapTransactionDTO(
  transactions: TransactionDTO[],
): Transaction[] {
  return transactions.map((tr) => ({
    ...tr,
    date: dayjs(tr.date, "YYYY-MM-DD"),
  }));
}
