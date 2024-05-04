defmodule InvoixWeb.InvoiceController do
  use InvoixWeb, :controller

  def getInvoices(conn, _) do
    invoices = [
      %{
        refNo: "1",
        clientName: "Client 1",
        date: "2024-03-04",
        amount: "300",
        status: "NOT_PAID"
      }
    ]

    render(conn, :getInvoices, invoices: invoices)
  end
end

