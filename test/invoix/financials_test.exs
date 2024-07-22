defmodule Invoix.FinancialsTest do
  use Invoix.DataCase

  alias Invoix.Financials.Invoice
  alias Invoix.Financials
  alias Invoix.Financials.Transaction

  describe "calculate sum" do
    setup do
      %{invoices: Invoix.FinancialsFixtures.get_invoices_fixtures()}
    end

    test "correctly sums up the invoices", %{invoices: invoices} do
      result = Invoix.Financials.sum_amount(invoices)
      assert result == 46500
    end
  end

  describe "calc_summary" do
    setup do
      Invoix.FinancialsFixtures.populate_invoices_in_database()
    end

    test "calculates summary correctly", %{first_user: first_user, second_user: second_user} do
      {:ok, result} = Financials.calc_summary(first_user.id, :month)

      assert result == %{
               value: 7,
               period: :month,
               current_income: 2000,
               current_num_invoices: 4,
               current_num_transactions: 2,
               current_revenue: 4000,
               previous_income: 2000,
               previous_num_invoices: 4,
               previous_num_transactions: 2,
               previous_revenue: 4000
             }

      {:ok, result} = Financials.calc_summary(second_user.id, :month)

      assert result == %{
               value: 7,
               period: :month,
               current_income: 4000,
               current_num_invoices: 4,
               current_num_transactions: 2,
               current_revenue: 8000,
               previous_income: 4000,
               previous_num_invoices: 4,
               previous_num_transactions: 2,
               previous_revenue: 8000
             }
    end
  end

  describe "get_financials_for_period" do
    setup do
      Invoix.FinancialsFixtures.populate_invoices_in_database()
    end

    test "only gets invoices for correct user id", %{
      first_user: first_user,
      second_user: second_user
    } do
      {:ok, invoices} =
        Invoix.Financials.get_financials_for_period(
          :month,
          Invoix.FinancialsFixtures.create_date_time("2024-07-19", "13:23:20"),
          first_user.id,
          Invoice
        )

      {:ok, transactions} =
        Invoix.Financials.get_financials_for_period(
          :month,
          Invoix.FinancialsFixtures.create_date_time("2024-07-19", "13:23:20"),
          first_user.id,
          Transaction
        )

      assert Enum.all?(invoices, fn inv -> inv.user_id == first_user.id end)
      refute Enum.any?(invoices, fn inv -> inv.user_id == second_user.id end)
      refute Enum.any?(invoices, fn inv -> inv.date.day > 19 end)

      assert Enum.all?(transactions, fn inv -> inv.user_id == first_user.id end)
      refute Enum.any?(transactions, fn inv -> inv.user_id == second_user.id end)
      refute Enum.any?(transactions, fn inv -> inv.date.day > 19 end)
    end

    test "returns the correct set of invoices", %{
      first_user: first_user,
      second_user: second_user
    } do
      {:ok, invoices} =
        Invoix.Financials.get_financials_for_period(
          :month,
          Invoix.FinancialsFixtures.create_date_time("2024-07-19", "13:23:20"),
          second_user.id,
          Invoice
        )

      {:ok, transactions} =
        Invoix.Financials.get_financials_for_period(
          :month,
          Invoix.FinancialsFixtures.create_date_time("2024-07-19", "13:23:20"),
          second_user.id,
          Transaction
        )

      assert Enum.all?(invoices, fn inv -> inv.user_id == second_user.id end)
      assert length(invoices) == 4
      assert Financials.sum_amount(invoices) == 8000
      refute Enum.any?(invoices, fn inv -> inv.user_id == first_user.id end)

      assert Enum.all?(transactions, fn inv -> inv.user_id == second_user.id end)
      assert length(transactions) == 2
      assert Financials.sum_amount(transactions) == 4000
      refute Enum.any?(transactions, fn inv -> inv.user_id == first_user.id end)
    end

    test "invoices returned are all of correct month", %{second_user: second_user} do
      {:ok, invoices} =
        Invoix.Financials.get_financials_for_period(
          :month,
          Invoix.FinancialsFixtures.create_date_time("2024-07-19", "13:23:20"),
          second_user.id,
          Invoice
        )

      {:ok, transactions} =
        Invoix.Financials.get_financials_for_period(
          :month,
          Invoix.FinancialsFixtures.create_date_time("2024-07-22", "13:23:20"),
          second_user.id,
          Transaction
        )

      assert Enum.all?(invoices, fn inv -> inv.user_id == second_user.id end)
      assert length(invoices) == 4

      assert Enum.all?(invoices, fn inv ->
               DateTime.to_date(inv.date).month == 7
             end)

      assert Enum.all?(transactions, fn inv -> inv.user_id == second_user.id end)
      assert length(transactions) == 2

      assert Enum.all?(transactions, fn inv ->
               DateTime.to_date(inv.date).month == 7
             end)
    end

    test "returns empty list if no invoices for month", %{
      second_user: second_user
    } do
      {:ok, invoices} =
        Invoix.Financials.get_financials_for_period(
          :month,
          Invoix.FinancialsFixtures.create_date_time("2024-09-19", "13:23:20"),
          second_user.id,
          Invoice
        )

      {:ok, transactions} =
        Invoix.Financials.get_financials_for_period(
          :month,
          Invoix.FinancialsFixtures.create_date_time("2024-09-19", "13:23:20"),
          second_user.id,
          Transaction
        )

      assert invoices == []
      assert transactions == []
    end
  end
end
