defmodule Invoix.Financials.Transaction do
  alias Invoix.Financials.Invoice
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, except: [:__meta__, :__struct__, :invoice]}
  schema "transactions" do
    field :date, :utc_datetime
    field :description, :string
    field :ref_no, :integer
    has_one :invoice, Invoice, foreign_key: :ref_no, references: :ref_no
    field :amount, :decimal
    belongs_to :users, Invoix.Accounts.User, foreign_key: :user_id

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(transcation, attrs) do
    transcation
    |> cast(attrs, [:ref_no, :date, :description, :amount, :user_id])
    |> validate_required([:ref_no, :date, :description, :amount, :user_id])
    |> unique_constraint(:ref_no)
  end

end
