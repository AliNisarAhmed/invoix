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

export type InvoiceStatus = "PAID" | "NOT_PAID";

export type InvoiceDTO = {
  refNo: string;
  clientName: string;
  date: string;
  amount: string;
  status: InvoiceStatus;
};

