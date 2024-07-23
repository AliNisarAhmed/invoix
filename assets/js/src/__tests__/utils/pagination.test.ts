import * as Pagination from "../../../src/utils/pagination";
import { ClientPagination, ServerPagination } from "../../types";

describe("Pagination", () => {
  const pageSize: number = 10;
  const testStartCursor_1 = "testStartCursor_1";
  const testEndCursor_1 = "testEndCursor_1";
  const testStartCursor_2 = "testStartCursor_2";
  const testEndCursor_2 = "testEndCursor_2";

  test("setupNextPage", () => {
    const serverPagination_1: ServerPagination = {
      pageSize,
      startCursor: testStartCursor_1,
      endCursor: testEndCursor_1,
      hasPreviousPage: false,
      hasNextPage: true,
    };
    const serverPagination_2: ServerPagination = {
      pageSize,
      startCursor: testStartCursor_2,
      endCursor: testEndCursor_2,
      hasPreviousPage: true,
      hasNextPage: false,
    };
    const clientPagination_1: ClientPagination = {
      pageSize,
      pageIndex: 0,
      pageMeta: {
        0: {
          startCursor: null,
          endCursor: null,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      },
      direction: "forward",
    };
    const result_1 =
      Pagination.setupNextPage(serverPagination_1)(clientPagination_1);
    expect(result_1.direction).toEqual("forward");
    expect(result_1.pageIndex).toEqual(0);
    expect(result_1.pageSize).toEqual(clientPagination_1.pageSize);
    expect(result_1.pageMeta[0].hasNextPage).toBeTruthy();
    expect(result_1.pageMeta[0].hasPreviousPage).toBeFalsy();
    expect(result_1.pageMeta[0].startCursor).toBeNull();
    expect(result_1.pageMeta[1].startCursor).toEqual(testEndCursor_1);

    const clientPagination_2 = Pagination.getNextPage(result_1);
    const result_2 =
      Pagination.setupNextPage(serverPagination_2)(clientPagination_2);
    expect(result_2.direction).toEqual("forward");
    expect(result_2.pageIndex).toEqual(1);
    expect(result_2.pageSize).toEqual(result_1.pageSize);
    expect(result_2.pageMeta[1].hasNextPage).toBeFalsy();
    expect(result_2.pageMeta[1].hasPreviousPage).toBeTruthy();
    expect(result_2.pageMeta[1].startCursor).toEqual(
      result_1.pageMeta[1].startCursor,
    );
    expect(result_2.pageMeta[2].startCursor).toEqual(testEndCursor_2);
  });
});
