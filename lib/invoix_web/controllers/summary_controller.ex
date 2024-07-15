defmodule InvoixWeb.SummaryController do
  alias Invoix.Accounts.User
  alias Invoix.Financials
  use InvoixWeb, :controller

  def getSummary(conn, _params) do
    with {:ok, summary} <- Financials.calc_summary() do
      render(conn, :render_summary, summary)
    else
      {:error, e} ->
        dbg(e)

        conn
        |> put_status(500)
        |> json(%{"error" => "Something went wrong"})
    end
  end
end
