defmodule InvoixWeb.InvoiceController do
  alias Invoix.Accounts.User
  alias Invoix.Financials
  use InvoixWeb, :controller

  def getInvoices(conn, _) do
    with %User{id: user_id} <- conn.assigns.current_user do
      invoices = Financials.get_invoices(user_id)
      render(conn, :getInvoices, invoices: invoices)
    end
  end

  def createInvoice(conn, _) do
    input = %{
      amount: conn.params["amount"],
      dateString: to_string(conn.params["date"]),
      clientName: to_string(conn.params["clientName"])
    }

    with %User{id: id} <- conn.assigns.current_user,
         {:ok, _new_invoice} <- Financials.create_invoice(input, user_id: id) do
      json(conn, %{success: true})
    else
      e ->
        dbg(e)
        json(conn, %{success: false})
    end
  end
end
