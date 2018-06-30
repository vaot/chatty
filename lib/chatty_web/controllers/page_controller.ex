defmodule ChattyWeb.PageController do
  use ChattyWeb, :controller
  import Coherence.ControllerHelpers

  def index(conn, _params) do
    render conn, "index.html"
  end

  def signout(conn, _params) do
    logout_user(conn)
    conn
      |> put_status(200)
      |> json(%{ success: true })
  end
end
