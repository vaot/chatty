defmodule Chatty.RoomModel.Room do
  use Ecto.Schema
  import Ecto.Changeset

  schema "rooms" do
    field :channelName, :string
    field :roomId, :string
    field :color, :string
    field :user_id, :id
    field :encrypted, :boolean

    timestamps()
  end

  @doc false
  def changeset(room, attrs) do
    IO.inspect(room)
    room
    |> cast(attrs, [:channelName, :roomId, :color, :user_id, :encrypted])
    |> ensure_room_id(room.roomId, attrs)
    |> validate_required([:channelName])
  end

  defp ensure_room_id(room, _room_id, %{ "room_id" => _anything }), do: room

  defp ensure_room_id(room, _room_id, %{ room_id: _anything }), do: room

  defp ensure_room_id(room, nil, attrs) do
    room
    |> Ecto.Changeset.put_change(:roomId, generate_random_id(16))
  end

  defp generate_random_id(n) do
    :crypto.strong_rand_bytes(n) |> Base.encode64
  end
end
