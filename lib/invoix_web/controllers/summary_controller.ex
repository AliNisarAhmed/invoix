defmodule InvoixWeb.SummaryController do
  alias Invoix.Accounts.User
  alias Invoix.Financials
  use InvoixWeb, :controller

  def getSummary(conn, params) do
    current_month = 7
    previous_month = 6
    with {:ok, current_invoices} <- Financials.get_invoices_for_month(current_month),
         {:ok, previous_invoices} <- Financials.get_invoices_for_month(previous_month) do
      revenue_this_month = Financials.calculate_revenue(current_invoices, current_month)
      revene_previous_month = Financials.calculate_revenue(previous_invoices, previous_month)
      current_num_invoices = length(current_invoices)
      previous_num_invoices = length(previous_invoices)

      current_num_clients =
        Enum.uniq_by(current_invoices, fn inv -> inv.client_name end) |> Enum.count()

      previous_num_clients =
        Enum.uniq_by(previous_invoices, fn inv -> inv.client_name end) |> Enum.count()

      render(conn, :render_summary,
        period: "month",
        value: current_month,
        current_revenue: revenue_this_month,
        previous_revenue: revene_previous_month,
        current_num_invoices: current_num_invoices,
        previous_num_invoices: previous_num_invoices,
        current_num_clients: current_num_clients,
        previous_num_clients: previous_num_clients
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
