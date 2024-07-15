defmodule Invoix.Types do
  defmacro __using__(_opts) do
    quote do
      @type summary_period() :: :month | :week | :year

      @type summary() :: %{
              period: summary_period(),
              period_value: non_neg_integer,
              current_num_invoices: non_neg_integer,
              previous_num_invoices: non_neg_integer,
              current_revenue: non_neg_integer,
              previous_revenue: non_neg_integer,
              current_num_transactions: non_neg_integer,
              previous_num_transactions: non_neg_integer,
              current_income: non_neg_integer,
              previous_income: non_neg_integer
            }
    end
  end
end
