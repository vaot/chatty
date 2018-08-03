defmodule ChattyWeb.Api.V1.FriendController do
  use ChattyWeb, :controller
  alias Chatty.Buddies
  alias Chatty.Repo
  alias Chatty.Coherence.User

  def index(conn, _params) do
    user = Repo.get(User, conn.assigns.user_id)

    case Buddies.get_friends(user.id) do
      friends ->
        conn |> put_status(200) |> render("index.json", friends: friends)
      _ ->
        conn |> put_status(200) |> json(%{ friends: [] })
    end
  end

  def create(conn, %{ "friend_id" => friend_id }) do
    user = Repo.get(User, conn.assigns.user_id)

    attrs = %{
      friend_id: friend_id,
      user_id: user.id
    }

    case Buddies.make_friend(attrs) do
      {:ok, friend}->
        conn |> put_status(200) |> json(%{ success: true })

      {:error, %Ecto.Changeset{} = changeset} ->
        conn |> put_status(422) |> render("changeset_errors.json", changeset)
    end
  end

end
