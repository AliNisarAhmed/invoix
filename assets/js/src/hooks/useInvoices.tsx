import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getInvoices } from "../api";
import { ClientPagination } from "../types";

function useInvoices(
  pagination: ClientPagination,
  setPagination: React.Dispatch<React.SetStateAction<ClientPagination>>,
) {
  const query = useQuery({
    staleTime: Infinity,
    queryKey: ["invoices", pagination.pageIndex, pagination.pageSize],
    queryFn: async () => {
      const paginatedInvoices = await getInvoices({
        startCursor: pagination.pageMeta[pagination.pageIndex].startCursor,
        endCursor: pagination.pageMeta[pagination.pageIndex].endCursor,
        direction: pagination.direction,
        pageSize: pagination.pageSize,
      });
      setPagination((prev) => ({
        ...prev,
        pageMeta: {
          ...prev.pageMeta,
          [prev.pageIndex + 1]: {
            startCursor: paginatedInvoices.pagination.endCursor,
            endCursor: null,
            hasNextPage: paginatedInvoices.pagination.hasNextPage,
            hasPreviousPage: paginatedInvoices.pagination.hasPreviousPage,
          },
        },
      }));

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
