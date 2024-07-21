defmodule Invoix.FinancialsTest do
  use Invoix.DataCase

  alias Invoix.Financials.Invoice
  alias Invoix.Financials

  describe "calculate sum" do
    setup do
      %{invoices: Invoix.FinancialsFixtures.get_invoices_fixtures()}
    end

    test "correctly sums up the invoices", %{invoices: invoices} do
      result = Invoix.Financials.sum_amount(invoices)
      assert result == 46500
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
          "month",
          Invoix.FinancialsFixtures.create_date_time("2024-07-19", "13:23:20"),
          first_user.id,
          Invoice
        )

      assert Enum.all?(invoices, fn inv -> inv.user_id == first_user.id end)
      refute Enum.any?(invoices, fn inv -> inv.user_id == second_user.id end)
    end

    test "returns the correct set of invoices", %{
      first_user: first_user,
      second_user: second_user
    } do
      {:ok, invoices} =
        Invoix.Financials.get_financials_for_period(
          "month",
          Invoix.FinancialsFixtures.create_date_time("2024-07-19", "13:23:20"),
          second_user.id,
          Invoice
        )

      assert Enum.all?(invoices, fn inv -> inv.user_id == second_user.id end)
      assert length(invoices) == 4
      assert Financials.sum_amount(invoices) == 8000
      refute Enum.any?(invoices, fn inv -> inv.user_id == first_user.id end)
    end

    test "invoices returned are all of correct month", %{
      first_user: first_user,
      second_user: second_user
    } do
      {:ok, invoices} =
        Invoix.Financials.get_financials_for_period(
          "month",
          Invoix.FinancialsFixtures.create_date_time("2024-08-19", "13:23:20"),
          second_user.id,
          Invoice
        )

      assert Enum.all?(invoices, fn inv -> inv.user_id == second_user.id end)
      assert length(invoices) == 4

      assert Enum.all?(invoices, fn inv ->
               DateTime.to_date(inv.date).month == 8
             end)
    end
  end
end
