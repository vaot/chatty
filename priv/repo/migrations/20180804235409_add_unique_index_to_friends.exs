defmodule Chatty.Repo.Migrations.AddUniqueIndexToFriends do
  use Ecto.Migration

  def change do
    create unique_index(:friends, [:user_id, :friend_id], name: :friend_id_and_user_id_index)
  end
end
