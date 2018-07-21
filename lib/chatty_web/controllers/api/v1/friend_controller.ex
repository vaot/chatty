defmodule ChattyWeb.Api.V1.FriendController do
  use ChattyWeb, :controller
  alias ChattyWeb.Buddies

  def index(conn, _params) do
    conn
    |> put_status(200)

  end
  
end
