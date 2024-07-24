import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getInvoices } from "../api";
import { ClientPagination } from "../types";
import * as Pagination from "../utils/pagination";

function useInvoices(
  pagination: ClientPagination,
  setPagination: React.Dispatch<React.SetStateAction<ClientPagination>>,
) {
  const query = useQuery({
    staleTime: 15,
    queryKey: ["invoices", pagination.pageIndex, pagination.pageSize],
    queryFn: async () => {
      const paginatedInvoices = await getInvoices({
        startCursor: pagination.pageMeta[pagination.pageIndex].startCursor,
        endCursor: pagination.pageMeta[pagination.pageIndex].endCursor,
        direction: pagination.direction,
        pageSize: pagination.pageSize,
      });
      setPagination(Pagination.setupNextPage(paginatedInvoices.pagination));
      return paginatedInvoices;
    },
    refetchOnReconnect: false,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  return query;
}

export { useInvoices };
