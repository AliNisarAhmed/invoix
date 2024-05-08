defmodule Invoix.Repo.Migrations.CreateTransactions do
  use Ecto.Migration

  def change do
    create table(:transactions) do
      add :ref_no, references(:invoices, column: :ref_no, type: :string)
      add :date, :utc_datetime
      add :description, :string
      add :amount, :decimal

      timestamps(type: :utc_datetime)
    end
  end
end
