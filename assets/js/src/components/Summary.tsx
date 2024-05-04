import React from "react";
import dayjs from "dayjs";
import { Transaction } from "../types";
import { totalAmount, transactionsBeforeDate } from "../utils";
import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "../api";

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
    <div className="bg-gray-300 border-black border-1 px-10">
      <div className="flex flex-col items-center">
        <h2 className="w-max border-black border-1 text-5xl">${total}</h2>
        <span className="text-sm">Total income in the last 30 days</span>
      </div>
      <div className="flex flex-col items-center">
        <h2 className="text-3xl">{transactions.length}</h2>
        <span className="text-sm">Transactions in the last 30 days</span>
      </div>
    </div>
  );
}
