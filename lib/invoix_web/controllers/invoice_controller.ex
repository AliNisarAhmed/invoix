defmodule InvoixWeb.InvoiceController do
  alias Invoix.Financials
  use InvoixWeb, :controller

  def getInvoices(conn, _) do
    invoices = Financials.get_invoices()
    render(conn, :getInvoices, invoices: invoices)
  end

  def createInvoice(conn, _) do
    dbg(conn.params)

    input = %{
      amount: conn.params["amount"],
      dateString: to_string(conn.params["date"]),
      clientName: to_string(conn.params["clientName"])
    }

    last_invoice_ref_no = Financials.get_last_invoice()
    dbg(last_invoice_ref_no)

    with {:ok, new_invoice} <- Financials.create_invoice(input) do
      dbg(new_invoice)
      json(conn, %{success: true})
    else
      e ->
        dbg(e)
        json(conn, %{success: false})
    end
  end
end
