defmodule Invoix.Financials.Invoice do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Flop.Schema, filterable: [:status], sortable: [:date]}
  @derive {Jason.Encoder, except: [:__meta__, :__struct__, :users]}
  schema "invoices" do
    field :status, :string
    field :date, :utc_datetime
    field :ref_no, :string
    field :client_name, :string
    field :amount, :decimal
    belongs_to :users, Invoix.Accounts.User, foreign_key: :user_id

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(invoice, attrs) do
    invoice
    |> cast(attrs, [:ref_no, :client_name, :date, :amount, :status, :user_id])
    |> validate_required([:ref_no, :client_name, :date, :amount, :status, :user_id])
  end

  def update_status_changeset(invoice, new_status) do
    invoice
    |> change(status: new_status)
  end
end
