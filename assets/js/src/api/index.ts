import { ApiFormError, FormErrorInfo } from "../errors";
import {
  CreateInvoiceRequest,
  CurrentUser,
  Invoice,
  InvoiceDTO,
  Paginated,
  SummaryData,
  Transaction,
  UserSessionRequest,
} from "../types";
import { mapInvoice, mapInvoiceDTO } from "../utils";
import ky, { HTTPError } from "ky";

const api = ky.create({
  headers: {
    Accept: "application/json; charset=utf8",
    "Content-Type": "application/json; charset=utf8",
  },
  referrerPolicy: "no-referrer",
  credentials: "same-origin",
});

export async function getInvoices({
  startCursor,
  endCursor,
  direction,
  pageSize,
}: {
  startCursor: string | null;
  endCursor: string | null;
  direction: "forward" | "backward";
  pageSize: number;
}) {
  const url = new URLSearchParams();
  const pageSizeString = String(pageSize ?? 10);

  url.set("first", pageSizeString);
  startCursor && url.set("after", startCursor);

  const resp = await api
    .get(`/api/invoices?${url.toString()}`)
    .json<Paginated<InvoiceDTO>>();

  return {
    data: mapInvoiceDTO(resp.data),
    pagination: resp.pagination,
  } as Paginated<Invoice>;
}

export async function loginUser({ email, password }: UserSessionRequest) {
  try {
    await api
      .post("/auth/login", { json: { user: { email, password } } })
      .json<CurrentUser>();
  } catch (e: any) {
    if (e instanceof HTTPError) {
      const errorObj = await e.response?.json<{ error: string }>();
      throw new Error(`${errorObj?.error}`);
    }
  }
}

export async function registerUser({ email, password }: UserSessionRequest) {
  try {
    return await api
      .post("/auth/register", {
        json: { user: { email, password } },
      })
      .json<CurrentUser>();
  } catch (e: any) {
    if (e instanceof HTTPError) {
      const json: { error: FormErrorInfo } = await e.response.json();
      throw new ApiFormError(json.error);
    }

    throw e;
  }
}

export async function postInvoice({
  clientName,
  date,
  amount,
}: CreateInvoiceRequest): Promise<Invoice> {
  return mapInvoice(
    await api
      .post("/api/invoice", {
        json: { clientName, date, amount },
      })
      .json(),
  );
}

export async function postTransaction(invoice: Invoice) {
  return await api.get(`/api/invoices/${invoice.refNo}/transaction`).json();
}

export async function logoutUser() {
  return await api.post("/auth/logout").json();
}

export async function getSummary(): Promise<SummaryData> {
  return await api.get("/api/summary").json<SummaryData>();
}
