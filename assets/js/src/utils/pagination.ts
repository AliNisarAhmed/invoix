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

function hasNextPage(clientPagination: ClientPagination): boolean {
  return clientPagination.pageMeta[clientPagination.pageIndex].hasNextPage;
}

function getNextPage(clientPagination: ClientPagination): ClientPagination {
  return {
    ...clientPagination,
    pageIndex: clientPagination.pageIndex + 1,
    direction: "forward",
  };
}

function hasPreviousPage(clientPagination: ClientPagination): boolean {
  return clientPagination.pageMeta[clientPagination.pageIndex].hasPreviousPage;
}

function getPreviousPage(clientPagination: ClientPagination): ClientPagination {
  return {
    ...clientPagination,
    pageIndex: clientPagination.pageIndex - 1,
    direction: "backward",
  };
}

function resetPagination(previous: ClientPagination): ClientPagination {
  return {
    pageSize: previous.pageSize,
    direction: "forward",
    pageIndex: 0,
    pageMeta: {
      0: {
        startCursor: null,
        endCursor: null,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    },
  };
}

export {
  setupNextPage,
  getNextPage,
  hasNextPage,
  getPreviousPage,
  hasPreviousPage,
  resetPagination
};
