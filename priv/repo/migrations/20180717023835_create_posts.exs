defmodule Chatty.Repo.Migrations.CreatePosts do
  use Ecto.Migration

  def change do
    create table(:posts) do
      add :name, :string
      add :post, :string
      add :email, :string
      add :user_id, :integer
      add :room_id, :string

      timestamps()
    end

    create index(:posts, [:user_id])
    create index(:posts, [:room_id])
  end

end
