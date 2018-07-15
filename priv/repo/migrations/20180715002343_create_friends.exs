defmodule Chatty.Repo.Migrations.CreateFriends do
  use Ecto.Migration
  use Coherence.Schema

  def change do
    create table(:friends) do
      add :name, :string
      add :friend, :string

      timestamps()
    end

    create index(:friends, [:name])
  end
end
