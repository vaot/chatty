defmodule ChattyWeb.Router do
  use ChattyWeb, :router
  use Coherence.Router

  @api_auth_key "x-chatty-auth-key"
  @api_token_age 1000000

  defp put_user_token(conn, _) do
    current_user = Coherence.current_user(conn).id
    user_id_token = Phoenix.Token.sign(conn, "user_id",
                    current_user)

    conn
    |> assign(:user_token, user_id_token)
    |> assign(:user_id, current_user)
  end

  defp authenticate_api(conn, _) do
    verify_user_token(conn, get_req_header(conn, @api_auth_key))
  end

  defp verify_user_token(conn, [token]) do
    case Phoenix.Token.verify(conn, "user_id", token, max_age: @api_token_age) do
      {:ok, user_id} ->
        conn |> assign(:user_id, user_id)
      {:error, _reason} ->
        conn |> put_status(401) |> json(%{}) |> halt
    end
  end

  defp verify_user_token(conn, _token_header) do
    conn |> put_status(401) |> json(%{}) |> halt
  end

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug Coherence.Authentication.Session
  end

  pipeline :protected do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug Coherence.Authentication.Session, protected: true
    plug :put_user_token
  end

  pipeline :api do
    plug :accepts, ["json"]
    plug :authenticate_api
  end

  scope "/api", ChattyWeb do
    scope "/v1", Api.V1 do
      pipe_through :api
      post "/room", RoomController, :create
      post "/room/:room_id", RoomController, :update
      get "/room/:room_id", RoomController, :show
      get "/room", RoomController, :index
      get "/room/:user_id/friends", FriendController, :index
    end
  end

  scope "/" do
    pipe_through :browser
    coherence_routes()
  end

  scope "/" do
    pipe_through :protected
    coherence_routes :protected
  end

  scope "/", ChattyWeb do
    pipe_through :protected
    get "/signout", PageController, :signout
    get "/*path", PageController, :index
  end
end
