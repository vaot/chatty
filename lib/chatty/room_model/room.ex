defmodule Chatty.RoomModel.Room do
  use Ecto.Schema
  import Ecto.Changeset


  schema "rooms" do
    field :roomId, :string
    field :channelName, :string
    field :color, :string
    field :owner, :string

    timestamps()
  end

  @doc false
  def changeset(room, attrs) do
    room
    |> cast(attrs, [:roomId, :channelName, :color, :owner])
    |> validate_required([:roomId, :channelName])
  end
end
