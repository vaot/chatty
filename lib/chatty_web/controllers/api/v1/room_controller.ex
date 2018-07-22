defmodule ChattyWeb.Api.V1.RoomController do
  use ChattyWeb, :controller
  alias Chatty.RoomModel
  alias Chatty.RoomModel.Room

  def create(conn, room_params) do
  	case RoomModel.create_room(room_params) do
      {:ok, room} ->
        conn
        |> put_status(200)
        |> json(room_view(room))

      {:error, %Ecto.Changeset{} = changeset} ->
      	conn
        |> put_status(422)
        |> json(%{ error: "dasdasdsada" })
    end
  end

  def update(conn, %{ "room_id" => room_id, "user_id" => user_id } = params) do
    room = RoomModel.get_by(%{ roomId: room_id, user_id: user_id })

    case RoomModel.update_room(room, params) do
      {:ok, room} ->
        respond_to_json(conn, room)
      {:error, %Ecto.Changeset{} = changeset} ->
        respond_to_json(conn, nil)
    end
  end

  def update(conn, _params) do
    respond_to_json(conn, nil)
  end

  def show(conn, %{ "room_id" => room_id }) do
    room = RoomModel.get_by(roomId: room_id)
    respond_to_json(conn, room)
  end

  def show(conn, _params) do
    conn
      |> put_status(404)
      |> json(%{})
  end

  def messages(conn, %{"room_id" => room_id}) do
    IO.puts">>>>>>>>"
    IO.inspect(room_id)
    IO.puts">>>>>>>>"

    conn
    |> put_status(200)
    |> json(%{room_id: room_id})

  end


  # ================= Helpers ===============================
  # We need to move these helpers out of the controller logic
  defp respond_to_json(conn, nil)  do
    conn
      |> put_status(404)
      |> json(%{})
  end

  defp respond_to_json(conn, room)  do
    conn
      |> put_status(200)
      |> json(room_view(room))
  end

  defp room_view(room) do
    %{
      channelName: room.channelName,
      roomId: room.roomId,
      id: room.id,
      encrypted: room.encrypted,
      user_id: room.user_id
    }
  end
end
