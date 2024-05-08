defmodule Invoix.Financials do
  import Ecto.Query, warn: false
  alias Invoix.Financials.Transcation
  alias Invoix.Financials.Invoice
  alias Invoix.Repo

  def get_invoices() do
    Repo.all(Invoice)
  end

  def get_transactions() do
    Repo.all(Transcation)
  end
end
