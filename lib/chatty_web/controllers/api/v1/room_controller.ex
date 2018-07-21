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

  def room_view(room) do
    %{channelName: room.channelName, roomId: room.roomId, id: room.id}
  end


end
