defmodule Chatty.Repo.Migrations.CreateRooms do
  use Ecto.Migration

  def change do
    create table(:rooms) do
      add :channelName, :string
      add :roomId, :string
      add :owner, :string
      add :color, :string

      timestamps()
    end

  end
end
