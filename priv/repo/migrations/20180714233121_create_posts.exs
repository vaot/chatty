defmodule Chatty.Repo.Migrations.CreatePosts do
  use Ecto.Migration

  def change do
    create table(:posts) do
      add :name, :string
      add :post, :string
      add :email, :string

      timestamps()
    end

  end
end
