defmodule Chatty.Repo.Migrations.AddAvatarToUser do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :avatar, :string
      add :uuid, :string
	end
  end
end
