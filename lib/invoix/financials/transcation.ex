defmodule Invoix.Financials.Transcation do
  alias Invoix.Financials.Invoice
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, except: [:__meta__, :__struct__, :invoice]}
  schema "transactions" do
    field :date, :utc_datetime
    field :description, :string
    field :ref_no, :string
    has_one :invoice, Invoice, foreign_key: :ref_no, references: :ref_no
    field :amount, :decimal

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(transcation, attrs) do
    transcation
    |> cast(attrs, [:ref_no, :date, :description, :amount])
    |> validate_required([:ref_no, :date, :description, :amount])
  end
end
