defmodule Invoix.Repo.Migrations.CreateInvoices do
  use Ecto.Migration

  def change do
    create table(:invoices) do
      add :ref_no, :bigserial
      add :client_name, :string, size: 16
      add :date, :utc_datetime
      add :amount, :decimal
      add :status, :string

      timestamps(type: :utc_datetime)
    end

    create unique_index("invoices", [:ref_no])
    create constraint("invoices", "amount must be positive", check: "amount > 0")
  end
end
