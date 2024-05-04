import React from "react";
import dayjs from "dayjs";
import { Transaction } from "./types";
import { totalAmount, transactionsBeforeDate } from "./utils";
import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "./api";

export function Summary() {
  const { data, isError, isPending } = useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
  });

  const transactions = isPending
    ? []
    : transactionsBeforeDate(
      data as Transaction[],
      dayjs().subtract(30, "day"),
    );
  const total = isPending ? 0 : totalAmount(transactions);

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching Transactions</div>;
  }

  return (
    <div>
      <div>Total: {total}</div>
      <div>Transactions in last 30 days: {transactions.length}</div>
    </div>
  );
}
