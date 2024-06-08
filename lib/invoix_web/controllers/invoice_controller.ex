defmodule InvoixWeb.InvoiceController do
  alias Invoix.Accounts.User
  alias Invoix.Financials
  use InvoixWeb, :controller

  def getInvoices(conn, params) do
    with %User{id: user_id} <- conn.assigns.current_user do
      first = if is_nil(params["first"]), do: nil, else: String.to_integer(params["first"])
      after_cursor = params["after"] || nil
      last = if is_nil(params["last"]), do: nil, else: String.to_integer(params["last"])
      before_cursor = params["before"]

      with {:ok, {invoices, meta}} <-
             Financials.get_invoices(user_id, %{
               first: first,
               after: after_cursor,
               last: last,
               before: before_cursor,
               order_by: [:date],
               order_directions: [:desc]
             }) do
        render(conn, :getInvoices, invoices: invoices, meta: meta)
      else
        e ->
          dbg(e)

          conn
          |> put_status(500)
          |> json(%{"error" => "Something went wrong"})
      end
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
