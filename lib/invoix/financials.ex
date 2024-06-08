defmodule Invoix.Financials do
  import Ecto.Query, warn: false
  alias Invoix.Financials.InvoiceRef
  alias Invoix.Financials.Transcation
  alias Invoix.Financials.Invoice
  alias Invoix.Repo

  def get_invoices(user_id, page_params) do
    query = from inv in Invoice, where: inv.user_id == ^user_id
    Flop.validate_and_run(query, page_params, repo: Repo)
  end

  def get_transactions() do
    Repo.all(Transcation)
  end

  def get_invoice_by_refno(invoice_refno) do
    Repo.get_by!(Invoice, ref_no: invoice_refno)
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
      ref_no: get_next_invoice_ref(),
      status: "not_paid",
      user_id: user_id
    })
    |> Repo.insert()
  end

  def create_transaction!(%Invoice{ref_no: ref_no, amount: amount} = invoice) do
    Repo.transaction(fn ->
      {:ok, now} = DateTime.now("Etc/UTC")

      %Invoix.Financials.Transcation{}
      |> Invoix.Financials.Transcation.changeset(%{
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

  def get_next_invoice_ref() do
    next_ref = InvoiceRef.next()
    "INV-#{String.pad_leading(Integer.to_string(next_ref), 5, "0")}"
  end
end
