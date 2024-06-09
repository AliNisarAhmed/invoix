import { Dayjs } from "dayjs";

export type Transaction = {
  refNo: string;
  description: string;
  date: Dayjs;
  amount: string;
};

export type TransactionDTO = {
  refNo: string;
  description: string;
  date: string;
  amount: string;
};

export type Invoice = {
  refNo: string;
  clientName: string;
  date: Dayjs;
  amount: string;
  status: InvoiceStatus;
};

export type InvoiceStatus = "paid" | "not_paid";

export type InvoiceDTO = {
  ref_no: string;
  client_name: string;
  date: string;
  amount: string;
  status: InvoiceStatus;
};

export type CurrentUser = {
  id: string;
  email: string;
  username: string;
};

export type UserSessionRequest = {
  email: string;
  password: string;
};

export type CreateInvoiceRequest = {
  clientName: string;
  amount: number;
  date: Date;
};

export type ServerPagination = {
  pageSize: number;
  startCursor: string;
  endCursor: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type Paginated<T> = {
  data: T[];
  pagination: ServerPagination;
};

export type ClientPagination = {
  pageIndex: number;
  direction: "forward" | "backward";
  pageSize: number;
};

export type PaginationState = ServerPagination & ClientPagination;
