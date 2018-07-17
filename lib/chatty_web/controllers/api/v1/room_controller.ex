defmodule ChattyWeb.Api.V1.RoomController do
  use ChattyWeb, :controller

  def create(conn, _params) do
    conn
    |> put_status(200)
    |> json(%{ rooom_id: "jdiusajdiuasdiuas" })
  end

  def messages(conn, _params) do
  	
  	
  end
end
