defmodule Invoix.UtilsTest do
  use ExUnit.Case, async: true

  describe "get date in previous month" do
    test "get_date_in_previous_month" do
      {:ok, time} = Time.new(0, 0, 0, 0)

      results =
        1..12
        |> Enum.map(fn m ->
          Date.new(2024, m, :rand.uniform(28))
          |> elem(1)
          |> DateTime.new(time)
          |> elem(1)
          |> Invoix.Utils.date_in_previous_month()
          |> then(fn datetime -> datetime.month end)
        end)

      assert results == [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    end
  end
end
