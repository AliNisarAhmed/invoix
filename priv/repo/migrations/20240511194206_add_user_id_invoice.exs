defmodule Invoix.Repo.Migrations.AddUserIdInvoice do
  use Ecto.Migration

  def change do
    alter table(:invoices) do
      add :user_id, references(:users)
    end

    create index(:invoices, [:user_id])
  end
end
