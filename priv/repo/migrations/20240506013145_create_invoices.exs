defmodule Invoix.Repo.Migrations.CreateInvoices do
  use Ecto.Migration

  def change do
    create table(:invoices, primary_key: false) do
      add :id, :uuid, primary_key: true
      add :ref_no, :integer, generated: "ALWAYS AS IDENTITY"
      add :client_name, :string, size: 16
      add :date, :utc_datetime
      add :amount, :decimal
      add :status, :string

      timestamps(type: :utc_datetime)
    end

    create unique_index("invoices", [:ref_no])
    execute(&execute_up/0, &execute_down/0)
    create constraint("invoices", "amount must be positive", check: "amount > 0")
  end

  defp execute_up do
    random_number = :rand.uniform(10965)
    repo().query!("SELECT setval('invoices_ref_no_seq', #{random_number})")
  end

  defp execute_down, do: nil
end
