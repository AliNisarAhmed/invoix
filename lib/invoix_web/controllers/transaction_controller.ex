defmodule InvoixWeb.TransactionController do
  use InvoixWeb, :controller

  def transactions(conn, _) do
    transactions = [
      %{
        refNo: "1",
        description: "First Transaction",
        date: "2024-01-03",
        amount: "100"
      },
      %{
        refNo: "2",
        description: "Second Transaction",
        date: "2024-02-03",
        amount: "200"
      },
      %{
        refNo: "3",
        description: "Third Transaction",
        date: "2024-03-03",
        amount: "300"
      },
      %{
        refNo: "4",
        description: "Third Transaction",
        date: "2024-05-02",
        amount: "400"
      },
      %{
        refNo: "5",
        description: "Third Transaction",
        date: "2024-05-03",
        amount: "500"
      }
    ]

    render(conn, :getTransactions, transactions: transactions)
  end
end
