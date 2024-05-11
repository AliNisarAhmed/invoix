defmodule Invoix.Financials do
  import Ecto.Query, warn: false
  alias Invoix.Financials.InvoiceRef
  alias Invoix.Financials.Transcation
  alias Invoix.Financials.Invoice
  alias Invoix.Repo

  def get_invoices() do
    Repo.all(Invoice)
  end

  def get_transactions() do
    Repo.all(Transcation)
  end

  def create_invoice(%{amount: amount, dateString: dateString, clientName: clientName}) do
    {:ok, date, _} = DateTime.from_iso8601(dateString)

    %Invoice{}
    |> Invoice.changeset(%{
      amount: Decimal.new(1, amount, 2),
      date: date,
      client_name: clientName,
      ref_no: get_next_invoice_ref(),
      status: "not_paid"
    })
    |> Repo.insert()
  end

  def get_last_invoice() do
    Invoice |> last(:inserted_at) |> Repo.one()
  end

  def get_next_invoice_ref() do
    next_ref = InvoiceRef.next()
    "INV-#{String.pad_leading(Integer.to_string(next_ref), 5, "0")}"
  end
end
