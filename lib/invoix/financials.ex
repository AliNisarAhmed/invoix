defmodule Invoix.Financials do
  import Ecto.Query, warn: false
  alias Invoix.Financials.Transaction
  alias Invoix.Financials.Invoice
  alias Invoix.Repo

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

  def create_transaction!(%Invoice{ref_no: ref_no, amount: amount} = invoice) do
    Repo.transaction(fn ->
      {:ok, now} = DateTime.now("Etc/UTC")

      %Invoix.Financials.Transaction{}
      |> Invoix.Financials.Transaction.changeset(%{
        ref_no: ref_no,
        date: now,
        amount: amount,
        description: "Transaction for Invoice #{ref_no}"
      })
      |> Repo.insert!()

      invoice
      |> Invoice.update_status_changeset("paid")
      |> Repo.update!()
    end)
  end

  def get_invoices_for_month(month, end_day) do
    {:ok, startDate} = Date.new(2024, month, 1)
    {:ok, startTime} = Time.new(0, 0, 0, 0)
    {:ok, startDateTime} = DateTime.new(startDate, startTime, "Etc/UTC")
    {:ok, endDate} = Date.new(2024, month, end_day)
    {:ok, endTime} = Time.new(11, 59, 59, 0)
    {:ok, endDateTime} = DateTime.new(endDate, endTime, "Etc/UTC")

    query =
      from inv in Invoice,
        where: inv.date >= ^startDateTime,
        where: inv.date <= ^endDateTime

    {:ok, Repo.all(query)}
  end

  def get_transactions_for_month(month, end_day) do 
    {:ok, startDate} = Date.new(2024, month, 1)
    {:ok, startTime} = Time.new(0, 0, 0, 0)
    {:ok, startDateTime} = DateTime.new(startDate, startTime, "Etc/UTC")
    {:ok, endDate} = Date.new(2024, month, end_day)
    {:ok, endTime} = Time.new(11, 59, 59, 0)
    {:ok, endDateTime} = DateTime.new(endDate, endTime, "Etc/UTC")

    query =
      from tr in Transaction,
        where: tr.date >= ^startDateTime,
        where: tr.date <= ^endDateTime

    {:ok, Repo.all(query)}
  end

  @spec sum_amount(Enum.t(Invoice | Transaction)) :: pos_integer
  def sum_amount(items) do
    items
    |> Enum.map(& &1.amount)
    |> Enum.reduce(&Decimal.add/2)
    |> Decimal.to_integer()
  end
end
