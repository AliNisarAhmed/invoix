defmodule InvoixWeb.TransactionController do
  alias Invoix.Financials
  use InvoixWeb, :controller

  def transactions(conn, _) do
    transactions = Financials.get_transactions()
    render(conn, :getTransactions, transactions: transactions)
  end

  def createTransaction(conn, %{"invoice_refno" => invoice_refno}) do
    with invoice <- Financials.get_invoice_by_refno(invoice_refno),
         Financials.create_transaction!(invoice) do
      json(conn, %{success: true})
    else
      e ->
        dbg(e)
        json(conn, %{success: false})
    end
  end
end
