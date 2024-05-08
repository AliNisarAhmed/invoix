defmodule InvoixWeb.InvoiceController do
  alias Invoix.Financials
  use InvoixWeb, :controller

  def getInvoices(conn, _) do
    invoices = Financials.get_invoices()
    render(conn, :getInvoices, invoices: invoices)
  end
end
