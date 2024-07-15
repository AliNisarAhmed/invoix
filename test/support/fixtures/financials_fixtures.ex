defmodule Invoix.FinancialsFixtures do
  alias Invoix.Financials.Invoice

  def get_invoices_fixtures() do
    1..30
    |> Enum.map(fn i ->
      {:ok, date, _} =
        DateTime.from_iso8601("2024-07-15T23:50:07Z")

      %Invoice{
        amount: Decimal.new(1, i, 2),
        date: date,
        client_name: "test_client",
        status: "not_paid",
        user_id: 1
      }
    end)
  end

end
