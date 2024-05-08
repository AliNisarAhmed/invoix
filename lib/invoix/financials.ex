defmodule Invoix.Financials do
  import Ecto.Query, warn: false
  alias Invoix.Financials.Invoice
  alias Invoix.Repo

  def get_invoices() do
    Repo.all(Invoice)
  end
end
