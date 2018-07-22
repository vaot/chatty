defmodule Chatty.Repo.Migrations.AddEncrypedToRoomModel do
  use Ecto.Migration

  def change do
    alter table(:rooms) do
      add :encrypted, :boolean
    end
  end
end
