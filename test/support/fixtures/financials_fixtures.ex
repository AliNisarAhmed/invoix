defmodule Invoix.FinancialsFixtures do
  alias Invoix.Financials.Invoice
  alias Invoix.Financials

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

  def generate_invoices(month, user_id_1, amount_1, user_id_2, amount_2) do
    month_string = Integer.to_string(month) |> String.pad_leading(2, "0")
    year = 2024
    end_of_month = Date.new!(year, month, 1) |> Date.end_of_month() |> Date.to_iso8601()

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
        date: create_date_time(end_of_month, "23:59:59"),
        client_name: "test_client",
        status: "not_paid",
        user_id: user_id_1
      },
      %{
        amount: Decimal.new(1, amount_2, 2),
        date: create_date_time(end_of_month, "23:59:59"),
        client_name: "test_client",
        status: "not_paid",
        user_id: user_id_2
      },
      %{
        amount: Decimal.new(1, amount_1, 2),
        date: create_date_time(end_of_month, "23:59:59"),
        client_name: "test_client",
        status: "not_paid",
        user_id: user_id_1
      },
      %{
        amount: Decimal.new(1, amount_2, 2),
        date: create_date_time(end_of_month, "23:59:59"),
        client_name: "test_client",
        status: "not_paid",
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

    invoices =
      generate_invoices(7, first_user.id, 10, second_user.id, 20)
      |> Enum.concat(generate_invoices(6, first_user.id, 10, second_user.id, 20))

    invoices_db =
      invoices
      |> Enum.map(fn inv ->
        %Invoice{}
        |> Invoice.changeset(inv)
        |> Repo.insert!()
      end)

    invoices_db
    |> Enum.each(fn inv ->
      if inv.date.day == 15 do
        Financials.create_transaction!(inv, inv.user_id, inv.date)
      end
    end)

    %{invoices: invoices, first_user: first_user, second_user: second_user}
  end

  def create_date_time(date, time) do
    {:ok, date, _} = DateTime.from_iso8601("#{date}T#{time}Z")
    date
  end
end
