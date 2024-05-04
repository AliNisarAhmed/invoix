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
