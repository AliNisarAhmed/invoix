defmodule Invoix.Financials do
  import Ecto.Query, warn: false
  alias Invoix.Financials.Transaction
  alias Invoix.Financials.Invoice
  alias Invoix.Repo

  use Invoix.Types

  def get_invoices(user_id, page_params) do
    query = from inv in Invoice, where: inv.user_id == ^user_id
    Flop.validate_and_run(query, page_params, repo: Repo)
  end

  def get_transactions() do
    Repo.all(Transcation)
  end

  @spec get_invoice_by_refno(String.t()) :: Invoice
  def get_invoice_by_refno(invoice_refno_str) do
    invoice_ref_no = parse_invoice_no(invoice_refno_str)
    Repo.get_by!(Invoice, ref_no: invoice_ref_no)
  end

  defp parse_invoice_no(invoice_refno_str) do
    ["INV", ref_no_str] = String.split(invoice_refno_str, "-")
    String.to_integer(ref_no_str)
  end

  def create_invoice(%{amount: amount, dateString: dateString, clientName: clientName},
        user_id: user_id
      ) do
    {:ok, date, _} = DateTime.from_iso8601(dateString)

    %Invoice{}
    |> Invoice.changeset(%{
      amount: Decimal.new(1, amount, 2),
      date: date,
      client_name: clientName,
      status: "not_paid",
      user_id: user_id
    })
    |> Repo.insert()
  end

  def create_transaction!(
        %Invoice{ref_no: ref_no, amount: amount} = invoice,
        user_id,
        date \\ DateTime.utc_now()
      ) do
    Repo.transaction(fn ->
      %Invoix.Financials.Transaction{}
      |> Invoix.Financials.Transaction.changeset(%{
        ref_no: ref_no,
        date: date,
        amount: amount,
        description: "Transaction for Invoice #{ref_no}",
        user_id: user_id
      })
      |> Repo.insert!()

      invoice
      |> Invoice.update_status_changeset("paid")
      |> Repo.update!()
    end)
  end

  @spec sum_amount(list(Invoice | Transaction)) :: pos_integer
  def sum_amount(items) do
    items
    |> Enum.map(& &1.amount)
    |> Enum.reduce(Decimal.new(1, 0, 2), &Decimal.add/2)
    |> Decimal.to_integer()
  end

  def get_financials_for_period(:month, date, user_id, schema) do
    current_year = date.year
    current_month = date.month

    {:ok, start_date} = Date.new(current_year, current_month, 1)
    {:ok, start_time} = Time.new(0, 0, 0, 0)
    {:ok, end_time} = Time.new(11, 59, 59, 0)
    {:ok, start_date_time} = DateTime.new(start_date, start_time, "Etc/UTC")
    {:ok, end_date_time} = DateTime.new(DateTime.to_date(date), end_time, "Etc/UTC")

    query =
      from item in schema,
        where: item.date >= ^start_date_time,
        where: item.date <= ^end_date_time,
        where: item.user_id == ^user_id

    {:ok, Repo.all(query)}
  end

  @spec calc_summary(user_id :: non_neg_integer, period :: summary_period()) ::
          {:ok, summary()} | {:error, any()}
  def calc_summary(user_id, period \\ :month) do
    today = DateTime.utc_now()
    previous_date = Invoix.Utils.date_in_previous_month(today)
    current_month = today.month

    with {:ok, current_invoices} <-
           get_financials_for_period(:month, today, user_id, Invoice),
         {:ok, previous_invoices} <-
           get_financials_for_period(:month, previous_date, user_id, Invoice),
         {:ok, current_transactions} <-
           get_financials_for_period(:month, today, user_id, Transaction),
         {:ok, previous_transactions} <-
           get_financials_for_period(:month, previous_date, user_id, Transaction) do
      current_revenue = sum_amount(current_invoices)
      previous_revenue = sum_amount(previous_invoices)
      current_num_invoices = length(current_invoices)
      previous_num_invoices = length(previous_invoices)
      current_num_transactions = length(current_transactions)
      previous_num_transactions = length(previous_transactions)
      current_income = sum_amount(current_transactions)
      previous_income = sum_amount(previous_transactions)

      {:ok,
       %{
         period: period,
         value: current_month,
         current_num_invoices: current_num_invoices,
         previous_num_invoices: previous_num_invoices,
         current_revenue: current_revenue,
         previous_revenue: previous_revenue,
         current_num_transactions: current_num_transactions,
         previous_num_transactions: previous_num_transactions,
         current_income: current_income,
         previous_income: previous_income
       }}
    else
      e -> {:error, e}
    end
  end
end
