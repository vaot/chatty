defmodule Chatty.Repo.Migrations.CreateFriends do
  use Ecto.Migration
  use Coherence.Schema

  def change do
    create table(:friends) do
      add :user_id, references(:users)
      add :friend_id, references(:users)

      # timestamps()
    end
  end
end



