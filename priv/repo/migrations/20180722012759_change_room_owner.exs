defmodule Chatty.Repo.Migrations.ChangeRoomOwner do
  use Ecto.Migration

  def change do
    alter table(:rooms) do
      remove :owner
      add :user_id, references(:users)
    end

    create index(:rooms, [:user_id])
  end
end
