defmodule Invoix.Utils do
  @spec date_in_previous_month(today :: DateTime) :: DateTime
  def date_in_previous_month(today) do
    {:ok, time} = Time.new(0, 0, 0, 0)

    {:ok, result} =
      today
      |> DateTime.to_date()
      |> Date.beginning_of_month()
      |> Date.add(-1)
      |> DateTime.new(time, "Etc/UTC")

    result
  end
end
