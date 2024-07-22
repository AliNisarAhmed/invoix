defmodule Invoix.Utils do
  @spec date_in_previous_month(today :: DateTime) :: DateTime
  def date_in_previous_month(today) do
    {:ok, time} = Time.new(0, 0, 0, 0)

    today_date = DateTime.to_date(today)

    prev_date =
      today_date
      |> Date.beginning_of_month()
      |> Date.add(-1)

    result_day =
      if Date.end_of_month(today_date).day == today_date.day,
        do: Date.end_of_month(prev_date).day,
        else: min(Date.days_in_month(prev_date), today_date.day)

    {:ok, result} =
      Date.new(prev_date.year, prev_date.month, result_day)
      |> elem(1)
      |> DateTime.new(time, "Etc/UTC")

    result
  end
end
