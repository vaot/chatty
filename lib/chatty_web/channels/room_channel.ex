defmodule ChattyWeb.RoomChannel do
  use Phoenix.Channel

  alias ChattyWeb.Presence
  alias Chatty.Repo
  alias Chatty.Coherence.User
  alias Chatty.Post
  alias Chatty.RoomModel
  alias Chatty.RoomModel.Room
  alias Chatty.Buddies.Friend

  def join("room:" <> chat_id, _payload, socket) do
    send(self, :after_join)
    {:ok, socket}

  end

  def handle_in("message:new", payload, socket) do

    IO.puts"++++++"
    IO.inspect(socket)
    IO.puts"++++++"
    IO.inspect(socket.topic)
    IO.puts"++++++"
    "room:" <> chat_id = socket.topic
    %{user_id: user_id} = socket.assigns
    IO.inspect(user_id)
    user = Repo.get(User, socket.assigns.user_id)

    #room id: / user id
    myPost = %{ 
      name: user.name,
      post: payload["message"],
      email: user.email,
      room_id: chat_id,
      user_id: user_id,
      timestamp: payload["timestamp"]
    }
    IO.puts"-----------"
    IO.inspect(myPost)


    Post.changeset(%Post{}, myPost) |> Repo.insert

    
    broadcast! socket, "message:new", %{
      user: user.name,
      message: payload["message"],
      user_id: user.id,
      timestamp: payload["timestamp"]
    }

    {:noreply, socket}
  end

  def handle_in("friend:new", payload, socket) do
    user = Repo.get(User, socket.assigns.user_id)

    myFriend = %{
      user_id: user.id,
      friend_id: payload["user_id"],
      # timestamp: payload["timestamp"]
    }

    Friend.changeset(%Friend{}, myFriend) |> Repo.insert
    {:noreply, socket}
  end

  def handle_info(:after_join,  socket) do
    user = Repo.get(User, socket.assigns.user_id)

    {:ok, _} = Presence.track(socket, user.name, %{
      online_at: inspect(System.system_time(:seconds)),
      user_id: user.id,
    })

    push socket, "presence_state", Presence.list(socket)

    # Post.get_posts() 
    # |> Enum.each (fn msg -> push(socket, "message:new", %{
    #   user: user.name,
    #   message: payload["message"],
    #   user_id: user.id,
    #   timestamp: payload["timestamp"]
    # }) end)


    {:noreply, socket} # :noreply
  end

  def terminate(reason, socket) do
    {:noreply, socket}
  end
end
