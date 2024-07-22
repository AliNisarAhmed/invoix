defmodule Invoix.UtilsTest do
  use ExUnit.Case, async: true

  describe "get_date_in_previous_month" do
    test "correctly converts dates on first of month" do
      {:ok, time} = Time.new(0, 0, 0, 0)

      results =
        1..12
        |> Enum.map(fn m ->
          Date.new(2024, m, 1)
          |> elem(1)
          |> DateTime.new(time)
          |> elem(1)
          |> Invoix.Utils.date_in_previous_month()
        end)

      assert Enum.map(results, fn d -> d.month end) == [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
      assert Enum.map(results, fn d -> d.day end) |> Enum.all?(&(&1 == 1))

      assert Enum.map(results, fn d -> d.year end) == [
               2023,
               2024,
               2024,
               2024,
               2024,
               2024,
               2024,
               2024,
               2024,
               2024,
               2024,
               2024
             ]
    end

    test "correctly converts dates in the middle of month" do
      {:ok, time} = Time.new(0, 0, 0, 0)

      results =
        1..12
        |> Enum.map(fn m ->
          Date.new(2024, m, 15)
          |> elem(1)
          |> DateTime.new(time)
          |> elem(1)
          |> Invoix.Utils.date_in_previous_month()
        end)

      assert Enum.map(results, fn d -> d.month end) == [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
      assert Enum.map(results, fn d -> d.day end) |> Enum.all?(&(&1 == 15))

      assert Enum.map(results, fn d -> d.year end) == [
               2023,
               2024,
               2024,
               2024,
               2024,
               2024,
               2024,
               2024,
               2024,
               2024,
               2024,
               2024
             ]
    end

    test "correctly converts dates on end of month" do
      {:ok, time} = Time.new(0, 0, 0, 0)

      days_in_month = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

      results =
        1..12
        |> Enum.zip(days_in_month)
        |> Enum.map(fn {m, d} ->
          Date.new(2024, m, d)
          |> elem(1)
          |> DateTime.new(time)
          |> elem(1)
          |> Invoix.Utils.date_in_previous_month()
        end)

      assert Enum.map(results, fn d -> d.month end) == [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

      assert Enum.map(results, fn d -> d.day end) == [
               31,
               31,
               29,
               31,
               30,
               31,
               30,
               31,
               31,
               30,
               31,
               30
             ]

      assert Enum.map(results, fn d -> d.year end) == [
               2023,
               2024,
               2024,
               2024,
               2024,
               2024,
               2024,
               2024,
               2024,
               2024,
               2024,
               2024
             ]

      days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

      results =
        1..12
        |> Enum.zip(days_in_month)
        |> Enum.map(fn {m, d} ->
          Date.new(2023, m, d)
          |> elem(1)
          |> DateTime.new(time)
          |> elem(1)
          |> Invoix.Utils.date_in_previous_month()
        end)

      assert Enum.map(results, fn d -> d.month end) == [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

      assert Enum.map(results, fn d -> d.day end) == [
               31,
               31,
               28,
               31,
               30,
               31,
               30,
               31,
               31,
               30,
               31,
               30
             ]

      assert Enum.map(results, fn d -> d.year end) == [
               2022,
               2023,
               2023,
               2023,
               2023,
               2023,
               2023,
               2023,
               2023,
               2023,
               2023,
               2023
             ]
    end
  end
end
