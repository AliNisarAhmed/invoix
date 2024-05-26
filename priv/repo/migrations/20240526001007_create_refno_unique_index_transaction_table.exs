defmodule Invoix.Repo.Migrations.CreateRefnoUniqueIndexTransactionTable do
  use Ecto.Migration

  def change do
    create unique_index(:transactions, [:ref_no])
  end
end
