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

export type PageMeta = {
  startCursor: string | null,
  endCursor: string | null,
  hasNextPage: boolean,
  hasPreviousPage: boolean
}

export type PageIndex = number;

export type ClientPagination = {
  pageIndex: PageIndex;
  direction: "forward" | "backward";
  pageSize: number;
  pageMeta: Record<PageIndex, PageMeta>, 
};

export type PaginationState = ServerPagination & ClientPagination;

export type SummaryPeriod = "month";

export type SummaryData = {
  currentIncome: number;
  previousIncome: number;
  currentInvoices: number;
  previousInvoices: number;
  currentRevenue: number;
  previousRevenue: number;
  currentTransactions: number;
  previousTransactions: number;
  period: SummaryPeriod;
  currentPeriodValue: number;
};
