defmodule Chatty.RoomModel.Room do
  use Ecto.Schema
  import Ecto.Changeset


  schema "rooms" do
    field :channelName, :string
    field :roomId, :string
    field :color, :string
    field :owner, :string

    timestamps()
  end

  @doc false
  def changeset(room, attrs) do
    room
    |> cast(attrs, [:channelName, :roomId, :color, :owner])
    |> ensure_room_id(attrs)
    |> validate_required([:channelName])
  end

  defp ensure_room_id(room, %{ "roomId" => _anything }), do: room

  defp ensure_room_id(room, %{ roomId: _anything }), do: room

  defp ensure_room_id(room, attrs) do
    room 
    |> Ecto.Changeset.put_change(:roomId, generate_random_id())
  end

  defp generate_random_id do
    "sdfsdf"
  end
end
