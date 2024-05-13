import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "../api";

function useTransactions() {
  const transactions = useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
  });

  return transactions;
}

export { useTransactions };
