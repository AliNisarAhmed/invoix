defmodule Invoix.FinancialsTest do
  use Invoix.DataCase

  describe "calculate sum" do
    setup do
      %{invoices: Invoix.FinancialsFixtures.get_invoices_fixtures()}
    end

    test "correctly sums up the invoices", %{invoices: invoices} do 
      result = Invoix.Financials.sum_amount(invoices) 
      assert result == 46500
    end
  end
end
