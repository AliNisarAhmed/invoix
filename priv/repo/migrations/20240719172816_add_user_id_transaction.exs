defmodule Invoix.Repo.Migrations.AddUserIdTransaction do
  use Ecto.Migration

  def change do
    alter table(:transactions) do
      add :user_id, references(:users)
    end

    create index(:transactions, [:user_id])
  end
end
