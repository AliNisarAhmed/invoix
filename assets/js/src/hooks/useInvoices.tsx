import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getInvoices } from "../api";
import { ClientPagination } from "../types";

function useInvoices(pagination: ClientPagination) {
  const query = useQuery({
    staleTime: Infinity,
    queryKey: ["invoices", pagination.pageIndex, pagination.pageSize],
    queryFn: async () => {
      return await getInvoices({
        startCursor: query?.data?.pagination.startCursor ?? "",
        endCursor: query?.data?.pagination.endCursor ?? "",
        direction: pagination.direction,
        pageSize: pagination.pageSize,
      });
    },
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  return query;
}

export { useInvoices };
