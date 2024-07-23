import { ClientPagination, ServerPagination } from "../types";

type UpdatePaginationFunc = (
  clientPagination: ClientPagination,
) => ClientPagination;

function setupNextPage(pagination: ServerPagination): UpdatePaginationFunc {
  return (prev: ClientPagination) => ({
    ...prev,
    pageMeta: {
      ...prev.pageMeta,
      [prev.pageIndex]: {
        ...prev.pageMeta[prev.pageIndex],
        hasNextPage: pagination.hasNextPage,
        hasPreviousPage: pagination.hasPreviousPage,
      },
      [prev.pageIndex + 1]: {
        ...prev.pageMeta[prev.pageIndex + 1],
        startCursor: pagination.endCursor,
        endCursor: null,
      },
    },
  });
}

function getNextPage(clientPagination: ClientPagination): ClientPagination {
  if (clientPagination.pageMeta[clientPagination.pageIndex]) {
    return {
      ...clientPagination,
      pageIndex: clientPagination.pageIndex + 1,
    };
  }

  return clientPagination;
}

export { setupNextPage, getNextPage };
