defmodule InvoixWeb.SummaryController do
  alias Invoix.Accounts.User
  alias Invoix.Financials
  use InvoixWeb, :controller

  def getSummary(conn, _params) do
    today = DateTime.utc_now()
    current_day = today.day
    current_month = today.month
    previous_month = if current_month - 1 <= 0, do: 12, else: current_month - 1

    with {:ok, current_invoices} <- Financials.get_invoices_for_month(current_month, current_day),
         {:ok, previous_invoices} <-
           Financials.get_invoices_for_month(previous_month, current_day),
         {:ok, current_transactions} <-
           Financials.get_transactions_for_month(current_month, current_day),
         {:ok, previous_transactions} <-
           Financials.get_invoices_for_month(previous_month, current_day) do
      current_revenue = Financials.sum_amount(current_invoices)
      previous_revenue = Financials.sum_amount(previous_invoices)
      current_num_invoices = length(current_invoices)
      previous_num_invoices = length(previous_invoices)
      current_num_transactions = length(current_transactions)
      previous_num_transactions = length(previous_transactions)
      current_income = Financials.sum_amount(current_transactions)
      previous_income = Financials.sum_amount(previous_transactions)

      render(conn, :render_summary,
        period: "month",
        value: current_month,
        current_num_invoices: current_num_invoices,
        previous_num_invoices: previous_num_invoices,
        current_revenue: current_revenue,
        previous_revenue: previous_revenue,
        current_num_transactions: current_num_transactions,
        previous_num_transactions: previous_num_transactions,
        current_income: current_income,
        previous_income: previous_income
      )
    else
      e ->
        dbg(e)

        conn
        |> put_status(500)
        |> json(%{"error" => "Something went wrong"})
    end
  end
end
