import { useQuery } from "@tanstack/react-query";
import { getInvoices } from "../api";

function useInvoices() {
  const query = useQuery({
    queryKey: ["invoices"],
    queryFn: getInvoices,
  });

  return query;
}

export { useInvoices };
