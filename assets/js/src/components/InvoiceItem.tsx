import React from "react";
import { Invoice } from "../types";

interface Props {
  invoice: Invoice;
}

export function InvoiceItem({ invoice }: Props) {
  return (
    <div>
      <span>{invoice.refNo}</span>
      <span>{invoice.clientName}</span>
      <span>{invoice.status}</span>
      <span>{invoice.date.toString()}</span>
      <span>{invoice.amount}</span>
    </div>
  );
}
