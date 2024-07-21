defmodule Invoix.FinancialsFixtures do
  alias Invoix.Financials.Invoice
  alias Invoix.Accounts.User

  import Ecto.Query, warn: false
  alias Invoix.Repo

  def get_invoices_fixtures() do
    1..30
    |> Enum.map(fn i ->
      date = create_date_time("2024-07-15", "23:50:07")

      %Invoice{
        amount: Decimal.new(1, i, 2),
        date: date,
        client_name: "test_client",
        status: "not_paid",
        user_id: 1
      }
    end)
  end

  def generate_invoices(month_string, user_id_1, amount_1, user_id_2, amount_2) do
    [
      %{
        id: Ecto.UUID.generate(),
        amount: Decimal.new(1, amount_1, 2),
        date: create_date_time("2024-#{month_string}-01", "00:00:00"),
        client_name: "test_client",
        status: "not_paid",
        user_id: user_id_1
      },
      %{
        amount: Decimal.new(1, amount_2, 2),
        date: create_date_time("2024-#{month_string}-01", "00:00:00"),
        client_name: "test_client",
        status: "not_paid",
        user_id: user_id_2
      },
      %{
        amount: Decimal.new(1, amount_1, 2),
        date: create_date_time("2024-#{month_string}-01", "00:00:00"),
        client_name: "test_client",
        status: "paid",
        user_id: user_id_1
      },
      %{
        amount: Decimal.new(1, amount_2, 2),
        date: create_date_time("2024-#{month_string}-01", "00:00:00"),
        client_name: "test_client",
        status: "paid",
        user_id: user_id_2
      },
      %{
        amount: Decimal.new(1, amount_1, 2),
        date: create_date_time("2024-#{month_string}-15", "00:00:00"),
        client_name: "test_client",
        status: "not_paid",
        user_id: user_id_1
      },
      %{
        amount: Decimal.new(1, amount_2, 2),
        date: create_date_time("2024-#{month_string}-15", "00:00:00"),
        client_name: "test_client",
        status: "not_paid",
        user_id: user_id_2
      },
      %{
        amount: Decimal.new(1, amount_1, 2),
        date: create_date_time("2024-#{month_string}-15", "00:00:00"),
        client_name: "test_client",
        status: "paid",
        user_id: user_id_1
      },
      %{
        amount: Decimal.new(1, amount_2, 2),
        date: create_date_time("2024-#{month_string}-15", "00:00:00"),
        client_name: "test_client",
        status: "paid",
        user_id: user_id_2
      },
      %{
        amount: Decimal.new(1, amount_1, 2),
        date: create_date_time("2024-#{month_string}-31", "23:59:59"),
        client_name: "test_client",
        status: "not_paid",
        user_id: user_id_1
      },
      %{
        amount: Decimal.new(1, amount_2, 2),
        date: create_date_time("2024-#{month_string}-31", "23:59:59"),
        client_name: "test_client",
        status: "not_paid",
        user_id: user_id_2
      },
      %{
        amount: Decimal.new(1, amount_1, 2),
        date: create_date_time("2024-#{month_string}-31", "23:59:59"),
        client_name: "test_client",
        status: "paid",
        user_id: user_id_1
      },
      %{
        amount: Decimal.new(1, amount_2, 2),
        date: create_date_time("2024-#{month_string}-31", "23:59:59"),
        client_name: "test_client",
        status: "paid",
        user_id: user_id_2
      }
    ]
  end

  def populate_invoices_in_database() do
    {:ok, first_user} =
      Invoix.Accounts.register_user(%{
        email: "test_first_user@invoix.com",
        password: "Password1!"
      })

    {:ok, second_user} =
      Invoix.Accounts.register_user(%{
        email: "test_second_user@invoix.com",
        password: "Password1!"
      })

    invoices = generate_invoices("07", first_user.id, 10, second_user.id, 20)

    invoices
    |> Enum.each(fn inv ->
      %Invoice{}
      |> Invoice.changeset(inv)
      |> Repo.insert!()
    end)

    %{invoices: invoices, first_user: first_user, second_user: second_user}
  end

  def create_date_time(date, time) do
    {:ok, date, _} = DateTime.from_iso8601("#{date}T#{time}Z")
    date
  end
end
