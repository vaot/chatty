defmodule ChattyWeb.Api.V1.RoomController do
  use ChattyWeb, :controller
  alias Chatty.RoomModel
  alias Chatty.Repo
  alias Chatty.Coherence.User


  def index(conn, params) do
    user = Repo.get(User, conn.assigns.user_id)
    case RoomModel.get_by_user_id(user.id) do
      rooms ->
        respond_to_json(conn, rooms)
      _ ->
        respond_to_json(conn, nil)
    end
  end

  def create(conn, room_params) do
    user = Repo.get(User, conn.assigns.user_id)
    room_params = room_params |> Map.put("user_id", user.id)

    case RoomModel.create_room(room_params) do
      {:ok, room} ->
        respond_to_json(conn, room)
      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(422)
        |> render("changeset_errors.json", changeset)
    end
  end

  def update(conn, %{ "room_id" => room_id } = params) do
    user = Repo.get(User, conn.assigns.user_id)
    room = RoomModel.get_by(roomId: room_id, user_id: user.id)

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

  # ================= Helpers ===============================
  # We need to move these helpers out of the controller logic
  defp respond_to_json(conn, nil)  do
    conn
      |> put_status(404)
      |> render("show.json", %{})
  end

  defp respond_to_json(conn, rooms) when is_list(rooms) do
    conn
      |> put_status(200)
      |> render("index.json", rooms: rooms)
  end

  defp respond_to_json(conn, room)  do
    conn
      |> put_status(200)
      |> render("show.json", room: room)
  end
end
