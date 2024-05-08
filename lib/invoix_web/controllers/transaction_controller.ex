defmodule InvoixWeb.TransactionController do
  alias Invoix.Financials
  use InvoixWeb, :controller

  def transactions(conn, _) do
    transactions = Financials.get_transactions()
    render(conn, :getTransactions, transactions: transactions)
  end
end
