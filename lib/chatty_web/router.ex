defmodule ChattyWeb.Router do
  use ChattyWeb, :router
  use Coherence.Router

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

  defp put_user_token(conn, _) do
    current_user = Coherence.current_user(conn).id
    user_id_token = Phoenix.Token.sign(conn, "user_id",
                    current_user)

    conn
    |> assign(:user_token, user_id_token)
    |> assign(:user_id, current_user)
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", ChattyWeb do
    scope "/v1", Api.V1 do
      pipe_through :api
      post "/room", RoomController, :create

      get "/room/:room_id/talk",  RoomController, :messages
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

  # Other scopes may use custom stacks.
  # scope "/api", ChattyWeb do
  #   pipe_through :api
  # end
end
