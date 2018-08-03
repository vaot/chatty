defmodule ChattyWeb.Api.V1.RoomView do
  use ChattyWeb, :view

  def render("index.json", %{ rooms: rooms }) do
    %{ rooms: Enum.map(rooms, &room_view/1) }
  end

  def render("show.json", %{ room: room }) do
    room_view(room)
  end

  def render("changeset_errors.json", changeset) do
    Ecto.Changeset.traverse_errors(changeset, fn {msg, opts} ->
      Enum.reduce(opts, msg, fn {key, value}, acc ->
        String.replace(acc, "%{#{key}}", to_string(value))
      end)
    end)
  end

  defp room_view(room) do
    %{
      channelName: room.channelName,
      roomId: room.roomId,
      id: room.id,
      encrypted: room.encrypted,
      user_id: room.user_id,
      color: room.color
    }
  end
end
